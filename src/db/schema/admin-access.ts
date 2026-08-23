import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * ============================================================
 * CARGOS / PERFIS ADMINISTRATIVOS
 * ============================================================
 */

export const adminRolesTable = pgTable(
  "admin_roles",
  {
    id: varchar("id", {
      length: 120,
    }).primaryKey(),

    code: varchar("code", {
      length: 80,
    }).notNull(),

    name: varchar("name", {
      length: 160,
    }).notNull(),

    description: text("description"),

    systemRole: boolean("system_role")
      .notNull()
      .default(false),

    active: boolean("active")
      .notNull()
      .default(true),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex(
      "admin_roles_code_unique",
    ).on(table.code),

    index(
      "admin_roles_active_idx",
    ).on(table.active),
  ],
);

/**
 * ============================================================
 * PERMISSÕES DOS CARGOS
 * ============================================================
 *
 * Exemplo:
 *
 * INVENTORY + VIEW
 * INVENTORY + UPDATE
 * USERS + MANAGE
 *
 * A combinação:
 *
 * role_id + module + action
 *
 * não pode se repetir.
 * ============================================================
 */

export const adminRolePermissionsTable =
  pgTable(
    "admin_role_permissions",
    {
      id: varchar("id", {
        length: 120,
      }).primaryKey(),

      roleId: varchar("role_id", {
        length: 120,
      })
        .notNull()
        .references(
          () => adminRolesTable.id,
          {
            onDelete: "cascade",
          },
        ),

      module: varchar("module", {
        length: 80,
      }).notNull(),

      action: varchar("action", {
        length: 40,
      }).notNull(),

      createdAt: timestamp("created_at", {
        withTimezone: true,
      })
        .notNull()
        .defaultNow(),
    },
    (table) => [
      uniqueIndex(
        "admin_role_permissions_unique",
      ).on(
        table.roleId,
        table.module,
        table.action,
      ),

      index(
        "admin_role_permissions_role_idx",
      ).on(table.roleId),
    ],
  );

/**
 * ============================================================
 * USUÁRIOS ADMINISTRATIVOS
 * ============================================================
 */

export const adminUsersTable = pgTable(
  "admin_users",
  {
    id: varchar("id", {
      length: 120,
    }).primaryKey(),

    name: varchar("name", {
      length: 255,
    }).notNull(),

    email: varchar("email", {
      length: 255,
    }).notNull(),

    /**
     * Nunca armazenar senha em texto puro.
     *
     * Este campo receberá futuramente
     * somente o hash seguro da senha.
     *
     * Pode iniciar NULL para usuário
     * convidado que ainda não definiu senha.
     */
    passwordHash: text("password_hash"),

    department: varchar("department", {
      length: 80,
    }).notNull(),

    status: varchar("status", {
      length: 40,
    })
      .notNull()
      .default("INVITED"),

    roleId: varchar("role_id", {
      length: 120,
    })
      .notNull()
      .references(
        () => adminRolesTable.id,
        {
          onDelete: "restrict",
        },
      ),

    failedLoginAttempts: integer(
      "failed_login_attempts",
    )
      .notNull()
      .default(0),

    lockedUntil: timestamp(
      "locked_until",
      {
        withTimezone: true,
      },
    ),

    lastLoginAt: timestamp(
      "last_login_at",
      {
        withTimezone: true,
      },
    ),

    passwordChangedAt: timestamp(
      "password_changed_at",
      {
        withTimezone: true,
      },
    ),

    /**
     * Incrementado quando sessões existentes
     * precisam ser invalidadas.
     *
     * Exemplos:
     * - troca de senha;
     * - bloqueio;
     * - alteração crítica de acesso.
     */
    authVersion: integer(
      "auth_version",
    )
      .notNull()
      .default(1),

    mustChangePassword: boolean(
      "must_change_password",
    )
      .notNull()
      .default(true),

    emailVerifiedAt: timestamp(
      "email_verified_at",
      {
        withTimezone: true,
      },
    ),

    deletedAt: timestamp(
      "deleted_at",
      {
        withTimezone: true,
      },
    ),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex(
      "admin_users_email_unique",
    ).on(table.email),

    index(
      "admin_users_role_idx",
    ).on(table.roleId),

    index(
      "admin_users_status_idx",
    ).on(table.status),

    index(
      "admin_users_department_idx",
    ).on(table.department),
  ],
);

export const adminPasswordResetTokensTable =
  pgTable(
    "admin_password_reset_tokens",
    {
      id: varchar("id", {
        length: 120,
      }).primaryKey(),

      userId: varchar("user_id", {
        length: 120,
      })
        .notNull()
        .references(
          () =>
            adminUsersTable.id,
          {
            onDelete: "cascade",
          },
        ),

      tokenHash: text(
        "token_hash",
      ).notNull(),

      expiresAt: timestamp(
        "expires_at",
        {
          withTimezone: true,
        },
      ).notNull(),

      usedAt: timestamp(
        "used_at",
        {
          withTimezone: true,
        },
      ),

      createdAt: timestamp(
        "created_at",
        {
          withTimezone: true,
        },
      )
        .notNull()
        .defaultNow(),
    },
    (table) => [
      uniqueIndex(
        "admin_password_reset_tokens_hash_unique",
      ).on(
        table.tokenHash,
      ),

      index(
        "admin_password_reset_tokens_user_idx",
      ).on(
        table.userId,
      ),

      index(
        "admin_password_reset_tokens_expires_idx",
      ).on(
        table.expiresAt,
      ),
    ],
  );

export type AdminRoleRow =
  typeof adminRolesTable.$inferSelect;

export type NewAdminRoleRow =
  typeof adminRolesTable.$inferInsert;

export type AdminRolePermissionRow =
  typeof adminRolePermissionsTable.$inferSelect;

export type NewAdminRolePermissionRow =
  typeof adminRolePermissionsTable.$inferInsert;

export type AdminUserRow =
  typeof adminUsersTable.$inferSelect;

export type NewAdminUserRow =
  typeof adminUsersTable.$inferInsert;

export type AdminPasswordResetTokenRow =
  typeof adminPasswordResetTokensTable.$inferSelect;

export type NewAdminPasswordResetTokenRow =
  typeof adminPasswordResetTokensTable.$inferInsert;
