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
   * Não revelamos externamente se o e-mail
   * informado existe no banco.
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
   * Guardamos o código em uma constante própria.
   *
   * Isso permite validar corretamente o possível
   * valor null retornado pela tipagem do banco
   * antes de tratá-lo como AdminRoleCode.
   */
  const roleCode =
    role.code;

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
   * O cargo também precisa estar ativo.
   */
  if (!role.active) {
    return {
      success: false,
      reason: "INACTIVE",
    };
  }

  /*
   * O cargo precisa possuir código válido.
   *
   * Esta validação resolve o TS2345 porque
   * elimina null antes de chamar
   * isAdminRoleCode().
   */
  if (
    typeof roleCode !== "string" ||
    !isAdminRoleCode(
      roleCode,
    )
  ) {
    return {
      success: false,
      reason: "INACTIVE",
    };
  }

  /*
   * Conta temporariamente bloqueada.
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
   * Controlamos o contador efetivo localmente.
   *
   * Se um bloqueio antigo expirou,
   * o contador volta para zero.
   */
  let effectiveFailedLoginAttempts =
    user.failedLoginAttempts;

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

    effectiveFailedLoginAttempts = 0;
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
      effectiveFailedLoginAttempts +
      1;

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
   * Remove tentativas anteriores,
   * libera eventual bloqueio expirado
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

      role: roleCode,

      authVersion:
        user.authVersion,
    },
  };
}
