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
  requireAdmin,
} from "./require-admin.server";

import {
  listAdminDepartments,
} from "./list-admin-departments.server";

export type CreateAdminUserInput = {
  name: string;

  email: string;

  department: string;

  roleId: string;
};

export type CreateAdminUserResult = {
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

    mustChangePassword: boolean;

    createdAt: Date;

    updatedAt: Date;
  };
};

function normalizeEmail(
  value: string,
): string {
  return value
    .trim()
    .toLowerCase();
}

function validateInput(
  input: CreateAdminUserInput,
) {
  const name =
    input.name?.trim() ?? "";

  const email =
    normalizeEmail(
      input.email ?? "",
    );

  const department =
    input.department?.trim() ?? "";

  const roleId =
    input.roleId?.trim() ?? "";

  if (!name) {
    throw new Error(
      "O nome do usuário é obrigatório.",
    );
  }

  if (
    name.length > 255
  ) {
    throw new Error(
      "O nome do usuário administrativo é inválido.",
    );
  }

  if (!email) {
    throw new Error(
      "O e-mail do usuário é obrigatório.",
    );
  }

  if (
    email.length > 255 ||
    !email.includes("@")
  ) {
    throw new Error(
      "Informe um e-mail válido.",
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
      "O departamento administrativo é inválido.",
    );
  }

  if (!roleId) {
    throw new Error(
      "O papel administrativo é obrigatório.",
    );
  }

  return {
    name,
    email,
    department,
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
      "Apenas o Super Administrador pode criar usuários administrativos.",
    );
  }

  return admin;
}

export async function createAdminUser(
  input: CreateAdminUserInput,
): Promise<CreateAdminUserResult> {
  /*
   * Criação de usuário administrativo é
   * uma operação crítica de governança.
   */
  await requireSuperAdmin();

  const data =
    validateInput(
      input,
    );

  const db =
    getDb();

  /*
   * O e-mail identifica unicamente
   * o usuário administrativo.
   */
  const [
    existingUser,
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
          adminUsersTable.email,
          data.email,
        ),
      )
      .limit(1);

  if (existingUser) {
    throw new Error(
      "Já existe um usuário administrativo com este e-mail.",
    );
  }

  /*
   * Departamentos já possuem uma camada
   * homologada própria.
   *
   * Não importamos novamente uma tabela
   * de schema que não existe.
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
   * O papel precisa existir no banco
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
   * SUPER_ADMIN é o papel-raiz.
   *
   * A criação comum de usuários não pode
   * gerar outro Super Administrador.
   */
  if (
    selectedRole.code ===
    "SUPER_ADMIN"
  ) {
    throw new Error(
      "O papel SUPER_ADMIN não pode ser atribuído pela criação comum de usuários.",
    );
  }

  /*
   * O usuário nasce como INVITED.
   *
   * Nenhuma senha temporária é gravada
   * nesta etapa.
   *
   * O fluxo de convite/definição de senha
   * será conectado separadamente.
   */
  const [
    createdUser,
  ] =
    await db
      .insert(
        adminUsersTable,
      )
      .values({
        id:
          `admin-user-${randomUUID()}`,

        name:
          data.name,

        email:
          data.email,

        passwordHash:
          null,

        department:
          selectedDepartment.code,

        status:
          "INVITED",

        roleId:
          selectedRole.id,

        failedLoginAttempts:
          0,

        lockedUntil:
          null,

        lastLoginAt:
          null,

        passwordChangedAt:
          null,

        authVersion:
          1,

        mustChangePassword:
          true,

        emailVerifiedAt:
          null,

        deletedAt:
          null,

        updatedAt:
          new Date(),
      })
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

        mustChangePassword:
          adminUsersTable.mustChangePassword,

        createdAt:
          adminUsersTable.createdAt,

        updatedAt:
          adminUsersTable.updatedAt,
      });

  if (!createdUser) {
    throw new Error(
      "Não foi possível criar o usuário administrativo.",
    );
  }

  return {
    user: {
      id:
        createdUser.id,

      name:
        createdUser.name,

      email:
        createdUser.email,

      department:
        createdUser.department,

      status:
        createdUser.status,

      role: {
        id:
          selectedRole.id,

        code:
          selectedRole.code,

        name:
          selectedRole.name,
      },

      mustChangePassword:
        createdUser.mustChangePassword,

      createdAt:
        createdUser.createdAt,

      updatedAt:
        createdUser.updatedAt,
    },
  };
}
