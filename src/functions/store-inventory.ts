import { createServerFn } from "@tanstack/react-start";

export const listStoreInventory = createServerFn({
  method: "GET",
}).handler(async () => {
  const { requireAdminPermission } =
    await import(
      "../services/auth/admin-effective-permissions.server"
    );

  await requireAdminPermission("INVENTORY", "VIEW");

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
      const { requireAdminPermission } =
        await import(
          "../services/auth/admin-effective-permissions.server"
        );

      await requireAdminPermission("INVENTORY", "VIEW");

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
      const { requireAdminPermission } =
        await import(
          "../services/auth/admin-effective-permissions.server"
        );

      await requireAdminPermission("INVENTORY", "VIEW");

      const { inventoryService } =
        await import(
          "../services/store/inventory-service.server"
        );

      return inventoryService.getAvailability(
        data,
      );
    });

export const updateStoreInventoryQuantity =
  createServerFn({
    method: "POST",
  })
    .validator(
      (input: {
        productId: string;
        quantityAvailable: number;
      }) => {
        const productId =
          input.productId.trim();

        if (!productId) {
          throw new Error(
            "ID do produto é obrigatório.",
          );
        }

        if (
          !Number.isInteger(
            input.quantityAvailable,
          ) ||
          input.quantityAvailable < 0
        ) {
          throw new Error(
            "A quantidade disponível deve ser um número inteiro maior ou igual a zero.",
          );
        }

        return {
          productId,
          quantityAvailable:
            input.quantityAvailable,
        };
      },
    )
    .handler(async ({ data }) => {
      const { requireAdminPermission } =
        await import(
          "../services/auth/admin-effective-permissions.server"
        );

      await requireAdminPermission("INVENTORY", "UPDATE");

      const {
        inventoryService,
      } = await import(
        "../services/store/inventory-service.server"
      );

      return inventoryService.setQuantity(
        data.productId,
        data.quantityAvailable,
      );
    });
