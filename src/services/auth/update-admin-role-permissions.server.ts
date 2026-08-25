import {
  randomUUID,
} from "node:crypto";

import {
  eq,
  sql,
} from "drizzle-orm";

import {
  getDb,
} from "../../db";

import {
  adminRolePermissionsTable,
  adminRolesTable,
} from "../../db/schema/admin-access";

import {
  ADMIN_ACTIONS,
  ADMIN_MODULES,
  type AdminAction,
  type AdminModule,
} from "../../domain/admin/access";

import {
  requireAdmin,
} from "./require-admin.server";

export type AdminRolePermissionInput = {
  module: AdminModule;

  action: AdminAction;
};

type UpdateAdminRolePermissionsInput = {
  roleId: string;

  permissions:
    AdminRolePermissionInput[];
};

export type UpdateAdminRolePermissionsResult = {
  roleId: string;

  permissions:
    AdminRolePermissionInput[];
};

function isAdminModule(
  value: string,
): value is AdminModule {
  return (
    ADMIN_MODULES as readonly string[]
  ).includes(
    value,
  );
}

function isAdminAction(
  value: string,
): value is AdminAction {
  return (
    ADMIN_ACTIONS as readonly string[]
  ).includes(
    value,
  );
}

function normalizePermissions(
  permissions:
    AdminRolePermissionInput[],
): AdminRolePermissionInput[] {
  const uniquePermissions =
    new Map<
      string,
      AdminRolePermissionInput
    >();

  for (
    const permission
    of permissions
  ) {
    if (
      !isAdminModule(
        permission.module,
      )
    ) {
      throw new Error(
        "Módulo administrativo inválido.",
      );
    }

    if (
      !isAdminAction(
        permission.action,
      )
    ) {
      throw new Error(
        "Ação administrativa inválida.",
      );
    }

    const key =
      `${permission.module}:${permission.action}`;

    uniquePermissions.set(
      key,
      {
        module:
          permission.module,

        action:
          permission.action,
      },
    );
  }

  return Array.from(
    uniquePermissions.values(),
  );
}

export async function updateAdminRolePermissions(
  input:
    UpdateAdminRolePermissionsInput,
): Promise<UpdateAdminRolePermissionsResult> {
  /*
   * Alterar permissões administrativas
   * é uma operação crítica de governança.
   */
  const admin =
    await requireAdmin();

  if (
    admin.role !==
    "SUPER_ADMIN"
  ) {
    throw new Error(
      "Apenas o Super Administrador pode alterar permissões administrativas.",
    );
  }

  const roleId =
    input.roleId?.trim() ?? "";

  if (!roleId) {
    throw new Error(
      "Papel administrativo inválido.",
    );
  }

  if (
    !Array.isArray(
      input.permissions,
    )
  ) {
    throw new Error(
      "Permissões administrativas inválidas.",
    );
  }

  const permissions =
    normalizePermissions(
      input.permissions,
    );

  const db =
    getDb();

  /*
   * Valida o papel real antes de qualquer
   * alteração na matriz de acesso.
   */
  const [
    role,
  ] =
    await db
      .select({
        id:
          adminRolesTable.id,

        code:
          adminRolesTable.code,

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
          adminRolesTable.id,
          roleId,
        ),
      )
      .limit(1);

  if (!role) {
    throw new Error(
      "Papel administrativo não encontrado.",
    );
  }

  /*
   * Os papéis estruturais permanecem
   * protegidos nesta frente.
   */
  if (
    role.systemRole
  ) {
    throw new Error(
      "As permissões de papéis estruturais do sistema não podem ser alteradas por esta operação.",
    );
  }

  if (
    !role.active
  ) {
    throw new Error(
      "Não é possível alterar permissões de um papel inativo.",
    );
  }

  /*
   * O projeto usa Neon HTTP.
   *
   * Não utilizamos db.transaction().
   *
   * Para matriz vazia, um DELETE individual
   * já representa a operação inteira.
   */
  if (
    permissions.length ===
    0
  ) {
    await db
      .delete(
        adminRolePermissionsTable,
      )
      .where(
        eq(
          adminRolePermissionsTable.roleId,
          roleId,
        ),
      );
  } else {
    /*
     * IMPORTANTE:
     *
     * A sincronização agora funciona por
     * convergência de estado:
     *
     * 1. INSERT das permissões desejadas.
     *    Permissões que já existem usam
     *    ON CONFLICT DO NOTHING.
     *
     * 2. DELETE das permissões antigas que
     *    NÃO pertencem mais à matriz desejada.
     *
     * Tudo ocorre em UMA ÚNICA instrução SQL.
     */

    const insertValues =
      permissions.map(
        (
          permission,
        ) => {
          const id =
            `role-permission-${randomUUID()}`;

          return sql`
            (
              ${id},
              ${roleId},
              ${permission.module},
              ${permission.action}
            )
          `;
        },
      );

    const desiredValues =
      permissions.map(
        (
          permission,
        ) =>
          sql`
            (
              ${permission.module},
              ${permission.action}
            )
          `,
      );

    await db.execute(
      sql`
        WITH inserted_permissions AS (
          INSERT INTO admin_role_permissions (
            id,
            role_id,
            module,
            action
          )
          VALUES
          ${sql.join(
            insertValues,
            sql`, `,
          )}
          ON CONFLICT (
            role_id,
            module,
            action
          )
          DO NOTHING
          RETURNING id
        )
        DELETE FROM admin_role_permissions
        WHERE
          role_id = ${roleId}
          AND NOT EXISTS (
            SELECT 1
            FROM (
              VALUES
              ${sql.join(
                desiredValues,
                sql`, `,
              )}
            ) AS desired_permissions (
              module,
              action
            )
            WHERE
              desired_permissions.module =
                admin_role_permissions.module
              AND
              desired_permissions.action =
                admin_role_permissions.action
          )
      `,
    );
  }

  /*
   * Relê o estado realmente persistido
   * depois da sincronização.
   */
  const persistedPermissions =
    await db
      .select({
        module:
          adminRolePermissionsTable.module,

        action:
          adminRolePermissionsTable.action,
      })
      .from(
        adminRolePermissionsTable,
      )
      .where(
        eq(
          adminRolePermissionsTable.roleId,
          roleId,
        ),
      );

  return {
    roleId,

    permissions:
      persistedPermissions.map(
        (
          permission,
        ) => ({
          module:
            permission.module as AdminModule,

          action:
            permission.action as AdminAction,
        }),
      ),
  };
}
