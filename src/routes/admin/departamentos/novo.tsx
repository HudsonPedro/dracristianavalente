import {
  createFileRoute,
  Link,
  useNavigate,
} from "@tanstack/react-router";

import {
  useState,
} from "react";

import {
  createAdminDepartmentAction,
} from "../../../functions/admin-users";

export const Route =
  createFileRoute(
    "/admin/departamentos/novo",
  )({
    component:
      AdminDepartmentCreatePage,
  });

function AdminDepartmentCreatePage() {
  const navigate =
    useNavigate();

  const [
    code,
    setCode,
  ] =
    useState("");

  const [
    name,
    setName,
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
      await createAdminDepartmentAction({
        data: {
          code,
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
          : "Não foi possível criar o departamento.",
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
            Novo departamento
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-stone-600">
            Cadastre uma nova unidade administrativa
            para organização dos usuários,
            responsabilidades e acessos.
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
              O departamento será criado como ativo
              e ficará disponível para a gestão
              administrativa.
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
                placeholder="Ex.: Marketing"
                className="mt-2 min-h-12 w-full rounded-2xl border border-stone-200 bg-white px-4 text-sm text-stone-950 outline-none transition focus:border-stone-500"
              />

              <p className="mt-2 text-xs leading-5 text-stone-400">
                Nome apresentado aos administradores
                nas telas de gestão.
              </p>
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
                placeholder="Ex.: MARKETING"
                className="mt-2 min-h-12 w-full rounded-2xl border border-stone-200 bg-white px-4 font-mono text-sm uppercase text-stone-950 outline-none transition focus:border-stone-500"
              />

              <p className="mt-2 text-xs leading-5 text-stone-400">
                Identificador técnico único. O sistema
                normalizará automaticamente o valor
                para letras maiúsculas e underscore.
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
                placeholder="Descreva as responsabilidades deste departamento."
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

            <div className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-4">
              <p className="text-sm font-semibold text-stone-800">
                Estado inicial
              </p>

              <p className="mt-1 text-sm text-stone-500">
                Ativo
              </p>

              <p className="mt-2 text-xs leading-5 text-stone-400">
                Depois do cadastro, o estado poderá
                ser administrado pela própria tela
                de Departamentos.
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
              {submitting
                ? "Criando..."
                : "Criar departamento"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
