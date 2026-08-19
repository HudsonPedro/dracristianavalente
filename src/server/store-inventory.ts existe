import { createServerFn } from "@tanstack/react-start";

import { inventoryService } from "../services/store/inventory-service.server";

export const listStoreInventory = createServerFn({
  method: "GET",
}).handler(async () => {
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
      return inventoryService.setQuantity(
        data.productId,
        data.quantityAvailable,
      );
    });
