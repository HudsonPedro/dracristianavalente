import { createServerFn } from "@tanstack/react-start";

export const listStoreInventory = createServerFn({
  method: "GET",
}).handler(async () => {
  const { inventoryService } =
    await import(
      "../services/store/inventory-service.server"
    );

  return inventoryService.list();
});

export const getStoreInventoryByProductId =
  createServerFn({
    method: "GET",
  })
    .validator((productId: string) => {
      const value = productId.trim();

      if (!value) {
        throw new Error(
          "ID do produto é obrigatório.",
        );
      }

      return value;
    })
    .handler(async ({ data }) => {
      const { inventoryService } =
        await import(
          "../services/store/inventory-service.server"
        );

      return inventoryService.getByProductId(
        data,
      );
    });

export const getStoreInventoryAvailability =
  createServerFn({
    method: "GET",
  })
    .validator((productId: string) => {
      const value = productId.trim();

      if (!value) {
        throw new Error(
          "ID do produto é obrigatório.",
        );
      }

      return value;
    })
    .handler(async ({ data }) => {
      const { inventoryService } =
        await import(
          "../services/store/inventory-service.server"
        );

      return inventoryService.getAvailability(
        data,
      );
    });
