import {
  asc,
  eq,
} from "drizzle-orm";

import {
  getDb,
} from "../../db";

import {
  adminRolePermissionsTable,
  adminRolesTable,
} from "../../db/schema/admin-access";

import {
  requireAdmin,
} from "./require-admin.server";

export type AdminRolePermissionListItem = {
  module: string;

  action: string;
};

export type AdminRoleListItem = {
  id: string;

  code: string;

  name: string;

  description: string | null;

  systemRole: boolean;

  active: boolean;

  permissions: AdminRolePermissionListItem[];
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

  const rolePermissions =
    await db
      .select({
        roleId:
          adminRolePermissionsTable.roleId,

        module:
          adminRolePermissionsTable.module,

        action:
          adminRolePermissionsTable.action,
      })
      .from(
        adminRolePermissionsTable,
      )
      .orderBy(
        asc(
          adminRolePermissionsTable.roleId,
        ),
        asc(
          adminRolePermissionsTable.module,
        ),
        asc(
          adminRolePermissionsTable.action,
        ),
      );

  const permissionsByRole =
    new Map<
      string,
      AdminRolePermissionListItem[]
    >();

  for (
    const permission
    of rolePermissions
  ) {
    const currentPermissions =
      permissionsByRole.get(
        permission.roleId,
      ) ?? [];

    currentPermissions.push({
      module:
        permission.module,

      action:
        permission.action,
    });

    permissionsByRole.set(
      permission.roleId,
      currentPermissions,
    );
  }

  return roles.map(
    (role) => ({
      id:
        role.id,

      code:
        role.code,

      name:
        role.name,

      description:
        role.description,

      systemRole:
        role.systemRole,

      active:
        role.active,

      permissions:
        permissionsByRole.get(
          role.id,
        ) ?? [],
    }),
  );
}
