import { createServerFn } from "@tanstack/react-start";

type AdminLoginInput = {
  email: string;
  password: string;
};

function validateLoginInput(
  input: AdminLoginInput,
) {
  const email =
    input.email
      ?.trim()
      .toLowerCase();

  const password =
    input.password ?? "";

  if (!email) {
    throw new Error(
      "E-mail é obrigatório.",
    );
  }

  if (
    email.length > 255 ||
    !email.includes("@")
  ) {
    throw new Error(
      "E-mail inválido.",
    );
  }

  if (
    !password ||
    password.length > 200
  ) {
    throw new Error(
      "Senha inválida.",
    );
  }

  return {
    email,
    password,
  };
}

export const loginAdmin =
  createServerFn({
    method: "POST",
  })
    .validator(validateLoginInput)
    .handler(async ({ data }) => {
      const {
        authenticateAdminUser,
      } = await import(
        "../services/auth/authenticate-admin-user.server"
      );

      const authentication =
        await authenticateAdminUser(
          data.email,
          data.password,
        );

      if (!authentication.success) {
        if (
          authentication.reason ===
          "BLOCKED"
        ) {
          return {
            success: false as const,
            error:
              "Acesso temporariamente bloqueado. Tente novamente mais tarde.",
          };
        }

        if (
          authentication.reason ===
          "INACTIVE"
        ) {
          return {
            success: false as const,
            error:
              "Acesso administrativo indisponível.",
          };
        }

        return {
          success: false as const,
          error:
            "E-mail ou senha inválidos.",
        };
      }

      const {
        useAdminSession,
      } = await import(
        "../services/auth/admin-session.server"
      );

      const session =
        await useAdminSession();

      await session.update({
        authenticated: true,

        userId:
          authentication.user.id,

        roleId:
          authentication.user.roleId,

        role:
          authentication.user.role,

        authVersion:
          authentication.user.authVersion,
      });

      return {
        success: true as const,
      };
    });

export const getAdminAuth =
  createServerFn({
    method: "GET",
  }).handler(async () => {
    /*
     * Não confiamos mais apenas no conteúdo
     * existente no cookie.
     *
     * Toda verificação administrativa passa
     * pelo requireAdmin(), que confronta:
     *
     * - userId
     * - roleId
     * - role
     * - authVersion
     * - status
     * - deletedAt
     * - cargo ativo
     *
     * contra os dados atuais do Neon.
     */
    try {
      const {
        requireAdmin,
      } = await import(
        "../services/auth/require-admin.server"
      );

      const admin =
        await requireAdmin();

      return {
        authenticated:
          true as const,

        userId:
          admin.userId,

        roleId:
          admin.roleId,

        role:
          admin.role,

        authVersion:
          admin.authVersion,
      };
    } catch {
      return {
        authenticated:
          false as const,

        userId:
          null,

        roleId:
          null,

        role:
          null,

        authVersion:
          null,
      };
    }
  });

export const logoutAdmin =
  createServerFn({
    method: "POST",
  }).handler(async () => {
    const {
      useAdminSession,
    } = await import(
      "../services/auth/admin-session.server"
    );

    const session =
      await useAdminSession();

    await session.clear();

    return {
      success: true as const,
    };
  });

export const revokeAllAdminSessions =
  createServerFn({
    method: "POST",
  }).handler(async () => {
    /*
     * A sessão atual precisa ser válida
     * antes que uma operação crítica
     * de segurança possa acontecer.
     */
    const {
      requireAdmin,
    } = await import(
      "../services/auth/require-admin.server"
    );

    const admin =
      await requireAdmin();

    const previousAuthVersion =
      admin.authVersion;

    /*
     * Incrementa authVersion de forma
     * atômica no PostgreSQL.
     */
    const {
      revokeAdminSessions,
    } = await import(
      "../services/auth/revoke-admin-sessions.server"
    );

    const result =
      await revokeAdminSessions(
        admin.userId,
      );

    /*
     * Gate crítico.
     *
     * A operação só poderá continuar
     * se o banco realmente devolver
     * a versão seguinte.
     *
     * Exemplo:
     * 1 → 2
     * 2 → 3
     */
    const expectedAuthVersion =
      previousAuthVersion + 1;

    if (
      result.authVersion !==
      expectedAuthVersion
    ) {
      throw new Error(
        "Falha ao confirmar a revogação das sessões administrativas.",
      );
    }

    /*
     * Somente depois de confirmar que
     * authVersion foi incrementado no banco
     * encerramos a sessão que solicitou
     * a revogação.
     */
    const {
      useAdminSession,
    } = await import(
      "../services/auth/admin-session.server"
    );

    const session =
      await useAdminSession();

    await session.clear();

    return {
      success:
        true as const,

      previousAuthVersion,

      authVersion:
        result.authVersion,
    };
  });
