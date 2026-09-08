import { eq } from "drizzle-orm";

import { getDb } from "../../db";

import { adminRolePermissionsTable } from "../../db/schema/admin-access";

import { adminUserPermissionOverridesTable } from "../../db/schema/admin-governance";

import {
  ADMIN_ACTIONS,
  ADMIN_MODULES,
  type AdminAction,
  type AdminModule,
} from "../../domain/admin/access";

import { requireAdmin, type AuthenticatedAdmin } from "./require-admin.server";

export type AdminEffectivePermission = {
  module: AdminModule;

  action: AdminAction;
};

export type AdminEffectivePermissions = {
  admin: AuthenticatedAdmin;

  permissions: AdminEffectivePermission[];
};

type PermissionEffect = "ALLOW" | "DENY";

function createPermissionKey(module: AdminModule, action: AdminAction) {
  return `${module}:${action}`;
}

function isAdminModule(value: string): value is AdminModule {
  return (ADMIN_MODULES as readonly string[]).includes(value);
}

function isAdminAction(value: string): value is AdminAction {
  return (ADMIN_ACTIONS as readonly string[]).includes(value);
}

function isPermissionEffect(value: string): value is PermissionEffect {
  return value === "ALLOW" || value === "DENY";
}

/**
 * Resolve a matriz efetiva de autorização
 * do administrador autenticado.
 *
 * Precedência:
 *
 * 1. override individual DENY;
 * 2. override individual ALLOW;
 * 3. permissão herdada do papel;
 * 4. DENY por padrão.
 *
 * A tabela de override possui uma única
 * linha por usuário/módulo/ação, portanto
 * um override individual substitui a
 * permissão herdada do papel.
 */
export async function getAdminEffectivePermissions(): Promise<AdminEffectivePermissions> {
  const admin = await requireAdmin();

  const db = getDb();

  const [rolePermissions, userOverrides] = await Promise.all([
    db
      .select({
        module: adminRolePermissionsTable.module,

        action: adminRolePermissionsTable.action,
      })
      .from(adminRolePermissionsTable)
      .where(eq(adminRolePermissionsTable.roleId, admin.roleId)),

    db
      .select({
        module: adminUserPermissionOverridesTable.module,

        action: adminUserPermissionOverridesTable.action,

        effect: adminUserPermissionOverridesTable.effect,
      })
      .from(adminUserPermissionOverridesTable)
      .where(eq(adminUserPermissionOverridesTable.userId, admin.userId)),
  ]);

  const effectivePermissions = new Map<string, AdminEffectivePermission>();

  /*
   * Primeiro carregamos as permissões
   * herdadas do papel.
   */
  for (const permission of rolePermissions) {
    if (!isAdminModule(permission.module) || !isAdminAction(permission.action)) {
      continue;
    }

    effectivePermissions.set(createPermissionKey(permission.module, permission.action), {
      module: permission.module,

      action: permission.action,
    });
  }

  /*
   * Depois aplicamos os overrides
   * individuais.
   *
   * ALLOW inclui a permissão.
   * DENY remove a permissão herdada.
   *
   * Efeitos desconhecidos são ignorados
   * e jamais concedem acesso.
   */
  for (const override of userOverrides) {
    if (
      !isAdminModule(override.module) ||
      !isAdminAction(override.action) ||
      !isPermissionEffect(override.effect)
    ) {
      continue;
    }

    const key = createPermissionKey(override.module, override.action);

    if (override.effect === "DENY") {
      effectivePermissions.delete(key);

      continue;
    }

    effectivePermissions.set(key, {
      module: override.module,

      action: override.action,
    });
  }

  return {
    admin,

    permissions: Array.from(effectivePermissions.values()),
  };
}

export function hasAdminEffectivePermission(
  permissions: readonly AdminEffectivePermission[],
  module: AdminModule,
  action: AdminAction,
) {
  return permissions.some(
    (permission) => permission.module === module && permission.action === action,
  );
}

export async function requireAdminPermission(
  module: AdminModule,
  action: AdminAction,
): Promise<AdminEffectivePermissions> {
  const effective = await getAdminEffectivePermissions();

  if (!hasAdminEffectivePermission(effective.permissions, module, action)) {
    throw new Error("Acesso administrativo sem permissão para esta operação.");
  }

  return effective;
}
