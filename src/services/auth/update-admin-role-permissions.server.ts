import {
  and,
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
   * operação crítica de governança.
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
    input.roleId?.trim();

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

  const [
    role,
  ] =
    await db
      .select({
        id:
          adminRolesTable.id,

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
   * Nesta etapa os sete papéis estruturais
   * permanecem imutáveis.
   *
   * A matriz editável será liberada somente
   * para papéis personalizados.
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
   * Substituição completa da matriz dentro
   * de uma única transação.
   *
   * Isso evita estados intermediários onde
   * parte das permissões antigas e novas
   * coexistam.
   */
  await db.transaction(
    async (
      tx,
    ) => {
      await tx
        .delete(
          adminRolePermissionsTable,
        )
        .where(
          eq(
            adminRolePermissionsTable.roleId,
            roleId,
          ),
        );

      if (
        permissions.length >
        0
      ) {
        await tx
          .insert(
            adminRolePermissionsTable,
          )
          .values(
            permissions.map(
              (
                permission,
              ) => ({
                roleId,

                module:
                  permission.module,

                action:
                  permission.action,
              }),
            ),
          );
      }
    },
  );

  /*
   * Leitura pós-transação.
   *
   * O retorno representa o estado realmente
   * persistido, e não apenas o payload recebido.
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
        and(
          eq(
            adminRolePermissionsTable.roleId,
            roleId,
          ),
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
