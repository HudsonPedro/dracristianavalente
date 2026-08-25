import {
  createFileRoute,
  Link,
  useNavigate,
} from "@tanstack/react-router";

import {
  useState,
} from "react";

import {
  getAdminDepartments,
  updateAdminDepartmentAction,
} from "../../../functions/admin-users";

export const Route =
  createFileRoute(
    "/admin/departamentos/$departmentId",
  )({
    loader: async ({
      params,
    }) => {
      const departments =
        await getAdminDepartments();

      const department =
        departments.find(
          (item) =>
            item.id ===
            params.departmentId,
        );

      if (!department) {
        throw new Error(
          "Departamento administrativo não encontrado.",
        );
      }

      return {
        department,
      };
    },

    component:
      AdminDepartmentEditPage,
  });

function AdminDepartmentEditPage() {
  const {
    department,
  } =
    Route.useLoaderData();

  const navigate =
    useNavigate();

  const [
    name,
    setName,
  ] =
    useState(
      department.name,
    );

  const [
    description,
    setDescription,
  ] =
    useState(
      department.description ??
        "",
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

  async function handleSubmit(
    event:
      React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (submitting) {
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      await updateAdminDepartmentAction({
        data: {
          departmentId:
            department.id,

          name,

          description,
        },
      });

      await navigate({
        to:
          "/admin/departamentos",
      });
    } catch (
      caughtError
    ) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Não foi possível atualizar o departamento.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="px-5 py-8 md:px-8 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-4xl">
        <div>
          <Link
            to="/admin/departamentos"
            className="text-sm font-semibold text-stone-500 transition hover:text-stone-950"
          >
            ← Voltar para departamentos
          </Link>
        </div>

        <header className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
            Usuários e acessos
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-stone-950 md:text-5xl">
            Editar departamento
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-stone-600">
            Atualize as informações administrativas
            permitidas para este departamento.
          </p>
        </header>

        <form
          onSubmit={
            handleSubmit
          }
          className="mt-10 overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm"
        >
          <div className="border-b border-stone-200 px-6 py-6 md:px-8">
            <h2 className="text-lg font-semibold text-stone-950">
              Dados do departamento
            </h2>

            <p className="mt-1 text-sm text-stone-500">
              O código e o estado possuem regras
              próprias e não são alterados por
              este formulário.
            </p>
          </div>

          <div className="space-y-6 px-6 py-7 md:px-8">
            <div>
              <label
                htmlFor="admin-department-name"
                className="text-sm font-semibold text-stone-800"
              >
                Nome
              </label>

              <input
                id="admin-department-name"
                type="text"
                required
                maxLength={120}
                value={
                  name
                }
                onChange={(
                  event,
                ) =>
                  setName(
                    event.target.value,
                  )
                }
                className="mt-2 min-h-12 w-full rounded-2xl border border-stone-200 bg-white px-4 text-sm text-stone-950 outline-none transition focus:border-stone-500"
              />
            </div>

            <div>
              <label
                htmlFor="admin-department-code"
                className="text-sm font-semibold text-stone-800"
              >
                Código
              </label>

              <input
                id="admin-department-code"
                type="text"
                disabled
                value={
                  department.code
                }
                className="mt-2 min-h-12 w-full cursor-not-allowed rounded-2xl border border-stone-200 bg-stone-100 px-4 font-mono text-sm font-semibold text-stone-500"
              />

              <p className="mt-2 text-xs leading-5 text-stone-400">
                Identificador técnico permanente
                utilizado pelas relações administrativas.
              </p>
            </div>

            <div>
              <label
                htmlFor="admin-department-description"
                className="text-sm font-semibold text-stone-800"
              >
                Descrição
              </label>

              <textarea
                id="admin-department-description"
                rows={6}
                maxLength={2000}
                value={
                  description
                }
                onChange={(
                  event,
                ) =>
                  setDescription(
                    event.target.value,
                  )
                }
                className="mt-2 w-full resize-y rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm leading-6 text-stone-950 outline-none transition focus:border-stone-500"
              />

              <div className="mt-2 flex justify-between gap-4 text-xs text-stone-400">
                <span>
                  Descrição administrativa do departamento.
                </span>

                <span>
                  {description.length}/2000
                </span>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-stone-800">
                Estado
              </p>

              <div className="mt-2 flex min-h-12 items-center rounded-2xl border border-stone-200 bg-stone-100 px-4">
                <span className="text-sm font-semibold text-stone-600">
                  {
                    department.isActive
                      ? "Ativo"
                      : "Inativo"
                  }
                </span>
              </div>

              <p className="mt-2 text-xs leading-5 text-stone-400">
                Ativar ou desativar será uma
                operação administrativa independente.
              </p>
            </div>

            {error ? (
              <div
                role="alert"
                className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
              >
                {error}
              </div>
            ) : null}
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-stone-200 bg-stone-50 px-6 py-5 sm:flex-row sm:justify-end md:px-8">
            <Link
              to="/admin/departamentos"
              className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-stone-200 bg-white px-6 text-sm font-semibold text-stone-700 transition hover:border-stone-300 hover:text-stone-950"
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
                  : "Salvar alterações"
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
