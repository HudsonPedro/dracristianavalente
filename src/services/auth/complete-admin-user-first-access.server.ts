import { and, eq, gt, isNull } from "drizzle-orm";
import { createHash } from "node:crypto";

import { getDb } from "../../db";
import { adminPasswordResetTokensTable, adminUsersTable } from "../../db/schema/admin-access";

import { hashAdminPassword } from "./admin-password.server";
import { consumeAdminPasswordResetToken } from "./consume-admin-password-reset-token.server";

export type CompleteAdminUserFirstAccessResult = {
  success: true;

  userId: string;
};

function hashFirstAccessToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function completeAdminUserFirstAccess(
  token: string,
  newPassword: string,
): Promise<CompleteAdminUserFirstAccessResult> {
  const normalizedToken = token.trim();

  if (!normalizedToken) {
    throw new Error("Token de primeiro acesso inválido.");
  }

  if (!newPassword) {
    throw new Error("A senha é obrigatória.");
  }

  /*
   * O token em claro nunca é usado
   * diretamente como chave no banco.
   *
   * A emissão homologada persiste
   * exclusivamente o SHA-256.
   */
  const tokenHash = hashFirstAccessToken(normalizedToken);

  const now = new Date();

  const db = getDb();

  /*
   * O fluxo de primeiro acesso é
   * diferente da recuperação de senha.
   *
   * Aqui exigimos:
   *
   * - token válido;
   * - token não utilizado;
   * - token não expirado;
   * - usuário INVITED;
   * - usuário não removido;
   * - usuário ainda sem senha.
   */
  const [invitation] = await db
    .select({
      tokenId: adminPasswordResetTokensTable.id,

      userId: adminPasswordResetTokensTable.userId,
    })
    .from(adminPasswordResetTokensTable)
    .innerJoin(adminUsersTable, eq(adminUsersTable.id, adminPasswordResetTokensTable.userId))
    .where(
      and(
        eq(adminPasswordResetTokensTable.tokenHash, tokenHash),

        isNull(adminPasswordResetTokensTable.usedAt),

        gt(adminPasswordResetTokensTable.expiresAt, now),

        eq(adminUsersTable.status, "INVITED"),

        isNull(adminUsersTable.deletedAt),

        isNull(adminUsersTable.passwordHash),
      ),
    )
    .limit(1);

  if (!invitation) {
    throw new Error("Token de primeiro acesso inválido ou expirado.");
  }

  /*
   * Utiliza a política e o algoritmo
   * oficiais de senha do projeto.
   */
  const newPasswordHash = await hashAdminPassword(newPassword);

  /*
   * O token é consumido através do
   * mecanismo atômico já existente.
   */
  const consumption = await consumeAdminPasswordResetToken(normalizedToken);

  if (!consumption.consumed) {
    throw new Error("Token de primeiro acesso inválido ou já utilizado.");
  }

  if (consumption.userId !== invitation.userId) {
    throw new Error("Falha de integridade no primeiro acesso.");
  }

  const activatedAt = new Date();

  /*
   * Finaliza a ativação apenas se o
   * usuário continuar no estado esperado.
   */
  const [activatedUser] = await db
    .update(adminUsersTable)
    .set({
      passwordHash: newPasswordHash,

      status: "ACTIVE",

      passwordChangedAt: activatedAt,

      mustChangePassword: false,

      failedLoginAttempts: 0,

      lockedUntil: null,

      updatedAt: activatedAt,
    })
    .where(
      and(
        eq(adminUsersTable.id, invitation.userId),

        eq(adminUsersTable.status, "INVITED"),

        isNull(adminUsersTable.passwordHash),

        isNull(adminUsersTable.deletedAt),
      ),
    )
    .returning({
      id: adminUsersTable.id,
    });

  if (!activatedUser) {
    throw new Error("Não foi possível concluir o primeiro acesso.");
  }

  return {
    success: true,

    userId: activatedUser.id,
  };
}
