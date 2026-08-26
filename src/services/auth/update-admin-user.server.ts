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
  requireAdmin,
} from "./require-admin.server";

export type UpdateAdminUserInput = {
  userId: string;

  name: string;

  department: string;

  roleId: string;
};

export type UpdateAdminUserResult = {
  id: string;

  name: string;

  email: string;

  department: string;

  status: string;

  roleId: string;

  updatedAt: Date;
};

function validateInput(
  input: UpdateAdminUserInput,
) {
  const userId =
    input.userId?.trim() ?? "";

  const name =
    input.name?.trim() ?? "";

  const department =
    input.department?.trim() ?? "";

  const roleId =
    input.roleId?.trim() ?? "";

  if (!userId) {
    throw new Error(
      "Usuário administrativo inválido.",
    );
  }

  if (!name) {
    throw new Error(
      "O nome do usuário é obrigatório.",
    );
  }

  if (
    name.length > 255
  ) {
    throw new Error(
      "O nome do usuário é inválido.",
    );
  }

  if (!department) {
    throw new Error(
      "O departamento é obrigatório.",
    );
  }

  if (
    department.length > 80
  ) {
    throw new Error(
      "O departamento é inválido.",
    );
  }

  if (!roleId) {
    throw new Error(
      "O papel administrativo é obrigatório.",
    );
  }

  return {
    userId,
    name,
    department,
    roleId,
  };
}

/*
 * Mantemos duas assinaturas compatíveis.
 *
 * Isso preserva tanto chamadas com objeto
 * quanto chamadas posicionais existentes
 * em camadas anteriores do projeto.
 */
export function updateAdminUser(
  input: UpdateAdminUserInput,
): Promise<UpdateAdminUserResult>;

export function updateAdminUser(
  userId: string,
  name: string,
  department: string,
  roleId: string,
): Promise<UpdateAdminUserResult>;

export async function updateAdminUser(
  inputOrUserId:
    | UpdateAdminUserInput
    | string,

  positionalName?: string,

  positionalDepartment?: string,

  positionalRoleId?: string,
): Promise<UpdateAdminUserResult> {
  /*
   * Toda edição de usuário exige
   * sessão administrativa válida.
   */
  const admin =
    await requireAdmin();

  const input:
    UpdateAdminUserInput =
      typeof inputOrUserId ===
      "string"
        ? {
            userId:
              inputOrUserId,

            name:
              positionalName ??
              "",

            department:
              positionalDepartment ??
              "",

            roleId:
              positionalRoleId ??
              "",
          }
        : inputOrUserId;

  const data =
    validateInput(
      input,
    );

  const db =
    getDb();

  /*
   * Carrega o usuário real.
   */
  const [
    existingUser,
  ] =
    await db
      .select({
        id:
          adminUsersTable.id,

        name:
          adminUsersTable.name,

        email:
          adminUsersTable.email,

        department:
          adminUsersTable.department,

        status:
          adminUsersTable.status,

        roleId:
          adminUsersTable.roleId,
      })
      .from(
        adminUsersTable,
      )
      .where(
        eq(
          adminUsersTable.id,
          data.userId,
        ),
      )
      .limit(1);

  if (!existingUser) {
    throw new Error(
      "Usuário administrativo não encontrado.",
    );
  }

  /*
   * O papel escolhido precisa existir
   * e estar ativo.
   */
  const [
    selectedRole,
  ] =
    await db
      .select({
        id:
          adminRolesTable.id,

        code:
          adminRolesTable.code,

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

  if (!selectedRole) {
    throw new Error(
      "Papel administrativo não encontrado.",
    );
  }

  if (
    !selectedRole.active
  ) {
    throw new Error(
      "Não é possível atribuir um papel administrativo inativo.",
    );
  }

  /*
   * Proteção crítica:
   *
   * o próprio SUPER_ADMIN autenticado
   * não pode remover de si mesmo o papel
   * SUPER_ADMIN por esta operação.
   */
  if (
    existingUser.id ===
      admin.userId &&
    admin.role ===
      "SUPER_ADMIN" &&
    selectedRole.code !==
      "SUPER_ADMIN"
  ) {
    throw new Error(
      "O Super Administrador não pode remover de si próprio o papel SUPER_ADMIN.",
    );
  }

  const [
    updatedUser,
  ] =
    await db
      .update(
        adminUsersTable,
      )
      .set({
        name:
          data.name,

        department:
          data.department,

        roleId:
          data.roleId,

        updatedAt:
          new Date(),
      })
      .where(
        eq(
          adminUsersTable.id,
          data.userId,
        ),
      )
      .returning({
        id:
          adminUsersTable.id,

        name:
          adminUsersTable.name,

        email:
          adminUsersTable.email,

        department:
          adminUsersTable.department,

        status:
          adminUsersTable.status,

        roleId:
          adminUsersTable.roleId,

        updatedAt:
          adminUsersTable.updatedAt,
      });

  if (!updatedUser) {
    throw new Error(
      "Não foi possível atualizar o usuário administrativo.",
    );
  }

  return updatedUser;
}
