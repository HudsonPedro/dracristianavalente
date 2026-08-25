import {
  createFileRoute,
  Link,
  useNavigate,
} from "@tanstack/react-router";

import {
  useMemo,
  useState,
} from "react";

import {
  ADMIN_ACTIONS,
  ADMIN_MODULES,
  type AdminAction,
  type AdminModule,
} from "../../../../domain/admin/access";

import {
  getAdminRolesForManagement,
  updateAdminRolePermissionsAction,
} from "../../../../functions/admin-users";

export const Route =
  createFileRoute(
    "/admin/papeis/$roleId/permissoes",
  )({
    loader: async ({
      params,
    }) => {
      const roles =
        await getAdminRolesForManagement();

      const role =
        roles.find(
          (
            item,
          ) =>
            item.id ===
            params.roleId,
        );

      if (!role) {
        throw new Error(
          "Papel administrativo não encontrado.",
        );
      }

      if (
        role.systemRole
      ) {
        throw new Error(
          "As permissões de papéis estruturais do sistema não podem ser alteradas por esta operação.",
        );
      }

      if (
        !role.active
      ) {
        throw new Error(
          "Não é possível alterar permissões de um papel inativo.",
        );
      }

      return {
        role,
      };
    },

    component:
      AdminRolePermissionsPage,
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

type PermissionSelection = {
  module: AdminModule;

  action: AdminAction;
};

function permissionKey(
  module: AdminModule,
  action: AdminAction,
): string {
  return `${module}:${action}`;
}

function AdminRolePermissionsPage() {
  const {
    role,
  } =
    Route.useLoaderData();

  const navigate =
    useNavigate();

  const initialPermissionKeys =
    useMemo(
      () =>
        new Set(
          role.permissions.map(
            (
              permission,
            ) =>
              `${permission.module}:${permission.action}`,
          ),
        ),
      [
        role.permissions,
      ],
    );

  const [
    selectedPermissions,
    setSelectedPermissions,
  ] =
    useState<Set<string>>(
      () =>
        new Set(
          initialPermissionKeys,
        ),
    );

  const [
    submitting,
    setSubmitting,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null,
    );

  function togglePermission(
    module: AdminModule,
    action: AdminAction,
  ) {
    const key =
      permissionKey(
        module,
        action,
      );

    setSelectedPermissions(
      (
        current,
      ) => {
        const next =
          new Set(
            current,
          );

        if (
          next.has(
            key,
          )
        ) {
          next.delete(
            key,
          );
        } else {
          next.add(
            key,
          );
        }

        return next;
      },
    );
  }

  function selectModule(
    module: AdminModule,
  ) {
    setSelectedPermissions(
      (
        current,
      ) => {
        const next =
          new Set(
            current,
          );

        for (
          const action
          of ADMIN_ACTIONS
        ) {
          next.add(
            permissionKey(
              module,
              action,
            ),
          );
        }

        return next;
      },
    );
  }

  function clearModule(
    module: AdminModule,
  ) {
    setSelectedPermissions(
      (
        current,
      ) => {
        const next =
          new Set(
            current,
          );

        for (
          const action
          of ADMIN_ACTIONS
        ) {
          next.delete(
            permissionKey(
              module,
              action,
            ),
          );
        }

        return next;
      },
    );
  }

  function selectAll() {
    const next =
      new Set<string>();

    for (
      const module
      of ADMIN_MODULES
    ) {
      for (
        const action
        of ADMIN_ACTIONS
      ) {
        next.add(
          permissionKey(
            module,
            action,
          ),
        );
      }
    }

    setSelectedPermissions(
      next,
    );
  }

  function clearAll() {
    setSelectedPermissions(
      new Set(),
    );
  }

  function resetPermissions() {
    setSelectedPermissions(
      new Set(
        initialPermissionKeys,
      ),
    );

    setError(null);
  }

  function buildPermissions():
    PermissionSelection[] {
    const permissions:
      PermissionSelection[] =
        [];

    for (
      const module
      of ADMIN_MODULES
    ) {
      for (
        const action
        of ADMIN_ACTIONS
      ) {
        if (
          selectedPermissions.has(
            permissionKey(
              module,
              action,
            ),
          )
        ) {
          permissions.push({
            module,
            action,
          });
        }
      }
    }

    return permissions;
  }

  async function handleSubmit(
    event:
      React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (
      submitting
    ) {
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      await updateAdminRolePermissionsAction({
        data: {
          roleId:
            role.id,

          permissions:
            buildPermissions(),
        },
      });

      await navigate({
        to:
          "/admin/papeis",
      });
    } catch (
      caughtError
    ) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Não foi possível atualizar as permissões do papel.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="px-5 py-8 md:px-8 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-7xl">
        <Link
          to="/admin/papeis"
          className="text-sm font-semibold text-stone-500 transition hover:text-stone-950"
        >
          ← Voltar para papéis e permissões
        </Link>

        <header className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
            Usuários e acessos
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-stone-950 md:text-5xl">
            Permissões do papel
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-6 text-stone-600">
            Configure exatamente quais
            módulos e ações este papel
            administrativo poderá utilizar.
          </p>
        </header>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <article className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-stone-400">
              Papel
            </p>

            <p className="mt-2 text-lg font-semibold text-stone-950">
              {
                role.name
              }
            </p>
          </article>

          <article className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-stone-400">
              Código
            </p>

            <p className="mt-2 font-mono text-sm font-semibold text-stone-700">
              {
                role.code
              }
            </p>
          </article>

          <article className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-stone-400">
              Tipo / Estado
            </p>

            <p className="mt-2 text-sm font-semibold text-stone-800">
              Personalizado · Ativo
            </p>
          </article>
        </section>

        <form
          onSubmit={
            handleSubmit
          }
          className="mt-8 overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm"
        >
          <div className="flex flex-col gap-4 border-b border-stone-200 px-6 py-5 lg:flex-row lg:items-center lg:justify-between md:px-8">
            <div>
              <h2 className="text-lg font-semibold text-stone-950">
                Matriz de acesso
              </h2>

              <p className="mt-1 text-sm text-stone-500">
                {
                  selectedPermissions.size
                }{" "}
                permissões selecionadas.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={
                  selectAll
                }
                className="rounded-xl border border-stone-200 bg-white px-4 py-2 text-xs font-semibold text-stone-700 transition hover:border-stone-400"
              >
                Selecionar tudo
              </button>

              <button
                type="button"
                onClick={
                  clearAll
                }
                className="rounded-xl border border-stone-200 bg-white px-4 py-2 text-xs font-semibold text-stone-700 transition hover:border-stone-400"
              >
                Limpar tudo
              </button>

              <button
                type="button"
                onClick={
                  resetPermissions
                }
                className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-2 text-xs font-semibold text-stone-600 transition hover:border-stone-400"
              >
                Restaurar
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left">
              <thead className="bg-stone-50">
                <tr className="border-b border-stone-200">
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.14em] text-stone-400">
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
                        className="px-4 py-4 text-center text-[10px] font-bold uppercase tracking-[0.12em] text-stone-400"
                      >
                        {
                          ACTION_LABELS[
                            action
                          ]
                        }
                      </th>
                    ),
                  )}

                  <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-[0.14em] text-stone-400">
                    Módulo
                  </th>
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
                      <td className="px-6 py-5">
                        <p className="text-sm font-semibold text-stone-900">
                          {
                            MODULE_LABELS[
                              module
                            ]
                          }
                        </p>

                        <p className="mt-1 font-mono text-[10px] text-stone-400">
                          {
                            module
                          }
                        </p>
                      </td>

                      {ADMIN_ACTIONS.map(
                        (
                          action,
                        ) => {
                          const checked =
                            selectedPermissions.has(
                              permissionKey(
                                module,
                                action,
                              ),
                            );

                          return (
                            <td
                              key={
                                `${module}:${action}`
                              }
                              className="px-4 py-5 text-center"
                            >
                              <label className="inline-flex cursor-pointer items-center justify-center">
                                <input
                                  type="checkbox"
                                  checked={
                                    checked
                                  }
                                  onChange={() =>
                                    togglePermission(
                                      module,
                                      action,
                                    )
                                  }
                                  className="h-5 w-5 cursor-pointer rounded border-stone-300 accent-stone-950"
                                />
                              </label>
                            </td>
                          );
                        },
                      )}

                      <td className="px-6 py-5">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              selectModule(
                                module,
                              )
                            }
                            className="rounded-lg border border-stone-200 px-3 py-2 text-[10px] font-semibold text-stone-600 transition hover:border-stone-400"
                          >
                            Tudo
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              clearModule(
                                module,
                              )
                            }
                            className="rounded-lg border border-stone-200 px-3 py-2 text-[10px] font-semibold text-stone-600 transition hover:border-stone-400"
                          >
                            Limpar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>

          {error ? (
            <div
              role="alert"
              className="mx-6 mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 md:mx-8"
            >
              {error}
            </div>
          ) : null}

          <div className="flex flex-col-reverse gap-3 border-t border-stone-200 bg-stone-50 px-6 py-5 sm:flex-row sm:justify-end md:px-8">
            <Link
              to="/admin/papeis"
              className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-stone-200 bg-white px-6 text-sm font-semibold text-stone-700 transition hover:border-stone-300"
            >
              Cancelar
            </Link>

            <button
              type="submit"
              disabled={
                submitting
              }
              className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-stone-950 px-6 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-400"
            >
              {
                submitting
                  ? "Salvando..."
                  : "Salvar permissões"
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
