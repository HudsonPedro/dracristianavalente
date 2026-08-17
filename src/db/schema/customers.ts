import {
  pgTable,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

export const customersTable =
  pgTable(
    "store_customers",
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

      phone: varchar("phone", {
        length: 40,
      }).notNull(),

      cpf: varchar("cpf", {
        length: 20,
      }),

      status: varchar("status", {
        length: 30,
      })
        .notNull()
        .default("ACTIVE"),

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
        "store_customers_email_unique",
      ).on(table.email),
    ],
  );

export type CustomerRow =
  typeof customersTable.$inferSelect;

export type NewCustomerRow =
  typeof customersTable.$inferInsert;
