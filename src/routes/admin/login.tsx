import {
  createFileRoute,
  useNavigate,
} from "@tanstack/react-router";
import {
  FormEvent,
  useState,
} from "react";

import { loginAdmin } from "../../functions/admin-auth";

export const Route = createFileRoute("/admin/login")({
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState<string | null>(null);

  const [loading, setLoading] =
    useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (loading) {
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const result =
        await loginAdmin({
          data: {
            email,
            password,
          },
        });

      if (!result.success) {
        setError(
          result.error ??
            "Não foi possível entrar no painel.",
        );

        return;
      }

      await navigate({
        to: "/admin/produtos",
      });
    } catch {
      setError(
        "Não foi possível realizar o login. Tente novamente.",
      );
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

            <h1 className="text-3xl font-semibold tracking-tight">
              Administração
            </h1>

            <p className="mt-3 text-sm leading-6 text-white/60">
              Entre com suas credenciais para acessar o painel administrativo.
            </p>
          </div>

          <form
            className="space-y-5"
            onSubmit={handleSubmit}
          >
            <div>
              <label
                className="mb-2 block text-sm font-medium text-white/80"
                htmlFor="admin-email"
              >
                E-mail
              </label>

              <input
                id="admin-email"
                name="email"
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(event) =>
                  setEmail(
                    event.target.value,
                  )
                }
                className="w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-white/30"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label
                className="mb-2 block text-sm font-medium text-white/80"
                htmlFor="admin-password"
              >
                Senha
              </label>

              <input
                id="admin-password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) =>
                  setPassword(
                    event.target.value,
                  )
                }
                className="w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-white/30"
                placeholder="Digite sua senha"
              />
            </div>

            {error ? (
              <div
                role="alert"
                className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200"
              >
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-white px-4 py-3 font-semibold text-neutral-950 transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Entrando..."
                : "Entrar"}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-white/35">
            Acesso restrito à administração.
          </p>
        </section>
      </div>
    </main>
  );
}
