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
  listAdminDepartments,
} from "./list-admin-departments.server";

import {
  requireAdminPermission,
} from "./admin-effective-permissions.server";

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

type AdminUserRoleAssignmentPolicyInput = {
  actorUserId: string;
  actorRole: string;
  targetUserId: string;
  currentRoleCode: string;
  selectedRoleCode: string;
};

/** Preserva o SUPER_ADMIN como autoridade raiz singular no servidor. */
export function assertAdminUserRoleAssignmentAllowed(
  input: AdminUserRoleAssignmentPolicyInput,
) {
  const targetIsSuperAdmin = input.currentRoleCode === "SUPER_ADMIN";
  const assignsSuperAdmin = input.selectedRoleCode === "SUPER_ADMIN";
  const actorIsTarget = input.actorUserId === input.targetUserId;
  const actorIsSuperAdmin = input.actorRole === "SUPER_ADMIN";

  if (assignsSuperAdmin && !targetIsSuperAdmin) {
    throw new Error(
      "O papel SUPER_ADMIN não pode ser atribuído pela edição comum de usuários.",
    );
  }

  if (targetIsSuperAdmin && (!actorIsSuperAdmin || !actorIsTarget || !assignsSuperAdmin)) {
    throw new Error(
      "A conta do Super Administrador não pode ser alterada por esta operação.",
    );
  }
}

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
 * Compatibilidade com as chamadas já
 * existentes no projeto.
 *
 * Aceita tanto objeto quanto argumentos
 * posicionais sem obrigar alterações nas
 * Server Functions já homologadas.
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
   * A operação exige uma sessão
   * administrativa válida.
   */
  const { admin } =
    await requireAdminPermission(
      "USERS",
      "UPDATE",
    );

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
   * Carrega o usuário real antes
   * de qualquer alteração.
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

        roleCode:
          adminRolesTable.code,
      })
      .from(
        adminUsersTable,
      )
      .innerJoin(
        adminRolesTable,
        eq(
          adminUsersTable.roleId,
          adminRolesTable.id,
        ),
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
   * Integração com a camada real e já
   * homologada de Departamentos.
   *
   * Não acessamos diretamente um schema
   * de Departamentos aqui. O serviço
   * existente é a fonte oficial.
   */
  const departments =
    await listAdminDepartments();

  const selectedDepartment =
    departments.find(
      (
        department,
      ) =>
        department.code ===
        data.department,
    );

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
   * O novo papel deve existir e
   * permanecer ativo.
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

  assertAdminUserRoleAssignmentAllowed({
    actorUserId: admin.userId,
    actorRole: admin.role,
    targetUserId: existingUser.id,
    currentRoleCode: existingUser.roleCode,
    selectedRoleCode: selectedRole.code,
  });

  /*
   * Esta operação continua limitada
   * aos campos já definidos para a
   * edição administrativa do usuário.
   *
   * E-mail, estado, senha e demais
   * controles de segurança não são
   * modificados aqui.
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
   * IMPORTANTE:
   *
   * Este é o contrato esperado pela
   * Server Function existente em
   * src/functions/admin-auth.ts.
   *
   * Não retornar o usuário diretamente.
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
