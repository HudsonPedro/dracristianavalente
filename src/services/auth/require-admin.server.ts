import { useAdminSession } from "./admin-session.server";

export type AuthenticatedAdmin = {
  authenticated: true;
  role: "ADMIN";
};

export async function requireAdmin(): Promise<AuthenticatedAdmin> {
  const session =
    await useAdminSession();

  const authenticated =
    session.data.authenticated === true &&
    session.data.role === "ADMIN";

  if (!authenticated) {
    throw new Error(
      "Acesso administrativo não autorizado.",
    );
  }

  return {
    authenticated: true,
    role: "ADMIN",
  };
}
