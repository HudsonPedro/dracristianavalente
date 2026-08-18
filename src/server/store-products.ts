import { createServerFn } from "@tanstack/react-start";

import type { ProductListFilters } from "../repositories/store/product-repository";
import { productService } from "../services/store/product-service.server";

export const listStoreProducts = createServerFn({
  method: "GET",
})
  .inputValidator(
    (input: ProductListFilters | undefined) =>
      input ?? {},
  )
  .handler(async ({ data }) => {
    return productService.list(data);
  });

export const getStoreProductById = createServerFn({
  method: "GET",
})
  .inputValidator((id: string) => id)
  .handler(async ({ data }) => {
    return productService.getById(data);
  });

export const getStoreProductBySlug = createServerFn({
  method: "GET",
})
  .inputValidator((slug: string) => slug)
  .handler(async ({ data }) => {
    return productService.getBySlug(data);
  });
