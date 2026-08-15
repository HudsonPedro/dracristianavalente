import type { Product } from "../../types/product";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const getPriceContent = () => {
    switch (product.priceVisibility) {
      case "SHOW_PRICE":
        if (typeof product.price === "number") {
          return (
            <div className="mt-5">
              {typeof product.promotionalPrice === "number" && (
                <div className="text-sm text-[color:var(--muted)] line-through">
                  R$ {product.price.toFixed(2).replace(".", ",")}
                </div>
              )}

              <div className="serif text-2xl">
                R${" "}
                {(product.promotionalPrice ?? product.price)
                  .toFixed(2)
                  .replace(".", ",")}
              </div>
            </div>
          );
        }

        return null;

      case "CONTACT_FOR_PRICE":
        return (
          <p className="mt-5 text-sm font-semibold">
            Consulte disponibilidade
          </p>
        );

      case "REQUIRES_EVALUATION":
        return (
          <p className="mt-5 text-sm font-semibold">
            Produto mediante indicação profissional
          </p>
        );

      case "REQUIRES_PROTOCOL":
        return (
          <p className="mt-5 text-sm font-semibold">
            Disponível conforme protocolo
          </p>
        );

      case "HIDE_PRICE":
      default:
        return null;
    }
  };

  const getCta = () => {
    if (product.requiresEvaluation) {
      return {
        label: "Agendar avaliação",
        href: "/avaliacao-capilar-curitiba",
      };
    }

    if (product.saleEnabled && product.priceVisibility === "SHOW_PRICE") {
      return {
        label: "Adicionar ao carrinho",
        href: "#",
      };
    }

    const mensagem = encodeURIComponent(
      `Olá, gostaria de saber mais sobre o produto ${product.name}.`
    );

    return {
      label: "Solicitar informações",
      href: `https://wa.me/5541991599558?text=${mensagem}`,
    };
  };

  const cta = getCta();

  return (
    <article className="card group flex h-full flex-col overflow-hidden">
      {/* IMAGEM
          Enquanto não cadastrarmos as imagens oficiais DNA VITAL,
          não exibimos imagem genérica ou inventada. */}
      <div className="relative aspect-[4/4.6] overflow-hidden bg-[#f1ece5]">
        {product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full items-center justify-center p-8 text-center">
            <div>
              <div className="serif rosetext text-2xl">
                DNA VITAL
              </div>

              <div className="mt-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--muted)]">
                Imagem oficial em preparação
              </div>
            </div>
          </div>
        )}

        {product.badge && (
          <div className="absolute left-4 top-4 rounded-full border border-white/40 bg-white/85 px-3 py-2 text-[9px] font-bold uppercase tracking-[0.14em] backdrop-blur-md">
            {product.badge}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--rose2)]">
          {product.brand}
        </div>

        <h3 className="serif mt-3 text-2xl leading-tight">
          {product.name}
        </h3>

        <p className="mt-4 flex-1 text-sm leading-6 text-[color:var(--muted)]">
          {product.shortDescription}
        </p>

        {getPriceContent()}

        <div className="hair my-5" />

        <div className="flex items-center justify-between gap-4">
          <span className="text-xs text-[color:var(--muted)]">
            {product.availability === "AVAILABLE" &&
              "Disponível"}

            {product.availability === "UNDER_CONSULTATION" &&
              "Sob consulta"}

            {product.availability === "UNAVAILABLE" &&
              "Temporariamente indisponível"}
          </span>
        </div>

        <a
          href={cta.href}
          target={
            cta.href.startsWith("https://wa.me/")
              ? "_blank"
              : undefined
          }
          rel={
            cta.href.startsWith("https://wa.me/")
              ? "noopener noreferrer"
              : undefined
          }
          className="btn btn-rose mt-6 w-full"
        >
          {cta.label}
        </a>
      </div>
    </article>
  );
}
