import {
  eq,
} from "drizzle-orm";

import {
  getDb,
} from "../../db";

import {
  adminDepartmentsTable,
} from "../../db/schema/admin-departments";

import {
  requireAdmin,
} from "./require-admin.server";

type UpdateAdminDepartmentInput = {
  departmentId: string;

  name: string;

  description?: string | null;
};

function validateUpdateAdminDepartmentInput(
  input: UpdateAdminDepartmentInput,
) {
  const departmentId =
    input.departmentId?.trim() ?? "";

  const name =
    input.name?.trim() ?? "";

  const description =
    input.description?.trim() ||
    null;

  if (!departmentId) {
    throw new Error(
      "Departamento inválido.",
    );
  }

  if (!name) {
    throw new Error(
      "O nome do departamento é obrigatório.",
    );
  }

  if (
    name.length > 120
  ) {
    throw new Error(
      "O nome do departamento deve possuir no máximo 120 caracteres.",
    );
  }

  if (
    description &&
    description.length > 2000
  ) {
    throw new Error(
      "A descrição do departamento deve possuir no máximo 2000 caracteres.",
    );
  }

  return {
    departmentId,
    name,
    description,
  };
}

export async function updateAdminDepartment(
  input: UpdateAdminDepartmentInput,
) {
  await requireAdmin();

  const data =
    validateUpdateAdminDepartmentInput(
      input,
    );

  const db =
    getDb();

  const [
    existingDepartment,
  ] =
    await db
      .select({
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
      })
      .from(
        adminDepartmentsTable,
      )
      .where(
        eq(
          adminDepartmentsTable.id,
          data.departmentId,
        ),
      )
      .limit(1);

  if (!existingDepartment) {
    throw new Error(
      "Departamento não encontrado.",
    );
  }

  const [
    updatedDepartment,
  ] =
    await db
      .update(
        adminDepartmentsTable,
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
          adminDepartmentsTable.id,
          data.departmentId,
        ),
      )
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

  if (!updatedDepartment) {
    throw new Error(
      "Não foi possível atualizar o departamento.",
    );
  }

  return updatedDepartment;
}
