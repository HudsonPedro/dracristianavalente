import {
  boolean,
  index,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
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

      code: varchar("code", {
        length: 80,
      })
        .notNull(),

      name: varchar("name", {
        length: 120,
      })
        .notNull(),

      description: text(
        "description",
      ),

      isActive: boolean(
        "is_active",
      )
        .notNull()
        .default(true),

      createdAt: timestamp(
        "created_at",
        {
          withTimezone: true,
        },
      )
        .notNull()
        .defaultNow(),

      updatedAt: timestamp(
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
        "admin_departments_code_unique",
      ).on(table.code),

      index(
        "admin_departments_name_idx",
      ).on(table.name),

      index(
        "admin_departments_active_idx",
      ).on(table.isActive),
    ],
  );

export type AdminDepartment =
  typeof adminDepartmentsTable.$inferSelect;

export type NewAdminDepartment =
  typeof adminDepartmentsTable.$inferInsert;
