import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
  useRouterState,
} from "@tanstack/react-router";

import {
  getAdminAuth,
  logoutAdmin,
} from "../functions/admin-auth";

export const Route = createFileRoute("/admin")({
  beforeLoad: async ({ location }) => {
    /*
     * O login permanece público e fora
     * do shell visual administrativo.
     */
    if (location.pathname === "/admin/login") {
      return;
    }

    const auth =
      await getAdminAuth();

    if (!auth.authenticated) {
      throw redirect({
        to: "/admin/login",
      });
    }
  },

  component:
    AdminRouteLayout,
});

function AdminRouteLayout() {
  const pathname =
    useRouterState({
      select: (state) =>
        state.location.pathname,
    });

  if (pathname === "/admin/login") {
    return <Outlet />;
  }

  return <AdminShell />;
}

function AdminShell() {
  const pathname =
    useRouterState({
      select: (state) =>
        state.location.pathname,
    });

  async function handleLogout() {
    await logoutAdmin();

    window.location.href =
      "/admin/login";
  }

  const dashboardActive =
    pathname === "/admin" ||
    pathname === "/admin/";

  const productsActive =
    pathname === "/admin/produtos" ||
    pathname.startsWith(
      "/admin/produtos/",
    );

  const passwordActive =
    pathname ===
    "/admin/seguranca/senha";

  return (
    <div className="min-h-screen bg-[#f7f4ef] text-stone-900">
      <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/95 backdrop-blur">
        <div className="flex min-h-16 items-center justify-between gap-6 px-5 md:px-8">
          <Link
            to="/admin/"
            className="flex min-w-0 items-center gap-4"
          >
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-500">
                Dra. Cristiana Valente
              </p>

              <p className="mt-0.5 text-base font-semibold text-stone-950">
                Administração
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-xl border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-stone-700 transition hover:border-stone-300 hover:bg-stone-50 hover:text-stone-950"
          >
            Sair
          </button>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[1680px]">
        <aside className="hidden min-h-[calc(100vh-65px)] w-72 shrink-0 border-r border-stone-200 bg-white px-5 py-7 lg:block">
          <nav className="space-y-8">
            <section>
              <p className="px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-stone-400">
                Administração
              </p>

              <div className="mt-3">
                <Link
                  to="/admin/"
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
            </section>

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

            <section>
              <p className="px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-stone-400">
                Usuários e acessos
              </p>

              <div className="mt-3 space-y-1">
                <div className="flex cursor-not-allowed items-center rounded-xl px-3 py-2.5 text-sm font-medium text-stone-400">
                  Usuários

                  <span className="ml-auto text-[9px] uppercase tracking-wider">
                    Em breve
                  </span>
                </div>

                <div className="flex cursor-not-allowed items-center rounded-xl px-3 py-2.5 text-sm font-medium text-stone-400">
                  Papéis e permissões

                  <span className="ml-auto text-[9px] uppercase tracking-wider">
                    Em breve
                  </span>
                </div>
              </div>
            </section>

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
              Área restrita à administração da
              loja Dra. Cristiana Valente.
            </p>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <div className="border-b border-stone-200 bg-white px-4 py-3 lg:hidden">
            <div className="flex gap-2 overflow-x-auto">
              <Link
                to="/admin/"
                className={[
                  "shrink-0 rounded-xl px-4 py-2 text-sm font-semibold",
                  dashboardActive
                    ? "bg-stone-950 text-white"
                    : "bg-stone-100 text-stone-700",
                ].join(" ")}
              >
                Visão geral
              </Link>

              <Link
                to="/admin/produtos"
                className={[
                  "shrink-0 rounded-xl px-4 py-2 text-sm font-semibold",
                  productsActive
                    ? "bg-stone-950 text-white"
                    : "bg-stone-100 text-stone-700",
                ].join(" ")}
              >
                Produtos
              </Link>

              <Link
                to="/admin/seguranca/senha"
                className={[
                  "shrink-0 rounded-xl px-4 py-2 text-sm font-semibold",
                  passwordActive
                    ? "bg-stone-950 text-white"
                    : "bg-stone-100 text-stone-700",
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
