import {
  asc,
  eq,
  isNull,
} from "drizzle-orm";

import { getDb } from "../../db";
import {
  adminRolesTable,
  adminUsersTable,
} from "../../db/schema/admin-access";

import {
  requireAdmin,
} from "./require-admin.server";

export type AdminUserListItem = {
  id: string;

  name: string;

  email: string;

  department: string;

  status: string;

  role: {
    id: string;

    code: string;

    name: string;
  };

  failedLoginAttempts: number;

  lockedUntil: Date | null;

  lastLoginAt: Date | null;

  passwordChangedAt: Date | null;

  mustChangePassword: boolean;

  emailVerifiedAt: Date | null;

  createdAt: Date;

  updatedAt: Date;
};

export async function listAdminUsers(): Promise<
  AdminUserListItem[]
> {
  /*
   * Somente uma sessão administrativa
   * real e válida pode consultar a lista.
   *
   * requireAdmin() já valida:
   *
   * - sessão;
   * - usuário real;
   * - estado da conta;
   * - authVersion.
   */
  await requireAdmin();

  const db =
    getDb();

  const rows =
    await db
      .select({
        id:
          adminUsersTable.id,

        name:
          adminUsersTable.name,

        email:
          adminUsersTable.email,

        department:
          adminUsersTable.department,

        status:
          adminUsersTable.status,

        roleId:
          adminRolesTable.id,

        roleCode:
          adminRolesTable.code,

        roleName:
          adminRolesTable.name,

        failedLoginAttempts:
          adminUsersTable.failedLoginAttempts,

        lockedUntil:
          adminUsersTable.lockedUntil,

        lastLoginAt:
          adminUsersTable.lastLoginAt,

        passwordChangedAt:
          adminUsersTable.passwordChangedAt,

        mustChangePassword:
          adminUsersTable.mustChangePassword,

        emailVerifiedAt:
          adminUsersTable.emailVerifiedAt,

        createdAt:
          adminUsersTable.createdAt,

        updatedAt:
          adminUsersTable.updatedAt,
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
        isNull(
          adminUsersTable.deletedAt,
        ),
      )
      .orderBy(
        asc(
          adminUsersTable.name,
        ),
      );

  return rows.map(
    (row): AdminUserListItem => ({
      id:
        row.id,

      name:
        row.name,

      email:
        row.email,

      department:
        row.department,

      status:
        row.status,

      role: {
        id:
          row.roleId,

        code:
          row.roleCode,

        name:
          row.roleName,
      },

      failedLoginAttempts:
        row.failedLoginAttempts,

      lockedUntil:
        row.lockedUntil,

      lastLoginAt:
        row.lastLoginAt,

      passwordChangedAt:
        row.passwordChangedAt,

      mustChangePassword:
        row.mustChangePassword,

      emailVerifiedAt:
        row.emailVerifiedAt,

      createdAt:
        row.createdAt,

      updatedAt:
        row.updatedAt,
    }),
  );
}
