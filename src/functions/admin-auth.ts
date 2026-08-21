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
        role: "ADMIN",
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
      session.data.role ===
        "ADMIN";

    return {
      authenticated,

      role:
        authenticated
          ? ("ADMIN" as const)
          : null,
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
