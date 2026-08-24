import {
  createFileRoute,
  Link,
} from "@tanstack/react-router";

import {
  getAdminUsers,
} from "../../../functions/admin-users";

export const Route =
  createFileRoute(
    "/admin/usuarios/",
  )({
    loader: async () => {
      return getAdminUsers();
    },

    component:
      AdminUsersPage,
  });

function formatDate(
  value: string | null,
): string {
  if (!value) {
    return "—";
  }

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

function formatStatus(
  status: string,
): string {
  switch (status) {
    case "ACTIVE":
      return "Ativo";

    case "INVITED":
      return "Convidado";

    case "BLOCKED":
      return "Bloqueado";

    case "INACTIVE":
      return "Inativo";

    default:
      return status;
  }
}

function AdminUsersPage() {
  const users =
    Route.useLoaderData();

  return (
    <div className="px-5 py-8 md:px-8 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
              Usuários e acessos
            </p>

            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-stone-950 md:text-5xl">
              Usuários
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-6 text-stone-600">
              Gerencie os usuários administrativos,
              papéis de acesso, estado da conta,
              bloqueios e segurança de credenciais.
            </p>
          </div>

          <button
            type="button"
            disabled
            className="inline-flex min-h-12 cursor-not-allowed items-center justify-center rounded-2xl bg-stone-300 px-6 text-sm font-semibold text-stone-500"
          >
            + Convidar usuário
          </button>
        </header>

        <section className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-stone-400">
              Total
            </p>

            <p className="mt-3 text-3xl font-semibold text-stone-950">
              {users.length}
            </p>
          </article>

          <article className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-stone-400">
              Ativos
            </p>

            <p className="mt-3 text-3xl font-semibold text-stone-950">
              {
                users.filter(
                  (user) =>
                    user.status ===
                    "ACTIVE",
                ).length
              }
            </p>
          </article>

          <article className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-stone-400">
              Convidados
            </p>

            <p className="mt-3 text-3xl font-semibold text-stone-950">
              {
                users.filter(
                  (user) =>
                    user.status ===
                    "INVITED",
                ).length
              }
            </p>
          </article>

          <article className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-stone-400">
              Bloqueados
            </p>

            <p className="mt-3 text-3xl font-semibold text-stone-950">
              {
                users.filter(
                  (user) =>
                    user.status ===
                      "BLOCKED" ||
                    Boolean(
                      user.lockedUntil,
                    ),
                ).length
              }
            </p>
          </article>
        </section>

        <section className="mt-8 overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
          <div className="border-b border-stone-200 px-6 py-5">
            <h2 className="text-lg font-semibold text-stone-950">
              Usuários administrativos
            </h2>

            <p className="mt-1 text-sm text-stone-500">
              Dados carregados diretamente da
              estrutura administrativa da loja.
            </p>
          </div>

          {users.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-sm font-medium text-stone-500">
                Nenhum usuário administrativo encontrado.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-[1180px] w-full text-left">
                <thead className="bg-stone-50">
                  <tr className="border-b border-stone-200">
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.16em] text-stone-400">
                      Usuário
                    </th>

                    <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-[0.16em] text-stone-400">
                      Papel
                    </th>

                    <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-[0.16em] text-stone-400">
                      Departamento
                    </th>

                    <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-[0.16em] text-stone-400">
                      Estado
                    </th>

                    <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-[0.16em] text-stone-400">
                      Último login
                    </th>

                    <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-[0.16em] text-stone-400">
                      Segurança
                    </th>

                    <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-[0.16em] text-stone-400">
                      Ações
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {users.map(
                    (user) => {
                      const temporarilyLocked =
                        user.lockedUntil
                          ? new Date(
                              user.lockedUntil,
                            ).getTime() >
                            Date.now()
                          : false;

                      return (
                        <tr
                          key={user.id}
                          className="border-b border-stone-100 last:border-b-0"
                        >
                          <td className="px-6 py-5">
                            <p className="font-semibold text-stone-950">
                              {user.name}
                            </p>

                            <p className="mt-1 text-sm text-stone-500">
                              {user.email}
                            </p>
                          </td>

                          <td className="px-4 py-5">
                            <p className="text-sm font-semibold text-stone-800">
                              {user.role.name}
                            </p>

                            <p className="mt-1 text-xs text-stone-400">
                              {user.role.code}
                            </p>
                          </td>

                          <td className="px-4 py-5 text-sm text-stone-600">
                            {user.department}
                          </td>

                          <td className="px-4 py-5">
                            <span className="inline-flex rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-xs font-semibold text-stone-700">
                              {formatStatus(
                                user.status,
                              )}
                            </span>
                          </td>

                          <td className="px-4 py-5 text-sm text-stone-600">
                            {formatDate(
                              user.lastLoginAt,
                            )}
                          </td>

                          <td className="px-4 py-5">
                            <div className="space-y-1 text-xs">
                              <p
                                className={
                                  temporarilyLocked
                                    ? "font-semibold text-red-700"
                                    : "text-stone-500"
                                }
                              >
                                {temporarilyLocked
                                  ? "Bloqueio temporário ativo"
                                  : "Sem bloqueio temporário"}
                              </p>

                              <p className="text-stone-400">
                                Tentativas inválidas:{" "}
                                {
                                  user.failedLoginAttempts
                                }
                              </p>

                              {user.mustChangePassword ? (
                                <p className="font-semibold text-amber-700">
                                  Troca de senha obrigatória
                                </p>
                              ) : null}
                            </div>
                          </td>

                          <td className="px-6 py-5">
                            <div className="flex justify-end gap-2">
                              <Link
                                to="/admin/usuarios/$userId"
                                params={{
                                  userId:
                                    user.id,
                                }}
                                className="rounded-xl border border-stone-300 bg-white px-3 py-2 text-xs font-semibold text-stone-700 transition hover:border-stone-950 hover:bg-stone-950 hover:text-white"
                              >
                                Editar
                              </Link>

                              <button
                                type="button"
                                disabled
                                className="cursor-not-allowed rounded-xl border border-stone-200 px-3 py-2 text-xs font-semibold text-stone-400"
                              >
                                Bloquear
                              </button>

                              <button
                                type="button"
                                disabled
                                className="cursor-not-allowed rounded-xl border border-stone-200 px-3 py-2 text-xs font-semibold text-stone-400"
                              >
                                Redefinir senha
                              </button>

                              <button
                                type="button"
                                disabled
                                className="cursor-not-allowed rounded-xl border border-stone-200 px-3 py-2 text-xs font-semibold text-stone-400"
                              >
                                Remover
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    },
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
