import type { Inventory } from "../../domain/store/inventory";

import { inventoryService } from "./inventory-service.server";
import { productService } from "./product-service.server";

export type StoreInventorySeedResult = {
  totalProducts: number;
  created: number;
  unchanged: number;
};

function createInitialInventory(
  productId: string,
): Inventory {
  return {
    id: `inventory-${productId}`,

    productId,

    stockEnabled: true,

    quantityAvailable: 0,

    quantityReserved: 0,

    minimumStock: 0,

    allowBackorder: false,
  };
}

export async function seedStoreInventory(): Promise<StoreInventorySeedResult> {
  const products =
    await productService.list();

  const result: StoreInventorySeedResult = {
    totalProducts: products.length,
    created: 0,
    unchanged: 0,
  };

  for (const product of products) {
    const current =
      await inventoryService.getByProductId(
        product.id,
      );

    if (current) {
      result.unchanged += 1;

      continue;
    }

    await inventoryService.createOrUpdate(
      createInitialInventory(
        product.id,
      ),
    );

    result.created += 1;
  }

  return result;
}
