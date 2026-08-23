import {
  createHash,
} from "node:crypto";

import {
  and,
  eq,
  gt,
  isNull,
} from "drizzle-orm";

import { getDb } from "../../db";
import {
  adminPasswordResetTokensTable,
  adminUsersTable,
} from "../../db/schema/admin-access";

export type ValidAdminPasswordResetToken = {
  tokenId: string;

  userId: string;

  expiresAt: Date;
};

export type ValidateAdminPasswordResetTokenResult =
  | {
      valid: true;

      reset:
        ValidAdminPasswordResetToken;
    }
  | {
      valid: false;
    };

function hashResetToken(
  token: string,
): string {
  return createHash("sha256")
    .update(token)
    .digest("hex");
}

export async function validateAdminPasswordResetToken(
  token: string,
): Promise<ValidateAdminPasswordResetTokenResult> {
  const normalizedToken =
    token.trim();

  /*
   * Não fazemos distinção pública entre:
   *
   * - token vazio;
   * - token inexistente;
   * - token expirado;
   * - token já utilizado;
   * - usuário indisponível.
   *
   * Todos são simplesmente inválidos.
   */
  if (!normalizedToken) {
    return {
      valid: false,
    };
  }

  /*
   * O token real nunca é comparado
   * diretamente com dados persistidos.
   *
   * Aplicamos exatamente o mesmo SHA-256
   * utilizado durante a geração.
   */
  const tokenHash =
    hashResetToken(
      normalizedToken,
    );

  const now =
    new Date();

  const db =
    getDb();

  const [result] =
    await db
      .select({
        tokenId:
          adminPasswordResetTokensTable.id,

        userId:
          adminPasswordResetTokensTable.userId,

        expiresAt:
          adminPasswordResetTokensTable.expiresAt,

        userStatus:
          adminUsersTable.status,

        userDeletedAt:
          adminUsersTable.deletedAt,
      })
      .from(
        adminPasswordResetTokensTable,
      )
      .innerJoin(
        adminUsersTable,
        eq(
          adminPasswordResetTokensTable.userId,
          adminUsersTable.id,
        ),
      )
      .where(
        and(
          eq(
            adminPasswordResetTokensTable.tokenHash,
            tokenHash,
          ),

          isNull(
            adminPasswordResetTokensTable.usedAt,
          ),

          gt(
            adminPasswordResetTokensTable.expiresAt,
            now,
          ),
        ),
      )
      .limit(1);

  if (!result) {
    return {
      valid: false,
    };
  }

  /*
   * Mesmo que o token esteja tecnicamente
   * válido, a recuperação não pode prosseguir
   * para uma conta removida ou inativa.
   */
  if (
    result.userDeletedAt ||
    result.userStatus !== "ACTIVE"
  ) {
    return {
      valid: false,
    };
  }

  return {
    valid: true,

    reset: {
      tokenId:
        result.tokenId,

      userId:
        result.userId,

      expiresAt:
        result.expiresAt,
    },
  };
}
