import {
  index,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

import {
  adminUsersTable,
} from "./admin-access";

/*
 * =========================================================
 * EXCEÇÕES DE PERMISSÃO POR USUÁRIO
 * =========================================================
 *
 * Departamentos possuem schema próprio em:
 *
 * src/db/schema/admin-departments.ts
 *
 * Portanto este arquivo NÃO redefine
 * admin_departments.
 *
 * O papel continua fornecendo as permissões padrão através
 * de admin_role_permissions.
 *
 * Esta tabela permite exceções individuais:
 *
 * ALLOW → permite explicitamente.
 * DENY  → nega explicitamente.
 *
 * Regra futura de autorização:
 *
 * DENY individual
 *   ↓
 * ALLOW individual
 *   ↓
 * permissão do papel
 *   ↓
 * DENY por padrão.
 */
export const adminUserPermissionOverridesTable =
  pgTable(
    "admin_user_permission_overrides",
    {
      id: varchar("id", {
        length: 120,
      })
        .primaryKey(),

      userId:
        varchar("user_id", {
          length: 120,
        })
          .notNull()
          .references(
            () =>
              adminUsersTable.id,
            {
              onDelete:
                "cascade",
            },
          ),

      module:
        varchar("module", {
          length: 80,
        })
          .notNull(),

      action:
        varchar("action", {
          length: 40,
        })
          .notNull(),

      effect:
        varchar("effect", {
          length: 20,
        })
          .notNull(),

      createdAt:
        timestamp(
          "created_at",
          {
            withTimezone: true,
          },
        )
          .notNull()
          .defaultNow(),

      updatedAt:
        timestamp(
          "updated_at",
          {
            withTimezone: true,
          },
        )
          .notNull()
          .defaultNow(),
    },
    (table) => [
      uniqueIndex(
        "admin_user_permission_overrides_unique",
      ).on(
        table.userId,
        table.module,
        table.action,
      ),

      index(
        "admin_user_permission_overrides_user_idx",
      ).on(
        table.userId,
      ),

      index(
        "admin_user_permission_overrides_effect_idx",
      ).on(
        table.effect,
      ),
    ],
  );

/*
 * =========================================================
 * CONVITES ADMINISTRATIVOS
 * =========================================================
 *
 * O token puro nunca será persistido.
 *
 * Somente tokenHash será armazenado.
 */
export const adminUserInvitationsTable =
  pgTable(
    "admin_user_invitations",
    {
      id: varchar("id", {
        length: 120,
      })
        .primaryKey(),

      email:
        varchar("email", {
          length: 255,
        })
          .notNull(),

      name:
        varchar("name", {
          length: 255,
        })
          .notNull(),

      department:
        varchar(
          "department",
          {
            length: 80,
          },
        )
          .notNull(),

      roleId:
        varchar("role_id", {
          length: 120,
        })
          .notNull(),

      tokenHash:
        text("token_hash")
          .notNull(),

      status:
        varchar("status", {
          length: 40,
        })
          .notNull()
          .default(
            "PENDING",
          ),

      expiresAt:
        timestamp(
          "expires_at",
          {
            withTimezone: true,
          },
        )
          .notNull(),

      acceptedAt:
        timestamp(
          "accepted_at",
          {
            withTimezone: true,
          },
        ),

      revokedAt:
        timestamp(
          "revoked_at",
          {
            withTimezone: true,
          },
        ),

      invitedByUserId:
        varchar(
          "invited_by_user_id",
          {
            length: 120,
          },
        )
          .notNull()
          .references(
            () =>
              adminUsersTable.id,
            {
              onDelete:
                "restrict",
            },
          ),

      createdAt:
        timestamp(
          "created_at",
          {
            withTimezone: true,
          },
        )
          .notNull()
          .defaultNow(),

      updatedAt:
        timestamp(
          "updated_at",
          {
            withTimezone: true,
          },
        )
          .notNull()
          .defaultNow(),
    },
    (table) => [
      index(
        "admin_user_invitations_email_idx",
      ).on(
        table.email,
      ),

      index(
        "admin_user_invitations_status_idx",
      ).on(
        table.status,
      ),

      index(
        "admin_user_invitations_expires_idx",
      ).on(
        table.expiresAt,
      ),

      index(
        "admin_user_invitations_invited_by_idx",
      ).on(
        table.invitedByUserId,
      ),
    ],
  );

/*
 * =========================================================
 * AUDITORIA ADMINISTRATIVA
 * =========================================================
 *
 * Registra operações administrativas relevantes.
 *
 * Nunca devem ser persistidos aqui:
 *
 * - senhas;
 * - password_hash;
 * - tokens;
 * - API Keys;
 * - cookies;
 * - segredos.
 */
export const adminAuditLogsTable =
  pgTable(
    "admin_audit_logs",
    {
      id: varchar("id", {
        length: 120,
      })
        .primaryKey(),

      actorUserId:
        varchar(
          "actor_user_id",
          {
            length: 120,
          },
        )
          .references(
            () =>
              adminUsersTable.id,
            {
              onDelete:
                "set null",
            },
          ),

      action:
        varchar("action", {
          length: 120,
        })
          .notNull(),

      targetType:
        varchar(
          "target_type",
          {
            length: 80,
          },
        )
          .notNull(),

      targetId:
        varchar("target_id", {
          length: 120,
        }),

      summary:
        varchar("summary", {
          length: 500,
        })
          .notNull(),

      previousData:
        text("previous_data"),

      nextData:
        text("next_data"),

      ipAddress:
        varchar("ip_address", {
          length: 64,
        }),

      userAgent:
        text("user_agent"),

      createdAt:
        timestamp(
          "created_at",
          {
            withTimezone: true,
          },
        )
          .notNull()
          .defaultNow(),
    },
    (table) => [
      index(
        "admin_audit_logs_actor_idx",
      ).on(
        table.actorUserId,
      ),

      index(
        "admin_audit_logs_action_idx",
      ).on(
        table.action,
      ),

      index(
        "admin_audit_logs_target_idx",
      ).on(
        table.targetType,
        table.targetId,
      ),

      index(
        "admin_audit_logs_created_at_idx",
      ).on(
        table.createdAt,
      ),
    ],
  );

export type AdminUserPermissionOverrideRecord =
  typeof adminUserPermissionOverridesTable.$inferSelect;

export type NewAdminUserPermissionOverrideRecord =
  typeof adminUserPermissionOverridesTable.$inferInsert;

export type AdminUserInvitationRecord =
  typeof adminUserInvitationsTable.$inferSelect;

export type NewAdminUserInvitationRecord =
  typeof adminUserInvitationsTable.$inferInsert;

export type AdminAuditLogRecord =
  typeof adminAuditLogsTable.$inferSelect;

export type NewAdminAuditLogRecord =
  typeof adminAuditLogsTable.$inferInsert;
