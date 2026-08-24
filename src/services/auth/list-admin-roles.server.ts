import {
  asc,
  eq,
} from "drizzle-orm";

import { getDb } from "../../db";
import {
  adminRolesTable,
} from "../../db/schema/admin-access";

import {
  requireAdmin,
} from "./require-admin.server";

export type AdminRoleListItem = {
  id: string;

  code: string;

  name: string;

  description: string | null;

  systemRole: boolean;

  active: boolean;
};

export async function listAdminRoles(): Promise<
  AdminRoleListItem[]
> {
  /*
   * A consulta de papéis administrativos
   * exige sessão administrativa válida.
   */
  await requireAdmin();

  const db =
    getDb();

  const roles =
    await db
      .select({
        id:
          adminRolesTable.id,

        code:
          adminRolesTable.code,

        name:
          adminRolesTable.name,

        description:
          adminRolesTable.description,

        systemRole:
          adminRolesTable.systemRole,

        active:
          adminRolesTable.active,
      })
      .from(
        adminRolesTable,
      )
      .where(
        eq(
          adminRolesTable.active,
          true,
        ),
      )
      .orderBy(
        asc(
          adminRolesTable.name,
        ),
      );

  return roles;
}
