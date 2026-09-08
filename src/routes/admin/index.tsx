import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboardPage,
});

function AdminDashboardPage() {
  const { adminAuth } = Route.useRouteContext();

  const permissions = adminAuth?.permissions ?? [];

  const canViewCatalog = permissions.some(
    (permission) => permission.module === "CATALOG" && permission.action === "VIEW",
  );

  const canViewUsers = permissions.some(
    (permission) => permission.module === "USERS" && permission.action === "VIEW",
  );

  return (
    <div className="px-5 py-8 md:px-8 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-7xl">
        <header>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
            Administração
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-stone-950 md:text-5xl">
            Visão geral
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-stone-600">
            Central administrativa da loja Dra. Cristiana Valente. Acompanhe os principais módulos e
            acesse rapidamente as áreas de gestão disponíveis para o seu perfil.
          </p>
        </header>

        <section className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-stone-400">Loja</p>

            <p className="mt-4 text-2xl font-semibold text-stone-950">Ativa</p>

            <p className="mt-2 text-sm leading-6 text-stone-500">
              Estrutura administrativa da loja disponível em produção.
            </p>
          </article>

          {canViewCatalog ? (
            <article className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-stone-400">
                Produtos
              </p>

              <p className="mt-4 text-2xl font-semibold text-stone-950">Disponível</p>

              <p className="mt-2 text-sm leading-6 text-stone-500">
                Catálogo administrativo integrado ao painel.
              </p>
            </article>
          ) : null}

          {canViewUsers ? (
            <article className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-stone-400">
                Usuários
              </p>

              <p className="mt-4 text-2xl font-semibold text-stone-950">Disponível</p>

              <p className="mt-2 text-sm leading-6 text-stone-500">
                Gestão de usuários, papéis e permissões integrada ao painel.
              </p>
            </article>
          ) : null}

          <article className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-stone-400">
              Segurança
            </p>

            <p className="mt-4 text-2xl font-semibold text-stone-950">Protegida</p>

            <p className="mt-2 text-sm leading-6 text-stone-500">
              Autenticação, sessão e troca segura de senha ativas.
            </p>
          </article>
        </section>

        <section className="mt-8">
          <div className="mb-5">
            <h2 className="text-2xl font-semibold tracking-tight text-stone-950">Acesso rápido</h2>

            <p className="mt-2 text-sm text-stone-500">
              Acesse os módulos administrativos disponíveis para o seu perfil.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {canViewCatalog ? (
              <Link
                to="/admin/produtos"
                className="group rounded-3xl border border-stone-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-stone-300 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-stone-400">
                      Loja
                    </p>

                    <h3 className="mt-3 text-xl font-semibold text-stone-950">Produtos</h3>

                    <p className="mt-2 text-sm leading-6 text-stone-500">
                      Gerencie catálogo, disponibilidade, regras de venda e estoque.
                    </p>
                  </div>

                  <span className="text-xl text-stone-400 transition group-hover:translate-x-1 group-hover:text-stone-950">
                    →
                  </span>
                </div>
              </Link>
            ) : null}

            <Link
              to="/admin/seguranca/senha"
              className="group rounded-3xl border border-stone-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-stone-300 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-stone-400">
                    Segurança
                  </p>

                  <h3 className="mt-3 text-xl font-semibold text-stone-950">Alterar senha</h3>

                  <p className="mt-2 text-sm leading-6 text-stone-500">
                    Atualize sua credencial administrativa com revogação das sessões anteriores.
                  </p>
                </div>

                <span className="text-xl text-stone-400 transition group-hover:translate-x-1 group-hover:text-stone-950">
                  →
                </span>
              </div>
            </Link>
          </div>
        </section>

        {canViewUsers ? (
          <section className="mt-8 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm md:p-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-stone-400">
                  Administração
                </p>

                <h2 className="mt-2 text-xl font-semibold text-stone-950">Usuários e acessos</h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-500">
                  Gerencie usuários, papéis, departamentos, convites e permissões administrativas.
                </p>
              </div>

              <Link
                to="/admin/usuarios"
                className="shrink-0 rounded-full border border-stone-200 bg-stone-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-stone-600 transition hover:border-stone-300 hover:bg-stone-100 hover:text-stone-950"
              >
                Gerenciar usuários
              </Link>
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
