import { products } from "../../data/products";
import type { Product } from "../../types/product";
import { ProductCard } from "./product-card";

type MarqueeRowProps = {
  items: Product[];
  direction: "left" | "right";
  duration?: number;
};

function MarqueeRow({
  items,
  direction,
  duration = 42,
}: MarqueeRowProps) {
  /*
   * Duplicamos os 3 produtos somente visualmente.
   * Isso permite o movimento infinito sem "buraco"
   * quando a primeira sequência sai da tela.
   */
  const duplicatedItems = [...items, ...items];

  return (
    <div className="dna-marquee">
      <div
        className={[
          "dna-marquee-track",
          direction === "left"
            ? "dna-marquee-left"
            : "dna-marquee-right",
        ].join(" ")}
        style={{
          animationDuration: `${duration}s`,
        }}
      >
        {duplicatedItems.map((product, index) => (
          <div
            key={`${direction}-${product.id}-${index}`}
            className="dna-marquee-card"
            aria-hidden={index >= items.length}
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProductMarquee() {
  const activeProducts = products.filter(
    (product) => product.status === "ACTIVE"
  );

  const row1 = activeProducts.slice(0, 3);
  const row2 = activeProducts.slice(3, 6);
  const row3 = activeProducts.slice(6, 9);

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            /* ================================================
               DNA VITAL — MOVIMENTO HORIZONTAL DOS PRODUTOS
               ================================================ */

            .dna-marquee-section {
              position: relative;
              overflow: hidden;
              padding: 7rem 0 8rem;
            }

            .dna-marquee-heading {
              position: relative;
              z-index: 2;
              margin-bottom: 4.5rem;
            }

            .dna-marquee {
              position: relative;
              width: 100%;
              overflow: hidden;
              padding: 0.75rem 0 1.5rem;
            }

            .dna-marquee + .dna-marquee {
              margin-top: 2.5rem;
            }

            /*
             * Máscara suave nas laterais.
             * Os cards não "cortam" bruscamente.
             */
            .dna-marquee::before,
            .dna-marquee::after {
              content: "";
              position: absolute;
              z-index: 5;
              top: 0;
              bottom: 0;
              width: clamp(20px, 6vw, 110px);
              pointer-events: none;
            }

            .dna-marquee::before {
              left: 0;
              background:
                linear-gradient(
                  90deg,
                  var(--bg) 0%,
                  color-mix(in srgb, var(--bg) 75%, transparent) 45%,
                  transparent 100%
                );
            }

            .dna-marquee::after {
              right: 0;
              background:
                linear-gradient(
                  270deg,
                  var(--bg) 0%,
                  color-mix(in srgb, var(--bg) 75%, transparent) 45%,
                  transparent 100%
                );
            }

            .dna-marquee-track {
              display: flex;
              width: max-content;
              gap: 1.5rem;
              will-change: transform;
              backface-visibility: hidden;
              transform: translate3d(0, 0, 0);
              animation-timing-function: linear;
              animation-iteration-count: infinite;
            }

            /*
             * Cada linha contém 3 cards reais + 3 cópias
             * usadas apenas para manter o loop contínuo.
             */
            .dna-marquee-card {
              width: clamp(310px, 31vw, 430px);
              flex: 0 0 auto;
              transition:
                transform 500ms cubic-bezier(.22, 1, .36, 1),
                opacity 500ms ease;
            }

            /*
             * LINHA 1 e LINHA 3
             * direita -> esquerda
             */
            .dna-marquee-left {
              animation-name: dnaScrollLeft;
            }

            /*
             * LINHA 2
             * esquerda -> direita
             */
            .dna-marquee-right {
              animation-name: dnaScrollRight;
            }

            @keyframes dnaScrollLeft {
              from {
                transform: translate3d(0, 0, 0);
              }

              to {
                transform: translate3d(
                  calc(-50% - 0.75rem),
                  0,
                  0
                );
              }
            }

            @keyframes dnaScrollRight {
              from {
                transform: translate3d(
                  calc(-50% - 0.75rem),
                  0,
                  0
                );
              }

              to {
                transform: translate3d(0, 0, 0);
              }
            }

            /*
             * Ao passar o mouse sobre uma linha:
             * movimento pausa.
             */
            .dna-marquee:hover .dna-marquee-track {
              animation-play-state: paused;
            }

            /*
             * Card em foco ganha pequena elevação.
             */
            .dna-marquee-card:hover {
              position: relative;
              z-index: 4;
              transform: translateY(-8px);
            }

            /*
             * Linha 2 levemente deslocada visualmente.
             * Evita aparência de grade estática.
             */
            .dna-marquee:nth-of-type(2) {
              transform: translateX(-3vw);
            }

            /*
             * Separação editorial entre as linhas.
             */
            .dna-row-label {
              width: min(1320px, calc(100% - 48px));
              margin: 0 auto 0.6rem;
              display: flex;
              align-items: center;
              gap: 1rem;
              font-size: 9px;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 0.18em;
              color: var(--muted);
              opacity: 0.72;
            }

            .dna-row-label::after {
              content: "";
              height: 1px;
              flex: 1;
              background: var(--line);
            }

            /*
             * MOBILE
             */
            @media (max-width: 768px) {
              .dna-marquee-section {
                padding: 5rem 0 6rem;
              }

              .dna-marquee-heading {
                margin-bottom: 3rem;
              }

              .dna-marquee + .dna-marquee {
                margin-top: 1.75rem;
              }

              .dna-marquee-track {
                gap: 1rem;
              }

              .dna-marquee-card {
                width: min(82vw, 340px);
              }

              .dna-row-label {
                width: calc(100% - 32px);
              }

              .dna-marquee:nth-of-type(2) {
                transform: none;
              }

              .dna-marquee::before,
              .dna-marquee::after {
                width: 24px;
              }
            }

            /*
             * ACESSIBILIDADE
             * Se o dispositivo solicitar redução de movimento,
             * não forçamos animação automática.
             */
            @media (prefers-reduced-motion: reduce) {
              .dna-marquee {
                overflow-x: auto;
              }

              .dna-marquee-track {
                animation: none !important;
                transform: none !important;
              }

              .dna-marquee-card {
                transform: none !important;
              }
            }
          `,
        }}
      />

      <section className="dna-marquee-section">
        {/* ===============================================
            CABEÇALHO
            =============================================== */}
        <div className="container dna-marquee-heading">
          <div className="kicker mb-6">
            DNA VITAL · Seleção profissional
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_.72fr] lg:items-end">
            <h2 className="display max-w-4xl text-4xl md:text-6xl">
              Tecnologia capilar em{" "}
              <span className="rosetext italic">
                movimento.
              </span>
            </h2>

            <p className="max-w-xl text-base leading-7 text-[color:var(--muted)] lg:justify-self-end">
              Linhas profissionais e Home Care selecionadas para
              diferentes momentos do cuidado capilar.
            </p>
          </div>

          <div className="hair mt-10" />
        </div>

        {/* ===============================================
            LINHA 01
            DIREITA -> ESQUERDA
            =============================================== */}
        {row1.length > 0 && (
          <>
            <div className="dna-row-label">
              <span>01 · Cuidado e crescimento</span>
            </div>

            <MarqueeRow
              items={row1}
              direction="left"
              duration={44}
            />
          </>
        )}

        {/* ===============================================
            LINHA 02
            ESQUERDA -> DIREITA
            =============================================== */}
        {row2.length > 0 && (
          <>
            <div className="dna-row-label mt-10">
              <span>02 · Tecnologia profissional</span>
            </div>

            <MarqueeRow
              items={row2}
              direction="right"
              duration={48}
            />
          </>
        )}

        {/* ===============================================
            LINHA 03
            DIREITA -> ESQUERDA
            =============================================== */}
        {row3.length > 0 && (
          <>
            <div className="dna-row-label mt-10">
              <span>03 · Reparação e continuidade</span>
            </div>

            <MarqueeRow
              items={row3}
              direction="left"
              duration={46}
            />
          </>
        )}
      </section>
    </>
  );
}
