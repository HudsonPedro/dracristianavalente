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
   * Alterar a matriz de autorização é
   * uma operação crítica de governança.
   *
   * Neste estágio permanece restrita ao
   * SUPER_ADMIN autenticado.
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
   * Carrega o papel real antes de qualquer
   * alteração na matriz.
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
   * SUPER_ADMIN é a autoridade raiz.
   *
   * Sua matriz permanece protegida para
   * evitar que a própria administração
   * principal seja privada de permissões
   * essenciais e provoque lockout.
   *
   * Os demais papéis, inclusive os
   * estruturais, podem ter sua matriz
   * administrada pelo SUPER_ADMIN.
   */
  if (
    role.code ===
    "SUPER_ADMIN"
  ) {
    throw new Error(
      "As permissões do Super Administrador são estruturais e não podem ser alteradas por esta operação.",
    );
  }

  /*
   * Papel inativo não recebe mudanças
   * de autorização enquanto permanecer
   * desativado.
   */
  if (
    !role.active
  ) {
    throw new Error(
      "Não é possível alterar permissões de um papel inativo.",
    );
  }

  /*
   * O projeto utiliza Neon HTTP.
   *
   * Não utilizamos db.transaction().
   *
   * Para matriz vazia, o DELETE individual
   * representa a operação inteira.
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
     * Sincronização convergente:
     *
     * 1. Inserimos todas as permissões
     *    desejadas.
     *
     * 2. As que já existem são preservadas
     *    por ON CONFLICT DO NOTHING.
     *
     * 3. Removemos as permissões que não
     *    fazem mais parte da matriz.
     *
     * INSERT + DELETE ficam dentro de uma
     * única instrução PostgreSQL compatível
     * com Neon HTTP.
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
   * O retorno reflete o estado realmente
   * persistido no banco.
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
