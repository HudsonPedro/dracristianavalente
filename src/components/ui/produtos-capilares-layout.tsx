import { useState } from "react";
import { ProductMarquee } from "./product-marquee";
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

  const produtosAtivos = products.filter(
    (product) => product.status === "ACTIVE"
  );

  const produtosFiltrados =
    categoriaSelecionada === "todos"
      ? produtosAtivos
      : produtosAtivos.filter(
          (product) => product.categoryId === categoriaSelecionada
        );

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="cine">
        <div className="l l1" />
        <div className="l l2" />
      </div>

      <main className="wrap min-h-screen">
        {/* =====================================================
            HERO
            ===================================================== */}
        <section className="relative flex min-h-[92vh] items-center overflow-hidden">
          <div className="container w-full py-24 md:py-32">
            <div className="max-w-4xl">
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
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {produtosFiltrados.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                    />
                  ))}
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
        <ProductMarquee />
      </main>
    </>
  );
}
