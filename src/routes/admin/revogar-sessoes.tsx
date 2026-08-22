import {
  createFileRoute,
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

type RevocationResult = {
  success: true;
  previousAuthVersion: number;
  authVersion: number;
};

function RevokeAdminSessionsPage() {
  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(
      null,
    );

  const [result, setResult] =
    useState<RevocationResult | null>(
      null,
    );

  async function handleRevoke() {
    if (
      loading ||
      result
    ) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response =
        await revokeAllAdminSessions();

      if (!response.success) {
        throw new Error(
          "A revogação não retornou sucesso.",
        );
      }

      setResult({
        success: true,

        previousAuthVersion:
          response.previousAuthVersion,

        authVersion:
          response.authVersion,
      });
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Não foi possível revogar as sessões administrativas.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        maxWidth: 720,
        margin: "0 auto",
        padding: "48px 24px",
        fontFamily:
          "Arial, sans-serif",
      }}
    >
      <h1>
        Homologação de revogação
      </h1>

      <p>
        Esta página executa uma única
        revogação e exibe o retorno real
        produzido pelo servidor.
      </p>

      {!result ? (
        <button
          type="button"
          disabled={loading}
          onClick={handleRevoke}
          style={{
            padding:
              "12px 18px",
            cursor:
              loading
                ? "wait"
                : "pointer",
          }}
        >
          {loading
            ? "Executando..."
            : "Executar revogação"}
        </button>
      ) : null}

      {error ? (
        <section
          role="alert"
          style={{
            marginTop: 24,
          }}
        >
          <strong>
            ERRO
          </strong>

          <p>
            {error}
          </p>
        </section>
      ) : null}

      {result ? (
        <section
          style={{
            marginTop: 24,
          }}
        >
          <h2>
            Revogação executada
          </h2>

          <p>
            previousAuthVersion:
            {" "}
            <strong>
              {
                result.previousAuthVersion
              }
            </strong>
          </p>

          <p>
            authVersion:
            {" "}
            <strong>
              {
                result.authVersion
              }
            </strong>
          </p>

          <p>
            A sessão atual foi encerrada
            no servidor. Não atualize esta
            página antes de validar o Neon.
          </p>
        </section>
      ) : null}
    </main>
  );
}
