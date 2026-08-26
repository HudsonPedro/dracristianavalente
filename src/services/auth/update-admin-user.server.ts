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
  adminDepartmentsTable,
} from "../../db/schema/admin-governance";

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
  user: {
    id: string;

    name: string;

    email: string;

    department: string;

    status: string;

    role: {
      id: string;

      code: string;

      name: string;
    };

    updatedAt: Date;
  };
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
 * Preserva compatibilidade com as chamadas
 * já existentes no sistema.
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
   * Toda alteração continua exigindo
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
   * O usuário precisa existir.
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
   * O departamento deixa de ser aceito
   * apenas como uma string arbitrária.
   *
   * Ele precisa existir no cadastro
   * oficial e estar ativo.
   */
  const [
    selectedDepartment,
  ] =
    await db
      .select({
        id:
          adminDepartmentsTable.id,

        code:
          adminDepartmentsTable.code,

        name:
          adminDepartmentsTable.name,

        isActive:
          adminDepartmentsTable.isActive,
      })
      .from(
        adminDepartmentsTable,
      )
      .where(
        eq(
          adminDepartmentsTable.code,
          data.department,
        ),
      )
      .limit(1);

  if (!selectedDepartment) {
    throw new Error(
      "Departamento administrativo não encontrado.",
    );
  }

  if (
    !selectedDepartment.isActive
  ) {
    throw new Error(
      "Não é possível atribuir um departamento administrativo inativo.",
    );
  }

  /*
   * O papel também precisa existir e
   * estar ativo.
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

        name:
          adminRolesTable.name,

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
   * Proteção crítica já existente:
   *
   * o SUPER_ADMIN autenticado não pode
   * retirar de si próprio o papel-raiz.
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

  /*
   * A operação continua limitada a:
   *
   * - nome
   * - departamento
   * - papel
   *
   * E-mail, senha, estado, sessões e
   * demais controles de segurança não
   * são alterados neste serviço.
   */
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
          selectedDepartment.code,

        roleId:
          selectedRole.id,

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

        updatedAt:
          adminUsersTable.updatedAt,
      });

  if (!updatedUser) {
    throw new Error(
      "Não foi possível atualizar o usuário administrativo.",
    );
  }

  /*
   * Preserva exatamente o contrato
   * consumido por admin-auth.ts.
   */
  return {
    user: {
      id:
        updatedUser.id,

      name:
        updatedUser.name,

      email:
        updatedUser.email,

      department:
        updatedUser.department,

      status:
        updatedUser.status,

      role: {
        id:
          selectedRole.id,

        code:
          selectedRole.code,

        name:
          selectedRole.name,
      },

      updatedAt:
        updatedUser.updatedAt,
    },
  };
}
