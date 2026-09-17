import { useEffect, useRef, useState } from "react";

import { CSS } from "../../routes/index";
import logo from "../../assets/logo.png";
import { productCategories } from "../../data/categories";
import type {
  PublicProduct,
  PublicProductImage,
} from "../../domain/store/public-product";
import { ProductCard } from "./product-card";

type ProdutosCapilaresLayoutProps = {
  products: PublicProduct[];
  onConhecerProdutos?: () => void;
};

function selectProductImage(
  images: PublicProductImage[],
): PublicProductImage | undefined {
  const byPosition = [...images].sort(
    (left, right) => left.position - right.position,
  );

  return byPosition.find((image) => image.main) ?? byPosition[0];
}

export function ProdutosCapilaresLayout({
  products,
  onConhecerProdutos,
}: ProdutosCapilaresLayoutProps) {
  const categoriasAtivas = productCategories
    .filter((categoria) => categoria.active)
    .sort((a, b) => a.order - b.order);

  const [categoriaSelecionada, setCategoriaSelecionada] =
    useState<string>("todos");

  const heroCarouselRef = useRef<HTMLDivElement | null>(null);
  const heroTrackRef = useRef<HTMLDivElement | null>(null);
  const heroRafRef = useRef<number | null>(null);
  const heroLastTimeRef = useRef<number | null>(null);
  const heroOffsetRef = useRef(0);
  const heroVelocityRef = useRef(-34);
  const heroPointerRef = useRef<{
    active: boolean;
    startX: number;
    lastX: number;
    lastTime: number;
  }>({
    active: false,
    startX: 0,
    lastX: 0,
    lastTime: 0,
  });

  const produtosFiltrados =
    categoriaSelecionada === "todos"
      ? products
      : products.filter((product) =>
          product.categoryIds.includes(categoriaSelecionada)
        );

  const heroLoopProducts = [
    ...products,
    ...products,
    ...products,
  ];

  useEffect(() => {
    const carousel = heroCarouselRef.current;
    const track = heroTrackRef.current;

    if (!carousel || !track || products.length === 0) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const normalizeOffset = () => {
      const oneSetWidth = track.scrollWidth / 3;

      if (!oneSetWidth) return;

      while (heroOffsetRef.current <= -oneSetWidth * 2) {
        heroOffsetRef.current += oneSetWidth;
      }

      while (heroOffsetRef.current >= -oneSetWidth * 0.15) {
        heroOffsetRef.current -= oneSetWidth;
      }
    };

    const animate = (time: number) => {
      if (heroLastTimeRef.current === null) {
        heroLastTimeRef.current = time;
      }

      const delta = Math.min(
        (time - heroLastTimeRef.current) / 1000,
        0.05
      );

      heroLastTimeRef.current = time;

      if (!heroPointerRef.current.active) {
        heroOffsetRef.current += heroVelocityRef.current * delta;

        const targetVelocity =
          heroVelocityRef.current < 0 ? -34 : 34;

        heroVelocityRef.current +=
          (targetVelocity - heroVelocityRef.current) * 0.018;
      }

      normalizeOffset();

      track.style.transform =
        `translate3d(${heroOffsetRef.current}px, 0, 0)`;

      heroRafRef.current = window.requestAnimationFrame(animate);
    };

    const oneSetWidth = track.scrollWidth / 3;
    heroOffsetRef.current = -oneSetWidth;
    heroVelocityRef.current = -34;
    heroLastTimeRef.current = null;

    heroRafRef.current = window.requestAnimationFrame(animate);

    return () => {
      if (heroRafRef.current !== null) {
        window.cancelAnimationFrame(heroRafRef.current);
      }

      heroRafRef.current = null;
      heroLastTimeRef.current = null;
    };
  }, [products.length]);

  const handleHeroPointerDown = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    const carousel = heroCarouselRef.current;

    if (!carousel) return;

    carousel.setPointerCapture(event.pointerId);

    heroPointerRef.current = {
      active: true,
      startX: event.clientX,
      lastX: event.clientX,
      lastTime: performance.now(),
    };
  };

  const handleHeroPointerMove = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    if (!heroPointerRef.current.active) return;

    const now = performance.now();
    const deltaX =
      event.clientX - heroPointerRef.current.lastX;
    const deltaTime = Math.max(
      now - heroPointerRef.current.lastTime,
      1
    );

    heroOffsetRef.current += deltaX;

    const instantVelocity = (deltaX / deltaTime) * 1000;

    heroVelocityRef.current = Math.max(
      -180,
      Math.min(180, instantVelocity)
    );

    heroPointerRef.current.lastX = event.clientX;
    heroPointerRef.current.lastTime = now;
  };

  const handleHeroPointerUp = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    const carousel = heroCarouselRef.current;

    if (
      carousel &&
      carousel.hasPointerCapture(event.pointerId)
    ) {
      carousel.releasePointerCapture(event.pointerId);
    }

    heroPointerRef.current.active = false;

    if (Math.abs(heroVelocityRef.current) < 18) {
      heroVelocityRef.current =
        heroVelocityRef.current < 0 ? -34 : 34;
    }
  };

  const catalogoRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const catalogo = catalogoRef.current;

    if (!catalogo) return;

    const cards = Array.from(
      catalogo.querySelectorAll<HTMLElement>("[data-product-reveal]")
    );

    cards.forEach((card) => {
      card.classList.remove("dna-product-visible");
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const card = entry.target as HTMLElement;
          card.classList.add("dna-product-visible");
          observer.unobserve(card);
        });
      },
      {
        threshold: 0.14,
        rootMargin: "0px 0px -60px 0px",
      }
    );

    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, [categoriaSelecionada]);

  const getRevealDirection = (index: number) => {
    const row = Math.floor(index / 3);

    return row % 2 === 0 ? "right" : "left";
  };

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html:
            CSS +
            `
              /* =====================================================
                 DNA VITAL — PRODUCT REVEAL
                 Mesmo catálogo. Sem duplicação. Sem marquee infinito.
                 Linha 1: direita -> posição final
                 Linha 2: esquerda -> posição final
                 Linha 3: direita -> posição final
                 ===================================================== */

              #catalogo-produtos {
                overflow: hidden;
              }

              .dna-product-reveal {
                opacity: 0;
                will-change: transform, opacity;
                transition:
                  opacity 760ms cubic-bezier(.22, 1, .36, 1),
                  transform 980ms cubic-bezier(.22, 1, .36, 1);
              }

              .dna-product-reveal[data-direction="right"] {
                transform: translate3d(130px, 0, 0);
              }

              .dna-product-reveal[data-direction="left"] {
                transform: translate3d(-130px, 0, 0);
              }

              .dna-product-reveal.dna-product-visible {
                opacity: 1;
                transform: translate3d(0, 0, 0);
              }

              .dna-product-reveal > article {
                height: 100%;
              }

              @media (max-width: 767px) {
                .dna-product-reveal[data-direction="right"] {
                  transform: translate3d(52px, 0, 0);
                }

                .dna-product-reveal[data-direction="left"] {
                  transform: translate3d(-52px, 0, 0);
                }

                .dna-product-reveal.dna-product-visible {
                  transform: translate3d(0, 0, 0);
                }
              }


              /* =====================================================
                 DNA VITAL — HERO PRODUCT CAROUSEL
                 Loop infinito + arraste com mouse/touch.
                 ===================================================== */

              .dna-hero-products {
                position: absolute;
                left: 0;
                right: 0;
                top: 50%;
                width: 100%;
                transform: translateY(-50%);
                overflow: hidden;
                z-index: 1;
                cursor: grab;
                touch-action: pan-y;
                user-select: none;
                -webkit-user-select: none;
                mask-image: linear-gradient(
                  90deg,
                  transparent 0%,
                  #000 4%,
                  #000 96%,
                  transparent 100%
                );
                -webkit-mask-image: linear-gradient(
                  90deg,
                  transparent 0%,
                  #000 4%,
                  #000 96%,
                  transparent 100%
                );
              }

              /*
               * Véu sutil: os produtos continuam visíveis atrás do texto,
               * mas o título permanece legível.
               */
              .dna-hero-products::after {
                content: "";
                position: absolute;
                inset: 0;
                z-index: 2;
                pointer-events: none;
                background:
                  linear-gradient(
                    90deg,
                    rgba(248,244,238,.78) 0%,
                    rgba(248,244,238,.56) 22%,
                    rgba(248,244,238,.18) 46%,
                    rgba(248,244,238,0) 68%
                  );
              }

              .dna-hero-products.is-dragging {
                cursor: grabbing;
              }

              .dna-hero-product-track {
                display: flex;
                align-items: flex-start;
                gap: 22px;
                width: max-content;
                padding: 28px 0 92px;
                will-change: transform;
                position: relative;
                z-index: 1;
              }

              .dna-hero-product-card {
                position: relative;
                flex: 0 0 clamp(190px, 18vw, 270px);
                aspect-ratio: .82;
                overflow: visible;
                border-radius: 24px;
                border: 1px solid rgba(138, 106, 59, .12);
                background:
                  linear-gradient(
                    145deg,
                    rgba(255,255,255,.86),
                    rgba(239,235,228,.96)
                  );
                box-shadow:
                  0 24px 60px rgba(25, 22, 19, .10);
                opacity: .88;
                transform: translateZ(0);
                transition:
                  transform 420ms cubic-bezier(.22, 1, .36, 1),
                  box-shadow 420ms ease,
                  opacity 320ms ease;
              }

              .dna-hero-product-card:nth-child(3n + 2) {
                background:
                  linear-gradient(
                    145deg,
                    #dfe7ec,
                    #b9c7d2
                  );
              }

              .dna-hero-product-card:nth-child(3n + 3) {
                background:
                  linear-gradient(
                    145deg,
                    #f1f2ec,
                    #dfe4dd
                  );
              }

              .dna-hero-product-card:hover {
                opacity: 1;
                transform: translateY(-8px) scale(1.015);
                box-shadow:
                  0 32px 70px rgba(25, 22, 19, .14);
              }

              .dna-hero-product-image-wrap {
                position: absolute;
                inset: 0;
                overflow: hidden;
                border-radius: 24px;
                background: transparent;
              }

              .dna-hero-product-image {
                display: block;
                width: 100%;
                height: 100%;
                object-fit: cover;
                object-position: center;
                border-radius: 24px;
                pointer-events: none;
                user-select: none;
                -webkit-user-drag: none;
              }

              .dna-hero-product-caption {
                position: absolute;
                left: 4px;
                right: 4px;
                top: calc(100% + 14px);
                z-index: 2;
                padding: 0 4px;
                background: transparent;
                border: 0;
                box-shadow: none;
                backdrop-filter: none;
                -webkit-backdrop-filter: none;
              }

              .dna-hero-product-line {
                font-size: 8px;
                font-weight: 700;
                letter-spacing: .16em;
                text-transform: uppercase;
                color: var(--rose2);
                opacity: .78;
              }

              .dna-hero-product-name {
                margin-top: 4px;
                font-family: "Fraunces", serif;
                font-size: clamp(.88rem, 1.15vw, 1.02rem);
                line-height: 1.15;
                color: var(--ink);
                opacity: .82;
              }

              .dna-hero-drag-hint {
                position: absolute;
                right: clamp(28px, 5vw, 72px);
                bottom: 12%;
                z-index: 4;
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 8px 12px;
                border-radius: 999px;
                border: 1px solid rgba(138,106,59,.18);
                background: rgba(255,255,255,.72);
                backdrop-filter: blur(10px);
                font-size: 8px;
                font-weight: 700;
                letter-spacing: .14em;
                text-transform: uppercase;
                color: var(--muted);
                pointer-events: none;
              }

              @media (max-width: 1023px) {
                .dna-products-hero {
                  flex-direction: column;
                  align-items: stretch;
                  min-height: auto;
                }

                .dna-products-hero > .container {
                  width: 100%;
                  flex: 0 0 auto;
                }

                .dna-hero-products {
                  position: relative;
                  left: auto;
                  right: auto;
                  top: auto;
                  width: calc(100% + 48px);
                  min-height: 390px;
                  margin: 22px -24px 0;
                  transform: none;
                  z-index: 2;
                  overflow: hidden;
                  flex: 0 0 auto;
                }

                .dna-hero-products::after {
                  display: none;
                }

                .dna-hero-product-card {
                  flex-basis: clamp(190px, 42vw, 260px);
                  opacity: 1;
                }

                .dna-hero-drag-hint {
                  position: relative;
                  right: auto;
                  bottom: auto;
                  width: max-content;
                  margin: 8px auto 0;
                }
              }

              @media (max-width: 640px) {
                .dna-products-hero {
                  overflow: hidden;
                }

                .dna-hero-products {
                  width: calc(100% + 32px);
                  min-height: 340px;
                  margin: 16px -16px 0;
                }

                .dna-hero-product-track {
                  gap: 14px;
                  padding: 18px 0 78px;
                }

                .dna-hero-product-card {
                  flex-basis: min(64vw, 235px);
                  border-radius: 20px;
                }

                .dna-hero-product-image-wrap,
                .dna-hero-product-image {
                  border-radius: 20px;
                }

                .dna-hero-drag-hint {
                  margin-top: 2px;
                  margin-bottom: 18px;
                }
              }


              @media (prefers-reduced-motion: reduce) {
                .dna-product-reveal,
                .dna-product-reveal[data-direction="right"],
                .dna-product-reveal[data-direction="left"],
                .dna-product-reveal.dna-product-visible {
                  opacity: 1 !important;
                  transform: none !important;
                  transition: none !important;
                }

                .dna-hero-product-track {
                  transform: none !important;
                }
              }
            `,
        }}
      />

      <div className="cine">
        <div className="l l1" />
        <div className="l l2" />
      </div>

      <main className="wrap min-h-screen">
        {/* =====================================================
            HERO
            ===================================================== */}
        <section className="dna-products-hero relative flex min-h-[92vh] items-center overflow-hidden">
          <div className="container relative z-[4] w-full py-20">
            <div className="relative z-[5] max-w-4xl">
              <div className="kicker mb-7">
                Dra. Cristiana Valente · Terapia Capilar
              </div>

              <h1 className="display max-w-4xl text-5xl md:text-7xl lg:text-[86px]">
                Sua rotina capilar também faz parte do{" "}
                <span className="rosetext italic">tratamento.</span>
              </h1>

              <p className="mt-8 max-w-2xl text-base leading-7 text-[color:var(--muted)] md:text-lg">
                Produtos selecionados para complementar protocolos de terapia
                capilar, manutenção e cuidados personalizados.
              </p>

              <div className="hair mt-8 max-w-[240px]" />

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <button
                  type="button"
                  onClick={onConhecerProdutos}
                  className="btn btn-wa"
                >
                  Conhecer produtos
                </button>

                <a
                  href="/avaliacao-capilar-curitiba"
                  className="btn btn-ghost"
                >
                  Agendar avaliação capilar
                </a>
              </div>

              <div className="mt-12 flex flex-wrap gap-x-8 gap-y-4 text-sm text-[color:var(--muted)]">
                <span>Home Care</span>
                <span>•</span>
                <span>Terapia Capilar</span>
                <span>•</span>
                <span>Indicação Profissional</span>
              </div>
            </div>
          </div>

          {products.length > 0 && (
            <>
              <div
                ref={heroCarouselRef}
                className={[
                  "dna-hero-products",
                  heroPointerRef.current.active
                    ? "is-dragging"
                    : "",
                ].join(" ")}
                aria-label="Produtos DNA VITAL em destaque"
                onPointerDown={handleHeroPointerDown}
                onPointerMove={handleHeroPointerMove}
                onPointerUp={handleHeroPointerUp}
                onPointerCancel={handleHeroPointerUp}
              >
                <div
                  ref={heroTrackRef}
                  className="dna-hero-product-track"
                >
                  {heroLoopProducts.map((product, index) => {
                    const image = selectProductImage(product.images);

                    return (
                      <div
                        key={`${product.id}-${index}`}
                        className="dna-hero-product-card"
                        aria-hidden={
                          index < products.length ||
                          index >= products.length * 2
                        }
                      >
                        <div className="dna-hero-product-image-wrap">
                          {image ? (
                            <img
                              src={image.url}
                              alt={
                                index >= products.length &&
                                index < products.length * 2
                                  ? image.alt || product.name
                                  : ""
                              }
                              draggable={false}
                              className="dna-hero-product-image"
                            />
                          ) : null}
                        </div>

                        <div className="dna-hero-product-caption">
                          <div className="dna-hero-product-line">
                            {product.line ?? product.brand}
                          </div>

                          <div className="dna-hero-product-name">
                            {product.name}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div
                className="dna-hero-drag-hint"
                aria-hidden="true"
              >
                <span>←</span>
                <span>arraste</span>
                <span>→</span>
              </div>
            </>
          )}

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-[180px] top-1/2 hidden h-[680px] w-[680px] -translate-y-1/2 rounded-full border border-black/[0.06] lg:block"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-[40px] top-1/2 hidden h-[460px] w-[460px] -translate-y-1/2 rounded-full border border-black/[0.05] lg:block"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-[140px] top-1/2 hidden h-[250px] w-[250px] -translate-y-1/2 rounded-full border border-[color:var(--gold)]/20 lg:block"
          />
        </section>

        {/* =====================================================
            POSICIONAMENTO
            ===================================================== */}
        <section className="container py-20">
          <div className="mx-auto max-w-5xl">
            <div className="kicker mb-6">
              Cuidado que continua em casa
            </div>

            <div className="grid gap-12 lg:grid-cols-[1.05fr_.95fr] lg:items-end">
              <div>
                <h2 className="display text-4xl md:text-6xl">
                  Mais do que produtos.
                  <br />
                  <span className="rosetext italic">
                    Uma extensão do seu cuidado capilar.
                  </span>
                </h2>
              </div>

              <div>
                <p className="text-base leading-7 text-[color:var(--muted)] md:text-lg">
                  Na Dra. Cristiana Valente, os produtos são selecionados de
                  acordo com a estratégia de cuidado de cada paciente. Alguns
                  itens podem ser adquiridos diretamente, enquanto outros
                  dependem de avaliação, indicação profissional ou integração
                  com protocolos realizados na clínica.
                </p>
              </div>
            </div>

            <div className="hair my-14" />

            {/* =================================================
                3 PILARES
                ================================================= */}
            <div className="grid gap-5 md:grid-cols-3">
              <article className="card protocol p-8">
                <div className="mb-6 flex items-center justify-between">
                  <span className="serif rosetext text-5xl">01</span>

                  <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--muted)]">
                    Primeiro passo
                  </span>
                </div>

                <h3 className="serif text-2xl">
                  Avaliação
                </h3>

                <p className="mt-4 leading-relaxed text-[color:var(--muted)]">
                  Entendemos as necessidades do couro cabeludo e dos fios.
                </p>
              </article>

              <article className="card protocol p-8">
                <div className="mb-6 flex items-center justify-between">
                  <span className="serif rosetext text-5xl">02</span>

                  <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--muted)]">
                    Seleção
                  </span>
                </div>

                <h3 className="serif text-2xl">
                  Indicação
                </h3>

                <p className="mt-4 leading-relaxed text-[color:var(--muted)]">
                  Selecionamos os produtos de acordo com o momento e objetivo
                  do tratamento.
                </p>
              </article>

              <article className="card protocol p-8">
                <div className="mb-6 flex items-center justify-between">
                  <span className="serif rosetext text-5xl">03</span>

                  <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--muted)]">
                    Continuidade
                  </span>
                </div>

                <h3 className="serif text-2xl">
                  Acompanhamento
                </h3>

                <p className="mt-4 leading-relaxed text-[color:var(--muted)]">
                  O cuidado continua em casa e pode ser acompanhado durante a
                  evolução do tratamento.
                </p>
              </article>
            </div>

            {/* =================================================
                ORIENTAÇÃO PROFISSIONAL
                ================================================= */}
            <div className="mt-14 rounded-[22px] border border-[color:var(--line)] bg-white/70 p-8 backdrop-blur-md md:p-10">
              <div className="max-w-3xl">
                <div className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--rose2)]">
                  Orientação profissional
                </div>

                <p className="serif text-2xl leading-relaxed md:text-3xl">
                  Cada couro cabeludo possui necessidades diferentes.
                  Por isso, alguns produtos são indicados somente após
                  avaliação profissional.
                </p>

                <div className="mt-7 flex flex-col gap-4 sm:flex-row">
                  <a
                    href="/avaliacao-capilar-curitiba"
                    className="btn btn-wa"
                  >
                    Agendar avaliação capilar
                  </a>

                  <a
                    href="/tratamento-capilar-curitiba"
                    className="btn btn-ghost"
                  >
                    Conhecer protocolos capilares
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            CATEGORIAS
            ===================================================== */}
        <section
          id="catalogo-produtos"
          className="border-y border-[color:var(--line)] bg-white/45 py-20"
        >
          <div className="container">
            <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
              <div>
                <div className="kicker mb-6">
                  Catálogo capilar
                </div>

                <h2 className="display text-4xl md:text-6xl">
                  Encontre por{" "}
                  <span className="rosetext italic">
                    categoria.
                  </span>
                </h2>
              </div>

              <div className="max-w-2xl lg:justify-self-end">
                <p className="text-base leading-7 text-[color:var(--muted)] md:text-lg">
                  Explore as categorias de produtos disponíveis para cuidado
                  em casa, manutenção, uso profissional e estratégias
                  específicas de terapia capilar.
                </p>

                <p className="mt-4 text-sm leading-6 text-[color:var(--muted)]">
                  A disponibilidade de cada produto, a possibilidade de compra
                  e a necessidade de avaliação serão informadas
                  individualmente.
                </p>
              </div>
            </div>

            {/* =================================================
                NAVEGAÇÃO DE CATEGORIAS
                ================================================= */}
            <div className="mt-12 overflow-x-auto pb-3">
              <div className="flex min-w-max gap-3">
                {categoriasAtivas.map((categoria) => {
                  const ativa =
                    categoriaSelecionada === categoria.id;

                  return (
                    <button
                      key={categoria.id}
                      type="button"
                      onClick={() =>
                        setCategoriaSelecionada(categoria.id)
                      }
                      aria-pressed={ativa}
                      className={[
                        "rounded-full border px-5 py-3 text-sm font-semibold",
                        "transition duration-300",
                        ativa
                          ? "border-[#141414] bg-[#141414] text-white shadow-lg"
                          : "border-[color:var(--line)] bg-white/70 text-[color:var(--muted)] hover:-translate-y-0.5 hover:border-[color:var(--gold)] hover:text-[color:var(--ink)]",
                      ].join(" ")}
                    >
                      {categoria.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* =================================================
                PRODUTOS DA CATEGORIA SELECIONADA
                ================================================= */}
            <div className="mt-12">
              <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--rose2)]">
                    Categoria selecionada
                  </div>

                  <h3 className="serif text-3xl md:text-4xl">
                    {categoriasAtivas.find(
                      (categoria) =>
                        categoria.id === categoriaSelecionada
                    )?.name ?? "Todos os produtos"}
                  </h3>
                </div>

                <p className="max-w-xl text-sm leading-6 text-[color:var(--muted)] md:text-right">
                  Alguns produtos podem exigir avaliação, indicação profissional
                  ou integração com um protocolo realizado na clínica.
                </p>
              </div>

              {produtosFiltrados.length > 0 ? (
                <div
                  ref={catalogoRef}
                  className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                >
                  {produtosFiltrados.map((product, index) => {
                    const direction = getRevealDirection(index);

                    return (
                      <div
                        key={product.id}
                        data-product-reveal
                        data-direction={direction}
                        className="dna-product-reveal"
                        style={{
                          transitionDelay: `${(index % 3) * 110}ms`,
                        }}
                      >
                        <ProductCard mode="public" product={product} />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-[24px] border border-[color:var(--line)] bg-white/70 px-6 py-12 text-center md:px-10">
                  <div className="serif rosetext text-3xl">
                    Em preparação
                  </div>

                  <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[color:var(--muted)]">
                    Ainda não há produtos publicados nesta categoria.
                    O catálogo será liberado somente com informações oficiais
                    e autorizadas.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* =====================================================
            COMO ESCOLHER
            ===================================================== */}
        <section className="container py-20">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              <div className="lg:sticky lg:top-28">
                <div className="kicker mb-6">
                  Escolha orientada
                </div>

                <h2 className="display text-4xl md:text-6xl">
                  Qual produto faz sentido para{" "}
                  <span className="rosetext italic">
                    o seu momento?
                  </span>
                </h2>

                <p className="mt-6 max-w-xl text-base leading-7 text-[color:var(--muted)] md:text-lg">
                  Cada couro cabeludo, fio e rotina possuem necessidades
                  diferentes. Por isso, a escolha deve considerar o objetivo,
                  o histórico, o protocolo realizado e a fase atual do cuidado.
                </p>

                <div className="hair my-8 max-w-[220px]" />

                <a
                  href="/avaliacao-capilar-curitiba"
                  className="btn btn-wa"
                >
                  Agendar avaliação capilar
                </a>
              </div>

              <div className="grid gap-5">
                <article className="card protocol p-7 md:p-8">
                  <div className="flex gap-5">
                    <div className="serif rosetext text-4xl">
                      01
                    </div>

                    <div>
                      <h3 className="serif text-2xl">
                        Identifique seu objetivo
                      </h3>

                      <p className="mt-3 leading-7 text-[color:var(--muted)]">
                        Entenda se o foco está no couro cabeludo, na manutenção
                        em casa, na reestruturação dos fios, no crescimento ou
                        em uma etapa específica do acompanhamento.
                      </p>
                    </div>
                  </div>
                </article>

                <article className="card protocol p-7 md:p-8">
                  <div className="flex gap-5">
                    <div className="serif rosetext text-4xl">
                      02
                    </div>

                    <div>
                      <h3 className="serif text-2xl">
                        Conheça as possibilidades
                      </h3>

                      <p className="mt-3 leading-7 text-[color:var(--muted)]">
                        O catálogo apresenta informações educativas sobre as
                        linhas e produtos disponíveis, sem substituir a
                        avaliação profissional.
                      </p>
                    </div>
                  </div>
                </article>

                <article className="card protocol p-7 md:p-8">
                  <div className="flex gap-5">
                    <div className="serif rosetext text-4xl">
                      03
                    </div>

                    <div>
                      <h3 className="serif text-2xl">
                        Avalie quando necessário
                      </h3>

                      <p className="mt-3 leading-7 text-[color:var(--muted)]">
                        Produtos profissionais, itens condicionados a protocolo
                        ou situações específicas podem depender de avaliação e
                        indicação antes da aquisição.
                      </p>
                    </div>
                  </div>
                </article>

                <article className="card protocol p-7 md:p-8">
                  <div className="flex gap-5">
                    <div className="serif rosetext text-4xl">
                      04
                    </div>

                    <div>
                      <h3 className="serif text-2xl">
                        Receba a indicação
                      </h3>

                      <p className="mt-3 leading-7 text-[color:var(--muted)]">
                        A recomendação pode integrar produto, rotina Home Care,
                        protocolo em clínica e acompanhamento conforme a
                        necessidade de cada paciente.
                      </p>
                    </div>
                  </div>
                </article>

                <div className="rounded-[24px] border border-[color:var(--line)] bg-white/65 p-7 md:p-8">
                  <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[color:var(--rose2)]">
                    Importante
                  </div>

                  <p className="serif mt-4 text-2xl leading-relaxed">
                    Esta área não realiza diagnóstico automático e não substitui
                    avaliação profissional.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* =====================================================
            AVALIAÇÃO PROFISSIONAL
            ===================================================== */}
        <section className="relative overflow-hidden border-y border-[color:var(--line)] bg-white/45 py-20">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-32 top-1/2 h-[360px] w-[360px] -translate-y-1/2 rounded-full border border-[color:var(--gold)]/15 md:h-[520px] md:w-[520px]"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-12 top-1/2 h-[240px] w-[240px] -translate-y-1/2 rounded-full border border-[color:var(--gold)]/10 md:h-[360px] md:w-[360px]"
          />

          <div className="container relative z-[2]">
            <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.02fr_.98fr] lg:items-center">
              <div>
                <div className="kicker mb-6">
                  Avaliação profissional
                </div>

                <h2 className="display text-4xl md:text-6xl">
                  Nem todo produto é indicado para{" "}
                  <span className="rosetext italic">
                    todas as pessoas.
                  </span>
                </h2>

                <p className="mt-6 max-w-2xl text-base leading-7 text-[color:var(--muted)] md:text-lg">
                  Alguns produtos podem estar disponíveis para compra direta,
                  enquanto outros dependem de avaliação, indicação profissional
                  ou integração com um protocolo realizado na clínica.
                </p>

                <div className="hair my-8 max-w-[240px]" />

                <p className="max-w-2xl text-sm leading-6 text-[color:var(--muted)]">
                  A avaliação ajuda a compreender o momento do couro cabeludo e
                  dos fios antes de definir quais produtos podem integrar a
                  rotina de cuidado.
                </p>

                <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                  <a
                    href="/avaliacao-capilar-curitiba"
                    className="btn btn-wa"
                  >
                    Agendar avaliação
                  </a>

                  <button
                    type="button"
                    disabled
                    aria-disabled="true"
                    className="btn btn-ghost cursor-not-allowed opacity-60"
                    title="Área do paciente em preparação"
                  >
                    Já sou paciente · em breve
                  </button>
                </div>
              </div>

              <div className="grid gap-5">
                <article className="card protocol p-7 md:p-8">
                  <div className="mb-5 text-[10px] font-bold uppercase tracking-[0.18em] text-[color:var(--rose2)]">
                    01 · Avaliar
                  </div>

                  <h3 className="serif text-2xl">
                    Entender antes de indicar
                  </h3>

                  <p className="mt-3 leading-7 text-[color:var(--muted)]">
                    A necessidade de avaliação depende do produto, do objetivo
                    e do contexto de cuidado de cada pessoa.
                  </p>
                </article>

                <article className="card protocol p-7 md:p-8">
                  <div className="mb-5 text-[10px] font-bold uppercase tracking-[0.18em] text-[color:var(--rose2)]">
                    02 · Indicar
                  </div>

                  <h3 className="serif text-2xl">
                    Produto dentro de uma estratégia
                  </h3>

                  <p className="mt-3 leading-7 text-[color:var(--muted)]">
                    Quando necessário, a recomendação é integrada ao protocolo,
                    à rotina Home Care e ao acompanhamento profissional.
                  </p>
                </article>

                <article className="rounded-[24px] border border-[color:var(--line)] bg-[color:var(--bg)]/88 p-7 md:p-8">
                  <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[color:var(--rose2)]">
                    Importante
                  </div>

                  <p className="serif mt-4 text-2xl leading-relaxed">
                    Esta página não realiza diagnóstico automático e não
                    substitui avaliação profissional.
                  </p>
                </article>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            HOME CARE
            ===================================================== */}
        <section className="container py-20">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
              <div>
                <div className="kicker mb-6">
                  Continuidade do cuidado
                </div>

                <h2 className="display text-4xl md:text-6xl">
                  Home Care não é um produto isolado.{" "}
                  <span className="rosetext italic">
                    É continuidade.
                  </span>
                </h2>
              </div>

              <p className="max-w-xl text-base leading-7 text-[color:var(--muted)] md:text-lg lg:justify-self-end">
                As linhas Home Care ajudam a manter em casa o cuidado iniciado
                na clínica, respeitando a indicação, a rotina e o momento de
                cada paciente.
              </p>
            </div>

            <div className="hair my-10" />

            <div className="grid gap-6 md:grid-cols-3">
              <article className="card protocol p-7 md:p-8">
                <div className="serif rosetext text-4xl">
                  01
                </div>

                <h3 className="serif mt-5 text-2xl">
                  Manutenção
                </h3>

                <p className="mt-3 leading-7 text-[color:var(--muted)]">
                  Produtos para dar continuidade, em casa, ao cuidado realizado
                  e orientado na clínica.
                </p>
              </article>

              <article className="card protocol p-7 md:p-8">
                <div className="serif rosetext text-4xl">
                  02
                </div>

                <h3 className="serif mt-5 text-2xl">
                  Rotina
                </h3>

                <p className="mt-3 leading-7 text-[color:var(--muted)]">
                  A escolha considera frequência de uso, objetivo e integração
                  com os demais produtos da rotina capilar.
                </p>
              </article>

              <article className="card protocol p-7 md:p-8">
                <div className="serif rosetext text-4xl">
                  03
                </div>

                <h3 className="serif mt-5 text-2xl">
                  Acompanhamento
                </h3>

                <p className="mt-3 leading-7 text-[color:var(--muted)]">
                  Quando necessário, a rotina pode ser ajustada conforme a
                  evolução observada durante o acompanhamento profissional.
                </p>
              </article>
            </div>

            <div className="mt-10 flex flex-col items-start justify-between gap-6 rounded-[26px] border border-[color:var(--line)] bg-white/55 p-7 md:flex-row md:items-center md:p-9">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[color:var(--rose2)]">
                  Produtos Home Care
                </div>

                <p className="serif mt-3 max-w-2xl text-2xl leading-relaxed">
                  Veja no catálogo as linhas indicadas para continuidade do
                  cuidado fora da clínica.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setCategoriaSelecionada("home-care");
                  document
                    .getElementById("catalogo-produtos")
                    ?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                }}
                className="btn btn-wa shrink-0"
              >
                Ver Home Care
              </button>
            </div>
          </div>
        </section>

        {/* =====================================================
            PÓS-TRANSPLANTE
            ===================================================== */}
        <section className="relative overflow-hidden border-y border-[color:var(--line)] bg-[color:var(--bg2)]/45 py-20">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full border border-[color:var(--line)] md:h-[620px] md:w-[620px]"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-40 right-20 h-[320px] w-[320px] rounded-full border border-[color:var(--gold)]/25 md:h-[460px] md:w-[460px]"
          />

          <div className="container relative z-[2]">
            <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
              <div>
                <div className="mb-6 inline-flex rounded-full border border-[color:var(--line)] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[color:var(--muted)]">
                  Cuidado específico
                </div>

                <h2 className="display text-4xl text-[color:var(--ink)] md:text-6xl">
                  Pós-transplante exige uma rotina{" "}
                  <span className="italic text-[color:var(--gold2)]">
                    própria de cuidado.
                  </span>
                </h2>

                <p className="mt-6 max-w-2xl text-base leading-7 text-[color:var(--muted)] md:text-lg">
                  A linha Pós-Transplante Home Care integra os cuidados do
                  couro cabeludo após o procedimento, com produtos destinados
                  à higienização e ao cuidado dessa fase específica.
                </p>

                <div className="my-8 h-px max-w-[240px] bg-white/15" />

                <p className="max-w-2xl text-sm leading-6 text-[color:var(--muted)]">
                  A utilização deve respeitar a orientação recebida para o
                  período pós-procedimento e o acompanhamento profissional
                  responsável pelo transplante.
                </p>

                <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => {
                      setCategoriaSelecionada("pos-transplante");
                      document
                        .getElementById("catalogo-produtos")
                        ?.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                    }}
                    className="btn border border-white/20 bg-white text-[color:var(--ink)] hover:bg-white/90"
                  >
                    Ver Pós-Transplante
                  </button>

                  <a
                    href="/avaliacao-capilar-curitiba"
                    className="btn border border-white/20 bg-transparent text-white hover:bg-white/10"
                  >
                    Falar sobre meu cuidado
                  </a>
                </div>
              </div>

              <div className="grid gap-5">
                <article className="rounded-[26px] border border-[color:var(--line)] bg-white p-7 backdrop-blur-sm md:p-8">
                  <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[color:var(--gold2)]">
                    Tônico pós-transplante
                  </div>

                  <h3 className="serif mt-4 text-2xl text-white">
                    Cuidado do couro cabeludo
                  </h3>

                  <p className="mt-3 leading-7 text-[color:var(--muted)]">
                    Produto da linha voltado ao cuidado do couro cabeludo no
                    período pós-transplante, conforme orientação profissional.
                  </p>
                </article>

                <article className="rounded-[26px] border border-[color:var(--line)] bg-white p-7 backdrop-blur-sm md:p-8">
                  <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[color:var(--gold2)]">
                    Espuma pós-transplante
                  </div>

                  <h3 className="serif mt-4 text-2xl text-white">
                    Higienização delicada
                  </h3>

                  <p className="mt-3 leading-7 text-[color:var(--muted)]">
                    Shampoo em espuma desenvolvido para a higienização do couro
                    cabeludo durante os cuidados do pós-transplante.
                  </p>
                </article>

                <div className="rounded-[26px] border border-[color:var(--gold)]/25 bg-[color:var(--gold)]/[0.08] p-7 md:p-8">
                  <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[color:var(--gold2)]">
                    Atenção
                  </div>

                  <p className="serif mt-4 text-xl leading-relaxed text-[color:var(--ink)] md:text-2xl">
                    O cuidado pós-transplante deve seguir as orientações do
                    profissional responsável pelo procedimento.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            PROTOCOLOS
            ===================================================== */}
        <section className="container py-20">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-4xl">
              <div className="kicker mb-6">
                Produtos + protocolos
              </div>

              <h2 className="display text-4xl md:text-6xl">
                O produto pode fazer parte de uma{" "}
                <span className="rosetext italic">
                  estratégia maior.
                </span>
              </h2>

              <p className="mt-6 max-w-3xl text-base leading-7 text-[color:var(--muted)] md:text-lg">
                Dependendo da necessidade, produtos profissionais e Home Care
                podem ser associados a protocolos realizados na clínica e ao
                acompanhamento da evolução capilar.
              </p>
            </div>

            <div className="hair my-10" />

            <div className="grid gap-6 lg:grid-cols-3">
              <a
                href="/tratamento-queda-de-cabelo-curitiba"
                className="card protocol group relative overflow-hidden p-7 transition-transform duration-500 hover:-translate-y-2 md:p-8"
              >
                <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[color:var(--rose2)]">
                  Protocolo 01
                </div>

                <h3 className="serif mt-5 text-3xl">
                  Queda de cabelo
                </h3>

                <p className="mt-4 leading-7 text-[color:var(--muted)]">
                  Conheça a abordagem clínica para investigação e cuidado da
                  queda capilar.
                </p>

                <div className="mt-8 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.16em]">
                  Conhecer protocolo
                  <span className="transition-transform duration-300 group-hover:translate-x-2">
                    →
                  </span>
                </div>
              </a>

              <a
                href="/tratamento-capilar-curitiba"
                className="card protocol group relative overflow-hidden p-7 transition-transform duration-500 hover:-translate-y-2 md:p-8"
              >
                <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[color:var(--rose2)]">
                  Protocolo 02
                </div>

                <h3 className="serif mt-5 text-3xl">
                  Terapia capilar
                </h3>

                <p className="mt-4 leading-7 text-[color:var(--muted)]">
                  Cuidados personalizados para couro cabeludo e fios dentro de
                  uma estratégia profissional.
                </p>

                <div className="mt-8 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.16em]">
                  Conhecer protocolo
                  <span className="transition-transform duration-300 group-hover:translate-x-2">
                    →
                  </span>
                </div>
              </a>

              <a
                href="/avaliacao-capilar-curitiba"
                className="card protocol group relative overflow-hidden p-7 transition-transform duration-500 hover:-translate-y-2 md:p-8"
              >
                <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[color:var(--rose2)]">
                  Protocolo 03
                </div>

                <h3 className="serif mt-5 text-3xl">
                  Avaliação capilar
                </h3>

                <p className="mt-4 leading-7 text-[color:var(--muted)]">
                  O ponto de partida para compreender necessidades, objetivos e
                  possibilidades de cuidado.
                </p>

                <div className="mt-8 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.16em]">
                  Agendar avaliação
                  <span className="transition-transform duration-300 group-hover:translate-x-2">
                    →
                  </span>
                </div>
              </a>
            </div>

            <div className="mt-10 rounded-[26px] border border-[color:var(--line)] bg-white/55 p-7 md:p-9">
              <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[color:var(--rose2)]">
                    Integração
                  </div>

                  <p className="serif mt-3 max-w-3xl text-2xl leading-relaxed">
                    Produto, protocolo e acompanhamento podem trabalhar juntos,
                    quando houver indicação profissional para essa combinação.
                  </p>
                </div>

                <a
                  href="/avaliacao-capilar-curitiba"
                  className="btn btn-wa"
                >
                  Começar pela avaliação
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            CONTEÚDO EDUCATIVO
            ===================================================== */}
        <section className="relative overflow-hidden border-y border-[color:var(--line)] bg-white/45 py-20">
          <div className="container relative z-[2]">
            <div className="mx-auto max-w-6xl">
              <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
                <div>
                  <div className="kicker mb-6">
                    Conteúdo educativo
                  </div>

                  <h2 className="display text-4xl md:text-6xl">
                    Informação também faz parte do{" "}
                    <span className="rosetext italic">
                      cuidado capilar.
                    </span>
                  </h2>
                </div>

                <p className="max-w-xl text-base leading-7 text-[color:var(--muted)] md:text-lg lg:justify-self-end">
                  Entender a função de cada etapa ajuda a usar produtos e
                  protocolos com mais consciência, sem transformar informação
                  em diagnóstico automático.
                </p>
              </div>

              <div className="hair my-10" />

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <article className="card protocol p-7 md:p-8">
                  <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[color:var(--rose2)]">
                    Couro cabeludo
                  </div>

                  <h3 className="serif mt-5 text-2xl">
                    O cuidado começa na base
                  </h3>

                  <p className="mt-4 leading-7 text-[color:var(--muted)]">
                    Oleosidade, sensibilidade, descamação e equilíbrio do couro
                    cabeludo podem influenciar a escolha da rotina de cuidado.
                  </p>
                </article>

                <article className="card protocol p-7 md:p-8">
                  <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[color:var(--rose2)]">
                    Queda capilar
                  </div>

                  <h3 className="serif mt-5 text-2xl">
                    Queda não é uma causa única
                  </h3>

                  <p className="mt-4 leading-7 text-[color:var(--muted)]">
                    Diferentes fatores podem estar envolvidos. Por isso,
                    produtos para queda não devem ser tratados como uma solução
                    universal para todos os casos.
                  </p>
                </article>

                <article className="card protocol p-7 md:p-8">
                  <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[color:var(--rose2)]">
                    Crescimento
                  </div>

                  <h3 className="serif mt-5 text-2xl">
                    Crescimento envolve continuidade
                  </h3>

                  <p className="mt-4 leading-7 text-[color:var(--muted)]">
                    O cuidado pode envolver couro cabeludo, fios, rotina em casa
                    e acompanhamento ao longo do tempo.
                  </p>
                </article>

                <article className="card protocol p-7 md:p-8">
                  <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[color:var(--rose2)]">
                    Home Care
                  </div>

                  <h3 className="serif mt-5 text-2xl">
                    O tratamento continua em casa
                  </h3>

                  <p className="mt-4 leading-7 text-[color:var(--muted)]">
                    A rotina Home Care pode complementar o cuidado realizado na
                    clínica quando há indicação adequada para sua utilização.
                  </p>
                </article>

                <article className="card protocol p-7 md:p-8">
                  <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[color:var(--rose2)]">
                    Reestruturação
                  </div>

                  <h3 className="serif mt-5 text-2xl">
                    Couro cabeludo e fio são cuidados diferentes
                  </h3>

                  <p className="mt-4 leading-7 text-[color:var(--muted)]">
                    Produtos destinados à haste capilar têm objetivos
                    diferentes daqueles direcionados ao couro cabeludo.
                  </p>
                </article>

                <article className="card protocol p-7 md:p-8">
                  <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[color:var(--rose2)]">
                    Avaliação
                  </div>

                  <h3 className="serif mt-5 text-2xl">
                    Quando procurar orientação?
                  </h3>

                  <p className="mt-4 leading-7 text-[color:var(--muted)]">
                    Quando houver dúvida sobre a necessidade, associação de
                    produtos ou integração com protocolos, a avaliação é o
                    caminho mais seguro para orientar a escolha.
                  </p>
                </article>
              </div>

              <div className="mt-10 flex flex-col items-start justify-between gap-6 rounded-[26px] border border-[color:var(--line)] bg-[color:var(--bg)]/85 p-7 md:flex-row md:items-center md:p-9">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[color:var(--rose2)]">
                    Informação não é diagnóstico
                  </div>

                  <p className="serif mt-3 max-w-3xl text-2xl leading-relaxed">
                    O conteúdo desta página é educativo e não substitui
                    avaliação individualizada.
                  </p>
                </div>

                <a
                  href="/avaliacao-capilar-curitiba"
                  className="btn btn-wa shrink-0"
                >
                  Agendar avaliação
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            PRODUTOS RECOMENDADOS
            ===================================================== */}
        <section className="container py-20">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
              <div className="max-w-4xl">
                <div className="kicker mb-6">
                  Encontre pelo objetivo
                </div>

                <h2 className="display text-4xl md:text-6xl">
                  Explore os produtos por{" "}
                  <span className="rosetext italic">
                    necessidade de cuidado.
                  </span>
                </h2>

                <p className="mt-6 max-w-3xl text-base leading-7 text-[color:var(--muted)] md:text-lg">
                  Use os atalhos abaixo para retornar ao catálogo já filtrado
                  pelo objetivo que deseja conhecer.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setCategoriaSelecionada("todos");
                  document
                    .getElementById("catalogo-produtos")
                    ?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                }}
                className="btn btn-ghost"
              >
                Ver todos
              </button>
            </div>

            <div className="hair my-10" />

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  categoryId: "controle-queda",
                  eyebrow: "Objetivo",
                  title: "Controle de queda",
                  description:
                    "Produtos relacionados ao cuidado de rotinas voltadas à queda capilar.",
                },
                {
                  categoryId: "couro-cabeludo",
                  eyebrow: "Objetivo",
                  title: "Couro cabeludo",
                  description:
                    "Linhas relacionadas ao equilíbrio e aos cuidados específicos do couro cabeludo.",
                },
                {
                  categoryId: "crescimento",
                  eyebrow: "Objetivo",
                  title: "Crescimento",
                  description:
                    "Produtos associados a estratégias de estímulo e continuidade do cuidado capilar.",
                },
                {
                  categoryId: "home-care",
                  eyebrow: "Rotina",
                  title: "Home Care",
                  description:
                    "Produtos para continuidade da rotina de cuidado fora da clínica.",
                },
                {
                  categoryId: "reestruturacao",
                  eyebrow: "Fios",
                  title: "Reestruturação",
                  description:
                    "Linhas direcionadas ao cuidado, resistência e aparência da haste capilar.",
                },
                {
                  categoryId: "profissional",
                  eyebrow: "Clínica",
                  title: "Uso profissional",
                  description:
                    "Produtos destinados ao uso profissional e à integração com protocolos.",
                },
                {
                  categoryId: "pos-transplante",
                  eyebrow: "Cuidado específico",
                  title: "Pós-Transplante",
                  description:
                    "Linha voltada aos cuidados específicos do período após o transplante capilar.",
                },
                {
                  categoryId: "tratamentos-especificos",
                  eyebrow: "Seleção",
                  title: "Tratamentos específicos",
                  description:
                    "Produtos que podem integrar necessidades e estratégias específicas de cuidado.",
                },
              ].map((item) => (
                <button
                  key={item.categoryId}
                  type="button"
                  onClick={() => {
                    setCategoriaSelecionada(item.categoryId);
                    document
                      .getElementById("catalogo-produtos")
                      ?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                  }}
                  className="card protocol group min-h-[230px] p-7 text-left transition-transform duration-500 hover:-translate-y-2 md:p-8"
                >
                  <div className="text-[9px] font-bold uppercase tracking-[0.18em] text-[color:var(--rose2)]">
                    {item.eyebrow}
                  </div>

                  <h3 className="serif mt-5 text-2xl">
                    {item.title}
                  </h3>

                  <p className="mt-4 text-sm leading-6 text-[color:var(--muted)]">
                    {item.description}
                  </p>

                  <div className="mt-7 flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.16em]">
                    Ver produtos
                    <span className="transition-transform duration-300 group-hover:translate-x-2">
                      →
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-10 rounded-[26px] border border-[color:var(--line)] bg-white/55 p-7 md:p-9">
              <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[color:var(--rose2)]">
                    Ainda em dúvida?
                  </div>

                  <p className="serif mt-3 max-w-3xl text-2xl leading-relaxed">
                    A avaliação capilar ajuda a orientar quais caminhos podem
                    fazer sentido para o seu momento.
                  </p>
                </div>

                <a
                  href="/avaliacao-capilar-curitiba"
                  className="btn btn-wa"
                >
                  Agendar avaliação
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            CTA FINAL
            ===================================================== */}
        <section className="container pb-24 pt-8 md:pb-32 md:pt-12">
          <div className="card protocol mx-auto max-w-4xl p-8 text-center md:p-12">
<div className="mx-auto max-w-3xl">
              <div className="mx-auto max-w-3xl">
                <div className="kicker mb-6 mx-auto">
                  Próximo passo
                </div>

                <h2 className="display text-4xl text-[color:var(--ink)] md:text-5xl">
                  Não sabe qual produto escolher?{" "}
                  <span className="italic text-[color:var(--gold2)]">
                    Comece pela avaliação.
                  </span>
                </h2>

                <p className="mt-6 max-w-3xl text-base leading-7 text-[color:var(--muted)] md:text-lg">
                  A avaliação capilar ajuda a compreender seu momento e orientar
                  quais produtos, cuidados em casa ou protocolos podem fazer
                  sentido para a sua rotina.
                </p>
              </div>

              <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                <a
                  href="/avaliacao-capilar-curitiba"
                  className="btn btn-wa"
                >
                  Agendar avaliação
                </a>

                <button
                  type="button"
                  onClick={() => {
                    setCategoriaSelecionada("todos");
                    document
                      .getElementById("catalogo-produtos")
                      ?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                  }}
                  className="btn btn-ghost"
                >
                  Rever produtos
                </button>
              </div>
            </div>

                      </div>
        </section>

        {/* FAQ — MESMO DESIGN DA HOME */}
        <section id="faq" className="container py-20">
          <div className="mx-auto max-w-4xl">
            <div className="reveal kicker mb-6">Dúvidas frequentes</div>
            <h2 className="reveal display text-4xl md:text-5xl">
              Antes de escolher seus{" "}
              <span className="rosetext italic">produtos capilares.</span>
            </h2>
            <p className="reveal mt-6 max-w-3xl text-lg leading-relaxed text-[color:var(--muted)]">
              Informações sobre compra, avaliação, Home Care, produtos profissionais e cuidados específicos.
            </p>
            <div className="mt-10">
              <details className="faq reveal">
                <summary>
                  Posso comprar qualquer produto diretamente?
                  <span className="pl">+</span>
                </summary>
                <p className="pb-5 text-[color:var(--muted)] leading-relaxed">
                  Não necessariamente. A disponibilidade depende do produto. Alguns itens podem estar disponíveis para compra direta, enquanto outros podem exigir avaliação, indicação profissional ou integração com um protocolo.
                </p>
              </details>
              <details className="faq reveal">
                <summary>
                  Preciso fazer avaliação antes de comprar?
                  <span className="pl">+</span>
                </summary>
                <p className="pb-5 text-[color:var(--muted)] leading-relaxed">
                  Depende do produto e do objetivo. Quando houver necessidade de compreender melhor o couro cabeludo, os fios ou a estratégia de cuidado, a avaliação profissional pode ser indicada antes da escolha.
                </p>
              </details>
              <details className="faq reveal">
                <summary>
                  Qual a diferença entre produto profissional e Home Care?
                  <span className="pl">+</span>
                </summary>
                <p className="pb-5 text-[color:var(--muted)] leading-relaxed">
                  Os produtos profissionais são destinados ao uso em clínica e podem integrar protocolos. As linhas Home Care são voltadas à continuidade da rotina fora da clínica, conforme a indicação de uso.
                </p>
              </details>
              <details className="faq reveal">
                <summary>
                  Os produtos Home Care substituem o tratamento na clínica?
                  <span className="pl">+</span>
                </summary>
                <p className="pb-5 text-[color:var(--muted)] leading-relaxed">
                  Não. Eles podem complementar e dar continuidade ao cuidado, mas não substituem automaticamente protocolos, avaliação ou acompanhamento profissional quando estes forem necessários.
                </p>
              </details>
              <details className="faq reveal">
                <summary>
                  Existe uma linha específica para pós-transplante?
                  <span className="pl">+</span>
                </summary>
                <p className="pb-5 text-[color:var(--muted)] leading-relaxed">
                  Sim. O catálogo possui uma linha Pós-Transplante Home Care voltada aos cuidados específicos dessa fase. O uso deve respeitar as orientações do profissional responsável pelo procedimento.
                </p>
              </details>
              <details className="faq reveal">
                <summary>
                  Como descubro qual produto faz sentido para mim?
                  <span className="pl">+</span>
                </summary>
                <p className="pb-5 text-[color:var(--muted)] leading-relaxed">
                  Você pode explorar o catálogo por objetivo e conhecer as características de cada linha. Se ainda houver dúvida, a avaliação capilar é o caminho indicado para receber orientação individualizada.
                </p>
              </details>
              <details className="faq reveal">
                <summary>
                  As informações desta página fazem diagnóstico?
                  <span className="pl">+</span>
                </summary>
                <p className="pb-5 text-[color:var(--muted)] leading-relaxed">
                  Não. O conteúdo é educativo e comercial. Esta página não realiza diagnóstico automático e não substitui uma avaliação profissional individualizada.
                </p>
              </details>
            </div>
            <div className="reveal mt-10">
              <a href="/avaliacao-capilar-curitiba" className="btn btn-wa">
                Agendar avaliação →
              </a>
            </div>
          </div>
        </section>

        {/* =====================================================
            FOOTER — MESMO DESIGN VISUAL DA HOME
            Conteúdo adaptado para a loja, sem criar outro estilo.
            ===================================================== */}
        <footer
          className="border-t border-[color:var(--line)]"
          style={{ background: "#fff" }}
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
                Produtos capilares DNA VITAL selecionados para integrar
                protocolos, Home Care e cuidados personalizados, com orientação
                profissional quando necessária.
              </p>

              <p className="mt-4 text-xs text-[color:var(--muted)]">
                <strong className="text-[color:var(--ink)]">
                  COREN-PR 451.408
                </strong>{" "}
                · Enfermeira Esteta · Especialista em Saúde Pública e Estética
                Avançada
              </p>

              <p className="mt-2 text-xs text-[color:var(--muted)]">
                <strong className="text-[color:var(--ink)]">
                  Atendimento:
                </strong>{" "}
                mediante agendamento · Curitiba/PR
                (Rebouças)
              </p>
            </div>

            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-wider">
                Produtos
              </p>

              <div className="grid gap-2 text-sm text-[color:var(--muted)]">
                {[
                  ["todos", "Todos os produtos"],
                  ["home-care", "Home Care"],
                  ["profissional", "Profissional"],
                  ["pos-transplante", "Pós-transplante"],
                  ["crescimento", "Crescimento"],
                ].map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      setCategoriaSelecionada(id);
                      document
                        .getElementById("catalogo-produtos")
                        ?.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                    }}
                    className="text-left transition hover:text-[color:var(--ink)]"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-wider">
                Atendimento
              </p>

              <div className="grid gap-2 text-sm text-[color:var(--muted)]">
                <a
                  href="/avaliacao-capilar-curitiba"
                  className="transition hover:text-[color:var(--ink)]"
                >
                  Agendar avaliação
                </a>

                <a
                  href="https://wa.me/5541991599558"
                  target="_blank"
                  rel="noreferrer"
                  className="transition hover:text-[color:var(--ink)]"
                >
                  WhatsApp
                </a>

                <a
                  href="/tratamento-capilar-curitiba"
                  className="transition hover:text-[color:var(--ink)]"
                >
                  Protocolos capilares
                </a>

                <a
                  href="/"
                  className="transition hover:text-[color:var(--ink)]"
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
                © {new Date().getFullYear()} Powered by ✠ HPtech PlatForm.
                Todos os direitos reservados.
              </span>

              <span>
                Política de Privacidade · Termos · Política de Trocas · Política de Entrega
              </span>
            </div>
          </div>
        </footer>

      </main>
    </>
  );
}
