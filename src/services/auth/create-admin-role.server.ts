import {
  randomUUID,
} from "node:crypto";

import {
  eq,
} from "drizzle-orm";

import {
  getDb,
} from "../../db";

import {
  adminRolesTable,
  adminUsersTable,
} from "../../db/schema/admin-access";

import {
  adminUserInvitationsTable,
} from "../../db/schema/admin-governance";

import {
  requireAdmin,
} from "./require-admin.server";

type CreateAdminRoleInput = {
  code: string;

  name: string;

  description?: string | null;
};

type UpdateAdminRoleInput = {
  roleId: string;

  name: string;

  description?: string | null;
};

type SetAdminRoleStatusInput = {
  roleId: string;

  active: boolean;
};

type DeleteAdminRoleInput = {
  roleId: string;
};

export type AdminRoleMutationResult = {
  id: string;

  code: string;

  name: string;

  description: string | null;

  systemRole: boolean;

  active: boolean;
};

export type DeleteAdminRoleResult = {
  id: string;

  code: string;

  name: string;

  deleted: true;
};

function normalizeRoleCode(
  value: string,
): string {
  return value
    .trim()
    .toUpperCase()
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      "",
    )
    .replace(
      /[^A-Z0-9]+/g,
      "_",
    )
    .replace(
      /^_+|_+$/g,
      "",
    );
}

function validateCreateInput(
  input: CreateAdminRoleInput,
) {
  const code =
    normalizeRoleCode(
      input.code ?? "",
    );

  const name =
    input.name?.trim() ?? "";

  const description =
    input.description?.trim() ||
    null;

  if (!code) {
    throw new Error(
      "O código do papel é obrigatório.",
    );
  }

  if (
    code.length > 80
  ) {
    throw new Error(
      "O código do papel deve possuir no máximo 80 caracteres.",
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
    code,
    name,
    description,
  };
}

function validateUpdateInput(
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

function validateStatusInput(
  input: SetAdminRoleStatusInput,
) {
  const roleId =
    input.roleId?.trim() ?? "";

  if (!roleId) {
    throw new Error(
      "Papel administrativo inválido.",
    );
  }

  if (
    typeof input.active !==
    "boolean"
  ) {
    throw new Error(
      "Estado do papel administrativo inválido.",
    );
  }

  return {
    roleId,

    active:
      input.active,
  };
}

function validateDeleteInput(
  input: DeleteAdminRoleInput,
) {
  const roleId =
    input.roleId?.trim() ?? "";

  if (!roleId) {
    throw new Error(
      "Papel administrativo inválido.",
    );
  }

  return {
    roleId,
  };
}

async function requireSuperAdmin() {
  const admin =
    await requireAdmin();

  if (
    admin.role !==
    "SUPER_ADMIN"
  ) {
    throw new Error(
      "Apenas o Super Administrador pode administrar papéis.",
    );
  }

  return admin;
}

export async function createAdminRole(
  input: CreateAdminRoleInput,
): Promise<AdminRoleMutationResult> {
  await requireSuperAdmin();

  const data =
    validateCreateInput(
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
      })
      .from(
        adminRolesTable,
      )
      .where(
        eq(
          adminRolesTable.code,
          data.code,
        ),
      )
      .limit(1);

  if (existingRole) {
    throw new Error(
      "Já existe um papel administrativo com este código.",
    );
  }

  const [
    role,
  ] =
    await db
      .insert(
        adminRolesTable,
      )
      .values({
        id:
          `role-${randomUUID()}`,

        code:
          data.code,

        name:
          data.name,

        description:
          data.description,

        systemRole:
          false,

        active:
          true,

        updatedAt:
          new Date(),
      })
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

  if (!role) {
    throw new Error(
      "Não foi possível criar o papel administrativo.",
    );
  }

  return role;
}

export async function updateAdminRole(
  input: UpdateAdminRoleInput,
): Promise<AdminRoleMutationResult> {
  await requireSuperAdmin();

  const data =
    validateUpdateInput(
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

  if (
    existingRole.code ===
    "SUPER_ADMIN"
  ) {
    throw new Error(
      "O papel Super Administrador é estrutural e não pode ser editado.",
    );
  }

  const [
    role,
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

  if (!role) {
    throw new Error(
      "Não foi possível atualizar o papel administrativo.",
    );
  }

  return role;
}

export async function setAdminRoleStatus(
  input: SetAdminRoleStatusInput,
): Promise<AdminRoleMutationResult> {
  await requireSuperAdmin();

  const data =
    validateStatusInput(
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

  if (
    existingRole.code ===
    "SUPER_ADMIN"
  ) {
    throw new Error(
      "O papel Super Administrador não pode ser ativado ou desativado por esta operação.",
    );
  }

  if (
    existingRole.active ===
    data.active
  ) {
    return existingRole;
  }

  const [
    role,
  ] =
    await db
      .update(
        adminRolesTable,
      )
      .set({
        active:
          data.active,

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

  if (!role) {
    throw new Error(
      "Não foi possível alterar o estado do papel administrativo.",
    );
  }

  return role;
}

export async function deleteAdminRole(
  input: DeleteAdminRoleInput,
): Promise<DeleteAdminRoleResult> {
  await requireSuperAdmin();

  const data =
    validateDeleteInput(
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
   * Nenhum papel estrutural do sistema
   * pode ser removido fisicamente.
   */
  if (
    existingRole.systemRole
  ) {
    throw new Error(
      "Papéis estruturais do sistema não podem ser removidos.",
    );
  }

  /*
   * A remoção permanente exige que o
   * papel tenha sido desativado antes.
   */
  if (
    existingRole.active
  ) {
    throw new Error(
      "Desative o papel administrativo antes de removê-lo permanentemente.",
    );
  }

  /*
   * Usuários mantêm FK RESTRICT para
   * admin_roles. Fazemos a verificação
   * também na aplicação para apresentar
   * uma mensagem administrativa clara.
   */
  const [
    linkedUser,
  ] =
    await db
      .select({
        id:
          adminUsersTable.id,
      })
      .from(
        adminUsersTable,
      )
      .where(
        eq(
          adminUsersTable.roleId,
          data.roleId,
        ),
      )
      .limit(1);

  if (linkedUser) {
    throw new Error(
      "Não é possível remover este papel porque existem usuários vinculados a ele.",
    );
  }

  /*
   * Convites administrativos também
   * referenciam admin_roles com RESTRICT.
   */
  const [
    linkedInvitation,
  ] =
    await db
      .select({
        id:
          adminUserInvitationsTable.id,
      })
      .from(
        adminUserInvitationsTable,
      )
      .where(
        eq(
          adminUserInvitationsTable.roleId,
          data.roleId,
        ),
      )
      .limit(1);

  if (linkedInvitation) {
    throw new Error(
      "Não é possível remover este papel porque existem convites administrativos vinculados a ele.",
    );
  }

  const [
    deletedRole,
  ] =
    await db
      .delete(
        adminRolesTable,
      )
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
      });

  if (!deletedRole) {
    throw new Error(
      "Não foi possível remover o papel administrativo.",
    );
  }

  /*
   * admin_role_permissions possui
   * ON DELETE CASCADE, portanto a matriz
   * pertencente ao papel é removida pelo
   * próprio PostgreSQL.
   */
  return {
    id:
      deletedRole.id,

    code:
      deletedRole.code,

    name:
      deletedRole.name,

    deleted:
      true,
  };
}
