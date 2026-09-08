const RESEND_EMAIL_ENDPOINT = "https://api.resend.com/emails";

const DEFAULT_APP_URL = "http://localhost:8080";

export type SendAdminFirstAccessEmailInput = {
  name: string;
  email: string;
  token: string;
  expiresAt: Date;
};

export type SendAdminFirstAccessEmailResult = {
  sent: true;
  messageId: string;
};

function requireEnvironmentVariable(name: "RESEND_API_KEY" | "ADMIN_EMAIL_FROM"): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`A variável de ambiente ${name} não está configurada.`);
  }

  return value;
}

function getAppUrl(): string {
  const configuredUrl = process.env.APP_URL?.trim();

  const appUrl = configuredUrl || DEFAULT_APP_URL;

  return appUrl.replace(/\/+$/, "");
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatExpiration(expiresAt: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "America/Sao_Paulo",
  }).format(expiresAt);
}

export async function sendAdminFirstAccessEmail(
  input: SendAdminFirstAccessEmailInput,
): Promise<SendAdminFirstAccessEmailResult> {
  const name = input.name.trim();

  const email = input.email.trim().toLowerCase();

  const token = input.token.trim();

  if (!name) {
    throw new Error("O nome do usuário administrativo é obrigatório para o convite.");
  }

  if (!email || email.length > 255 || !email.includes("@")) {
    throw new Error("O e-mail do usuário administrativo é inválido.");
  }

  if (!token) {
    throw new Error("O token de primeiro acesso é inválido.");
  }

  if (!(input.expiresAt instanceof Date) || Number.isNaN(input.expiresAt.getTime())) {
    throw new Error("A expiração do convite administrativo é inválida.");
  }

  const apiKey = requireEnvironmentVariable("RESEND_API_KEY");

  const from = requireEnvironmentVariable("ADMIN_EMAIL_FROM");

  const appUrl = getAppUrl();

  const firstAccessUrl = new URL("/admin/primeiro-acesso", `${appUrl}/`);

  firstAccessUrl.searchParams.set("token", token);

  const safeName = escapeHtml(name);

  const safeFirstAccessUrl = escapeHtml(firstAccessUrl.toString());

  const expirationText = formatExpiration(input.expiresAt);

  const response = await fetch(RESEND_EMAIL_ENDPOINT, {
    method: "POST",

    headers: {
      Authorization: `Bearer ${apiKey}`,

      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      from,

      to: [email],

      subject: "Seu acesso administrativo — Dra. Cris",

      html: `
              <div style="font-family:Arial,sans-serif;line-height:1.6;color:#292524;max-width:600px;margin:0 auto;">
                <h1 style="font-size:24px;margin-bottom:16px;">
                  Primeiro acesso
                </h1>

                <p>
                  Olá, ${safeName}.
                </p>

                <p>
                  Seu acesso à administração da Dra. Cristiana Valente foi criado.
                  Para definir sua senha e ativar sua conta, utilize o botão abaixo.
                </p>

                <p style="margin:28px 0;">
                  <a
                    href="${safeFirstAccessUrl}"
                    style="display:inline-block;background:#1c1917;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:10px;font-weight:600;"
                  >
                    Criar minha senha
                  </a>
                </p>

                <p>
                  Este link é de uso único e expira em:
                  <strong>${escapeHtml(expirationText)}</strong>.
                </p>

                <p>
                  Se você não esperava receber este convite,
                  não utilize o link.
                </p>

                <p style="margin-top:32px;color:#78716c;font-size:13px;">
                  Administração — Dra. Cristiana Valente
                </p>
              </div>
            `,
    }),
  });

  if (!response.ok) {
    /*
     * Token, API key e conteúdo sensível nunca
     * são incorporados à mensagem de erro.
     */
    throw new Error("Não foi possível enviar o e-mail de primeiro acesso.");
  }

  const responseBody = (await response.json()) as {
    id?: unknown;
  };

  if (typeof responseBody.id !== "string" || !responseBody.id) {
    throw new Error("O provedor de e-mail não confirmou o envio do convite.");
  }

  return {
    sent: true,
    messageId: responseBody.id,
  };
}
