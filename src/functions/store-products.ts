/*atualizção*/
import { createServerFn } from "@tanstack/react-start";

import type { ProductListFilters } from "../repositories/store/product-repository";

export const listStoreProducts = createServerFn({
  method: "GET",
})
  .validator(
    (input: ProductListFilters | undefined) =>
      input ?? {},
  )
  .handler(async ({ data }) => {
    const { requireAdminPermission } =
      await import(
        "../services/auth/admin-effective-permissions.server"
      );

    await requireAdminPermission(
      "CATALOG",
      "VIEW",
    );

    const { productService } =
      await import(
        "../services/store/product-service.server"
      );

    return productService.list(data);
  });

export const getStoreProductById = createServerFn({
  method: "GET",
})
  .validator((id: string) => {
    const value = id.trim();

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

    await requireAdminPermission(
      "CATALOG",
      "VIEW",
    );

    const { productService } =
      await import(
        "../services/store/product-service.server"
      );

    return productService.getById(data);
  });

export const getStoreProductBySlug = createServerFn({
  method: "GET",
})
  .validator((slug: string) => {
    const value = slug.trim();

    if (!value) {
      throw new Error(
        "Slug do produto é obrigatório.",
      );
    }

    return value;
  })
  .handler(async ({ data }) => {
    const { requireAdminPermission } =
      await import(
        "../services/auth/admin-effective-permissions.server"
      );

    await requireAdminPermission(
      "CATALOG",
      "VIEW",
    );

    const { productService } =
      await import(
        "../services/store/product-service.server"
      );

    return productService.getBySlug(data);
  });
