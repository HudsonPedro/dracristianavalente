import {
  boolean,
  index,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const adminDepartmentsTable =
  pgTable(
    "admin_departments",
    {
      id: uuid("id")
        .defaultRandom()
        .primaryKey(),

      /*
       * code é o identificador funcional
       * utilizado por admin_users.department
       * e por admin_user_invitations.department.
       *
       * A unicidade é declarada diretamente
       * na coluna para que o PostgreSQL crie
       * a restrição junto com CREATE TABLE,
       * antes das FKs que apontam para code.
       */
      code: varchar("code", {
        length: 80,
      })
        .notNull()
        .unique(
          "admin_departments_code_unique",
        ),

      name: varchar("name", {
        length: 120,
      })
        .notNull(),

      description:
        text("description"),

      isActive:
        boolean("is_active")
          .notNull()
          .default(true),

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
        "admin_departments_name_idx",
      ).on(
        table.name,
      ),

      index(
        "admin_departments_active_idx",
      ).on(
        table.isActive,
      ),
    ],
  );

export type AdminDepartment =
  typeof adminDepartmentsTable.$inferSelect;

export type NewAdminDepartment =
  typeof adminDepartmentsTable.$inferInsert;
