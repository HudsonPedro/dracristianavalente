import { boolean, integer, pgTable, timestamp, uniqueIndex, varchar } from "drizzle-orm/pg-core";

import { productsTable } from "./products";

export const inventoryTable = pgTable(
  "store_inventory",
  {
    id: varchar("id", {
      length: 120,
    }).primaryKey(),

    productId: varchar("product_id", {
      length: 120,
    })
      .notNull()
      .references(() => productsTable.id, {
        onDelete: "cascade",
      }),

    stockEnabled: boolean("stock_enabled").notNull().default(true),

    quantityAvailable: integer("quantity_available").notNull().default(0),

    quantityReserved: integer("quantity_reserved").notNull().default(0),

    minimumStock: integer("minimum_stock").notNull().default(0),

    allowBackorder: boolean("allow_backorder").notNull().default(false),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
  },
  (table) => [uniqueIndex("store_inventory_product_unique").on(table.productId)],
);

export type InventoryRow = typeof inventoryTable.$inferSelect;

export type NewInventoryRow = typeof inventoryTable.$inferInsert;
