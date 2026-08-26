import {
  createHash,
  randomBytes,
  randomUUID,
} from "node:crypto";

import {
  and,
  eq,
  isNull,
} from "drizzle-orm";

import {
  getDb,
} from "../../db";

import {
  adminPasswordResetTokensTable,
  adminUsersTable,
} from "../../db/schema/admin-access";

import {
  requireAdmin,
} from "./require-admin.server";

export type CreateAdminUserInvitationTokenInput = {
  userId: string;
};

export type CreateAdminUserInvitationTokenResult = {
  user: {
    id: string;

    name: string;

    email: string;

    status: string;
  };

  token: string;

  expiresAt: Date;
};

const ADMIN_INVITATION_TOKEN_BYTES =
  32;

const ADMIN_INVITATION_TTL_MS =
  24 * 60 * 60 * 1000;

function normalizeUserId(
  value: string,
): string {
  return value?.trim() ?? "";
}

function hashToken(
  token: string,
): string {
  return createHash(
    "sha256",
  )
    .update(
      token,
      "utf8",
    )
    .digest(
      "hex",
    );
}

export async function createAdminUserInvitationToken(
  input:
    CreateAdminUserInvitationTokenInput,
): Promise<CreateAdminUserInvitationTokenResult> {
  /*
   * Convites administrativos são uma
   * operação de governança.
   *
   * Mantemos a mesma autoridade adotada
   * na criação de usuários administrativos:
   * somente SUPER_ADMIN.
   */
  const admin =
    await requireAdmin();

  if (
    admin.role !==
    "SUPER_ADMIN"
  ) {
    throw new Error(
      "Apenas o Super Administrador pode convidar usuários administrativos.",
    );
  }

  const userId =
    normalizeUserId(
      input.userId,
    );

  if (!userId) {
    throw new Error(
      "Usuário administrativo inválido.",
    );
  }

  const db =
    getDb();

  /*
   * O convite só pode ser emitido para
   * um usuário real, ainda não removido,
   * que permaneça aguardando primeiro
   * acesso.
   */
  const [
    user,
  ] =
    await db
      .select({
        id:
          adminUsersTable.id,

        name:
          adminUsersTable.name,

        email:
          adminUsersTable.email,

        passwordHash:
          adminUsersTable.passwordHash,

        status:
          adminUsersTable.status,

        deletedAt:
          adminUsersTable.deletedAt,
      })
      .from(
        adminUsersTable,
      )
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

  if (!user) {
    throw new Error(
      "Usuário administrativo não encontrado.",
    );
  }

  if (
    user.status !==
    "INVITED"
  ) {
    throw new Error(
      "Somente usuários com convite pendente podem receber um link de primeiro acesso.",
    );
  }

  if (
    user.passwordHash
  ) {
    throw new Error(
      "Este usuário já possui credencial administrativa configurada.",
    );
  }

  /*
   * Um novo convite invalida qualquer
   * token de credencial anterior deste
   * usuário.
   *
   * Como o usuário INVITED ainda não
   * possui senha, não há reset legítimo
   * concorrente a preservar.
   */
  await db
    .delete(
      adminPasswordResetTokensTable,
    )
    .where(
      eq(
        adminPasswordResetTokensTable.userId,
        user.id,
      ),
    );

  /*
   * O token em claro existe somente nesta
   * resposta server-side para que a próxima
   * camada possa montar e enviar o e-mail.
   *
   * O banco recebe exclusivamente SHA-256.
   */
  const token =
    randomBytes(
      ADMIN_INVITATION_TOKEN_BYTES,
    ).toString(
      "hex",
    );

  const tokenHash =
    hashToken(
      token,
    );

  const expiresAt =
    new Date(
      Date.now() +
        ADMIN_INVITATION_TTL_MS,
    );

  await db
    .insert(
      adminPasswordResetTokensTable,
    )
    .values({
      id:
        `admin-invite-${randomUUID()}`,

      userId:
        user.id,

      tokenHash,

      expiresAt,
    });

  return {
    user: {
      id:
        user.id,

      name:
        user.name,

      email:
        user.email,

      status:
        user.status,
    },

    token,

    expiresAt,
  };
}
