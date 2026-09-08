import { eq } from "drizzle-orm";

import { getDb } from "../../db";
import { adminRolesTable, adminUsersTable } from "../../db/schema/admin-access";
import { verifyAdminPassword } from "./admin-password.server";

const MAX_FAILED_LOGIN_ATTEMPTS = 5;

const LOCK_DURATION_MINUTES = 15;

export type AuthenticatedAdminUser = {
  id: string;

  name: string;

  email: string;

  roleId: string;

  role: string;

  authVersion: number;
};

export type AdminAuthenticationResult =
  | {
      success: true;

      user: AuthenticatedAdminUser;
    }
  | {
      success: false;

      reason: "INVALID_CREDENTIALS" | "BLOCKED" | "INACTIVE";
    };

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function getLockExpiration(): Date {
  return new Date(Date.now() + LOCK_DURATION_MINUTES * 60 * 1000);
}

export async function authenticateAdminUser(
  email: string,
  password: string,
): Promise<AdminAuthenticationResult> {
  const db = getDb();

  const normalizedEmail = normalizeEmail(email);

  const [result] = await db
    .select({
      user: adminUsersTable,
      role: adminRolesTable,
    })
    .from(adminUsersTable)
    .innerJoin(adminRolesTable, eq(adminUsersTable.roleId, adminRolesTable.id))
    .where(eq(adminUsersTable.email, normalizedEmail))
    .limit(1);

  /*
   * Não revelamos externamente se
   * determinado e-mail existe.
   */
  if (!result) {
    return {
      success: false,
      reason: "INVALID_CREDENTIALS",
    };
  }

  const user = result.user;

  const role = result.role;

  /*
   * password_hash é nullable no banco porque
   * usuários convidados ainda podem não possuir
   * uma senha definida.
   *
   * Capturamos o valor agora e validamos
   * explicitamente antes de utilizá-lo.
   */
  const passwordHash = user.passwordHash;

  if (typeof passwordHash !== "string" || !passwordHash) {
    return {
      success: false,
      reason: "INVALID_CREDENTIALS",
    };
  }
  /*
   * O código do papel vem do papel real
   * persistido no banco.
   *
   * Papéis customizados são válidos no runtime
   * desde que o papel exista e esteja ativo.
   */
  const roleCode = role.code;

  /*
   * Usuário removido logicamente
   * não pode autenticar.
   */
  if (user.deletedAt) {
    return {
      success: false,
      reason: "INVALID_CREDENTIALS",
    };
  }

  /*
   * Somente usuários ACTIVE podem entrar.
   */
  if (user.status !== "ACTIVE") {
    return {
      success: false,
      reason: user.status === "BLOCKED" ? "BLOCKED" : "INACTIVE",
    };
  }

  /*
   * O cargo associado ao usuário
   * também precisa estar ativo.
   */
  if (!role.active) {
    return {
      success: false,
      reason: "INACTIVE",
    };
  }

  /*
   * Verifica se existe bloqueio temporário
   * ainda vigente.
   */
  const now = Date.now();

  if (user.lockedUntil && user.lockedUntil.getTime() > now) {
    return {
      success: false,
      reason: "BLOCKED",
    };
  }

  /*
   * Mantemos um contador efetivo local.
   *
   * Se um bloqueio anterior já expirou,
   * zeramos contador e locked_until
   * antes de processar uma nova tentativa.
   */
  let effectiveFailedLoginAttempts = user.failedLoginAttempts;

  if (user.lockedUntil && user.lockedUntil.getTime() <= now) {
    await db
      .update(adminUsersTable)
      .set({
        failedLoginAttempts: 0,

        lockedUntil: null,

        updatedAt: new Date(),
      })
      .where(eq(adminUsersTable.id, user.id));

    effectiveFailedLoginAttempts = 0;
  }

  /*
   * Validação criptográfica da senha.
   *
   * passwordHash já foi validado acima
   * como string não nula.
   */
  const passwordValid = await verifyAdminPassword(password, passwordHash);

  /*
   * SENHA INCORRETA
   */
  if (!passwordValid) {
    const failedLoginAttempts = effectiveFailedLoginAttempts + 1;

    const shouldLock = failedLoginAttempts >= MAX_FAILED_LOGIN_ATTEMPTS;

    await db
      .update(adminUsersTable)
      .set({
        failedLoginAttempts: shouldLock ? 0 : failedLoginAttempts,

        lockedUntil: shouldLock ? getLockExpiration() : null,

        updatedAt: new Date(),
      })
      .where(eq(adminUsersTable.id, user.id));

    return {
      success: false,

      reason: shouldLock ? "BLOCKED" : "INVALID_CREDENTIALS",
    };
  }

  /*
   * LOGIN CORRETO
   *
   * Zera qualquer tentativa anterior,
   * remove bloqueio expirado
   * e registra o último login.
   */
  await db
    .update(adminUsersTable)
    .set({
      failedLoginAttempts: 0,

      lockedUntil: null,

      lastLoginAt: new Date(),

      updatedAt: new Date(),
    })
    .where(eq(adminUsersTable.id, user.id));

  return {
    success: true,

    user: {
      id: user.id,

      name: user.name,

      email: user.email,

      roleId: user.roleId,

      role: roleCode,

      authVersion: user.authVersion,
    },
  };
}
