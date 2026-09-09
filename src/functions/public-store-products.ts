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
