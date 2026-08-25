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
} from "../../db/schema/admin-access";

import {
  requireAdmin,
} from "./require-admin.server";

type CreateAdminRoleInput = {
  code: string;

  name: string;

  description?: string | null;
};

export type CreateAdminRoleResult = {
  id: string;

  code: string;

  name: string;

  description: string | null;

  systemRole: boolean;

  active: boolean;
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

function validateInput(
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

export async function createAdminRole(
  input: CreateAdminRoleInput,
): Promise<CreateAdminRoleResult> {
  /*
   * Governança de papéis é uma operação
   * administrativa de alto privilégio.
   *
   * Enquanto o enforcement completo de RBAC
   * ainda não está aplicado às mutações,
   * somente SUPER_ADMIN pode criar papéis.
   */
  const admin =
    await requireAdmin();

  if (
    admin.role !==
    "SUPER_ADMIN"
  ) {
    throw new Error(
      "Apenas o Super Administrador pode criar papéis administrativos.",
    );
  }

  const data =
    validateInput(
      input,
    );

  const db =
    getDb();

  /*
   * O código é a identidade funcional
   * do papel e não pode ser duplicado.
   */
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

  /*
   * Papéis criados pelo painel nunca são
   * papéis estruturais do sistema.
   *
   * systemRole permanece false.
   */
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
