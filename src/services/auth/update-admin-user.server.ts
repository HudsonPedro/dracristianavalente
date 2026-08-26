import {
  eq,
} from "drizzle-orm";

import {
  getDb,
} from "../../db";

import {
  adminRolesTable,
} from "../../db/schema/admin-access";

import {
  requireAdmin,
} from "./require-admin.server";

type UpdateAdminRoleInput = {
  roleId: string;

  name: string;

  description?: string | null;
};

export type UpdateAdminRoleResult = {
  id: string;

  code: string;

  name: string;

  description: string | null;

  systemRole: boolean;

  active: boolean;
};

function validateInput(
  input: UpdateAdminRoleInput,
) {
  const roleId =
    input.roleId?.trim() ?? "";

  const name =
    input.name?.trim() ?? "";

  const description =
    input.description?.trim() ||
    null;

  if (!roleId) {
    throw new Error(
      "Papel administrativo inválido.",
    );
  }

  if (!name) {
    throw new Error(
      "O nome do papel é obrigatório.",
    );
  }

  if (
    name.length > 160
  ) {
    throw new Error(
      "O nome do papel deve possuir no máximo 160 caracteres.",
    );
  }

  if (
    description &&
    description.length > 2000
  ) {
    throw new Error(
      "A descrição do papel deve possuir no máximo 2000 caracteres.",
    );
  }

  return {
    roleId,
    name,
    description,
  };
}

export async function updateAdminRole(
  input: UpdateAdminRoleInput,
): Promise<UpdateAdminRoleResult> {
  /*
   * Alteração de papel administrativo
   * continua restrita ao SUPER_ADMIN.
   */
  const admin =
    await requireAdmin();

  if (
    admin.role !==
    "SUPER_ADMIN"
  ) {
    throw new Error(
      "Apenas o Super Administrador pode editar papéis administrativos.",
    );
  }

  const data =
    validateInput(
      input,
    );

  const db =
    getDb();

  const [
    existingRole,
  ] =
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
          adminRolesTable.id,
          data.roleId,
        ),
      )
      .limit(1);

  if (!existingRole) {
    throw new Error(
      "Papel administrativo não encontrado.",
    );
  }

  /*
   * Papéis estruturais não podem ser
   * alterados por esta operação.
   */
  if (
    existingRole.systemRole
  ) {
    throw new Error(
      "Papéis estruturais do sistema não podem ser editados por esta operação.",
    );
  }

  const [
    updatedRole,
  ] =
    await db
      .update(
        adminRolesTable,
      )
      .set({
        name:
          data.name,

        description:
          data.description,

        updatedAt:
          new Date(),
      })
      .where(
        eq(
          adminRolesTable.id,
          data.roleId,
        ),
      )
      .returning({
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
      });

  if (!updatedRole) {
    throw new Error(
      "Não foi possível atualizar o papel administrativo.",
    );
  }

  return updatedRole;
}
