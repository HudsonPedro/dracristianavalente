import {
  createFileRoute,
  Link,
  useNavigate,
} from "@tanstack/react-router";
import {
  type FormEvent,
  useState,
} from "react";

import {
  changeAdminPasswordAction,
} from "../../../functions/admin-auth";

export const Route =
  createFileRoute(
    "/admin/seguranca/senha",
  )({
    component:
      AdminChangePasswordPage,
  });

function AdminChangePasswordPage() {
  const navigate =
    useNavigate();

  const [
    currentPassword,
    setCurrentPassword,
  ] = useState("");

  const [
    newPassword,
    setNewPassword,
  ] = useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState<string | null>(
    null,
  );

  function clearError() {
    if (error) {
      setError(null);
    }
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (saving) {
      return;
    }

    setError(null);

    if (!currentPassword) {
      setError(
        "Informe sua senha atual.",
      );

      return;
    }

    if (!newPassword) {
      setError(
        "Informe a nova senha.",
      );

      return;
    }

    if (!confirmPassword) {
      setError(
        "Confirme a nova senha.",
      );

      return;
    }

    if (
      newPassword !==
      confirmPassword
    ) {
      setError(
        "A confirmação da nova senha não corresponde.",
      );

      return;
    }

    if (
      currentPassword ===
      newPassword
    ) {
      setError(
        "A nova senha deve ser diferente da senha atual.",
      );

      return;
    }

    setSaving(true);

    try {
      const result =
        await changeAdminPasswordAction({
          data: {
            currentPassword,
            newPassword,
            confirmPassword,
          },
        });

      if (!result.success) {
        throw new Error(
          "Não foi possível alterar a senha.",
        );
      }

      /*
       * A Server Function:
       *
       * 1. altera password_hash;
       * 2. atualiza password_changed_at;
       * 3. incrementa authVersion;
       * 4. encerra a sessão atual.
       *
       * Portanto, depois do sucesso,
       * o usuário obrigatoriamente volta
       * para o login.
       */
      await navigate({
        to: "/admin/login",
        replace: true,
      });
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Não foi possível alterar a senha.",
      );

      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-stone-50 px-4 py-10 text-stone-900 sm:px-6">
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-6">
          <Link
            to="/admin/produtos"
            className="text-sm font-medium text-stone-600 transition hover:text-stone-950"
          >
            ← Voltar para administração
          </Link>
        </div>

        <section className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
          <header className="border-b border-stone-200 px-6 py-7 sm:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
              Segurança da conta
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              Alterar senha
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-stone-600">
              Para sua segurança, informe a senha
              atual e defina uma nova senha para
              sua conta administrativa.
            </p>
          </header>

          <form
            onSubmit={handleSubmit}
            className="space-y-6 px-6 py-7 sm:px-8"
          >
            <div>
              <label
                htmlFor="current-password"
                className="mb-2 block text-sm font-semibold"
              >
                Senha atual
              </label>

              <input
                id="current-password"
                name="currentPassword"
                type="password"
                autoComplete="current-password"
                required
                maxLength={200}
                value={currentPassword}
                onChange={(event) => {
                  setCurrentPassword(
                    event.target.value,
                  );

                  clearError();
                }}
                className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-base outline-none transition focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10"
              />
            </div>

            <div>
              <label
                htmlFor="new-password"
                className="mb-2 block text-sm font-semibold"
              >
                Nova senha
              </label>

              <input
                id="new-password"
                name="newPassword"
                type="password"
                autoComplete="new-password"
                required
                minLength={12}
                maxLength={200}
                value={newPassword}
                onChange={(event) => {
                  setNewPassword(
                    event.target.value,
                  );

                  clearError();
                }}
                className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-base outline-none transition focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10"
              />
            </div>

            <div>
              <label
                htmlFor="confirm-password"
                className="mb-2 block text-sm font-semibold"
              >
                Confirmar nova senha
              </label>

              <input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                minLength={12}
                maxLength={200}
                value={confirmPassword}
                onChange={(event) => {
                  setConfirmPassword(
                    event.target.value,
                  );

                  clearError();
                }}
                className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-base outline-none transition focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10"
              />
            </div>

            <div className="rounded-2xl border border-stone-200 bg-stone-50 p-5">
              <p className="text-sm font-semibold">
                Requisitos da nova senha
              </p>

              <ul className="mt-3 space-y-2 text-sm leading-5 text-stone-600">
                <li>
                  • pelo menos 12 caracteres;
                </li>

                <li>
                  • pelo menos uma letra maiúscula;
                </li>

                <li>
                  • pelo menos uma letra minúscula;
                </li>

                <li>
                  • pelo menos um número;
                </li>

                <li>
                  • pelo menos um caractere especial;
                </li>

                <li>
                  • diferente da senha atual.
                </li>
              </ul>
            </div>

            {error ? (
              <div
                role="alert"
                className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
              >
                {error}
              </div>
            ) : null}

            <div className="border-t border-stone-200 pt-6">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-stone-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "Alterando senha..."
                  : "Alterar senha"}
              </button>

              <p className="mt-4 text-center text-xs leading-5 text-stone-500">
                Após a alteração, todas as sessões
                administrativas serão encerradas e
                será necessário entrar novamente.
              </p>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
