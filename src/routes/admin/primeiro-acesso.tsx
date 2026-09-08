import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { FormEvent, useState } from "react";

import { completeAdminUserFirstAccessAction } from "../../functions/admin-auth";

type FirstAccessSearch = {
  token: string;
};

export const Route = createFileRoute("/admin/primeiro-acesso")({
  validateSearch: (search: Record<string, unknown>): FirstAccessSearch => ({
    token: typeof search.token === "string" ? search.token.trim() : "",
  }),
  component: AdminFirstAccessPage,
});

function AdminFirstAccessPage() {
  const navigate = useNavigate();

  const { token } = Route.useSearch();

  const [newPassword, setNewPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  const tokenAvailable = token.length > 0;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) {
      return;
    }

    setError(null);

    if (!tokenAvailable) {
      setError("O link de primeiro acesso é inválido ou está incompleto.");

      return;
    }

    if (newPassword !== confirmPassword) {
      setError("A confirmação da nova senha não corresponde.");

      return;
    }

    setLoading(true);

    try {
      const result = await completeAdminUserFirstAccessAction({
        data: {
          token,
          newPassword,
          confirmPassword,
        },
      });

      if (!result.success) {
        setError("Não foi possível concluir o primeiro acesso.");

        return;
      }

      await navigate({
        to: "/admin/login",
      });
    } catch (caughtError) {
      if (caughtError instanceof Error) {
        setError(caughtError.message);

        return;
      }

      setError("Não foi possível concluir o primeiro acesso. Verifique o link e tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-12 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-md items-center">
        <section className="w-full rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl md:p-10">
          <div className="mb-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-white/50">
              Dra. Cristiana Valente
            </p>

            <h1 className="text-3xl font-semibold tracking-tight">Primeiro acesso</h1>

            <p className="mt-3 text-sm leading-6 text-white/60">
              Defina sua senha para ativar o acesso ao painel administrativo.
            </p>
          </div>

          {!tokenAvailable ? (
            <div
              role="alert"
              className="mb-6 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm leading-6 text-red-200"
            >
              O link de primeiro acesso está inválido ou incompleto.
            </div>
          ) : null}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label
                className="mb-2 block text-sm font-medium text-white/80"
                htmlFor="admin-new-password"
              >
                Nova senha
              </label>

              <input
                id="admin-new-password"
                name="newPassword"
                type="password"
                autoComplete="new-password"
                required
                minLength={12}
                maxLength={200}
                disabled={loading || !tokenAvailable}
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-white/30 disabled:cursor-not-allowed disabled:opacity-60"
                placeholder="Digite sua nova senha"
              />
            </div>

            <div>
              <label
                className="mb-2 block text-sm font-medium text-white/80"
                htmlFor="admin-confirm-password"
              >
                Confirmar senha
              </label>

              <input
                id="admin-confirm-password"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                minLength={12}
                maxLength={200}
                disabled={loading || !tokenAvailable}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-white/30 disabled:cursor-not-allowed disabled:opacity-60"
                placeholder="Repita sua nova senha"
              />
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">
                Requisitos da senha
              </p>

              <ul className="mt-3 space-y-1 text-xs leading-5 text-white/55">
                <li>Pelo menos 12 caracteres.</li>

                <li>Uma letra maiúscula e uma minúscula.</li>

                <li>Pelo menos um número.</li>

                <li>Pelo menos um caractere especial.</li>
              </ul>
            </div>

            {error ? (
              <div
                role="alert"
                className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm leading-6 text-red-200"
              >
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading || !tokenAvailable}
              className="w-full rounded-xl bg-white px-4 py-3 font-semibold text-neutral-950 transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Ativando acesso..." : "Definir senha e ativar acesso"}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-white/35">Acesso restrito à administração.</p>
        </section>
      </div>
    </main>
  );
}
