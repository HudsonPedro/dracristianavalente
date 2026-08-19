import { useSession } from "@tanstack/react-start/server";

export type AdminSessionData = {
  authenticated?: boolean;
  role?: "ADMIN";
};

function getSessionSecret() {
  const secret =
    process.env.ADMIN_SESSION_SECRET;

  if (!secret) {
    throw new Error(
      "ADMIN_SESSION_SECRET não configurada.",
    );
  }

  if (secret.length < 32) {
    throw new Error(
      "ADMIN_SESSION_SECRET deve possuir pelo menos 32 caracteres.",
    );
  }

  return secret;
}

export function useAdminSession() {
  return useSession<AdminSessionData>({
    name: "dra-cris-admin-session",

    password: getSessionSecret(),

    cookie: {
      httpOnly: true,
      secure:
        process.env.NODE_ENV ===
        "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8,
    },
  });
}
