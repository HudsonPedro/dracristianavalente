import {
  eq,
} from "drizzle-orm";

import {
  db,
} from "../../db";

import {
  adminDepartmentsTable,
} from "../../db/schema/admin-departments";

import {
  requireAdmin,
} from "./require-admin.server";

type CreateAdminDepartmentInput = {
  code: string;
  name: string;
  description?: string | null;
};

function normalizeDepartmentCode(
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

function validateDepartmentInput(
  input: CreateAdminDepartmentInput,
) {
  const code =
    normalizeDepartmentCode(
      input.code ?? "",
    );

  const name =
    input.name
      ?.trim();

  const description =
    input.description
      ?.trim() ||
    null;

  if (!code) {
    throw new Error(
      "O código do departamento é obrigatório.",
    );
  }

  if (code.length > 80) {
    throw new Error(
      "O código do departamento deve possuir no máximo 80 caracteres.",
    );
  }

  if (!name) {
    throw new Error(
      "O nome do departamento é obrigatório.",
    );
  }

  if (name.length > 120) {
    throw new Error(
      "O nome do departamento deve possuir no máximo 120 caracteres.",
    );
  }

  return {
    code,
    name,
    description,
  };
}

export async function createAdminDepartment(
  input: CreateAdminDepartmentInput,
) {
  /*
   * Toda operação administrativa de escrita
   * exige uma sessão administrativa válida.
   */
  await requireAdmin();

  const data =
    validateDepartmentInput(
      input,
    );

  /*
   * A constraint UNIQUE do banco continua sendo
   * a garantia definitiva de integridade.
   *
   * Esta consulta permite retornar uma mensagem
   * administrativa compreensível antes do INSERT.
   */
  const [
    existingDepartment,
  ] =
    await db
      .select({
        id:
          adminDepartmentsTable.id,
      })
      .from(
        adminDepartmentsTable,
      )
      .where(
        eq(
          adminDepartmentsTable.code,
          data.code,
        ),
      )
      .limit(1);

  if (existingDepartment) {
    throw new Error(
      "Já existe um departamento com este código.",
    );
  }

  const [
    department,
  ] =
    await db
      .insert(
        adminDepartmentsTable,
      )
      .values({
        code:
          data.code,

        name:
          data.name,

        description:
          data.description,

        isActive:
          true,

        updatedAt:
          new Date(),
      })
      .returning({
        id:
          adminDepartmentsTable.id,

        code:
          adminDepartmentsTable.code,

        name:
          adminDepartmentsTable.name,

        description:
          adminDepartmentsTable.description,

        isActive:
          adminDepartmentsTable.isActive,

        createdAt:
          adminDepartmentsTable.createdAt,

        updatedAt:
          adminDepartmentsTable.updatedAt,
      });

  if (!department) {
    throw new Error(
      "Não foi possível criar o departamento administrativo.",
    );
  }

  return department;
}
