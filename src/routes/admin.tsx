import { createFileRoute, Link, Outlet, redirect, useRouterState } from "@tanstack/react-router";

import { getAdminAuth, logoutAdmin } from "../functions/admin-auth";

export const Route = createFileRoute("/admin")({
  beforeLoad: async ({ location }) => {
    if (location.pathname === "/admin/login") {
      return {
        adminAuth: null,
      };
    }

    const auth = await getAdminAuth();

    if (!auth.authenticated) {
      throw redirect({
        to: "/admin/login",
      });
    }

    return {
      adminAuth: auth,
    };
  },

  errorComponent: AdminErrorComponent,
  component: AdminRouteLayout,
});

function AdminErrorComponent({ error }: { error: Error }) {
  const isPermissionDenied =
    error.message === "Acesso administrativo sem permissão para esta operação.";

  if (!isPermissionDenied) {
    throw error;
  }

  return (
    <main className="min-h-screen bg-[#f7f4ef] px-5 py-12 text-stone-950 md:px-8">
      <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center">
        <section className="w-full rounded-3xl border border-stone-200 bg-white p-8 shadow-sm md:p-12">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
            Administração
          </p>

          <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">Acesso negado</h1>

          <p className="mt-5 max-w-xl text-sm leading-7 text-stone-600 md:text-base">
            Seu perfil não possui permissão para acessar esta área.
          </p>

          <div className="mt-8">
            <Link
              to="/admin"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-stone-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-stone-800"
            >
              Voltar para a Visão geral
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
function AdminRouteLayout() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  const { adminAuth } = Route.useRouteContext();

  if (pathname === "/admin/login") {
    return <Outlet />;
  }

  if (!adminAuth) {
    return null;
  }

  return <AdminShell auth={adminAuth} />;
}

type AdminShellAuth = {
  authenticated: true;

  userId: string;

  name: string;

  email: string;

  roleId: string;

  role: string;

  roleName: string;

  authVersion: number;

  permissions: Array<{
    module: string;
    action: string;
  }>;
};

function AdminShell({ auth }: { auth: AdminShellAuth }) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  async function handleLogout() {
    await logoutAdmin();

    window.location.href = "/admin/login";
  }

  const dashboardActive = pathname === "/admin" || pathname === "/admin/";

  const productsActive = pathname === "/admin/produtos" || pathname.startsWith("/admin/produtos/");

  const usersActive = pathname === "/admin/usuarios" || pathname.startsWith("/admin/usuarios/");

  const departmentsActive =
    pathname === "/admin/departamentos" || pathname.startsWith("/admin/departamentos/");

  const rolesActive = pathname === "/admin/papeis" || pathname.startsWith("/admin/papeis/");

  const passwordActive = pathname === "/admin/seguranca/senha";

  const canViewDashboard = auth.permissions.some(
    (permission) => permission.module === "DASHBOARD" && permission.action === "VIEW",
  );

  const canViewCatalog = auth.permissions.some(
    (permission) => permission.module === "CATALOG" && permission.action === "VIEW",
  );

  const canViewUsers = auth.permissions.some(
    (permission) => permission.module === "USERS" && permission.action === "VIEW",
  );

  return (
    <div className="min-h-screen bg-[#f7f4ef] text-stone-900">
      <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/95 backdrop-blur">
        <div className="flex min-h-16 items-center justify-between gap-6 px-5 md:px-8">
          <Link to="/admin" className="flex min-w-0 items-center gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-500">
                Dra. Cristiana Valente
              </p>

              <p className="mt-0.5 text-base font-semibold text-stone-950">Administração</p>
            </div>
          </Link>

          <div className="flex min-w-0 items-center gap-3 sm:gap-5">
            <div className="min-w-0 text-right">
              <p className="truncate text-sm font-semibold text-stone-950">{auth.name}</p>

              <p className="truncate text-xs font-medium text-stone-500">{auth.roleName}</p>

              <p className="hidden truncate text-[11px] text-stone-400 sm:block">{auth.email}</p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="shrink-0 rounded-xl border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-stone-700 transition hover:border-stone-300 hover:bg-stone-50 hover:text-stone-950"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[1680px]">
        <aside className="hidden min-h-[calc(100vh-65px)] w-72 shrink-0 border-r border-stone-200 bg-white px-5 py-7 lg:block">
          <nav className="space-y-8">
            <section>
              <p className="px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-stone-400">
                Administração
              </p>

              {canViewDashboard ? (
                <div className="mt-3">
                  <Link
                    to="/admin"
                    className={[
                      "flex items-center rounded-xl px-3 py-2.5 text-sm font-semibold transition",

                      dashboardActive
                        ? "bg-stone-950 text-white"
                        : "text-stone-600 hover:bg-stone-100 hover:text-stone-950",
                    ].join(" ")}
                  >
                    Visão geral
                  </Link>
                </div>
              ) : null}
            </section>

            {canViewCatalog ? (
              <section>
                <p className="px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-stone-400">
                  Loja
                </p>

                <div className="mt-3">
                  <Link
                    to="/admin/produtos"
                    className={[
                      "flex items-center rounded-xl px-3 py-2.5 text-sm font-semibold transition",

                      productsActive
                        ? "bg-stone-950 text-white"
                        : "text-stone-600 hover:bg-stone-100 hover:text-stone-950",
                    ].join(" ")}
                  >
                    Produtos
                  </Link>
                </div>
              </section>
            ) : null}

            {canViewUsers ? (
              <section>
                <p className="px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-stone-400">
                  Usuários e acessos
                </p>

                <div className="mt-3 space-y-1">
                  <Link
                    to="/admin/usuarios"
                    className={[
                      "flex items-center rounded-xl px-3 py-2.5 text-sm font-semibold transition",

                      usersActive
                        ? "bg-stone-950 text-white"
                        : "text-stone-600 hover:bg-stone-100 hover:text-stone-950",
                    ].join(" ")}
                  >
                    Usuários
                  </Link>

                  <Link
                    to="/admin/departamentos"
                    className={[
                      "flex items-center rounded-xl px-3 py-2.5 text-sm font-semibold transition",

                      departmentsActive
                        ? "bg-stone-950 text-white"
                        : "text-stone-600 hover:bg-stone-100 hover:text-stone-950",
                    ].join(" ")}
                  >
                    Departamentos
                  </Link>

                  <Link
                    to="/admin/papeis"
                    className={[
                      "flex items-center rounded-xl px-3 py-2.5 text-sm font-semibold transition",

                      rolesActive
                        ? "bg-stone-950 text-white"
                        : "text-stone-600 hover:bg-stone-100 hover:text-stone-950",
                    ].join(" ")}
                  >
                    Papéis e permissões
                  </Link>
                </div>
              </section>
            ) : null}

            <section>
              <p className="px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-stone-400">
                Segurança
              </p>

              <div className="mt-3">
                <Link
                  to="/admin/seguranca/senha"
                  className={[
                    "flex items-center rounded-xl px-3 py-2.5 text-sm font-semibold transition",

                    passwordActive
                      ? "bg-stone-950 text-white"
                      : "text-stone-600 hover:bg-stone-100 hover:text-stone-950",
                  ].join(" ")}
                >
                  Alterar senha
                </Link>
              </div>
            </section>
          </nav>

          <div className="mt-10 border-t border-stone-200 px-3 pt-6">
            <p className="text-[11px] leading-5 text-stone-400">
              Área restrita à administração da loja Dra. Cristiana Valente.
            </p>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <div className="border-b border-stone-200 bg-white px-4 py-3 lg:hidden">
            <div className="flex gap-2 overflow-x-auto">
              {canViewDashboard ? (
                <Link
                  to="/admin"
                  className={[
                    "shrink-0 rounded-xl px-4 py-2 text-sm font-semibold",

                    dashboardActive ? "bg-stone-950 text-white" : "bg-stone-100 text-stone-700",
                  ].join(" ")}
                >
                  Visão geral
                </Link>
              ) : null}

              {canViewCatalog ? (
                <Link
                  to="/admin/produtos"
                  className={[
                    "shrink-0 rounded-xl px-4 py-2 text-sm font-semibold",

                    productsActive ? "bg-stone-950 text-white" : "bg-stone-100 text-stone-700",
                  ].join(" ")}
                >
                  Produtos
                </Link>
              ) : null}

              {canViewUsers ? (
                <>
                  <Link
                    to="/admin/usuarios"
                    className={[
                      "shrink-0 rounded-xl px-4 py-2 text-sm font-semibold",

                      usersActive ? "bg-stone-950 text-white" : "bg-stone-100 text-stone-700",
                    ].join(" ")}
                  >
                    Usuários
                  </Link>

                  <Link
                    to="/admin/departamentos"
                    className={[
                      "shrink-0 rounded-xl px-4 py-2 text-sm font-semibold",

                      departmentsActive ? "bg-stone-950 text-white" : "bg-stone-100 text-stone-700",
                    ].join(" ")}
                  >
                    Departamentos
                  </Link>

                  <Link
                    to="/admin/papeis"
                    className={[
                      "shrink-0 rounded-xl px-4 py-2 text-sm font-semibold",

                      rolesActive ? "bg-stone-950 text-white" : "bg-stone-100 text-stone-700",
                    ].join(" ")}
                  >
                    Papéis
                  </Link>
                </>
              ) : null}

              <Link
                to="/admin/seguranca/senha"
                className={[
                  "shrink-0 rounded-xl px-4 py-2 text-sm font-semibold",

                  passwordActive ? "bg-stone-950 text-white" : "bg-stone-100 text-stone-700",
                ].join(" ")}
              >
                Alterar senha
              </Link>
            </div>
          </div>

          <Outlet />
        </main>
      </div>
    </div>
  );
}
