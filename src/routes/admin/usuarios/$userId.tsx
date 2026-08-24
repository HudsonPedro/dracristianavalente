import {
  createFileRoute,
  Link,
  useNavigate,
} from "@tanstack/react-router";

import {
  useState,
} from "react";

import {
  getAdminRoles,
  getAdminUsers,
} from "../../../functions/admin-users";

import {
  updateAdminUserAction,
} from "../../../functions/admin-auth";

export const Route =
  createFileRoute(
    "/admin/usuarios/$userId",
  )({
    loader: async ({
      params,
    }) => {
      /*
       * Usuários e papéis são carregados
       * diretamente das respectivas fontes
       * administrativas protegidas.
       *
       * getAdminUsers()
       *   → admin_users + papel atual
       *
       * getAdminRoles()
       *   → todos os admin_roles ativos
       */
      const [
        users,
        roles,
      ] =
        await Promise.all([
          getAdminUsers(),
          getAdminRoles(),
        ]);

      const user =
        users.find(
          (item) =>
            item.id ===
            params.userId,
        );

      if (!user) {
        throw new Error(
          "Usuário administrativo não encontrado.",
        );
      }

      /*
       * O papel atual do usuário deve existir
       * na lista oficial de papéis ativos.
       *
       * Isso evita apresentar ao formulário
       * um papel inexistente ou inativo.
       */
      const currentRoleExists =
        roles.some(
          (role) =>
            role.id ===
            user.role.id,
        );

      if (!currentRoleExists) {
        throw new Error(
          "O papel atual do usuário está indisponível.",
        );
      }

      return {
        user,
        roles,
      };
    },

    component:
      AdminUserEditPage,
  });

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

function AdminUserEditPage() {
  const {
    user,
    roles,
  } =
    Route.useLoaderData();

  const navigate =
    useNavigate();

  const [
    name,
    setName,
  ] =
    useState(
      user.name,
    );

  const [
    department,
    setDepartment,
  ] =
    useState(
      user.department,
    );

  const [
    roleId,
    setRoleId,
  ] =
    useState(
      user.role.id,
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
      await updateAdminUserAction({
        data: {
          userId:
            user.id,

          name,

          department,

          roleId,
        },
      });

      await navigate({
        to:
          "/admin/usuarios",
      });
    } catch (
      caughtError
    ) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Não foi possível atualizar o usuário.",
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
            to="/admin/usuarios"
            className="text-sm font-semibold text-stone-500 transition hover:text-stone-950"
          >
            ← Voltar para usuários
          </Link>
        </div>

        <header className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
            Usuários e acessos
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-stone-950 md:text-5xl">
            Editar usuário
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-stone-600">
            Atualize as informações
            administrativas permitidas para
            este usuário.
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
              Dados do usuário
            </h2>

            <p className="mt-1 text-sm text-stone-500">
              E-mail e estado da conta não
              podem ser alterados por este
              formulário.
            </p>
          </div>

          <div className="space-y-6 px-6 py-7 md:px-8">
            <div>
              <label
                htmlFor="admin-user-name"
                className="text-sm font-semibold text-stone-800"
              >
                Nome
              </label>

              <input
                id="admin-user-name"
                type="text"
                required
                maxLength={255}
                value={name}
                onChange={(
                  event,
                ) =>
                  setName(
                    event.target
                      .value,
                  )
                }
                className="mt-2 min-h-12 w-full rounded-2xl border border-stone-200 bg-white px-4 text-sm text-stone-950 outline-none transition focus:border-stone-500"
              />
            </div>

            <div>
              <label
                htmlFor="admin-user-email"
                className="text-sm font-semibold text-stone-800"
              >
                E-mail
              </label>

              <input
                id="admin-user-email"
                type="email"
                disabled
                value={
                  user.email
                }
                className="mt-2 min-h-12 w-full cursor-not-allowed rounded-2xl border border-stone-200 bg-stone-100 px-4 text-sm text-stone-500"
              />
            </div>

            <div>
              <label
                htmlFor="admin-user-department"
                className="text-sm font-semibold text-stone-800"
              >
                Departamento
              </label>

              <input
                id="admin-user-department"
                type="text"
                required
                maxLength={80}
                value={
                  department
                }
                onChange={(
                  event,
                ) =>
                  setDepartment(
                    event.target
                      .value,
                  )
                }
                className="mt-2 min-h-12 w-full rounded-2xl border border-stone-200 bg-white px-4 text-sm text-stone-950 outline-none transition focus:border-stone-500"
              />

              <p className="mt-2 text-xs leading-5 text-stone-400">
                O departamento utiliza o campo
                administrativo atualmente
                existente no cadastro do usuário.
              </p>
            </div>

            <div>
              <label
                htmlFor="admin-user-role"
                className="text-sm font-semibold text-stone-800"
              >
                Papel
              </label>

              <select
                id="admin-user-role"
                required
                value={
                  roleId
                }
                onChange={(
                  event,
                ) =>
                  setRoleId(
                    event.target
                      .value,
                  )
                }
                className="mt-2 min-h-12 w-full rounded-2xl border border-stone-200 bg-white px-4 text-sm text-stone-950 outline-none transition focus:border-stone-500"
              >
                {roles.map(
                  (role) => (
                    <option
                      key={
                        role.id
                      }
                      value={
                        role.id
                      }
                    >
                      {
                        role.name
                      }
                      {" — "}
                      {
                        role.code
                      }
                    </option>
                  ),
                )}
              </select>

              <p className="mt-2 text-xs leading-5 text-stone-400">
                Os papéis acima são carregados
                diretamente dos papéis ativos
                cadastrados no banco de dados.
              </p>

              {user.role.code ===
              "SUPER_ADMIN" ? (
                <p className="mt-2 text-xs font-semibold leading-5 text-amber-700">
                  O próprio Super Administrador
                  não pode remover de si o papel
                  SUPER_ADMIN por esta operação.
                </p>
              ) : null}
            </div>

            <div>
              <p className="text-sm font-semibold text-stone-800">
                Estado
              </p>

              <div className="mt-2 flex min-h-12 items-center rounded-2xl border border-stone-200 bg-stone-100 px-4">
                <span className="text-sm font-semibold text-stone-600">
                  {formatStatus(
                    user.status,
                  )}
                </span>
              </div>
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
              to="/admin/usuarios"
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
              {submitting
                ? "Salvando..."
                : "Salvar alterações"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
