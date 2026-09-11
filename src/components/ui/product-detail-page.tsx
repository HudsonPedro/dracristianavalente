import { useState, type ReactNode } from "react";

import {
  canProductBeAddedToCart,
  useCart,
} from "../../contexts/cart-context";
import type {
  PublicProduct,
  PublicProductImage,
} from "../../domain/store/public-product";
import { CSS } from "../../routes/index";
import logo from "../../assets/logo.png";

type ProductDetailPageProps = {
  product: PublicProduct;
  eyebrow: string;
  name: string;
  shortDescription: string;

  images: PublicProductImage[];

  indication?: string;
  characteristics?: string[];
  composition?: string[];
  howToUse?: string[];
  safety?: string[];
  professionalNotes?: string[];

  availabilityLabel?: string;
  acquisitionLabel?: string;

  primaryHref?: string;
  primaryLabel?: string;

  secondaryHref?: string;
  secondaryLabel?: string;

  faq?: Array<{
    question: string;
    answer: string;
  }>;

  relatedProducts?: ReactNode;
};

const WA =
  "https://wa.me/5541991599558?text=Ol%C3%A1%20Dra.%20Cristiana%2C%20gostaria%20de%20receber%20orienta%C3%A7%C3%A3o%20sobre%20um%20produto%20capilar.";

export function ProductDetailPage({
  product,
  eyebrow,
  name,
  shortDescription,

  images,

  indication,
  characteristics = [],
  composition = [],
  howToUse = [],
  safety = [],
  professionalNotes = [],

  availabilityLabel = "Disponibilidade sob consulta",
  acquisitionLabel = "Aquisição conforme orientação",

  primaryHref = WA,
  primaryLabel = "Solicitar informações",

  secondaryHref = "/produtos-capilares",
  secondaryLabel = "Voltar aos produtos",

  faq = [],

  relatedProducts,
}: ProductDetailPageProps) {
  const { addItem } = useCart();
  const [cartFeedback, setCartFeedback] = useState<string | null>(null);
  const cartEligibility = canProductBeAddedToCart(product);
  const canAddToCart = cartEligibility.success;
  const orderedImages = [...images].sort(
    (left, right) =>
      Number(right.main) - Number(left.main) ||
      left.position - right.position ||
      left.id.localeCompare(right.id),
  );
  const mainImage = orderedImages[0];

  const handleAddToCart = () => {
    setCartFeedback(null);
    const result = addItem(product);

    setCartFeedback(
      result.success ? "Produto adicionado ao carrinho." : result.reason,
    );
  };

  const renderPrimaryAction = (
    extraClassName = "",
  ) =>
    canAddToCart ? (
      <button
        type="button"
        onClick={handleAddToCart}
        className={`btn btn-wa ${extraClassName}`}
      >
        Adicionar ao carrinho →
      </button>
    ) : (
      <a
        href={primaryHref}
        target={
          primaryHref.startsWith("http")
            ? "_blank"
            : undefined
        }
        rel={
          primaryHref.startsWith("http")
            ? "noopener noreferrer"
            : undefined
        }
        className={`btn btn-wa ${extraClassName}`}
      >
        {primaryLabel} →
      </a>
    );

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: CSS,
        }}
      />

      <main>
        {/* =====================================================
            HERO DO PRODUTO
            ===================================================== */}
        <header className="container grid gap-12 pb-20 pt-28 md:pb-28 md:pt-40 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <div className="kicker">
              {eyebrow}
            </div>

            <h1 className="display mt-7 text-5xl md:text-7xl">
              {name}
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-[color:var(--muted)] md:text-xl">
              {shortDescription}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <span className="tag">
                {availabilityLabel}
              </span>

              <span className="tag">
                {acquisitionLabel}
              </span>
            </div>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              {renderPrimaryAction()}

              <a
                href={secondaryHref}
                className="btn btn-ghost"
              >
                {secondaryLabel}
              </a>
            </div>

            {cartFeedback && (
              <div className="mt-5 max-w-md rounded-[14px] border border-[color:var(--line)] bg-white/70 p-4">
                <p className="text-sm font-semibold text-[color:var(--ink)]">
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

          </div>

          <div>
            {mainImage ? (
              <div className="frame bg-white">
                <img
                  src={mainImage.url}
                  alt={mainImage.alt || name}
                  className="aspect-[4/5] h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="card flex aspect-[4/5] items-center justify-center p-8 text-center text-[color:var(--muted)]">
                Imagem do produto
              </div>
            )}
          </div>
        </header>

        {/* =====================================================
            GALERIA
            ===================================================== */}
        {orderedImages.length > 1 && (
          <section className="container py-12">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {orderedImages
                .slice(1)
                .map((image, index) => (
                  <div
                    key={image.id}
                    className="frame"
                  >
                    <img
                      src={image.url}
                      alt={
                        image.alt ||
                        `${name} - imagem ${index + 2}`
                      }
                      loading="lazy"
                      className="aspect-square h-full w-full object-cover"
                    />
                  </div>
                ))}
            </div>
          </section>
        )}

        {/* =====================================================
            INDICAÇÃO
            ===================================================== */}
        {indication && (
          <section className="container py-20">
            <div className="mx-auto max-w-4xl">
              <div className="kicker mb-6">
                Indicação de uso
              </div>

              <h2 className="display text-4xl md:text-5xl">
                Para qual cuidado este produto é
                indicado?
              </h2>

              <p className="mt-7 text-lg leading-relaxed text-[color:var(--muted)]">
                {indication}
              </p>
            </div>
          </section>
        )}

        {/* =====================================================
            CARACTERÍSTICAS
            ===================================================== */}
        {characteristics.length > 0 && (
          <section className="container py-20">
            <div className="max-w-3xl">
              <div className="kicker mb-6">
                Características
              </div>

              <h2 className="display text-4xl md:text-5xl">
                Principais características
              </h2>
            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {characteristics.map(
                (item, index) => (
                  <article
                    key={item}
                    className="card protocol p-8"
                  >
                    <span className="serif rosetext text-5xl">
                      {String(
                        index + 1,
                      ).padStart(2, "0")}
                    </span>

                    <p className="mt-4 leading-relaxed text-[color:var(--muted)]">
                      {item}
                    </p>
                  </article>
                ),
              )}
            </div>
          </section>
        )}

        {/* =====================================================
            COMPOSIÇÃO
            ===================================================== */}
        {composition.length > 0 && (
          <section className="container py-20">
            <div className="mx-auto max-w-4xl">
              <div className="card p-8 md:p-10">
                <div className="kicker mb-6">
                  Composição
                </div>

                <h2 className="display text-3xl md:text-4xl">
                  Informações de composição
                </h2>

                <div className="mt-7 grid gap-3 text-[color:var(--muted)]">
                  {composition.map((item) => (
                    <div
                      key={item}
                      className="border-b border-[color:var(--line)] pb-3"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* =====================================================
            MODO DE UTILIZAÇÃO
            ===================================================== */}
        {howToUse.length > 0 && (
          <section className="container py-20">
            <div className="max-w-3xl">
              <div className="kicker mb-6">
                Modo de utilização
              </div>

              <h2 className="display text-4xl md:text-5xl">
                Como utilizar
              </h2>
            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {howToUse.map(
                (item, index) => (
                  <article
                    key={item}
                    className="card protocol p-8"
                  >
                    <span className="serif rosetext text-5xl">
                      {String(
                        index + 1,
                      ).padStart(2, "0")}
                    </span>

                    <p className="mt-4 leading-relaxed text-[color:var(--muted)]">
                      {item}
                    </p>
                  </article>
                ),
              )}
            </div>
          </section>
        )}

        {/* =====================================================
            SEGURANÇA
            ===================================================== */}
        {safety.length > 0 && (
          <section className="container py-20">
            <div className="mx-auto max-w-4xl">
              <div className="card p-8 md:p-10">
                <div className="kicker mb-6">
                  Segurança
                </div>

                <h2 className="display text-3xl md:text-4xl">
                  Informações importantes
                </h2>

                <ul className="mt-7 grid gap-4 text-[color:var(--muted)]">
                  {safety.map((item) => (
                    <li
                      key={item}
                      className="border-b border-[color:var(--line)] pb-4 leading-relaxed"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}

        {/* =====================================================
            OBSERVAÇÕES PROFISSIONAIS
            ===================================================== */}
        {professionalNotes.length > 0 && (
          <section className="container py-20">
            <div className="mx-auto max-w-4xl">
              <div className="kicker mb-6">
                Orientação profissional
              </div>

              <h2 className="display text-4xl md:text-5xl">
                Observações sobre este produto
              </h2>

              <div className="mt-10 grid gap-5">
                {professionalNotes.map(
                  (item) => (
                    <div
                      key={item}
                      className="card p-8"
                    >
                      <p className="leading-relaxed text-[color:var(--muted)]">
                        {item}
                      </p>
                    </div>
                  ),
                )}
              </div>
            </div>
          </section>
        )}

        {/* =====================================================
            FAQ
            ===================================================== */}
        {faq.length > 0 && (
          <section
            id="faq"
            className="container py-20"
          >
            <div className="mx-auto max-w-4xl">
              <div className="kicker mb-6">
                Dúvidas frequentes
              </div>

              <h2 className="display text-4xl md:text-5xl">
                Perguntas sobre {name}
              </h2>

              <div className="mt-10">
                {faq.map((item) => (
                  <details
                    key={item.question}
                    className="faq"
                  >
                    <summary>
                      {item.question}

                      <span className="pl">
                        +
                      </span>
                    </summary>

                    <p className="pb-5 leading-relaxed text-[color:var(--muted)]">
                      {item.answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* =====================================================
            PRODUTOS RELACIONADOS
            ===================================================== */}
        {relatedProducts && (
          <section className="container py-20">
            <div className="kicker mb-6">
              Produtos relacionados
            </div>

            <h2 className="display text-4xl md:text-5xl">
              Continue explorando
            </h2>

            <div className="mt-12">
              {relatedProducts}
            </div>
          </section>
        )}

        {/* =====================================================
            CTA FINAL
            ===================================================== */}
        <section className="container py-20">
          <div
            className="card mx-auto max-w-4xl p-8 text-center md:p-12"
            style={{
              background:
                "linear-gradient(180deg,#fff,#faf5ee)",
            }}
          >
            <div className="kicker mb-6 mx-auto">
              Orientação personalizada
            </div>

            <h2 className="display text-4xl md:text-5xl">
              Tem dúvida se este produto é indicado para você?
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[color:var(--muted)]">
              Fale com a equipe da Dra. Cristiana Valente ou agende uma
              avaliação capilar para receber uma orientação individualizada.
            </p>

            {renderPrimaryAction("mt-8")}

            {cartFeedback && canAddToCart && (
              <div className="mx-auto mt-5 max-w-md rounded-[14px] border border-[color:var(--line)] bg-white p-4">
                <p className="text-sm font-semibold">{cartFeedback}</p>

                <a
                  href="/carrinho"
                  className="mt-2 inline-block text-xs font-bold text-[color:var(--rose2)] transition hover:text-[color:var(--ink)]"
                >
                  Ver carrinho →
                </a>
              </div>
            )}

          </div>
        </section>

        {/* =====================================================
            FOOTER
            ===================================================== */}
        <footer
          className="border-t border-[color:var(--line)]"
          style={{
            background: "#fff",
          }}
        >
          <div className="container grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3">
                <img
                  src={logo}
                  alt="Dra. Cristiana Valente Estética"
                  className="mark"
                />

                <span className="serif text-lg">
                  Dra. Cristiana Valente
                </span>
              </div>

              <p className="mt-4 max-w-sm text-sm leading-relaxed text-[color:var(--muted)]">
                Produtos capilares selecionados
                para integrar cuidados
                profissionais e rotinas Home Care.
              </p>

              <p className="mt-4 text-xs text-[color:var(--muted)]">
                <strong className="text-[color:var(--ink)]">
                  COREN-PR 451.408
                </strong>{" "}
                · Enfermeira Esteta · Especialista
                em Saúde Pública e Estética Avançada
              </p>
            </div>

            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-wider">
                Produtos
              </p>

              <div className="grid gap-2 text-sm text-[color:var(--muted)]">
                <a
                  href="/produtos-capilares"
                  className="hover:text-[color:var(--ink)]"
                >
                  Todos os produtos
                </a>

                <a
                  href="/produtos-capilares"
                  className="hover:text-[color:var(--ink)]"
                >
                  Home Care
                </a>

                <a
                  href="/produtos-capilares"
                  className="hover:text-[color:var(--ink)]"
                >
                  Uso profissional
                </a>

                <a
                  href="/carrinho"
                  className="hover:text-[color:var(--ink)]"
                >
                  Carrinho
                </a>
              </div>
            </div>

            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-wider">
                Atendimento
              </p>

              <div className="grid gap-2 text-sm text-[color:var(--muted)]">
                <a
                  href="/avaliacao-capilar-curitiba"
                  className="hover:text-[color:var(--ink)]"
                >
                  Avaliação capilar
                </a>

                <a
                  href="/tratamento-capilar-curitiba"
                  className="hover:text-[color:var(--ink)]"
                >
                  Tratamentos capilares
                </a>

                <a
                  href="/"
                  className="hover:text-[color:var(--ink)]"
                >
                  Site principal
                </a>
              </div>
            </div>
          </div>

          <div className="container pb-8">
            <div className="hair mb-6" />

            <div className="flex flex-col justify-between gap-3 text-xs text-[color:var(--muted)] sm:flex-row">
              <span>
                © {new Date().getFullYear()} Powered
                by ✠ HPtech PlatForm. Todos os
                direitos reservados.
              </span>

              <span>
                Política de Privacidade · Termos
              </span>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
