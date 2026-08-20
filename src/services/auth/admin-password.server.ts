import {
  randomBytes,
  scrypt,
  timingSafeEqual,
} from "node:crypto";

const HASH_VERSION =
  "scrypt-v1";

const SALT_BYTES =
  16;

const KEY_LENGTH =
  64;

const MIN_PASSWORD_LENGTH =
  12;

const MAX_PASSWORD_LENGTH =
  200;

function validatePasswordPolicy(
  password: string,
) {
  if (
    password.length <
    MIN_PASSWORD_LENGTH
  ) {
    throw new Error(
      `A senha deve possuir pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`,
    );
  }

  if (
    password.length >
    MAX_PASSWORD_LENGTH
  ) {
    throw new Error(
      "A senha excede o tamanho máximo permitido.",
    );
  }

  if (
    !/[a-z]/.test(password)
  ) {
    throw new Error(
      "A senha deve possuir pelo menos uma letra minúscula.",
    );
  }

  if (
    !/[A-Z]/.test(password)
  ) {
    throw new Error(
      "A senha deve possuir pelo menos uma letra maiúscula.",
    );
  }

  if (
    !/[0-9]/.test(password)
  ) {
    throw new Error(
      "A senha deve possuir pelo menos um número.",
    );
  }

  if (
    !/[^A-Za-z0-9]/.test(
      password,
    )
  ) {
    throw new Error(
      "A senha deve possuir pelo menos um caractere especial.",
    );
  }
}

function deriveKey(
  password: string,
  salt: Buffer,
): Promise<Buffer> {
  return new Promise(
    (
      resolve,
      reject,
    ) => {
      scrypt(
        password,
        salt,
        KEY_LENGTH,
        (
          error,
          derivedKey,
        ) => {
          if (error) {
            reject(error);

            return;
          }

          resolve(
            derivedKey,
          );
        },
      );
    },
  );
}

function parsePasswordHash(
  passwordHash: string,
) {
  const parts =
    passwordHash.split("$");

  if (
    parts.length !== 3
  ) {
    return null;
  }

  const [
    version,
    saltHex,
    keyHex,
  ] = parts;

  if (
    version !==
      HASH_VERSION ||
    !saltHex ||
    !keyHex
  ) {
    return null;
  }

  if (
    !/^[0-9a-f]+$/i.test(
      saltHex,
    ) ||
    !/^[0-9a-f]+$/i.test(
      keyHex,
    )
  ) {
    return null;
  }

  return {
    saltHex,
    keyHex,
  };
}

export async function hashAdminPassword(
  password: string,
): Promise<string> {
  validatePasswordPolicy(
    password,
  );

  const salt =
    randomBytes(
      SALT_BYTES,
    );

  const derivedKey =
    await deriveKey(
      password,
      salt,
    );

  return [
    HASH_VERSION,
    salt.toString(
      "hex",
    ),
    derivedKey.toString(
      "hex",
    ),
  ].join("$");
}

export async function verifyAdminPassword(
  password: string,
  passwordHash: string,
): Promise<boolean> {
  const parsed =
    parsePasswordHash(
      passwordHash,
    );

  if (!parsed) {
    return false;
  }

  const salt =
    Buffer.from(
      parsed.saltHex,
      "hex",
    );

  const expectedKey =
    Buffer.from(
      parsed.keyHex,
      "hex",
    );

  if (
    expectedKey.length !==
    KEY_LENGTH
  ) {
    return false;
  }

  const receivedKey =
    await deriveKey(
      password,
      salt,
    );

  if (
    receivedKey.length !==
    expectedKey.length
  ) {
    return false;
  }

  return timingSafeEqual(
    receivedKey,
    expectedKey,
  );
}

export function validateAdminPassword(
  password: string,
): true {
  validatePasswordPolicy(
    password,
  );

  return true;
}
