import {
  jsonb,
  numeric,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

import { customersTable } from "./customers";

export const ordersTable = pgTable(
  "store_orders",
  {
    id: varchar("id", {
      length: 120,
    }).primaryKey(),

    orderNumber: varchar("order_number", {
      length: 80,
    }).notNull(),

    customerId: varchar("customer_id", {
      length: 120,
    }).references(() => customersTable.id, {
      onDelete: "set null",
    }),

    customerName: varchar("customer_name", {
      length: 255,
    }).notNull(),

    customerEmail: varchar("customer_email", {
      length: 255,
    }).notNull(),

    customerPhone: varchar("customer_phone", {
      length: 40,
    }).notNull(),

    subtotal: numeric("subtotal", {
      precision: 12,
      scale: 2,
    }).notNull(),

    discount: numeric("discount", {
      precision: 12,
      scale: 2,
    })
      .notNull()
      .default("0"),

    shipping: numeric("shipping", {
      precision: 12,
      scale: 2,
    })
      .notNull()
      .default("0"),

    total: numeric("total", {
      precision: 12,
      scale: 2,
    }).notNull(),

    fulfillmentType: varchar("fulfillment_type", {
      length: 30,
    }).notNull(),

    deliveryAddress: jsonb("delivery_address").$type<{
      recipientName: string;
      postalCode: string;
      street: string;
      number: string;
      complement?: string;
      neighborhood: string;
      city: string;
      state: string;
      country: string;
    }>(),

    status: varchar("status", {
      length: 40,
    })
      .notNull()
      .default("PENDING"),

    paymentStatus: varchar("payment_status", {
      length: 40,
    })
      .notNull()
      .default("PENDING"),

    notes: text("notes"),

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
  (table) => [uniqueIndex("store_orders_number_unique").on(table.orderNumber)],
);

export type OrderRow = typeof ordersTable.$inferSelect;

export type NewOrderRow = typeof ordersTable.$inferInsert;
