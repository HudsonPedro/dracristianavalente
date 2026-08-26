import {
  createFileRoute,
  Link,
  useNavigate,
} from "@tanstack/react-router";

import {
  useState,
} from "react";

import {
  getAdminRolesForManagement,
  updateAdminRoleAction,
} from "../../../../functions/admin-users";

export const Route =
  createFileRoute(
    "/admin/papeis/$roleId/",
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
        role.code ===
        "SUPER_ADMIN"
      ) {
        throw new Error(
          "O papel Super Administrador é estrutural e não pode ser editado.",
        );
      }

      return {
        role,
      };
    },

    component:
      AdminRoleEditPage,
  });

function AdminRoleEditPage() {
  const {
    role,
  } =
    Route.useLoaderData();

  const navigate =
    useNavigate();

  const [
    name,
    setName,
  ] =
    useState(
      role.name,
    );

  const [
    description,
    setDescription,
  ] =
    useState(
      role.description ?? "",
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

    if (
      submitting
    ) {
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      await updateAdminRoleAction({
        data: {
          roleId:
            role.id,

          name,

          description,
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
          : "Não foi possível atualizar o papel administrativo.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="px-5 py-8 md:px-8 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-4xl">
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
            Editar papel
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-stone-600">
            Atualize os dados cadastrais deste
            papel administrativo sem alterar sua
            identidade funcional.
          </p>
        </header>

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <article className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-stone-400">
              Código
            </p>

            <p className="mt-2 break-all font-mono text-sm font-semibold text-stone-700">
              {
                role.code
              }
            </p>
          </article>

          <article className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-stone-400">
              Tipo
            </p>

            <p className="mt-2 text-sm font-semibold text-stone-800">
              {
                role.systemRole
                  ? "Sistema"
                  : "Personalizado"
              }
            </p>
          </article>

          <article className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-stone-400">
              Estado
            </p>

            <p className="mt-2 text-sm font-semibold text-stone-800">
              {
                role.active
                  ? "Ativo"
                  : "Inativo"
              }
            </p>
          </article>
        </section>

        <form
          onSubmit={
            handleSubmit
          }
          className="mt-8 overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm"
        >
          <div className="border-b border-stone-200 px-6 py-6 md:px-8">
            <h2 className="text-lg font-semibold text-stone-950">
              Dados do papel
            </h2>

            <p className="mt-1 text-sm text-stone-500">
              Nome e descrição podem ser
              atualizados. O código é permanente.
            </p>
          </div>

          <div className="space-y-6 px-6 py-7 md:px-8">
            <div>
              <label
                htmlFor="admin-role-code"
                className="text-sm font-semibold text-stone-800"
              >
                Código
              </label>

              <input
                id="admin-role-code"
                type="text"
                disabled
                value={
                  role.code
                }
                className="mt-2 min-h-12 w-full cursor-not-allowed rounded-2xl border border-stone-200 bg-stone-100 px-4 font-mono text-sm text-stone-500"
              />

              <p className="mt-2 text-xs leading-5 text-stone-400">
                O código é a identidade funcional
                do papel e não pode ser alterado.
              </p>
            </div>

            <div>
              <label
                htmlFor="admin-role-name"
                className="text-sm font-semibold text-stone-800"
              >
                Nome
              </label>

              <input
                id="admin-role-name"
                type="text"
                required
                maxLength={160}
                autoComplete="off"
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
                htmlFor="admin-role-description"
                className="text-sm font-semibold text-stone-800"
              >
                Descrição
              </label>

              <textarea
                id="admin-role-description"
                rows={5}
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
                  Opcional.
                </span>

                <span>
                  {
                    description.length
                  }
                  /2000
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-4">
              <p className="text-sm font-semibold text-stone-800">
                As permissões não são alteradas nesta tela.
              </p>

              <p className="mt-1 text-xs leading-5 text-stone-500">
                A matriz de acesso continua sendo
                administrada separadamente pela
                função Permissões.
              </p>
            </div>

            {error ? (
              <div
                role="alert"
                className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
              >
                {
                  error
                }
              </div>
            ) : null}
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-stone-200 bg-stone-50 px-6 py-5 sm:flex-row sm:justify-end md:px-8">
            <Link
              to="/admin/papeis"
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
