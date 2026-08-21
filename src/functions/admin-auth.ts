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
    const {
      useAdminSession,
    } = await import(
      "../services/auth/admin-session.server"
    );

    const session =
      await useAdminSession();

    const authenticated =
      session.data.authenticated ===
        true &&
      typeof session.data.userId ===
        "string" &&
      typeof session.data.roleId ===
        "string" &&
      typeof session.data.role ===
        "string" &&
      typeof session.data.authVersion ===
        "number";

    if (!authenticated) {
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

    return {
      authenticated:
        true as const,

      userId:
        session.data.userId!,

      roleId:
        session.data.roleId!,

      role:
        session.data.role!,

      authVersion:
        session.data.authVersion!,
    };
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
     * Primeiro validamos a sessão atual
     * contra o usuário real no Neon.
     */
    const {
      requireAdmin,
    } = await import(
      "../services/auth/require-admin.server"
    );

    const admin =
      await requireAdmin();

    /*
     * Incrementamos authVersion no banco.
     *
     * Qualquer sessão antiga contendo
     * a versão anterior passa a ser inválida
     * na próxima chamada de requireAdmin().
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
     * A sessão que solicitou a revogação
     * também precisa ser encerrada.
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
      success: true as const,

      authVersion:
        result.authVersion,
    };
  });
