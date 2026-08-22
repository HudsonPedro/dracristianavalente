import { eq } from "drizzle-orm";

import { getDb } from "../../db";
import {
  adminUsersTable,
} from "../../db/schema/admin-access";

import {
  hashAdminPassword,
  verifyAdminPassword,
} from "./admin-password.server";
import {
  requireAdmin,
} from "./require-admin.server";
import {
  revokeAdminSessions,
} from "./revoke-admin-sessions.server";

export type ChangeAdminPasswordResult = {
  success: true;

  userId: string;

  authVersion: number;
};

export async function changeAdminPassword(
  currentPassword: string,
  newPassword: string,
): Promise<ChangeAdminPasswordResult> {
  const admin =
    await requireAdmin();

  if (!currentPassword) {
    throw new Error(
      "A senha atual é obrigatória.",
    );
  }

  if (!newPassword) {
    throw new Error(
      "A nova senha é obrigatória.",
    );
  }

  if (
    currentPassword ===
    newPassword
  ) {
    throw new Error(
      "A nova senha deve ser diferente da senha atual.",
    );
  }

  const db =
    getDb();

  const [user] =
    await db
      .select()
      .from(adminUsersTable)
      .where(
        eq(
          adminUsersTable.id,
          admin.userId,
        ),
      )
      .limit(1);

  if (
    !user ||
    !user.passwordHash
  ) {
    throw new Error(
      "Usuário administrativo inválido.",
    );
  }

  const currentPasswordValid =
    await verifyAdminPassword(
      currentPassword,
      user.passwordHash,
    );

  if (!currentPasswordValid) {
    throw new Error(
      "Senha atual inválida.",
    );
  }

  const newPasswordHash =
    await hashAdminPassword(
      newPassword,
    );

  const now =
    new Date();

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
        admin.userId,
      ),
    );

  /*
   * Depois da alteração da senha,
   * todas as sessões existentes precisam
   * ser invalidadas.
   *
   * Isso incrementa authVersion no Neon.
   */
  const revocation =
    await revokeAdminSessions(
      admin.userId,
    );

  return {
    success: true,

    userId:
      admin.userId,

    authVersion:
      revocation.authVersion,
  };
}
