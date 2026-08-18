import type { Inventory } from "../../domain/store/inventory";

export interface InventoryRepository {
  findByProductId(productId: string): Promise<Inventory | null>;

  list(): Promise<Inventory[]>;

  save(inventory: Inventory): Promise<Inventory>;

  updateQuantity(productId: string, quantityAvailable: number): Promise<Inventory>;

  reserve(productId: string, quantity: number): Promise<Inventory>;

  release(productId: string, quantity: number): Promise<Inventory>;

  commitReservedStock(productId: string, quantity: number): Promise<Inventory>;
}
