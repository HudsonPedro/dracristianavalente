import { timingSafeEqual } from "node:crypto";

type AdminCredentialEnvironmentVariable =
  | "ADMIN_LOGIN_EMAIL"
  | "ADMIN_LOGIN_PASSWORD";

function getRequiredEnvironmentVariable(
  name: AdminCredentialEnvironmentVariable,
) {
  const value = process.env[name];

  if (!value) {
    throw new Error(
      `${name} não configurada no ambiente.`,
    );
  }

  return value;
}

function safeEqual(
  received: string,
  expected: string,
) {
  const receivedBuffer =
    Buffer.from(received, "utf8");

  const expectedBuffer =
    Buffer.from(expected, "utf8");

  if (
    receivedBuffer.length !==
    expectedBuffer.length
  ) {
    return false;
  }

  return timingSafeEqual(
    receivedBuffer,
    expectedBuffer,
  );
}

export function validateAdminCredentials(
  email: string,
  password: string,
) {
  const expectedEmail =
    getRequiredEnvironmentVariable(
      "ADMIN_LOGIN_EMAIL",
    );

  const expectedPassword =
    getRequiredEnvironmentVariable(
      "ADMIN_LOGIN_PASSWORD",
    );

  const normalizedEmail =
    email
      .trim()
      .toLowerCase();

  const normalizedExpectedEmail =
    expectedEmail
      .trim()
      .toLowerCase();

  const emailValid =
    safeEqual(
      normalizedEmail,
      normalizedExpectedEmail,
    );

  const passwordValid =
    safeEqual(
      password,
      expectedPassword,
    );

  return (
    emailValid &&
    passwordValid
  );
}
