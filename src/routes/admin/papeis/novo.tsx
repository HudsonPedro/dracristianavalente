import {
  createFileRoute,
  Link,
  useNavigate,
} from "@tanstack/react-router";

import {
  useState,
} from "react";

import {
  getAdminAuth,
} from "../../../functions/admin-auth";

import {
  createAdminRoleAction,
} from "../../../functions/admin-users";

export const Route =
  createFileRoute(
    "/admin/papeis/novo",
  )({
    loader: async () => {
      const auth =
        await getAdminAuth();

      if (
        !auth.authenticated ||
        auth.role !==
          "SUPER_ADMIN"
      ) {
        throw new Error(
          "Apenas o Super Administrador pode criar papéis administrativos.",
        );
      }

      return {
        authorized:
          true as const,
      };
    },

    component:
      AdminRoleCreatePage,
  });

function AdminRoleCreatePage() {
  const navigate =
    useNavigate();

  const [
    name,
    setName,
  ] =
    useState("");

  const [
    code,
    setCode,
  ] =
    useState("");

  const [
    description,
    setDescription,
  ] =
    useState("");

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
      await createAdminRoleAction({
        data: {
          code,
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
          : "Não foi possível criar o papel administrativo.",
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
            Novo papel
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-stone-600">
            Crie um papel administrativo
            personalizado. As permissões serão
            configuradas separadamente após a
            criação do cadastro.
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
              Dados do papel
            </h2>

            <p className="mt-1 text-sm text-stone-500">
              O novo papel será criado como
              personalizado e ativo.
            </p>
          </div>

          <div className="space-y-6 px-6 py-7 md:px-8">
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
                placeholder="Ex.: Gerente Comercial"
                className="mt-2 min-h-12 w-full rounded-2xl border border-stone-200 bg-white px-4 text-sm text-stone-950 outline-none transition focus:border-stone-500"
              />

              <p className="mt-2 text-xs leading-5 text-stone-400">
                Nome apresentado aos
                administradores e usuários.
              </p>
            </div>

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
                required
                maxLength={80}
                autoComplete="off"
                spellCheck={false}
                value={
                  code
                }
                onChange={(
                  event,
                ) =>
                  setCode(
                    event.target.value,
                  )
                }
                placeholder="Ex.: SALES_MANAGER_CUSTOM"
                className="mt-2 min-h-12 w-full rounded-2xl border border-stone-200 bg-white px-4 font-mono text-sm uppercase text-stone-950 outline-none transition focus:border-stone-500"
              />

              <p className="mt-2 text-xs leading-5 text-stone-400">
                Identificador técnico único.
                O servidor normaliza o valor
                para letras maiúsculas e underscore.
              </p>
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
                placeholder="Descreva as responsabilidades administrativas deste papel."
                className="mt-2 w-full resize-y rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm leading-6 text-stone-950 outline-none transition focus:border-stone-500"
              />

              <div className="mt-2 flex justify-between gap-4 text-xs text-stone-400">
                <span>
                  Opcional.
                </span>

                <span>
                  {description.length}/2000
                </span>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-4">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-stone-400">
                  Tipo
                </p>

                <p className="mt-2 text-sm font-semibold text-stone-800">
                  Personalizado
                </p>

                <p className="mt-1 text-xs leading-5 text-stone-400">
                  Papéis criados pelo painel
                  nunca são papéis estruturais
                  do sistema.
                </p>
              </div>

              <div className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-4">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-stone-400">
                  Estado inicial
                </p>

                <p className="mt-2 text-sm font-semibold text-stone-800">
                  Ativo
                </p>

                <p className="mt-1 text-xs leading-5 text-stone-400">
                  O estado será administrado
                  separadamente depois.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4">
              <p className="text-sm font-semibold text-amber-800">
                Permissões iniciais: nenhuma
              </p>

              <p className="mt-1 text-xs leading-5 text-amber-700">
                Após criar o papel, a matriz
                de permissões será configurada
                em uma operação administrativa
                própria e protegida.
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
                  ? "Criando..."
                  : "Criar papel"
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
