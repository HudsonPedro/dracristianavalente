import { useState } from "react";

import {
  canProductBeAddedToCart,
  useCart,
} from "../../contexts/cart-context";
import type {
  PublicProduct,
  PublicProductImage,
} from "../../domain/store/public-product";
import type { Product } from "../../types/product";

type ProductCardProps =
  | {
      mode: "public";
      product: PublicProduct;
    }
  | {
      mode?: "legacy";
      product: Product;
    };

type ProductCardContentProps = ProductCardProps & {
  canAddToCart?: boolean;
  cartFeedback?: string | null;
  onAddToCart?: () => void;
};

function selectPublicImage(
  images: PublicProductImage[],
): PublicProductImage | undefined {
  const byPosition = [...images].sort(
    (left, right) => left.position - right.position,
  );

  return byPosition.find((image) => image.main) ?? byPosition[0];
}

export function ProductCard(props: ProductCardProps) {
  if (props.mode === "public") {
    return <PublicProductCard product={props.product} />;
  }

  return <LegacyProductCard product={props.product} />;
}

function PublicProductCard({ product }: { product: PublicProduct }) {
  const { addItem } = useCart();

  const [cartFeedback, setCartFeedback] = useState<string | null>(
    null,
  );

  const cartEligibility =
    canProductBeAddedToCart(product);

  const canAddToCart =
    cartEligibility.success;

  const handleAddToCart = () => {
    setCartFeedback(null);

    const result = addItem(product);

    if (!result.success) {
      setCartFeedback(result.reason);
      return;
    }

    setCartFeedback("Produto adicionado ao carrinho.");
  };

  return (
    <ProductCardContent
      mode="public"
      product={product}
      canAddToCart={canAddToCart}
      cartFeedback={cartFeedback}
      onAddToCart={handleAddToCart}
    />
  );
}

function LegacyProductCard({ product }: { product: Product }) {
  return <ProductCardContent mode="legacy" product={product} />;
}

function ProductCardContent(props: ProductCardContentProps) {
  const { product } = props;
  const isPublic = props.mode === "public";
  const productHref = `/produtos-capilares/${product.slug}`;
  const publicImage = isPublic
    ? selectPublicImage(props.product.images)
    : undefined;
  const mainImage = isPublic
    ? publicImage
      ? {
          url: publicImage.url,
          alt: publicImage.alt || product.name,
        }
      : undefined
    : props.product.images[0]
      ? {
          url: props.product.images[0],
          alt: product.name,
        }
      : undefined;
  const canAddToCart = props.canAddToCart === true;
  const cartFeedback = props.cartFeedback;

  const formatPrice = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  const getPriceContent = () => {
    switch (product.priceVisibility) {
      case "SHOW_PRICE":
        if (typeof product.price !== "number") {
          return null;
        }

        return (
          <div className="mt-6">
            {typeof product.promotionalPrice === "number" && (
              <div className="text-sm text-[color:var(--muted)] line-through">
                {formatPrice(product.price)}
              </div>
            )}

            <div className="serif mt-1 text-2xl">
              {formatPrice(
                product.promotionalPrice ?? product.price,
              )}
            </div>
          </div>
        );

      case "CONTACT_FOR_PRICE":
        return (
          <div className="mt-6 rounded-[14px] border border-[color:var(--line)] bg-white/60 px-4 py-3">
            <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[color:var(--rose2)]">
              Aquisição
            </div>

            <p className="mt-1 text-sm font-semibold">
              Consulte disponibilidade
            </p>
          </div>
        );

      case "REQUIRES_EVALUATION":
        return (
          <div className="mt-6 rounded-[14px] border border-[color:var(--line)] bg-white/60 px-4 py-3">
            <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[color:var(--rose2)]">
              Aquisição
            </div>

            <p className="mt-1 text-sm font-semibold">
              Produto mediante indicação profissional
            </p>
          </div>
        );

      case "REQUIRES_PROTOCOL":
        return (
          <div className="mt-6 rounded-[14px] border border-[color:var(--line)] bg-white/60 px-4 py-3">
            <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[color:var(--rose2)]">
              Aquisição
            </div>

            <p className="mt-1 text-sm font-semibold">
              Disponível conforme protocolo
            </p>
          </div>
        );

      case "HIDE_PRICE":
      default:
        return null;
    }
  };

  const getAvailabilityLabel = () => {
    switch (product.availability) {
      case "AVAILABLE":
        return "Disponível";

      case "UNAVAILABLE":
        return "Temporariamente indisponível";

      case "UNDER_CONSULTATION":
      default:
        return "Sob consulta";
    }
  };

  return (
    <article className="card group flex h-full flex-col overflow-hidden">
      {/* =====================================================
          IMAGEM DO PRODUTO
          ===================================================== */}
      <a
        href={productHref}
        className="relative block aspect-[4/4.6] overflow-hidden bg-[#f1ece5]"
        aria-label={`Conhecer ${product.name}`}
      >
        {mainImage ? (
          <img
            src={mainImage.url}
            alt={mainImage.alt}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full items-center justify-center p-8 text-center">
            <div>
              <div className="serif rosetext text-3xl">
                DNA VITAL
              </div>

              {product.line && (
                <div className="mt-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--muted)]">
                  {product.line}
                </div>
              )}

              <div className="mx-auto mt-6 h-px w-16 bg-[color:var(--line)]" />

              <div className="mt-5 text-[9px] font-semibold uppercase tracking-[0.16em] text-[color:var(--muted)]">
                Imagem oficial em preparação
              </div>
            </div>
          </div>
        )}

        {product.badge && (
          <div className="absolute left-4 top-4 rounded-full border border-white/50 bg-white/90 px-3 py-2 text-[9px] font-bold uppercase tracking-[0.14em] backdrop-blur-md">
            {product.badge}
          </div>
        )}
      </a>

      {/* =====================================================
          INFORMAÇÕES PRINCIPAIS
          ===================================================== */}
      <div className="flex flex-1 flex-col p-6 md:p-7">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--rose2)]">
            {product.brand}
          </span>

          {product.line && (
            <>
              <span className="text-[color:var(--muted)]">
                •
              </span>

              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[color:var(--muted)]">
                {product.line}
              </span>
            </>
          )}
        </div>

        <a
          href={productHref}
          className="group/title"
        >
          <h3 className="serif mt-3 text-2xl leading-tight transition-colors group-hover/title:text-[color:var(--rose2)] md:text-[28px]">
            {product.name}
          </h3>
        </a>

        <div className="mt-4 flex flex-wrap gap-2">
          {product.professionalProduct && (
            <span className="rounded-full border border-[color:var(--line)] px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.13em] text-[color:var(--muted)]">
              Uso profissional
            </span>
          )}

          {product.homeCare && (
            <span className="rounded-full border border-[color:var(--line)] px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.13em] text-[color:var(--muted)]">
              Home Care
            </span>
          )}

          {product.requiresEvaluation && (
            <span className="rounded-full border border-[color:var(--line)] px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.13em] text-[color:var(--muted)]">
              Avaliação profissional
            </span>
          )}
        </div>

        <p className="mt-5 text-sm leading-6 text-[color:var(--muted)]">
          {product.shortDescription}
        </p>

        {product.description && (
          <p className="mt-4 text-sm leading-6 text-[color:var(--ink)]/75">
            {product.description}
          </p>
        )}

        {/* =====================================================
            COMPONENTES DA LINHA
            ===================================================== */}
        {product.components &&
          product.components.length > 0 && (
            <div className="mt-7">
              <div className="hair mb-6" />

              <div className="mb-4 text-[10px] font-bold uppercase tracking-[0.18em] text-[color:var(--rose2)]">
                Componentes da linha
              </div>

              <div className="space-y-3">
                {product.components.map((component) => (
                  <div
                    key={component.id}
                    className="rounded-[14px] border border-[color:var(--line)] bg-white/55 p-4"
                  >
                    <h4 className="serif text-lg">
                      {component.name}
                    </h4>

                    {component.description && (
                      <p className="mt-2 text-xs leading-5 text-[color:var(--muted)]">
                        {component.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* =====================================================
            ATIVOS PRINCIPAIS
            ===================================================== */}
        {isPublic && props.product.ingredients.length > 0 && (
          <div className="mt-7">
            <div className="hair mb-6" />

            <div className="mb-4 text-[10px] font-bold uppercase tracking-[0.18em] text-[color:var(--rose2)]">
              Ativos principais
            </div>

            <div className="space-y-4">
              {props.product.ingredients.map((ingredient, index) => (
                <div
                  key={ingredient.id}
                  className="grid grid-cols-[28px_1fr] gap-3"
                >
                  <div className="serif rosetext text-lg">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold">
                      {ingredient.name}
                    </h4>

                    {ingredient.description && (
                      <p className="mt-1 text-xs leading-5 text-[color:var(--muted)]">
                        {ingredient.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!isPublic &&
          props.product.activeIngredients &&
          props.product.activeIngredients.length > 0 && (
            <div className="mt-7">
              <div className="hair mb-6" />

              <div className="mb-4 text-[10px] font-bold uppercase tracking-[0.18em] text-[color:var(--rose2)]">
                Ativos principais
              </div>

              <div className="space-y-4">
                {props.product.activeIngredients.map(
                  (activeIngredient, index) => (
                    <div
                      key={`${product.id}-active-${index}`}
                      className="grid grid-cols-[28px_1fr] gap-3"
                    >
                      <div className="serif rosetext text-lg">
                        {String(index + 1).padStart(2, "0")}
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold">
                          {activeIngredient.name}
                        </h4>

                        {activeIngredient.description && (
                          <p className="mt-1 text-xs leading-5 text-[color:var(--muted)]">
                            {activeIngredient.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>
          )}

        {/* =====================================================
            CARACTERÍSTICAS / BENEFÍCIOS
            ===================================================== */}
        {isPublic && props.product.benefits.length > 0 && (
          <div className="mt-7">
            <div className="hair mb-6" />

            <div className="mb-4 text-[10px] font-bold uppercase tracking-[0.18em] text-[color:var(--rose2)]">
              Características
            </div>

            <div className="grid gap-3">
              {props.product.benefits.map((benefit) => (
                <div
                  key={benefit.id}
                  className="rounded-[14px] border border-[color:var(--line)] bg-white/55 p-4"
                >
                  <h4 className="text-sm font-semibold">
                    {benefit.title}
                  </h4>

                  {benefit.description && (
                    <p className="mt-2 text-xs leading-5 text-[color:var(--muted)]">
                      {benefit.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {!isPublic &&
          props.product.benefits &&
          props.product.benefits.length > 0 && (
            <div className="mt-7">
              <div className="hair mb-6" />

              <div className="mb-4 text-[10px] font-bold uppercase tracking-[0.18em] text-[color:var(--rose2)]">
                Características
              </div>

              <div className="grid gap-3">
                {props.product.benefits.map((benefit, index) => (
                  <div
                    key={`${product.id}-benefit-${index}`}
                    className="rounded-[14px] border border-[color:var(--line)] bg-white/55 p-4"
                  >
                    <h4 className="text-sm font-semibold">
                      {benefit.title}
                    </h4>

                    {benefit.description && (
                      <p className="mt-2 text-xs leading-5 text-[color:var(--muted)]">
                        {benefit.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* =====================================================
            MODO DE USO
            ===================================================== */}
        {product.usageInstructions && (
          <div className="mt-7">
            <div className="hair mb-6" />

            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[color:var(--rose2)]">
              Orientação de uso
            </div>

            <p className="mt-3 text-xs leading-5 text-[color:var(--muted)]">
              {product.usageInstructions}
            </p>
          </div>
        )}

        {/* =====================================================
            PREÇO / REGRA DE AQUISIÇÃO
            ===================================================== */}
        <div className="mt-auto pt-2">
          {getPriceContent()}

          <div className="hair my-5" />

          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-[9px] font-bold uppercase tracking-[0.15em] text-[color:var(--muted)]">
                Disponibilidade
              </div>

              <div className="mt-1 text-xs font-semibold">
                {getAvailabilityLabel()}
              </div>
            </div>

            <div
              className={[
                "h-2.5 w-2.5 rounded-full",
                product.availability === "AVAILABLE"
                  ? "bg-emerald-500"
                  : product.availability === "UNAVAILABLE"
                    ? "bg-red-400"
                    : "bg-amber-400",
              ].join(" ")}
              aria-hidden="true"
            />
          </div>

          {/* ===================================================
              CTA
              =================================================== */}
          {canAddToCart ? (
            <button
              type="button"
              onClick={props.onAddToCart}
              className="btn btn-wa mt-6 w-full"
            >
              Adicionar ao carrinho →
            </button>
          ) : (
            <a
              href={productHref}
              className="btn btn-wa mt-6 w-full"
            >
              Conhecer produto →
            </a>
          )}

          {/* ===================================================
              FEEDBACK DO CARRINHO
              =================================================== */}
          {cartFeedback && (
            <div className="mt-4 rounded-[14px] border border-[color:var(--line)] bg-white/65 p-4 text-center">
              <p className="text-xs font-semibold text-[color:var(--ink)]">
                {cartFeedback}
              </p>

              {canAddToCart && (
                <a
                  href="/carrinho"
                  className="mt-2 inline-block text-xs font-bold text-[color:var(--rose2)] transition hover:text-[color:var(--ink)]"
                >
                  Ver carrinho →
                </a>
              )}
            </div>
          )}

          {product.officialSource && (
            <p className="mt-4 text-center text-[9px] uppercase tracking-[0.12em] text-[color:var(--muted)]">
              Informações técnicas: DNA VITAL
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
