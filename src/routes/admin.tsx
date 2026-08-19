import {
  createFileRoute,
  Outlet,
  redirect,
} from "@tanstack/react-router";

import { getAdminAuth } from "../functions/admin-auth";

export const Route = createFileRoute("/admin")({
  beforeLoad: async ({ location }) => {
    /*
     * /admin/login precisa permanecer público
     * para permitir que o administrador crie
     * sua sessão.
     */
    if (
      location.pathname ===
      "/admin/login"
    ) {
      return;
    }

    const auth =
      await getAdminAuth();

    if (!auth.authenticated) {
      throw redirect({
        to: "/admin/login",
      });
    }

    return {
      admin: {
        authenticated: true as const,
        role: "ADMIN" as const,
      },
    };
  },

  component: AdminLayout,
});

function AdminLayout() {
  return <Outlet />;
}
