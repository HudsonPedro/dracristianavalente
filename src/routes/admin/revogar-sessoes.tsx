import {
  createFileRoute,
  useNavigate,
} from "@tanstack/react-router";
import {
  useState,
} from "react";

import {
  revokeAllAdminSessions,
} from "../../functions/admin-auth";

export const Route =
  createFileRoute(
    "/admin/revogar-sessoes",
  )({
    component:
      RevokeAdminSessionsPage,
  });

function RevokeAdminSessionsPage() {
  const navigate =
    useNavigate();

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(
      null,
    );

  async function handleRevoke() {
    if (loading) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result =
        await revokeAllAdminSessions();

      if (!result.success) {
        throw new Error(
          "Não foi possível revogar as sessões.",
        );
      }

      await navigate({
        to: "/admin/login",
        replace: true,
      });
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Não foi possível revogar as sessões.",
      );

      setLoading(false);
    }
  }

  return (
    <main
      style={{
        maxWidth: 720,
        margin: "0 auto",
        padding: "48px 24px",
      }}
    >
      <h1>
        Homologação de segurança
      </h1>

      <p>
        Esta página temporária valida a
        revogação centralizada das sessões
        administrativas.
      </p>

      <p>
        Ao continuar, todas as sessões
        administrativas deste usuário serão
        invalidadas e será necessário entrar
        novamente.
      </p>

      {error ? (
        <p role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="button"
        disabled={loading}
        onClick={handleRevoke}
      >
        {loading
          ? "Revogando..."
          : "Revogar todas as sessões"}
      </button>
    </main>
  );
}
