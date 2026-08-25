import {
  createFileRoute,
  Link,
  useRouter,
} from "@tanstack/react-router";

import {
  useState,
} from "react";

import {
  getAdminDepartments,
  setAdminDepartmentStatusAction,
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

type PendingStatusChange = {
  id: string;

  name: string;

  code: string;

  currentStatus: boolean;

  nextStatus: boolean;
};

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

  const router =
    useRouter();

  const [
    pendingStatusChange,
    setPendingStatusChange,
  ] =
    useState<PendingStatusChange | null>(
      null,
    );

  const [
    submittingStatus,
    setSubmittingStatus,
  ] =
    useState(false);

  const [
    statusError,
    setStatusError,
  ] =
    useState<string | null>(
      null,
    );

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

  function requestStatusChange(
    department: {
      id: string;
      name: string;
      code: string;
      isActive: boolean;
    },
  ) {
    setStatusError(null);

    setPendingStatusChange({
      id:
        department.id,

      name:
        department.name,

      code:
        department.code,

      currentStatus:
        department.isActive,

      nextStatus:
        !department.isActive,
    });
  }

  function cancelStatusChange() {
    if (submittingStatus) {
      return;
    }

    setStatusError(null);

    setPendingStatusChange(
      null,
    );
  }

  async function confirmStatusChange() {
    if (
      !pendingStatusChange ||
      submittingStatus
    ) {
      return;
    }

    setStatusError(null);
    setSubmittingStatus(true);

    try {
      await setAdminDepartmentStatusAction({
        data: {
          departmentId:
            pendingStatusChange.id,

          isActive:
            pendingStatusChange.nextStatus,
        },
      });

      setPendingStatusChange(
        null,
      );

      await router.invalidate();
    } catch (
      caughtError
    ) {
      setStatusError(
        caughtError instanceof Error
          ? caughtError.message
          : "Não foi possível alterar o estado do departamento.",
      );
    } finally {
      setSubmittingStatus(false);
    }
  }

  return (
    <>
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

            <Link
              to="/admin/departamentos/novo"
              className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-stone-950 px-6 text-sm font-semibold text-white transition hover:bg-stone-800"
            >
              + Novo departamento
            </Link>
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
                            <span
                              className={[
                                "inline-flex rounded-full border px-3 py-1 text-xs font-semibold",

                                department.isActive
                                  ? "border-stone-200 bg-stone-50 text-stone-700"
                                  : "border-amber-200 bg-amber-50 text-amber-700",
                              ].join(
                                " ",
                              )}
                            >
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
                              <Link
                                to="/admin/departamentos/$departmentId"
                                params={{
                                  departmentId:
                                    department.id,
                                }}
                                className="rounded-xl border border-stone-300 bg-white px-3 py-2 text-xs font-semibold text-stone-700 transition hover:border-stone-950 hover:bg-stone-950 hover:text-white"
                              >
                                Editar
                              </Link>

                              <button
                                type="button"
                                onClick={() =>
                                  requestStatusChange(
                                    department,
                                  )
                                }
                                className={[
                                  "rounded-xl border px-3 py-2 text-xs font-semibold transition",

                                  department.isActive
                                    ? "border-stone-300 bg-white text-stone-700 hover:border-amber-500 hover:bg-amber-50 hover:text-amber-800"
                                    : "border-stone-950 bg-stone-950 text-white hover:bg-stone-800",
                                ].join(
                                  " ",
                                )}
                              >
                                {
                                  department.isActive
                                    ? "Desativar"
                                    : "Ativar"
                                }
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

      {pendingStatusChange ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="department-status-title"
            className="w-full max-w-lg overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-2xl"
          >
            <div className="px-6 py-6 md:px-8">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">
                Alterar estado
              </p>

              <h2
                id="department-status-title"
                className="mt-3 text-2xl font-semibold tracking-tight text-stone-950"
              >
                {
                  pendingStatusChange.nextStatus
                    ? "Ativar departamento?"
                    : "Desativar departamento?"
                }
              </h2>

              <p className="mt-4 text-sm leading-6 text-stone-600">
                Você está prestes a{" "}
                <strong>
                  {
                    pendingStatusChange.nextStatus
                      ? "ativar"
                      : "desativar"
                  }
                </strong>{" "}
                o departamento{" "}
                <strong>
                  {
                    pendingStatusChange.name
                  }
                </strong>.
              </p>

              <div className="mt-5 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-400">
                  Código
                </p>

                <p className="mt-1 font-mono text-sm font-semibold text-stone-700">
                  {
                    pendingStatusChange.code
                  }
                </p>

                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-stone-400">
                  Alteração
                </p>

                <p className="mt-1 text-sm font-semibold text-stone-700">
                  {
                    pendingStatusChange.currentStatus
                      ? "Ativo → Inativo"
                      : "Inativo → Ativo"
                  }
                </p>
              </div>

              {!pendingStatusChange.nextStatus ? (
                <p className="mt-4 text-sm leading-6 text-amber-700">
                  Um departamento inativo permanece
                  cadastrado no sistema, mas não deve
                  ser utilizado para novas associações
                  administrativas.
                </p>
              ) : null}

              {statusError ? (
                <div
                  role="alert"
                  className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
                >
                  {statusError}
                </div>
              ) : null}
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-stone-200 bg-stone-50 px-6 py-5 sm:flex-row sm:justify-end md:px-8">
              <button
                type="button"
                disabled={
                  submittingStatus
                }
                onClick={
                  cancelStatusChange
                }
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-stone-200 bg-white px-5 text-sm font-semibold text-stone-700 transition hover:border-stone-300 hover:text-stone-950 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancelar
              </button>

              <button
                type="button"
                disabled={
                  submittingStatus
                }
                onClick={
                  confirmStatusChange
                }
                className={[
                  "inline-flex min-h-11 items-center justify-center rounded-xl px-5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50",

                  pendingStatusChange.nextStatus
                    ? "bg-stone-950 hover:bg-stone-800"
                    : "bg-amber-700 hover:bg-amber-800",
                ].join(
                  " ",
                )}
              >
                {
                  submittingStatus
                    ? "Processando..."
                    : pendingStatusChange.nextStatus
                      ? "Confirmar ativação"
                      : "Confirmar desativação"
                }
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
