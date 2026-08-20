import { eq } from "drizzle-orm";

import { getDb } from "../../db";
import {
  adminRolesTable,
  adminUsersTable,
} from "../../db/schema/admin-access";

import { hashAdminPassword } from "./admin-password.server";

export type BootstrapSuperAdminResult = {
  created: boolean;

  userId: string;

  email: string;

  role: "SUPER_ADMIN";
};

function getRequiredEnvironmentVariable(
  name:
    | "ADMIN_LOGIN_EMAIL"
    | "ADMIN_LOGIN_PASSWORD",
) {
  const value =
    process.env[name];

  if (!value) {
    throw new Error(
      `${name} não configurada no ambiente.`,
    );
  }

  return value;
}

export async function bootstrapSuperAdmin(): Promise<BootstrapSuperAdminResult> {
  const db =
    getDb();

  const email =
    getRequiredEnvironmentVariable(
      "ADMIN_LOGIN_EMAIL",
    )
      .trim()
      .toLowerCase();

  const password =
    getRequiredEnvironmentVariable(
      "ADMIN_LOGIN_PASSWORD",
    );

  if (!email) {
    throw new Error(
      "E-mail administrativo inválido.",
    );
  }

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

  const [existingUser] =
    await db
      .select()
      .from(adminUsersTable)
      .where(
        eq(
          adminUsersTable.email,
          email,
        ),
      )
      .limit(1);

  if (existingUser) {
    if (
      existingUser.roleId !==
      superAdminRole.id
    ) {
      throw new Error(
        "Já existe um usuário com este e-mail utilizando outro cargo.",
      );
    }

    return {
      created: false,
      userId: existingUser.id,
      email: existingUser.email,
      role: "SUPER_ADMIN",
    };
  }

  const passwordHash =
    await hashAdminPassword(
      password,
    );

  const now =
    new Date();

  const userId =
    "admin-super-admin-primary";

  const [createdUser] =
    await db
      .insert(adminUsersTable)
      .values({
        id: userId,

        name:
          "Super Administrador",

        email,

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
    userId: createdUser.id,
    email: createdUser.email,
    role: "SUPER_ADMIN",
  };
}
