import { eq } from "drizzle-orm";

import { getDb } from "../../db";
import {
  adminUsersTable,
} from "../../db/schema/admin-access";

import {
  createAdminPasswordResetToken,
} from "./admin-password-reset-token.server";

export type RequestAdminPasswordResetResult = {
  accepted: true;

  delivery:
    | {
        token: string;

        expiresAt: Date;

        email: string;

        userId: string;
      }
    | null;
};

function normalizeEmail(
  email: string,
): string {
  return email
    .trim()
    .toLowerCase();
}

export async function requestAdminPasswordReset(
  email: string,
): Promise<RequestAdminPasswordResetResult> {
  const normalizedEmail =
    normalizeEmail(email);

  /*
   * A camada pública deverá sempre receber
   * uma resposta neutra.
   *
   * Mesmo entradas inválidas não revelarão
   * se determinado usuário existe.
   */
  if (
    !normalizedEmail ||
    normalizedEmail.length > 255 ||
    !normalizedEmail.includes("@")
  ) {
    return {
      accepted: true,

      delivery:
        null,
    };
  }

  const db =
    getDb();

  const [user] =
    await db
      .select({
        id:
          adminUsersTable.id,

        email:
          adminUsersTable.email,

        status:
          adminUsersTable.status,

        deletedAt:
          adminUsersTable.deletedAt,
      })
      .from(adminUsersTable)
      .where(
        eq(
          adminUsersTable.email,
          normalizedEmail,
        ),
      )
      .limit(1);

  /*
   * Não revelamos:
   *
   * - usuário inexistente;
   * - usuário inativo;
   * - usuário removido.
   *
   * Todos produzem a mesma resposta externa.
   */
  if (
    !user ||
    user.deletedAt ||
    user.status !== "ACTIVE"
  ) {
    return {
      accepted: true,

      delivery:
        null,
    };
  }

  /*
   * O serviço criptográfico:
   *
   * 1. invalida tokens anteriores;
   * 2. gera token aleatório de 256 bits;
   * 3. persiste somente SHA-256;
   * 4. define expiração de 30 minutos;
   * 5. retorna o token real exclusivamente
   *    para a próxima camada server-side.
   */
  const reset =
    await createAdminPasswordResetToken(
      user.id,
    );

  return {
    accepted: true,

    delivery: {
      token:
        reset.token,

      expiresAt:
        reset.expiresAt,

      email:
        user.email,

      userId:
        user.id,
    },
  };
}
