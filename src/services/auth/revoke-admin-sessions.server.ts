import {
  eq,
  sql,
} from "drizzle-orm";

import { getDb } from "../../db";
import {
  adminUsersTable,
} from "../../db/schema/admin-access";

export type RevokeAdminSessionsResult = {
  userId: string;

  authVersion: number;
};

export async function revokeAdminSessions(
  userId: string,
): Promise<RevokeAdminSessionsResult> {
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
   * Incrementamos auth_version diretamente
   * no PostgreSQL.
   *
   * Isso evita depender de um valor lido
   * anteriormente e reduz risco de condição
   * de corrida entre duas revogações.
   */
  const [updatedUser] =
    await db
      .update(adminUsersTable)
      .set({
        authVersion:
          sql`${adminUsersTable.authVersion} + 1`,

        updatedAt:
          new Date(),
      })
      .where(
        eq(
          adminUsersTable.id,
          normalizedUserId,
        ),
      )
      .returning({
        userId:
          adminUsersTable.id,

        authVersion:
          adminUsersTable.authVersion,
      });

  if (!updatedUser) {
    throw new Error(
      "Usuário administrativo não encontrado.",
    );
  }

  return {
    userId:
      updatedUser.userId,

    authVersion:
      updatedUser.authVersion,
  };
}
