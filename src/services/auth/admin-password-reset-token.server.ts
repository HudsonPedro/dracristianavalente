import {
  createHash,
  randomBytes,
  randomUUID,
} from "node:crypto";

import {
  and,
  eq,
  isNull,
} from "drizzle-orm";

import { getDb } from "../../db";
import {
  adminPasswordResetTokensTable,
  adminUsersTable,
} from "../../db/schema/admin-access";

const RESET_TOKEN_BYTES = 32;

const RESET_TOKEN_TTL_MINUTES = 30;

export type AdminPasswordResetTokenResult = {
  token: string;

  expiresAt: Date;
};

function hashResetToken(
  token: string,
): string {
  return createHash("sha256")
    .update(token)
    .digest("hex");
}

function createResetTokenExpiration(): Date {
  return new Date(
    Date.now() +
      RESET_TOKEN_TTL_MINUTES *
        60 *
        1000,
  );
}

export async function createAdminPasswordResetToken(
  userId: string,
): Promise<AdminPasswordResetTokenResult> {
  const normalizedUserId =
    userId.trim();

  if (!normalizedUserId) {
    throw new Error(
      "ID do usuário administrativo é obrigatório.",
    );
  }

  const db =
    getDb();

  /*
   * O token só pode ser emitido para
   * um usuário administrativo existente.
   */
  const [user] =
    await db
      .select({
        id:
          adminUsersTable.id,

        status:
          adminUsersTable.status,

        deletedAt:
          adminUsersTable.deletedAt,
      })
      .from(adminUsersTable)
      .where(
        eq(
          adminUsersTable.id,
          normalizedUserId,
        ),
      )
      .limit(1);

  if (
    !user ||
    user.deletedAt ||
    user.status !== "ACTIVE"
  ) {
    throw new Error(
      "Usuário administrativo indisponível para recuperação de senha.",
    );
  }

  const now =
    new Date();

  /*
   * Tokens anteriores ainda não utilizados
   * deixam de ser válidos assim que um novo
   * pedido de recuperação é criado.
   *
   * Mantemos o registro no banco para auditoria,
   * mas marcamos used_at.
   */
  await db
    .update(
      adminPasswordResetTokensTable,
    )
    .set({
      usedAt:
        now,
    })
    .where(
      and(
        eq(
          adminPasswordResetTokensTable.userId,
          normalizedUserId,
        ),

        isNull(
          adminPasswordResetTokensTable.usedAt,
        ),
      ),
    );

  /*
   * O token real é gerado com 256 bits
   * de entropia criptográfica.
   *
   * Ele NÃO será armazenado no banco.
   */
  const token =
    randomBytes(
      RESET_TOKEN_BYTES,
    ).toString(
      "base64url",
    );

  /*
   * Apenas o SHA-256 do token
   * será persistido no Neon.
   */
  const tokenHash =
    hashResetToken(
      token,
    );

  const expiresAt =
    createResetTokenExpiration();

  await db
    .insert(
      adminPasswordResetTokensTable,
    )
    .values({
      id:
        `admin-password-reset-${randomUUID()}`,

      userId:
        normalizedUserId,

      tokenHash,

      expiresAt,

      usedAt:
        null,

      createdAt:
        now,
    });

  /*
   * O token real volta apenas para
   * a camada server-side que futuramente
   * enviará o link por e-mail.
   *
   * Ele nunca é persistido.
   */
  return {
    token,

    expiresAt,
  };
}
