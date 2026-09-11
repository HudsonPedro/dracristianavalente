import { createServerFn } from "@tanstack/react-start";

export const listPublicStoreProducts = createServerFn({
  method: "GET",
}).handler(async () => {
  const { publicProductCatalogService } = await import(
    "../services/store/public-product-catalog.server"
  );

  return publicProductCatalogService.listPublicProducts();
});

export const getPublicStoreProductBySlug = createServerFn({
  method: "GET",
})
  .validator((slug: string) => {
    const value = slug.trim();

    if (!value) {
      throw new Error("Slug do produto é obrigatório.");
    }

    return value;
  })
  .handler(async ({ data }) => {
    const { publicProductCatalogService } = await import(
      "../services/store/public-product-catalog.server"
    );

    return publicProductCatalogService.getPublicProductBySlug(data);
  });

export const getPublicStoreProductsByIds = createServerFn({
  method: "GET",
})
  .validator((productIds: string[]) => {
    if (!Array.isArray(productIds)) {
      throw new Error("A lista de produtos é inválida.");
    }

    return productIds.map((productId) => {
      if (typeof productId !== "string" || !productId.trim()) {
        throw new Error("ID de produto inválido.");
      }

      return productId.trim();
    });
  })
  .handler(async ({ data }) => {
    const { publicProductCatalogService } = await import(
      "../services/store/public-product-catalog.server"
    );

    return publicProductCatalogService.getByIds(data);
  });
