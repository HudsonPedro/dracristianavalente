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

type SetAdminDepartmentStatusInput = {
  departmentId: string;

  isActive: boolean;
};

export type SetAdminDepartmentStatusResult = {
  id: string;

  code: string;

  name: string;

  description: string | null;

  isActive: boolean;

  createdAt: Date;

  updatedAt: Date;
};

function validateInput(
  input: SetAdminDepartmentStatusInput,
) {
  const departmentId =
    input.departmentId
      ?.trim() ?? "";

  if (!departmentId) {
    throw new Error(
      "Departamento inválido.",
    );
  }

  if (
    typeof input.isActive !==
    "boolean"
  ) {
    throw new Error(
      "Estado do departamento inválido.",
    );
  }

  return {
    departmentId,

    isActive:
      input.isActive,
  };
}

export async function setAdminDepartmentStatus(
  input: SetAdminDepartmentStatusInput,
): Promise<SetAdminDepartmentStatusResult> {
  /*
   * Toda alteração administrativa continua
   * exigindo sessão administrativa real.
   */
  await requireAdmin();

  const data =
    validateInput(
      input,
    );

  const db =
    getDb();

  /*
   * Primeiro validamos o registro real
   * antes de executar qualquer UPDATE.
   */
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

  /*
   * Operação idempotente.
   *
   * Se o departamento já estiver no estado
   * solicitado, nenhuma escrita desnecessária
   * é realizada.
   */
  if (
    existingDepartment.isActive ===
    data.isActive
  ) {
    return existingDepartment;
  }

  const [
    updatedDepartment,
  ] =
    await db
      .update(
        adminDepartmentsTable,
      )
      .set({
        isActive:
          data.isActive,

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
      data.isActive
        ? "Não foi possível ativar o departamento."
        : "Não foi possível desativar o departamento.",
    );
  }

  return updatedDepartment;
}
