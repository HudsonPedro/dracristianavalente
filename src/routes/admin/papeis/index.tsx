import {
  createFileRoute,
  Link,
  useRouter,
} from "@tanstack/react-router";

import {
  ADMIN_ACTIONS,
  ADMIN_MODULES,
  type AdminAction,
  type AdminModule,
} from "../../../domain/admin/access";

import {
  useState,
} from "react";

import {
  getAdminRolesForManagement,
  setAdminRoleStatusAction,
} from "../../../functions/admin-users";

export const Route =
  createFileRoute(
    "/admin/papeis/",
  )({
    loader: async () => {
      return getAdminRolesForManagement();
    },

    component:
      AdminRolesPage,
  });

const MODULE_LABELS: Record<
  AdminModule,
  string
> = {
  DASHBOARD:
    "Visão geral",

  CATALOG:
    "Catálogo",

  INVENTORY:
    "Estoque",

  ORDERS:
    "Pedidos",

  CUSTOMERS:
    "Clientes",

  SALES:
    "Vendas",

  FULFILLMENT:
    "Expedição",

  USERS:
    "Usuários e acessos",

  SETTINGS:
    "Configurações",

  AUDIT:
    "Auditoria",
};

const ACTION_LABELS: Record<
  AdminAction,
  string
> = {
  VIEW:
    "Visualizar",

  CREATE:
    "Criar",

  UPDATE:
    "Editar",

  DELETE:
    "Remover",

  MANAGE:
    "Gerenciar",
};

function hasPermission(
  permissions: {
    module: string;
    action: string;
  }[],
  module: AdminModule,
  action: AdminAction,
): boolean {
  return permissions.some(
    (
      permission,
    ) =>
      permission.module ===
        module &&
      permission.action ===
        action,
  );
}

function AdminRolesPage() {
  const roles =
    Route.useLoaderData();

  const router =
    useRouter();

  const [
    changingRoleId,
    setChangingRoleId,
  ] =
    useState<string | null>(
      null,
    );

  const [
    statusError,
    setStatusError,
  ] =
    useState<string | null>(
      null,
    );

  async function handleRoleStatusChange(
    roleId: string,
    active: boolean,
  ) {
    if (
      changingRoleId
    ) {
      return;
    }

    setStatusError(null);
    setChangingRoleId(
      roleId,
    );

    try {
      await setAdminRoleStatusAction({
        data: {
          roleId,
          active,
        },
      });

      await router.invalidate();
    } catch (
      caughtError
    ) {
      setStatusError(
        caughtError instanceof Error
          ? caughtError.message
          : "Não foi possível alterar o estado do papel administrativo.",
      );
    } finally {
      setChangingRoleId(
        null,
      );
    }
  }

  const activeRoles =
    roles.filter(
      (
        role,
      ) =>
        role.active,
    );

  const systemRoles =
    roles.filter(
      (
        role,
      ) =>
        role.systemRole,
    );

  const customRoles =
    roles.filter(
      (
        role,
      ) =>
        !role.systemRole,
    );

  const inactiveRoles =
    roles.filter(
      (
        role,
      ) =>
        !role.active,
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
              Papéis e permissões
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-6 text-stone-600">
              Controle as responsabilidades
              administrativas e visualize quais
              módulos e ações cada papel pode
              acessar na operação.
            </p>
          </div>

          <Link
            to="/admin/papeis/novo"
            className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-stone-950 px-6 text-sm font-semibold text-white transition hover:bg-stone-800"
          >
            + Novo papel
          </Link>
        </header>

        <section className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-stone-400">
              Total
            </p>

            <p className="mt-3 text-3xl font-semibold text-stone-950">
              {
                roles.length
              }
            </p>
          </article>

          <article className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-stone-400">
              Ativos
            </p>

            <p className="mt-3 text-3xl font-semibold text-stone-950">
              {
                activeRoles.length
              }
            </p>
          </article>

          <article className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-stone-400">
              Sistema
            </p>

            <p className="mt-3 text-3xl font-semibold text-stone-950">
              {
                systemRoles.length
              }
            </p>
          </article>

          <article className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-stone-400">
              Personalizados
            </p>

            <p className="mt-3 text-3xl font-semibold text-stone-950">
              {
                customRoles.length
              }
            </p>
          </article>
        </section>

        {inactiveRoles.length > 0 ? (
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
            <p className="text-sm font-semibold text-amber-800">
              Existem papéis administrativos
              inativos cadastrados.
            </p>
          </div>
        ) : null}

        {statusError ? (
          <div
            role="alert"
            className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4"
          >
            <p className="text-sm font-semibold text-red-700">
              {
                statusError
              }
            </p>
          </div>
        ) : null}

        <section className="mt-8 space-y-5">
          {roles.length === 0 ? (
            <div className="rounded-3xl border border-stone-200 bg-white px-6 py-14 text-center shadow-sm">
              <p className="text-sm font-medium text-stone-500">
                Nenhum papel administrativo cadastrado.
              </p>
            </div>
          ) : (
            roles.map(
              (
                role,
              ) => {
                const isSuperAdmin =
                  role.code ===
                  "SUPER_ADMIN";

                return (
                  <article
                    key={
                      role.id
                    }
                    className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm"
                  >
                    <div className="flex flex-col gap-5 border-b border-stone-200 px-6 py-6 lg:flex-row lg:items-start lg:justify-between md:px-8">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-xl font-semibold text-stone-950">
                            {
                              role.name
                            }
                          </h2>

                          <span className="inline-flex rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-stone-500">
                            {
                              role.systemRole
                                ? "Sistema"
                                : "Personalizado"
                            }
                          </span>

                          <span
                            className={[
                              "inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em]",

                              role.active
                                ? "border-stone-200 bg-stone-50 text-stone-600"
                                : "border-amber-200 bg-amber-50 text-amber-700",
                            ].join(
                              " ",
                            )}
                          >
                            {
                              role.active
                                ? "Ativo"
                                : "Inativo"
                            }
                          </span>

                          {isSuperAdmin ? (
                            <span className="inline-flex rounded-full border border-stone-900 bg-stone-950 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white">
                              Protegido
                            </span>
                          ) : null}
                        </div>

                        <p className="mt-2 font-mono text-xs font-semibold text-stone-500">
                          {
                            role.code
                          }
                        </p>

                        <p className="mt-4 max-w-3xl text-sm leading-6 text-stone-600">
                          {
                            role.description ??
                            "Sem descrição administrativa."
                          }
                        </p>
                      </div>

                      <div className="flex shrink-0 flex-wrap gap-2">
                        {!isSuperAdmin ? (
                          <Link
                            to="/admin/papeis/$roleId"
                            params={{
                              roleId:
                                role.id,
                            }}
                            className="rounded-xl border border-stone-300 bg-white px-4 py-2 text-xs font-semibold text-stone-700 transition hover:border-stone-500 hover:text-stone-950"
                          >
                            Editar
                          </Link>
                        ) : (
                          <button
                            type="button"
                            disabled
                            title="O Super Administrador é o papel-raiz protegido do sistema."
                            className="cursor-not-allowed rounded-xl border border-stone-200 bg-stone-50 px-4 py-2 text-xs font-semibold text-stone-400"
                          >
                            Editar
                          </button>
                        )}

                        {!isSuperAdmin &&
                        role.active ? (
                          <Link
                            to="/admin/papeis/$roleId/permissoes"
                            params={{
                              roleId:
                                role.id,
                            }}
                            className="rounded-xl border border-stone-950 bg-stone-950 px-4 py-2 text-xs font-semibold text-white transition hover:bg-stone-800"
                          >
                            Permissões
                          </Link>
                        ) : (
                          <button
                            type="button"
                            disabled
                            title={
                              isSuperAdmin
                                ? "As permissões do Super Administrador são protegidas."
                                : "Ative o papel antes de alterar permissões."
                            }
                            className="cursor-not-allowed rounded-xl border border-stone-200 bg-stone-50 px-4 py-2 text-xs font-semibold text-stone-400"
                          >
                            Permissões
                          </button>
                        )}

                        {!isSuperAdmin ? (
                          <button
                            type="button"
                            disabled={
                              changingRoleId !==
                              null
                            }
                            onClick={() =>
                              void handleRoleStatusChange(
                                role.id,
                                !role.active,
                              )
                            }
                            className={[
                              "rounded-xl border px-4 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50",

                              role.active
                                ? "border-amber-300 bg-amber-50 text-amber-800 hover:border-amber-400"
                                : "border-emerald-300 bg-emerald-50 text-emerald-800 hover:border-emerald-400",
                            ].join(
                              " ",
                            )}
                          >
                            {
                              changingRoleId ===
                              role.id
                                ? "Salvando..."
                                : role.active
                                  ? "Desativar"
                                  : "Ativar"
                            }
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled
                            title="O Super Administrador não pode ser desativado."
                            className="cursor-not-allowed rounded-xl border border-stone-200 bg-stone-50 px-4 py-2 text-xs font-semibold text-stone-400"
                          >
                            Desativar
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="px-6 py-6 md:px-8">
                      <div className="mb-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">
                          Matriz de acesso
                        </p>

                        <p className="mt-1 text-sm text-stone-500">
                          {
                            role.permissions.length
                          }{" "}
                          permissões persistidas.
                        </p>
                      </div>

                      <div className="overflow-x-auto rounded-2xl border border-stone-200">
                        <table className="w-full min-w-[850px] text-left">
                          <thead className="bg-stone-50">
                            <tr>
                              <th className="border-b border-stone-200 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-stone-400">
                                Módulo
                              </th>

                              {ADMIN_ACTIONS.map(
                                (
                                  action,
                                ) => (
                                  <th
                                    key={
                                      action
                                    }
                                    className="border-b border-stone-200 px-3 py-3 text-center text-[10px] font-bold uppercase tracking-[0.12em] text-stone-400"
                                  >
                                    {
                                      ACTION_LABELS[
                                        action
                                      ]
                                    }
                                  </th>
                                ),
                              )}
                            </tr>
                          </thead>

                          <tbody>
                            {ADMIN_MODULES.map(
                              (
                                module,
                              ) => (
                                <tr
                                  key={
                                    module
                                  }
                                  className="border-b border-stone-100 last:border-b-0"
                                >
                                  <td className="px-4 py-3">
                                    <p className="text-sm font-semibold text-stone-800">
                                      {
                                        MODULE_LABELS[
                                          module
                                        ]
                                      }
                                    </p>

                                    <p className="mt-0.5 font-mono text-[10px] text-stone-400">
                                      {
                                        module
                                      }
                                    </p>
                                  </td>

                                  {ADMIN_ACTIONS.map(
                                    (
                                      action,
                                    ) => {
                                      const allowed =
                                        hasPermission(
                                          role.permissions,
                                          module,
                                          action,
                                        );

                                      return (
                                        <td
                                          key={
                                            `${module}:${action}`
                                          }
                                          className="px-3 py-3 text-center"
                                        >
                                          <span
                                            title={
                                              `${module}:${action}`
                                            }
                                            className={[
                                              "inline-flex h-7 min-w-7 items-center justify-center rounded-lg border px-2 text-xs font-bold",

                                              allowed
                                                ? "border-stone-900 bg-stone-950 text-white"
                                                : "border-stone-200 bg-stone-50 text-stone-300",
                                            ].join(
                                              " ",
                                            )}
                                          >
                                            {
                                              allowed
                                                ? "✓"
                                                : "—"
                                            }
                                          </span>
                                        </td>
                                      );
                                    },
                                  )}
                                </tr>
                              ),
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </article>
                );
              },
            )
          )}
        </section>
      </div>
    </div>
  );
}
