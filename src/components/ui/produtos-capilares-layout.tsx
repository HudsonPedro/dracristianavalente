import { useEffect, useRef, useState } from "react";

import { CSS } from "../../routes/index";
import { productCategories } from "../../data/categories";
import { products } from "../../data/products";
import { ProductCard } from "./product-card";

type ProdutosCapilaresLayoutProps = {
  onConhecerProdutos?: () => void;
};

export function ProdutosCapilaresLayout({
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

  const produtosAtivos = products.filter(
    (product) => product.status === "ACTIVE"
  );

  const produtosFiltrados =
    categoriaSelecionada === "todos"
      ? produtosAtivos
      : produtosAtivos.filter((product) =>
          product.categoryIds.includes(categoriaSelecionada)
        );

  const heroLoopProducts = [
    ...produtosAtivos,
    ...produtosAtivos,
    ...produtosAtivos,
  ];

  useEffect(() => {
    const carousel = heroCarouselRef.current;
    const track = heroTrackRef.current;

    if (!carousel || !track || produtosAtivos.length === 0) return;

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
  }, [produtosAtivos.length]);

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
          <div className="container relative z-[4] w-full py-24 md:py-32">
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
                  className="btn btn-rose"
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

          {produtosAtivos.length > 0 && (
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
                  {heroLoopProducts.map((product, index) => (
                    <div
                      key={`${product.id}-${index}`}
                      className="dna-hero-product-card"
                      aria-hidden={
                        index < produtosAtivos.length ||
                        index >= produtosAtivos.length * 2
                      }
                    >
                      <div className="dna-hero-product-image-wrap">
                        {product.images[0] ? (
                          <img
                            src={product.images[0]}
                            alt={
                              index >= produtosAtivos.length &&
                              index < produtosAtivos.length * 2
                                ? product.name
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
                  ))}
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
        <section className="container py-24 md:py-32">
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
              <article className="card p-8">
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

              <article className="card p-8">
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

              <article className="card p-8">
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
                    className="btn btn-rose"
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
          className="border-y border-[color:var(--line)] bg-white/45 py-24 md:py-28"
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
                        <ProductCard product={product} />
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
        <section className="container py-24 md:py-32">
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
                  className="btn btn-rose"
                >
                  Agendar avaliação capilar
                </a>
              </div>

              <div className="grid gap-5">
                <article className="card p-7 md:p-8">
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

                <article className="card p-7 md:p-8">
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

                <article className="card p-7 md:p-8">
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

                <article className="card p-7 md:p-8">
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
      </main>
    </>
  );
}
