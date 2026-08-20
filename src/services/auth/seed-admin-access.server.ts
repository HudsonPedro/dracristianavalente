import { eq } from "drizzle-orm";

import { ADMIN_ROLE_SEEDS } from "../../data/admin-access";
import { getDb } from "../../db";
import {
  adminRolePermissionsTable,
  adminRolesTable,
} from "../../db/schema/admin-access";
import type {
  AdminAction,
  AdminModule,
  AdminPermission,
} from "../../domain/admin/access";

type SeedAdminAccessResult = {
  roles: number;
  permissions: number;
};

function splitPermission(
  permission: AdminPermission,
): {
  module: AdminModule;
  action: AdminAction;
} {
  const [module, action] =
    permission.split(":") as [
      AdminModule,
      AdminAction,
    ];

  return {
    module,
    action,
  };
}

function createPermissionId(
  roleId: string,
  permission: AdminPermission,
) {
  const normalizedPermission =
    permission
      .toLowerCase()
      .replaceAll("_", "-")
      .replace(":", "-");

  return `${roleId}-${normalizedPermission}`;
}

export async function seedAdminAccess(): Promise<SeedAdminAccessResult> {
  const db = getDb();

  let permissionCount = 0;

  for (const role of ADMIN_ROLE_SEEDS) {
    await db
      .insert(adminRolesTable)
      .values({
        id: role.id,
        code: role.code,
        name: role.name,
        description: role.description,
        systemRole: role.systemRole,
        active: role.active,
      })
      .onConflictDoUpdate({
        target: adminRolesTable.code,
        set: {
          name: role.name,
          description: role.description,
          systemRole: role.systemRole,
          active: role.active,
          updatedAt: new Date(),
        },
      });

    /*
     * A matriz declarada em src/data/admin-access.ts
     * é a fonte oficial das permissões dos cargos
     * de sistema.
     *
     * Ao executar novamente o seed, removemos somente
     * as permissões do cargo atual e recriamos exatamente
     * a matriz homologada.
     */
    await db
      .delete(adminRolePermissionsTable)
      .where(
        eq(
          adminRolePermissionsTable.roleId,
          role.id,
        ),
      );

    if (role.permissions.length === 0) {
      continue;
    }

    const permissionRows =
      role.permissions.map(
        (permission) => {
          const {
            module,
            action,
          } = splitPermission(
            permission,
          );

          return {
            id: createPermissionId(
              role.id,
              permission,
            ),
            roleId: role.id,
            module,
            action,
          };
        },
      );

    await db
      .insert(
        adminRolePermissionsTable,
      )
      .values(permissionRows);

    permissionCount +=
      permissionRows.length;
  }

  return {
    roles: ADMIN_ROLE_SEEDS.length,
    permissions: permissionCount,
  };
}
