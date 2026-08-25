import {
  createFileRoute,
} from "@tanstack/react-router";

import {
  getAdminDepartments,
} from "../../../functions/admin-users";

export const Route =
  createFileRoute(
    "/admin/departamentos/",
  )({
    loader: async () => {
      return getAdminDepartments();
    },

    component:
      AdminDepartmentsPage,
  });

function formatDate(
  value: string,
): string {
  return new Intl.DateTimeFormat(
    "pt-BR",
    {
      dateStyle:
        "short",

      timeStyle:
        "short",

      timeZone:
        "America/Sao_Paulo",
    },
  ).format(
    new Date(value),
  );
}

function AdminDepartmentsPage() {
  const departments =
    Route.useLoaderData();

  const activeDepartments =
    departments.filter(
      (department) =>
        department.isActive,
    );

  const inactiveDepartments =
    departments.filter(
      (department) =>
        !department.isActive,
    );

  return (
    <div className="px-5 py-8 md:px-8 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
              Usuários e acessos
            </p>

            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-stone-950 md:text-5xl">
              Departamentos
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-6 text-stone-600">
              Gerencie a estrutura administrativa
              utilizada para organizar usuários,
              responsabilidades e acessos da operação.
            </p>
          </div>

          <button
            type="button"
            disabled
            className="inline-flex min-h-12 cursor-not-allowed items-center justify-center rounded-2xl bg-stone-300 px-6 text-sm font-semibold text-stone-500"
          >
            + Novo departamento
          </button>
        </header>

        <section className="mt-10 grid gap-4 sm:grid-cols-3">
          <article className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-stone-400">
              Total
            </p>

            <p className="mt-3 text-3xl font-semibold text-stone-950">
              {departments.length}
            </p>
          </article>

          <article className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-stone-400">
              Ativos
            </p>

            <p className="mt-3 text-3xl font-semibold text-stone-950">
              {activeDepartments.length}
            </p>
          </article>

          <article className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-stone-400">
              Inativos
            </p>

            <p className="mt-3 text-3xl font-semibold text-stone-950">
              {inactiveDepartments.length}
            </p>
          </article>
        </section>

        <section className="mt-8 overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
          <div className="border-b border-stone-200 px-6 py-5">
            <h2 className="text-lg font-semibold text-stone-950">
              Departamentos administrativos
            </h2>

            <p className="mt-1 text-sm text-stone-500">
              Dados carregados diretamente do
              cadastro administrativo em produção.
            </p>
          </div>

          {departments.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-sm font-medium text-stone-500">
                Nenhum departamento cadastrado.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] text-left">
                <thead className="bg-stone-50">
                  <tr className="border-b border-stone-200">
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.16em] text-stone-400">
                      Departamento
                    </th>

                    <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-[0.16em] text-stone-400">
                      Código
                    </th>

                    <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-[0.16em] text-stone-400">
                      Estado
                    </th>

                    <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-[0.16em] text-stone-400">
                      Atualizado
                    </th>

                    <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-[0.16em] text-stone-400">
                      Ações
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {departments.map(
                    (department) => (
                      <tr
                        key={
                          department.id
                        }
                        className="border-b border-stone-100 last:border-b-0"
                      >
                        <td className="px-6 py-5">
                          <p className="font-semibold text-stone-950">
                            {
                              department.name
                            }
                          </p>

                          <p className="mt-1 max-w-xl text-sm leading-5 text-stone-500">
                            {
                              department.description ??
                              "Sem descrição."
                            }
                          </p>
                        </td>

                        <td className="px-4 py-5">
                          <span className="font-mono text-xs font-semibold text-stone-600">
                            {
                              department.code
                            }
                          </span>
                        </td>

                        <td className="px-4 py-5">
                          <span className="inline-flex rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-xs font-semibold text-stone-700">
                            {
                              department.isActive
                                ? "Ativo"
                                : "Inativo"
                            }
                          </span>
                        </td>

                        <td className="px-4 py-5 text-sm text-stone-500">
                          {formatDate(
                            department.updatedAt,
                          )}
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              disabled
                              className="cursor-not-allowed rounded-xl border border-stone-200 px-3 py-2 text-xs font-semibold text-stone-400"
                            >
                              Editar
                            </button>

                            <button
                              type="button"
                              disabled
                              className="cursor-not-allowed rounded-xl border border-stone-200 px-3 py-2 text-xs font-semibold text-stone-400"
                            >
                              {department.isActive
                                ? "Desativar"
                                : "Ativar"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
