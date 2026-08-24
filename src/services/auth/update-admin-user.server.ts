import {
  and,
  eq,
  isNull,
} from "drizzle-orm";

import { getDb } from "../../db";
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
  success: true;

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

function normalizeRequiredText(
  value: string,
  fieldName: string,
  maxLength: number,
): string {
  const normalized =
    value.trim();

  if (!normalized) {
    throw new Error(
      `${fieldName} é obrigatório.`,
    );
  }

  if (
    normalized.length >
    maxLength
  ) {
    throw new Error(
      `${fieldName} excede o tamanho permitido.`,
    );
  }

  return normalized;
}

export async function updateAdminUser(
  input: UpdateAdminUserInput,
): Promise<UpdateAdminUserResult> {
  /*
   * Toda alteração exige sessão
   * administrativa válida.
   */
  const currentAdmin =
    await requireAdmin();

  const userId =
    normalizeRequiredText(
      input.userId,
      "Usuário",
      120,
    );

  const name =
    normalizeRequiredText(
      input.name,
      "Nome",
      255,
    );

  const department =
    normalizeRequiredText(
      input.department,
      "Departamento",
      80,
    );

  const roleId =
    normalizeRequiredText(
      input.roleId,
      "Papel",
      120,
    );

  const db =
    getDb();

  /*
   * Localiza o usuário alvo.
   *
   * Usuários removidos logicamente
   * não podem ser editados.
   */
  const [targetUser] =
    await db
      .select({
        id:
          adminUsersTable.id,

        email:
          adminUsersTable.email,

        roleId:
          adminUsersTable.roleId,

        status:
          adminUsersTable.status,

        deletedAt:
          adminUsersTable.deletedAt,
      })
      .from(adminUsersTable)
      .where(
        and(
          eq(
            adminUsersTable.id,
            userId,
          ),

          isNull(
            adminUsersTable.deletedAt,
          ),
        ),
      )
      .limit(1);

  if (!targetUser) {
    throw new Error(
      "Usuário administrativo não encontrado.",
    );
  }

  /*
   * Valida o papel escolhido.
   *
   * Apenas papéis ativos podem ser atribuídos.
   */
  const [targetRole] =
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
      .from(adminRolesTable)
      .where(
        eq(
          adminRolesTable.id,
          roleId,
        ),
      )
      .limit(1);

  if (
    !targetRole ||
    !targetRole.active
  ) {
    throw new Error(
      "Papel administrativo inválido ou inativo.",
    );
  }

  /*
   * Proteção do SUPER_ADMIN.
   *
   * O próprio SUPER_ADMIN autenticado
   * não pode remover de si mesmo o papel
   * SUPER_ADMIN por esta operação comum.
   *
   * Uma mudança desse nível exigirá fluxo
   * administrativo específico no futuro.
   */
  const editingSelf =
    currentAdmin.userId ===
    targetUser.id;

  if (
    editingSelf &&
    currentAdmin.role ===
      "SUPER_ADMIN" &&
    targetRole.code !==
      "SUPER_ADMIN"
  ) {
    throw new Error(
      "O Super Administrador não pode remover o próprio papel por esta operação.",
    );
  }

  const now =
    new Date();

  const [updatedUser] =
    await db
      .update(adminUsersTable)
      .set({
        name,

        department,

        roleId:
          targetRole.id,

        updatedAt:
          now,
      })
      .where(
        eq(
          adminUsersTable.id,
          targetUser.id,
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

  return {
    success: true,

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
          targetRole.id,

        code:
          targetRole.code,

        name:
          targetRole.name,
      },

      updatedAt:
        updatedUser.updatedAt,
    },
  };
}
