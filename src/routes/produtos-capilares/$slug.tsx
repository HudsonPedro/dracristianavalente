import {
  createFileRoute,
  notFound,
} from "@tanstack/react-router";

import { ProductDetailPage } from "../../components/ui/product-detail-page";
import { products } from "../../data/products";

export const Route = createFileRoute(
  "/produtos-capilares/$slug",
)({
  component: ProdutoCapilarPage,
});

function ProdutoCapilarPage() {
  const { slug } = Route.useParams();

  const product = products.find(
    (item) =>
      item.slug === slug &&
      item.status === "ACTIVE",
  );

  if (!product) {
    throw notFound();
  }

  const characteristics = [
    ...(product.benefits?.map(
      (benefit) =>
        `${benefit.title}: ${benefit.description}`,
    ) ?? []),

    ...(product.components?.map(
      (component) =>
        component.description
          ? `${component.name}: ${component.description}`
          : component.name,
    ) ?? []),
  ];

  const composition =
    product.activeIngredients?.map(
      (ingredient) =>
        `${ingredient.name}: ${ingredient.description}`,
    ) ?? [];

  const requiresProfessionalGuidance =
    product.requiresEvaluation ||
    product.requiresProtocol;

  const availabilityLabel =
    product.availability === "AVAILABLE"
      ? "Disponível"
      : product.availability ===
          "UNAVAILABLE"
        ? "Temporariamente indisponível"
        : "Disponibilidade sob consulta";

  const acquisitionLabel =
    product.saleEnabled &&
    product.priceVisibility ===
      "SHOW_PRICE" &&
    !product.requiresEvaluation &&
    !product.requiresProtocol
      ? "Compra online"
      : product.requiresProtocol
        ? "Aquisição vinculada ao protocolo"
        : product.requiresEvaluation
          ? "Requer avaliação"
          : product.homeCare
            ? "Home Care"
            : "Consulte condições";

  const whatsappMessage =
    encodeURIComponent(
      `Olá, gostaria de receber informações sobre o produto ${product.name} da DNA VITAL.`,
    );

  const whatsappHref =
    `https://wa.me/5541991599558?text=${whatsappMessage}`;

  return (
    <ProductDetailPage
      product={product}
      eyebrow={`${product.brand} · ${product.badge}`}
      name={product.name}
      shortDescription={
        product.shortDescription
      }
      images={product.images}
      indication={product.description}
      characteristics={characteristics}
      composition={composition}
      professionalNotes={
        requiresProfessionalGuidance
          ? [
              product.requiresEvaluation
                ? "Este produto requer avaliação antes da indicação."
                : "",

              product.requiresProtocol
                ? "A utilização e aquisição deste produto estão vinculadas ao protocolo profissional indicado."
                : "",
            ].filter(Boolean)
          : []
      }
      availabilityLabel={
        availabilityLabel
      }
      acquisitionLabel={
        acquisitionLabel
      }
      primaryHref={whatsappHref}
      primaryLabel={
        product.requiresEvaluation
          ? "Solicitar avaliação"
          : "Consultar produto"
      }
      secondaryHref="/produtos-capilares"
      secondaryLabel="Voltar aos produtos"
    />
  );
}
