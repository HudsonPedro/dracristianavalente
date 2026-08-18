import { DrizzleInventoryRepository } from "../../repositories/store/drizzle-inventory-repository.server";
import { InventoryService } from "./inventory-service";

const inventoryRepository =
  new DrizzleInventoryRepository();

export const inventoryService =
  new InventoryService(
    inventoryRepository,
  );
