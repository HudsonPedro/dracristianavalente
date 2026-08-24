const RESEND_API_URL =
  "https://api.resend.com/emails";

const ADMIN_PASSWORD_RESET_PATH =
  "/admin/redefinir-senha";

const DEFAULT_APP_URL =
  "https://www.dracristianavalente.com.br";

export type SendAdminPasswordResetEmailInput = {
  email: string;

  token: string;

  expiresAt: Date;
};

export type SendAdminPasswordResetEmailResult = {
  sent: true;

  messageId: string;
};

function getRequiredEnvironmentVariable(
  name:
    | "RESEND_API_KEY"
    | "ADMIN_EMAIL_FROM",
): string {
  const value =
    process.env[name];

  if (!value) {
    throw new Error(
      `${name} não configurada no ambiente.`,
    );
  }

  return value.trim();
}

function getApplicationUrl(): string {
  const configuredUrl =
    process.env.APP_URL
      ?.trim();

  const value =
    configuredUrl ||
    DEFAULT_APP_URL;

  return value.replace(
    /\/+$/,
    "",
  );
}

function createPasswordResetUrl(
  token: string,
): string {
  const applicationUrl =
    getApplicationUrl();

  const url =
    new URL(
      ADMIN_PASSWORD_RESET_PATH,
      `${applicationUrl}/`,
    );

  /*
   * O token real aparece somente no link
   * entregue ao destinatário.
   *
   * Ele não é salvo no Neon e este serviço
   * não o escreve em logs.
   */
  url.searchParams.set(
    "token",
    token,
  );

  return url.toString();
}

function escapeHtml(
  value: string,
): string {
  return value
    .replaceAll(
      "&",
      "&amp;",
    )
    .replaceAll(
      "<",
      "&lt;",
    )
    .replaceAll(
      ">",
      "&gt;",
    )
    .replaceAll(
      '"',
      "&quot;",
    )
    .replaceAll(
      "'",
      "&#039;",
    );
}

export async function sendAdminPasswordResetEmail(
  input: SendAdminPasswordResetEmailInput,
): Promise<SendAdminPasswordResetEmailResult> {
  const email =
    input.email
      .trim()
      .toLowerCase();

  const token =
    input.token.trim();

  if (
    !email ||
    email.length > 255 ||
    !email.includes("@")
  ) {
    throw new Error(
      "Destinatário da recuperação inválido.",
    );
  }

  if (!token) {
    throw new Error(
      "Token de recuperação inválido.",
    );
  }

  if (
    !(
      input.expiresAt
        instanceof Date
    ) ||
    Number.isNaN(
      input.expiresAt.getTime(),
    ) ||
    input.expiresAt.getTime() <=
      Date.now()
  ) {
    throw new Error(
      "Expiração do token de recuperação inválida.",
    );
  }

  const apiKey =
    getRequiredEnvironmentVariable(
      "RESEND_API_KEY",
    );

  const from =
    getRequiredEnvironmentVariable(
      "ADMIN_EMAIL_FROM",
    );

  const resetUrl =
    createPasswordResetUrl(
      token,
    );

  const safeResetUrl =
    escapeHtml(
      resetUrl,
    );

  const expirationText =
    input.expiresAt
      .toLocaleString(
        "pt-BR",
        {
          timeZone:
            "America/Sao_Paulo",

          dateStyle:
            "short",

          timeStyle:
            "short",
        },
      );

  const response =
    await fetch(
      RESEND_API_URL,
      {
        method:
          "POST",

        headers: {
          Authorization:
            `Bearer ${apiKey}`,

          "Content-Type":
            "application/json",
        },

        body:
          JSON.stringify({
            from,

            to: [
              email,
            ],

            subject:
              "Redefinição de senha — Dra. Cris",

            html: `
              <div style="font-family:Arial,sans-serif;line-height:1.6;color:#292524;max-width:600px;margin:0 auto;">
                <h1 style="font-size:24px;margin-bottom:16px;">
                  Redefinição de senha
                </h1>

                <p>
                  Recebemos uma solicitação para redefinir
                  a senha da sua conta administrativa.
                </p>

                <p style="margin:28px 0;">
                  <a
                    href="${safeResetUrl}"
                    style="display:inline-block;background:#1c1917;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:10px;font-weight:600;"
                  >
                    Criar nova senha
                  </a>
                </p>

                <p>
                  Este link é de uso único e expira em:
                  <strong>${escapeHtml(expirationText)}</strong>.
                </p>

                <p>
                  Se você não solicitou esta alteração,
                  ignore esta mensagem. Sua senha atual
                  continuará válida.
                </p>

                <p style="margin-top:32px;color:#78716c;font-size:13px;">
                  Administração — Dra. Cristiana Valente
                </p>
              </div>
            `,
          }),
      },
    );

  if (!response.ok) {
    /*
     * Não incluímos token, API key ou conteúdo
     * sensível na mensagem de erro.
     */
    throw new Error(
      "Não foi possível enviar o e-mail de recuperação.",
    );
  }

  const responseBody =
    (await response.json()) as {
      id?: unknown;
    };

  if (
    typeof responseBody.id !==
      "string" ||
    !responseBody.id
  ) {
    throw new Error(
      "O provedor de e-mail não confirmou o envio.",
    );
  }

  return {
    sent: true,

    messageId:
      responseBody.id,
  };
}
