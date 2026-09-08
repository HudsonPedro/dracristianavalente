import { asc } from "drizzle-orm";

import { getDb } from "../../db";

import { adminDepartmentsTable } from "../../db/schema/admin-departments";

import { requireAdminPermission } from "./admin-effective-permissions.server";

export type AdminDepartmentListItem = {
  id: string;

  code: string;

  name: string;

  description: string | null;

  isActive: boolean;

  createdAt: Date;

  updatedAt: Date;
};

export async function listAdminDepartments(): Promise<AdminDepartmentListItem[]> {
  /*
   * A listagem administrativa exige
   * uma sessão administrativa válida.
   */
  await requireAdminPermission("USERS", "VIEW");

  const db = getDb();

  const departments = await db
    .select({
      id: adminDepartmentsTable.id,

      code: adminDepartmentsTable.code,

      name: adminDepartmentsTable.name,

      description: adminDepartmentsTable.description,

      isActive: adminDepartmentsTable.isActive,

      createdAt: adminDepartmentsTable.createdAt,

      updatedAt: adminDepartmentsTable.updatedAt,
    })
    .from(adminDepartmentsTable)
    .orderBy(asc(adminDepartmentsTable.name));

  return departments;
}
