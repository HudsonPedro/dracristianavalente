import { boolean, integer, numeric, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

export const storeSettingsTable = pgTable("store_settings", {
  id: varchar("id", {
    length: 120,
  }).primaryKey(),

  storeEnabled: boolean("store_enabled").notNull().default(true),

  cartEnabled: boolean("cart_enabled").notNull().default(true),

  checkoutEnabled: boolean("checkout_enabled").notNull().default(false),

  paymentEnabled: boolean("payment_enabled").notNull().default(false),

  inventoryEnabled: boolean("inventory_enabled").notNull().default(true),

  pickupEnabled: boolean("pickup_enabled").notNull().default(false),

  deliveryEnabled: boolean("delivery_enabled").notNull().default(false),

  whatsappEnabled: boolean("whatsapp_enabled").notNull().default(true),

  whatsappNumber: varchar("whatsapp_number", {
    length: 40,
  }),

  currency: varchar("currency", {
    length: 10,
  })
    .notNull()
    .default("BRL"),

  minimumOrderValue: numeric("minimum_order_value", {
    precision: 12,
    scale: 2,
  }),

  defaultStockMinimum: integer("default_stock_minimum").notNull().default(2),

  allowSaleWithoutStockControl: boolean("allow_sale_without_stock_control")
    .notNull()
    .default(false),

  requireCustomerIdentification: boolean("require_customer_identification").notNull().default(true),

  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
});

export type StoreSettingsRow = typeof storeSettingsTable.$inferSelect;

export type NewStoreSettingsRow = typeof storeSettingsTable.$inferInsert;
