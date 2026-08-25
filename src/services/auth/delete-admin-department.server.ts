import {
  eq,
} from "drizzle-orm";

import {
  ADMIN_DEPARTMENTS,
} from "../../domain/admin/access";

import {
  getDb,
} from "../../db";

import {
  adminUsersTable,
} from "../../db/schema/admin-access";

import {
  adminDepartmentsTable,
} from "../../db/schema/admin-departments";

import {
  adminUserInvitationsTable,
} from "../../db/schema/admin-governance";

import {
  requireAdmin,
} from "./require-admin.server";

type DeleteAdminDepartmentInput = {
  departmentId: string;
};

export type DeleteAdminDepartmentResult = {
  id: string;

  code: string;

  name: string;

  deleted: true;
};

function validateInput(
  input: DeleteAdminDepartmentInput,
) {
  const departmentId =
    input.departmentId?.trim() ?? "";

  if (!departmentId) {
    throw new Error(
      "Departamento inválido.",
    );
  }

  return {
    departmentId,
  };
}

export async function deleteAdminDepartment(
  input: DeleteAdminDepartmentInput,
): Promise<DeleteAdminDepartmentResult> {
  /*
   * A remoção é uma operação administrativa
   * protegida e nunca pode ser pública.
   */
  await requireAdmin();

  const data =
    validateInput(
      input,
    );

  const db =
    getDb();

  /*
   * Primeiro carregamos o registro real.
   */
  const [
    department,
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
          adminDepartmentsTable.id,
          data.departmentId,
        ),
      )
      .limit(1);

  if (!department) {
    throw new Error(
      "Departamento não encontrado.",
    );
  }

  /*
   * Os departamentos oficiais definidos
   * pelo domínio administrativo não podem
   * ser removidos fisicamente.
   *
   * Eles podem ser administrados por estado,
   * mas permanecem como parte estrutural
   * da plataforma.
   */
  const isOfficialDepartment =
    (
      ADMIN_DEPARTMENTS as readonly string[]
    ).includes(
      department.code,
    );

  if (isOfficialDepartment) {
    throw new Error(
      "Departamentos oficiais da plataforma não podem ser removidos.",
    );
  }

  /*
   * A remoção permanente exige que o
   * departamento já esteja inativo.
   */
  if (department.isActive) {
    throw new Error(
      "Desative o departamento antes de removê-lo.",
    );
  }

  /*
   * admin_users.department ainda utiliza
   * o código funcional do departamento.
   *
   * Mesmo sem FK física, impedimos a remoção
   * quando existe qualquer usuário associado.
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
          adminUsersTable.department,
          department.code,
        ),
      )
      .limit(1);

  if (linkedUser) {
    throw new Error(
      "Não é possível remover este departamento porque existem usuários vinculados a ele.",
    );
  }

  /*
   * Convites possuem FK real para
   * admin_departments.code.
   *
   * Validamos previamente para produzir
   * uma mensagem administrativa clara.
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
          adminUserInvitationsTable.department,
          department.code,
        ),
      )
      .limit(1);

  if (linkedInvitation) {
    throw new Error(
      "Não é possível remover este departamento porque existem convites vinculados a ele.",
    );
  }

  /*
   * Somente após todos os gates de
   * integridade executamos a remoção.
   */
  const [
    deletedDepartment,
  ] =
    await db
      .delete(
        adminDepartmentsTable,
      )
      .where(
        eq(
          adminDepartmentsTable.id,
          department.id,
        ),
      )
      .returning({
        id:
          adminDepartmentsTable.id,

        code:
          adminDepartmentsTable.code,

        name:
          adminDepartmentsTable.name,
      });

  if (!deletedDepartment) {
    throw new Error(
      "Não foi possível remover o departamento.",
    );
  }

  return {
    id:
      deletedDepartment.id,

    code:
      deletedDepartment.code,

    name:
      deletedDepartment.name,

    deleted:
      true,
  };
}
