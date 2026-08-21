import { eq } from "drizzle-orm";

import { getDb } from "../../db";
import {
  adminRolesTable,
  adminUsersTable,
} from "../../db/schema/admin-access";
import type {
  AdminRoleCode,
} from "../../domain/admin/access";

import {
  useAdminSession,
} from "./admin-session.server";

export type AuthenticatedAdmin = {
  authenticated: true;

  userId: string;

  roleId: string;

  role: AdminRoleCode;

  authVersion: number;
};

export async function requireAdmin(): Promise<AuthenticatedAdmin> {
  const session =
    await useAdminSession();

  const sessionData =
    session.data;

  if (
    sessionData.authenticated !== true ||
    typeof sessionData.userId !== "string" ||
    typeof sessionData.roleId !== "string" ||
    typeof sessionData.role !== "string" ||
    typeof sessionData.authVersion !== "number"
  ) {
    throw new Error(
      "Acesso administrativo não autorizado.",
    );
  }

  const db =
    getDb();

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
          adminUsersTable.id,
          sessionData.userId,
        ),
      )
      .limit(1);

  if (!result) {
    await session.clear();

    throw new Error(
      "Acesso administrativo não autorizado.",
    );
  }

  const user =
    result.user;

  const role =
    result.role;

  if (
    user.deletedAt ||
    user.status !== "ACTIVE" ||
    !role.active
  ) {
    await session.clear();

    throw new Error(
      "Acesso administrativo não autorizado.",
    );
  }

  if (
    user.roleId !==
      sessionData.roleId ||
    role.id !==
      sessionData.roleId ||
    role.code !==
      sessionData.role
  ) {
    await session.clear();

    throw new Error(
      "Acesso administrativo não autorizado.",
    );
  }

  if (
    user.authVersion !==
    sessionData.authVersion
  ) {
    await session.clear();

    throw new Error(
      "Sessão administrativa expirada.",
    );
  }

  return {
    authenticated: true,

    userId:
      user.id,

    roleId:
      role.id,

    role:
      sessionData.role,

    authVersion:
      user.authVersion,
  };
}
