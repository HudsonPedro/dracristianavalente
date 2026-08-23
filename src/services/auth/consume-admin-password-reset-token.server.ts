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
} from "../../db/schema/admin-access";

export type ConsumeAdminPasswordResetTokenResult =
  | {
      consumed: true;

      tokenId: string;

      userId: string;

      usedAt: Date;
    }
  | {
      consumed: false;
    };

function hashResetToken(
  token: string,
): string {
  return createHash("sha256")
    .update(token)
    .digest("hex");
}

export async function consumeAdminPasswordResetToken(
  token: string,
): Promise<ConsumeAdminPasswordResetTokenResult> {
  const normalizedToken =
    token.trim();

  if (!normalizedToken) {
    return {
      consumed: false,
    };
  }

  /*
   * O token real nunca é armazenado
   * nem utilizado como chave no banco.
   *
   * Procuramos somente pelo SHA-256.
   */
  const tokenHash =
    hashResetToken(
      normalizedToken,
    );

  const now =
    new Date();

  const db =
    getDb();

  /*
   * CONSUMO ATÔMICO
   *
   * A própria instrução UPDATE exige:
   *
   * - hash correto;
   * - token ainda não utilizado;
   * - token ainda não expirado.
   *
   * Se duas requisições tentarem usar
   * o mesmo token ao mesmo tempo,
   * somente uma conseguirá alterar
   * used_at de NULL para uma data.
   */
  const [consumedToken] =
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
      .returning({
        tokenId:
          adminPasswordResetTokensTable.id,

        userId:
          adminPasswordResetTokensTable.userId,

        usedAt:
          adminPasswordResetTokensTable.usedAt,
      });

  /*
   * Nenhuma linha atualizada significa:
   *
   * - token inexistente;
   * - token expirado;
   * - token já utilizado.
   *
   * Não distinguimos os motivos
   * externamente.
   */
  if (
    !consumedToken ||
    !consumedToken.usedAt
  ) {
    return {
      consumed: false,
    };
  }

  return {
    consumed: true,

    tokenId:
      consumedToken.tokenId,

    userId:
      consumedToken.userId,

    usedAt:
      consumedToken.usedAt,
  };
}
