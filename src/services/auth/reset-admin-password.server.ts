import { eq } from "drizzle-orm";

import { getDb } from "../../db";
import {
  adminUsersTable,
} from "../../db/schema/admin-access";

import {
  hashAdminPassword,
} from "./admin-password.server";
import {
  consumeAdminPasswordResetToken,
} from "./consume-admin-password-reset-token.server";
import {
  revokeAdminSessions,
} from "./revoke-admin-sessions.server";
import {
  validateAdminPasswordResetToken,
} from "./validate-admin-password-reset-token.server";

export type ResetAdminPasswordResult = {
  success: true;

  userId: string;

  authVersion: number;
};

export async function resetAdminPassword(
  token: string,
  newPassword: string,
): Promise<ResetAdminPasswordResult> {
  const normalizedToken =
    token.trim();

  if (!normalizedToken) {
    throw new Error(
      "Token de recuperação inválido.",
    );
  }

  if (!newPassword) {
    throw new Error(
      "A nova senha é obrigatória.",
    );
  }

  /*
   * Primeiro validamos o token sem consumi-lo.
   *
   * Isso confirma:
   *
   * - hash correspondente;
   * - token não utilizado;
   * - token não expirado;
   * - usuário ACTIVE;
   * - usuário não removido.
   */
  const validation =
    await validateAdminPasswordResetToken(
      normalizedToken,
    );

  if (!validation.valid) {
    throw new Error(
      "Token de recuperação inválido ou expirado.",
    );
  }

  /*
   * A política da nova senha é aplicada
   * pelo mesmo serviço oficial utilizado
   * na alteração de senha autenticada.
   */
  const newPasswordHash =
    await hashAdminPassword(
      newPassword,
    );

  /*
   * Consumimos o token de forma atômica.
   *
   * Se outra requisição tiver utilizado o
   * mesmo token entre a validação acima e
   * este ponto, consumed será false.
   */
  const consumption =
    await consumeAdminPasswordResetToken(
      normalizedToken,
    );

  if (!consumption.consumed) {
    throw new Error(
      "Token de recuperação inválido ou já utilizado.",
    );
  }

  /*
   * A identidade retornada pelo consumo
   * precisa corresponder à identidade
   * validada anteriormente.
   */
  if (
    consumption.userId !==
    validation.reset.userId
  ) {
    throw new Error(
      "Falha de integridade na recuperação de senha.",
    );
  }

  const db =
    getDb();

  const now =
    new Date();

  const [updatedUser] =
    await db
      .update(adminUsersTable)
      .set({
        passwordHash:
          newPasswordHash,

        passwordChangedAt:
          now,

        mustChangePassword:
          false,

        failedLoginAttempts:
          0,

        lockedUntil:
          null,

        updatedAt:
          now,
      })
      .where(
        eq(
          adminUsersTable.id,
          consumption.userId,
        ),
      )
      .returning({
        id:
          adminUsersTable.id,
      });

  if (!updatedUser) {
    throw new Error(
      "Usuário administrativo não encontrado.",
    );
  }

  /*
   * A redefinição de senha é uma operação
   * crítica de segurança.
   *
   * Todas as sessões anteriores precisam
   * ser invalidadas.
   */
  const revocation =
    await revokeAdminSessions(
      updatedUser.id,
    );

  return {
    success: true,

    userId:
      updatedUser.id,

    authVersion:
      revocation.authVersion,
  };
}
