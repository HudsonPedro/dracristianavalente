export type InventoryStatus =
  | "IN_STOCK"
  | "LOW_STOCK"
  | "OUT_OF_STOCK"
  | "NOT_CONTROLLED";

export type Inventory = {
  id: string;

  productId: string;

  stockEnabled: boolean;

  quantityAvailable: number;
  quantityReserved: number;

  minimumStock: number;

  allowBackorder: boolean;

  updatedAt?: string;
};

export type InventoryAvailability = {
  productId: string;

  stockEnabled: boolean;

  quantityAvailable: number;
  quantityReserved: number;

  quantityForSale: number;

  status: InventoryStatus;
};

export function getQuantityForSale(
  inventory: Inventory,
): number {
  if (!inventory.stockEnabled) {
    return Number.POSITIVE_INFINITY;
  }

  return Math.max(
    0,
    inventory.quantityAvailable -
      inventory.quantityReserved,
  );
}

export function getInventoryStatus(
  inventory: Inventory,
): InventoryStatus {
  if (!inventory.stockEnabled) {
    return "NOT_CONTROLLED";
  }

  const quantityForSale =
    getQuantityForSale(inventory);

  if (quantityForSale <= 0) {
    return "OUT_OF_STOCK";
  }

  if (
    quantityForSale <=
    inventory.minimumStock
  ) {
    return "LOW_STOCK";
  }

  return "IN_STOCK";
}

export function canFulfillQuantity(
  inventory: Inventory,
  quantity: number,
): boolean {
  if (quantity <= 0) {
    return false;
  }

  if (!inventory.stockEnabled) {
    return true;
  }

  if (inventory.allowBackorder) {
    return true;
  }

  return (
    getQuantityForSale(inventory) >=
    quantity
  );
}
