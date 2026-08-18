import { boolean, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

import { customersTable } from "./customers";

export const addressesTable = pgTable("store_addresses", {
  id: varchar("id", {
    length: 120,
  }).primaryKey(),

  customerId: varchar("customer_id", {
    length: 120,
  }).references(() => customersTable.id, {
    onDelete: "cascade",
  }),

  label: varchar("label", {
    length: 80,
  }),

  recipientName: varchar("recipient_name", {
    length: 255,
  }).notNull(),

  postalCode: varchar("postal_code", {
    length: 20,
  }).notNull(),

  street: varchar("street", {
    length: 255,
  }).notNull(),

  number: varchar("number", {
    length: 40,
  }).notNull(),

  complement: varchar("complement", {
    length: 255,
  }),

  neighborhood: varchar("neighborhood", {
    length: 160,
  }).notNull(),

  city: varchar("city", {
    length: 160,
  }).notNull(),

  state: varchar("state", {
    length: 40,
  }).notNull(),

  country: varchar("country", {
    length: 80,
  })
    .notNull()
    .default("Brasil"),

  isDefault: boolean("is_default").notNull().default(false),

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
});

export type AddressRow = typeof addressesTable.$inferSelect;

export type NewAddressRow = typeof addressesTable.$inferInsert;
