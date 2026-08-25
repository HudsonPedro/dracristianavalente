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
   * Alterar permissões é uma operação
   * crítica de governança.
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
   * Carregamos o papel real antes
   * de qualquer modificação.
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
   * Papéis estruturais permanecem
   * protegidos nesta etapa.
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
   * IMPORTANTE:
   *
   * O projeto utiliza o driver neon-http.
   * Esse driver não oferece db.transaction().
   *
   * Portanto fazemos a substituição da matriz
   * utilizando UMA ÚNICA instrução PostgreSQL.
   *
   * Uma instrução SQL individual é atômica:
   * ou toda ela é concluída, ou nenhuma parte
   * fica persistida.
   */

  if (
    permissions.length ===
    0
  ) {
    /*
     * Matriz vazia:
     * apenas remove todas as permissões
     * existentes do papel.
     */
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
     * Criamos os valores que serão inseridos.
     *
     * Cada vínculo Papel + Módulo + Ação
     * recebe ID próprio.
     */
    const values =
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

    /*
     * DELETE + INSERT executados dentro
     * da mesma instrução SQL usando CTE.
     *
     * Compatível com neon-http e atômico
     * no PostgreSQL.
     */
    await db.execute(
      sql`
        WITH deleted_permissions AS (
          DELETE FROM admin_role_permissions
          WHERE role_id = ${roleId}
          RETURNING id
        )
        INSERT INTO admin_role_permissions (
          id,
          role_id,
          module,
          action
        )
        VALUES
        ${sql.join(
          values,
          sql`, `,
        )}
      `,
    );
  }

  /*
   * Relê o estado realmente persistido.
   *
   * O retorno nunca depende somente
   * do payload recebido pela aplicação.
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
