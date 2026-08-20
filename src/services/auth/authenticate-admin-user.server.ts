import { eq } from "drizzle-orm";

import { getDb } from "../../db";
import {
  adminRolesTable,
  adminUsersTable,
} from "../../db/schema/admin-access";
import {
  ADMIN_ROLE_CODES,
  type AdminRoleCode,
} from "../../domain/admin/access";

import { verifyAdminPassword } from "./admin-password.server";

const MAX_FAILED_LOGIN_ATTEMPTS = 5;

const LOCK_DURATION_MINUTES = 15;

export type AuthenticatedAdminUser = {
  id: string;

  name: string;

  email: string;

  roleId: string;

  role: AdminRoleCode;

  authVersion: number;
};

export type AdminAuthenticationResult =
  | {
      success: true;

      user: AuthenticatedAdminUser;
    }
  | {
      success: false;

      reason:
        | "INVALID_CREDENTIALS"
        | "BLOCKED"
        | "INACTIVE";
    };

function normalizeEmail(
  email: string,
) {
  return email
    .trim()
    .toLowerCase();
}

function isAdminRoleCode(
  value: string,
): value is AdminRoleCode {
  return (
    ADMIN_ROLE_CODES as readonly string[]
  ).includes(value);
}

function getLockExpiration() {
  return new Date(
    Date.now() +
      LOCK_DURATION_MINUTES *
        60 *
        1000,
  );
}

export async function authenticateAdminUser(
  email: string,
  password: string,
): Promise<AdminAuthenticationResult> {
  const db = getDb();

  const normalizedEmail =
    normalizeEmail(email);

  const [result] =
    await db
      .select({
        user: adminUsersTable,
        role: adminRolesTable,
      })
      .from(adminUsersTable)
      .innerJoin(
        adminRolesTable,
        eq(
          adminUsersTable.roleId,
          adminRolesTable.id,
        ),
      )
      .where(
        eq(
          adminUsersTable.email,
          normalizedEmail,
        ),
      )
      .limit(1);

  /*
   * A resposta externa deve continuar genérica.
   * Não revelamos se determinado e-mail existe.
   */
  if (
    !result ||
    !result.user.passwordHash
  ) {
    return {
      success: false,
      reason: "INVALID_CREDENTIALS",
    };
  }

  const user =
    result.user;

  const role =
    result.role;

  /*
   * Usuário removido logicamente não pode autenticar.
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
  if (
    user.status !== "ACTIVE"
  ) {
    return {
      success: false,
      reason:
        user.status === "BLOCKED"
          ? "BLOCKED"
          : "INACTIVE",
    };
  }

  /*
   * Cargo também precisa continuar ativo.
   */
  if (!role.active) {
    return {
      success: false,
      reason: "INACTIVE",
    };
  }

  /*
   * O código vindo do banco precisa pertencer
   * aos cargos administrativos reconhecidos
   * pela aplicação.
   */
  if (
    !isAdminRoleCode(
      role.code,
    )
  ) {
    return {
      success: false,
      reason: "INACTIVE",
    };
  }

  /*
   * Bloqueio temporário ainda vigente.
   */
  if (
    user.lockedUntil &&
    user.lockedUntil.getTime() >
      Date.now()
  ) {
    return {
      success: false,
      reason: "BLOCKED",
    };
  }

  /*
   * Se o bloqueio anterior já venceu,
   * zeramos o estado antes de continuar.
   */
  if (
    user.lockedUntil &&
    user.lockedUntil.getTime() <=
      Date.now()
  ) {
    await db
      .update(adminUsersTable)
      .set({
        failedLoginAttempts: 0,
        lockedUntil: null,
        updatedAt: new Date(),
      })
      .where(
        eq(
          adminUsersTable.id,
          user.id,
        ),
      );

    user.failedLoginAttempts = 0;
    user.lockedUntil = null;
  }

  const passwordValid =
    await verifyAdminPassword(
      password,
      user.passwordHash,
    );

  /*
   * SENHA INCORRETA
   */
  if (!passwordValid) {
    const failedLoginAttempts =
      user.failedLoginAttempts + 1;

    const shouldLock =
      failedLoginAttempts >=
      MAX_FAILED_LOGIN_ATTEMPTS;

    await db
      .update(adminUsersTable)
      .set({
        failedLoginAttempts:
          shouldLock
            ? 0
            : failedLoginAttempts,

        lockedUntil:
          shouldLock
            ? getLockExpiration()
            : null,

        updatedAt:
          new Date(),
      })
      .where(
        eq(
          adminUsersTable.id,
          user.id,
        ),
      );

    return {
      success: false,
      reason:
        shouldLock
          ? "BLOCKED"
          : "INVALID_CREDENTIALS",
    };
  }

  /*
   * LOGIN CORRETO
   *
   * Zera qualquer tentativa incorreta anterior
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
    .where(
      eq(
        adminUsersTable.id,
        user.id,
      ),
    );

  return {
    success: true,

    user: {
      id: user.id,

      name: user.name,

      email: user.email,

      roleId: role.id,

      role: role.code,

      authVersion:
        user.authVersion,
    },
  };
}
