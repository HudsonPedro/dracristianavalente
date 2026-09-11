import {
  createFileRoute,
  notFound,
  useRouter,
} from "@tanstack/react-router";

import { ProductDetailPage } from "../../components/ui/product-detail-page";
import { getPublicStoreProductBySlug } from "../../functions/public-store-products";

const SITE_URL = "https://www.dracristianavalente.com.br";

export const Route = createFileRoute(
  "/produtos-capilares/$slug",
)({
  loader: async ({ params }) => {
    const product = await getPublicStoreProductBySlug({
      data: params.slug,
    });

    if (!product) {
      throw notFound();
    }

    return product;
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {};
    }

    const title =
      loaderData.seo?.title ??
      `${loaderData.name} | Dra. Cristiana Valente`;
    const description =
      loaderData.seo?.description ?? loaderData.shortDescription;
    const canonical =
      loaderData.seo?.canonicalUrl ??
      `${SITE_URL}/produtos-capilares/${loaderData.slug}`;

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        { property: "og:url", content: canonical },
        ...(loaderData.seo?.noIndex
          ? [{ name: "robots", content: "noindex,nofollow" }]
          : []),
      ],
      links: [{ rel: "canonical", href: canonical }],
    };
  },
  pendingComponent: ProdutoCapilarPending,
  errorComponent: ProdutoCapilarError,
  component: ProdutoCapilarPage,
});

function ProdutoCapilarPage() {
  const product = Route.useLoaderData();

  const characteristics = [
    ...product.benefits.map((benefit) =>
      benefit.description
        ? `${benefit.title}: ${benefit.description}`
        : benefit.title,
    ),
    ...product.components.map((component) =>
      component.description
        ? `${component.name}: ${component.description}`
        : component.name,
    ),
  ];

  const composition = product.ingredients.map((ingredient) =>
    ingredient.description
      ? `${ingredient.name}: ${ingredient.description}`
      : ingredient.name,
  );

  const requiresProfessionalGuidance =
    product.requiresEvaluation || product.requiresProtocol;

  const availabilityLabel =
    product.availability === "AVAILABLE"
      ? "Disponível"
      : product.availability === "UNAVAILABLE"
        ? "Temporariamente indisponível"
        : "Disponibilidade sob consulta";

  const acquisitionLabel =
    product.saleEnabled &&
    product.priceVisibility === "SHOW_PRICE" &&
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

  const whatsappMessage = encodeURIComponent(
    `Olá, gostaria de receber informações sobre o produto ${product.name} da DNA VITAL.`,
  );
  const whatsappHref =
    `https://wa.me/5541991599558?text=${whatsappMessage}`;
  const eyebrow = [product.brand, product.badge]
    .filter(Boolean)
    .join(" · ");

  return (
    <ProductDetailPage
      product={product}
      eyebrow={eyebrow}
      name={product.name}
      shortDescription={product.shortDescription}
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
      availabilityLabel={availabilityLabel}
      acquisitionLabel={acquisitionLabel}
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

function ProdutoCapilarPending() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center px-6 py-20">
      <p
        aria-live="polite"
        className="text-sm text-[color:var(--muted)]"
      >
        Carregando produto...
      </p>
    </main>
  );
}

function ProdutoCapilarError({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const router = useRouter();

  const handleRetry = () => {
    router.invalidate();
    reset();
  };

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-6 py-20">
      <div className="card max-w-xl p-8 text-center md:p-10">
        <h1 className="display text-3xl md:text-4xl">
          Produto temporariamente indisponível
        </h1>

        <p className="mt-4 text-sm leading-6 text-[color:var(--muted)]">
          Não foi possível carregar este produto agora. Tente novamente em
          alguns instantes.
        </p>

        <button
          type="button"
          onClick={handleRetry}
          className="btn btn-wa mt-8"
        >
          Tentar novamente
        </button>
      </div>
    </main>
  );
}
