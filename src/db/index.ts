import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as addressesSchema from "./schema/addresses";
import * as customersSchema from "./schema/customers";
import * as inventorySchema from "./schema/inventory";
import * as orderItemsSchema from "./schema/order-items";
import * as ordersSchema from "./schema/orders";
import * as productsSchema from "./schema/products";
import * as storeSettingsSchema from "./schema/store-settings";

function getDatabaseUrl() {
  const databaseUrl =
    process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL não configurada no ambiente.",
    );
  }

  return databaseUrl;
}

const schema = {
  ...productsSchema,
  ...inventorySchema,
  ...customersSchema,
  ...addressesSchema,
  ...ordersSchema,
  ...orderItemsSchema,
  ...storeSettingsSchema,
};

export function getDb() {
  const sql = neon(
    getDatabaseUrl(),
  );

  return drizzle({
    client: sql,
    schema,
  });
}

export type Database =
  ReturnType<typeof getDb>;
