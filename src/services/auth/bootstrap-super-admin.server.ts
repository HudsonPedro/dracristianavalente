import { eq } from "drizzle-orm";

import { getDb } from "../../db";
import {
  adminRolesTable,
  adminUsersTable,
} from "../../db/schema/admin-access";

import { hashAdminPassword } from "./admin-password.server";

export type BootstrapSuperAdminResult = {
  created: boolean;

  repaired: boolean;

  userId: string;

  role: "SUPER_ADMIN";
};

const SUPER_ADMIN_ID =
  "admin-super-admin-primary";

const SUPER_ADMIN_EMAIL =
  "hptech@hptechinformatica.com";

const SUPER_ADMIN_NAME =
  "Super Administrador";

function getAdminPassword() {
  const password =
    process.env.ADMIN_LOGIN_PASSWORD;

  if (!password) {
    throw new Error(
      "ADMIN_LOGIN_PASSWORD não configurada no ambiente.",
    );
  }

  return password;
}

export async function bootstrapSuperAdmin(): Promise<BootstrapSuperAdminResult> {
  const db = getDb();

  /*
   * O e-mail principal do proprietário da loja
   * possui uma identidade canônica única.
   *
   * Não dependemos mais de ADMIN_LOGIN_EMAIL
   * durante o bootstrap para impedir que um
   * Secret configurado incorretamente altere
   * novamente a identidade do SUPER_ADMIN.
   */
  const canonicalEmail =
    SUPER_ADMIN_EMAIL;

  const [superAdminRole] =
    await db
      .select()
      .from(adminRolesTable)
      .where(
        eq(
          adminRolesTable.code,
          "SUPER_ADMIN",
        ),
      )
      .limit(1);

  if (!superAdminRole) {
    throw new Error(
      "Cargo SUPER_ADMIN não encontrado.",
    );
  }

  if (!superAdminRole.active) {
    throw new Error(
      "Cargo SUPER_ADMIN está inativo.",
    );
  }

  /*
   * Primeiro procuramos pelo ID estrutural
   * do SUPER_ADMIN.
   *
   * Isso permite reparar uma identidade que
   * tenha sido criada anteriormente com e-mail
   * incorreto, sem criar novo usuário.
   */
  const [existingPrimaryUser] =
    await db
      .select()
      .from(adminUsersTable)
      .where(
        eq(
          adminUsersTable.id,
          SUPER_ADMIN_ID,
        ),
      )
      .limit(1);

  if (existingPrimaryUser) {
    if (
      existingPrimaryUser.roleId !==
      superAdminRole.id
    ) {
      throw new Error(
        "O usuário administrativo principal está associado a um cargo diferente de SUPER_ADMIN.",
      );
    }

    const needsRepair =
      existingPrimaryUser.email !==
        canonicalEmail ||
      existingPrimaryUser.name !==
        SUPER_ADMIN_NAME ||
      existingPrimaryUser.department !==
        "ADMINISTRATION" ||
      existingPrimaryUser.status !==
        "ACTIVE";

    if (needsRepair) {
      await db
        .update(adminUsersTable)
        .set({
          name:
            SUPER_ADMIN_NAME,

          email:
            canonicalEmail,

          department:
            "ADMINISTRATION",

          status:
            "ACTIVE",

          updatedAt:
            new Date(),
        })
        .where(
          eq(
            adminUsersTable.id,
            SUPER_ADMIN_ID,
          ),
        );
    }

    /*
     * IMPORTANTE:
     *
     * Não tocamos no password_hash existente.
     * Portanto a senha atual permanece exatamente
     * a mesma que foi utilizada para criar
     * este SUPER_ADMIN.
     */
    return {
      created: false,

      repaired:
        needsRepair,

      userId:
        existingPrimaryUser.id,

      role:
        "SUPER_ADMIN",
    };
  }

  /*
   * Somente chegamos aqui se o usuário estrutural
   * realmente não existir.
   *
   * Nesse cenário usamos a senha protegida do
   * ambiente para criar o primeiro hash.
   */
  const password =
    getAdminPassword();

  const passwordHash =
    await hashAdminPassword(
      password,
    );

  const now =
    new Date();

  const [createdUser] =
    await db
      .insert(adminUsersTable)
      .values({
        id:
          SUPER_ADMIN_ID,

        name:
          SUPER_ADMIN_NAME,

        email:
          canonicalEmail,

        passwordHash,

        department:
          "ADMINISTRATION",

        status:
          "ACTIVE",

        roleId:
          superAdminRole.id,

        failedLoginAttempts:
          0,

        lockedUntil:
          null,

        lastLoginAt:
          null,

        passwordChangedAt:
          now,

        authVersion:
          1,

        mustChangePassword:
          false,

        emailVerifiedAt:
          now,

        deletedAt:
          null,

        createdAt:
          now,

        updatedAt:
          now,
      })
      .returning();

  if (!createdUser) {
    throw new Error(
      "Não foi possível criar o Super Administrador.",
    );
  }

  return {
    created: true,

    repaired: false,

    userId:
      createdUser.id,

    role:
      "SUPER_ADMIN",
  };
}
