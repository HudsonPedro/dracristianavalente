import {
  integer,
  numeric,
  pgTable,
  varchar,
} from "drizzle-orm/pg-core";

import { ordersTable } from "./orders";
import { productsTable } from "./products";

export const orderItemsTable =
  pgTable("store_order_items", {
    id: varchar("id", {
      length: 120,
    }).primaryKey(),

    orderId: varchar(
      "order_id",
      {
        length: 120,
      },
    )
      .notNull()
      .references(
        () => ordersTable.id,
        {
          onDelete: "cascade",
        },
      ),

    productId: varchar(
      "product_id",
      {
        length: 120,
      },
    ).references(
      () => productsTable.id,
      {
        onDelete: "set null",
      },
    ),

    productName: varchar(
      "product_name",
      {
        length: 255,
      },
    ).notNull(),

    quantity: integer(
      "quantity",
    ).notNull(),

    unitPrice: numeric(
      "unit_price",
      {
        precision: 12,
        scale: 2,
      },
    ).notNull(),

    total: numeric("total", {
      precision: 12,
      scale: 2,
    }).notNull(),
  });

export type OrderItemRow =
  typeof orderItemsTable.$inferSelect;

export type NewOrderItemRow =
  typeof orderItemsTable.$inferInsert;
