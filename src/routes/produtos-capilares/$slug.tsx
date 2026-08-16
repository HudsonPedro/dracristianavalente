import { createFileRoute, notFound } from "@tanstack/react-router";

import { ProductDetailPage } from "../../components/ui/product-detail-page";
import { products } from "../../data/products";

export const Route = createFileRoute("/produtos-capilares/$slug")({
  component: ProdutoCapilarPage,
});

function ProdutoCapilarPage() {
  const { slug } = Route.useParams();

  const product = products.find(
    (item) => item.slug === slug && item.status === "ACTIVE"
  );

  if (!product) {
    throw notFound();
  }

  return (
    <ProductDetailPage
      eyebrow={product.line ?? product.brand}
      name={product.name}
      shortDescription={product.shortDescription}
      images={product.images}
      indication={product.indication}
      characteristics={product.characteristics}
      composition={product.composition}
      howToUse={product.howToUse}
      safety={product.safety}
      professionalNotes={product.professionalNotes}
      availabilityLabel={product.availabilityLabel}
      acquisitionLabel={product.acquisitionLabel}
    />
  );
}
