import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { listStoreProducts } from "../../../functions/store-products";
import { CSS } from "../../index";

export const Route = createFileRoute("/admin/produtos/")({
  loader: async () => {
    return listStoreProducts({
      data: {},
    });
  },

  component: AdminProdutosPage,
});

function formatPrice(value?: number) {
  if (typeof value !== "number") {
    return "Sem preço";
  }

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function AdminProdutosPage() {
  const products = Route.useLoaderData();

  const [search, setSearch] = useState("");

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return products;
    }

    return products.filter((product) => {
      return [
        product.name,
        product.brand,
        product.line,
        product.badge,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value)
            .toLowerCase()
            .includes(term),
        );
    });
  }, [products, search]);

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: CSS,
        }}
      />

      <main className="min-h-screen bg-[color:var(--bg)] text-[color:var(--ink)]">
        {/* =====================================================
            CABEÇALHO
            ===================================================== */}
        <header className="border-b border-[color:var(--line)] bg-white">
          <div className="container flex flex-col gap-6 py-8 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="kicker mb-4">
                Administração da loja
              </div>

              <h1 className="display text-4xl md:text-5xl">
                Produtos
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-[color:var(--muted)]">
                Gerencie catálogo, preço, disponibilidade,
                regras de venda e estoque dos produtos
                capilares.
              </p>
            </div>

            <button
              type="button"
              className="btn btn-wa"
              disabled
              title="Será habilitado na próxima etapa"
            >
              + Novo produto
            </button>
          </div>
        </header>

        {/* =====================================================
            RESUMO
            ===================================================== */}
        <section className="container py-10">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="card p-6">
              <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">
                Total de produtos
              </div>

              <div className="serif mt-3 text-4xl">
                {products.length}
              </div>
            </div>

            <div className="card p-6">
              <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">
                Ativos
              </div>

              <div className="serif mt-3 text-4xl">
                {
                  products.filter(
                    (product) =>
                      product.status === "ACTIVE",
                  ).length
                }
              </div>
            </div>

            <div className="card p-6">
              <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">
                Venda online
              </div>

              <div className="serif mt-3 text-4xl">
                {
                  products.filter(
                    (product) =>
                      product.saleEnabled,
                  ).length
                }
              </div>
            </div>

            <div className="card p-6">
              <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">
                Sob consulta
              </div>

              <div className="serif mt-3 text-4xl">
                {
                  products.filter(
                    (product) =>
                      product.availability ===
                      "UNDER_CONSULTATION",
                  ).length
                }
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            FILTRO
            ===================================================== */}
        <section className="container pb-8">
          <div className="card p-5">
            <label
              htmlFor="product-search"
              className="mb-2 block text-[10px] font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]"
            >
              Buscar produto
            </label>

            <input
              id="product-search"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Digite nome, linha ou marca..."
              className="w-full rounded-[14px] border border-[color:var(--line)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[color:var(--rose2)]"
            />
          </div>
        </section>

        {/* =====================================================
            LISTA DE PRODUTOS
            ===================================================== */}
        <section className="container pb-24">
          <div className="grid gap-5">
            {filteredProducts.map((product) => {
              const mainImage =
                product.images.find(
                  (image) => image.main,
                ) ?? product.images[0];

              return (
                <article
                  key={product.id}
                  className="card overflow-hidden"
                >
                  <div className="grid md:grid-cols-[150px_1fr]">
                    {/* IMAGEM */}
                    <div className="bg-[#f1ece5]">
                      {mainImage ? (
                        <img
                          src={mainImage.url}
                          alt={
                            mainImage.alt ||
                            product.name
                          }
                          className="aspect-square h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex aspect-square items-center justify-center p-6 text-center text-xs text-[color:var(--muted)]">
                          Sem imagem
                        </div>
                      )}
                    </div>

                    {/* DADOS */}
                    <div className="p-6">
                      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[color:var(--rose2)]">
                            {product.brand}

                            {product.line
                              ? ` · ${product.line}`
                              : ""}
                          </div>

                          <h2 className="serif mt-2 text-2xl">
                            {product.name}
                          </h2>

                          <p className="mt-3 max-w-3xl text-sm leading-6 text-[color:var(--muted)]">
                            {
                              product.shortDescription
                            }
                          </p>
                        </div>

                        <div className="flex gap-3">
                          <a
                            href={`/produtos-capilares/${product.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-ghost"
                          >
                            Ver página
                          </a>

                          <button
                            type="button"
                            disabled
                            className="btn btn-wa cursor-not-allowed opacity-60"
                            title="Edição será habilitada na próxima etapa"
                          >
                            Editar
                          </button>
                        </div>
                      </div>

                      {/* STATUS */}
                      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
                        <div className="rounded-[14px] border border-[color:var(--line)] bg-white/70 p-4">
                          <div className="text-[9px] font-bold uppercase tracking-[0.14em] text-[color:var(--muted)]">
                            Status
                          </div>

                          <div className="mt-1 text-sm font-semibold">
                            {product.status}
                          </div>
                        </div>

                        <div className="rounded-[14px] border border-[color:var(--line)] bg-white/70 p-4">
                          <div className="text-[9px] font-bold uppercase tracking-[0.14em] text-[color:var(--muted)]">
                            Preço
                          </div>

                          <div className="mt-1 text-sm font-semibold">
                            {formatPrice(
                              product.price,
                            )}
                          </div>
                        </div>

                        <div className="rounded-[14px] border border-[color:var(--line)] bg-white/70 p-4">
                          <div className="text-[9px] font-bold uppercase tracking-[0.14em] text-[color:var(--muted)]">
                            Venda
                          </div>

                          <div className="mt-1 text-sm font-semibold">
                            {product.saleEnabled
                              ? "Liberada"
                              : "Bloqueada"}
                          </div>
                        </div>

                        <div className="rounded-[14px] border border-[color:var(--line)] bg-white/70 p-4">
                          <div className="text-[9px] font-bold uppercase tracking-[0.14em] text-[color:var(--muted)]">
                            Avaliação
                          </div>

                          <div className="mt-1 text-sm font-semibold">
                            {product.requiresEvaluation
                              ? "Obrigatória"
                              : "Não"}
                          </div>
                        </div>

                        <div className="rounded-[14px] border border-[color:var(--line)] bg-white/70 p-4">
                          <div className="text-[9px] font-bold uppercase tracking-[0.14em] text-[color:var(--muted)]">
                            Protocolo
                          </div>

                          <div className="mt-1 text-sm font-semibold">
                            {product.requiresProtocol
                              ? "Obrigatório"
                              : "Não"}
                          </div>
                        </div>

                        <div className="rounded-[14px] border border-[color:var(--line)] bg-white/70 p-4">
                          <div className="text-[9px] font-bold uppercase tracking-[0.14em] text-[color:var(--muted)]">
                            Disponibilidade
                          </div>

                          <div className="mt-1 text-sm font-semibold">
                            {
                              product.availability
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {filteredProducts.length === 0 && (
            <div className="card p-10 text-center">
              <h2 className="serif text-2xl">
                Nenhum produto encontrado.
              </h2>

              <p className="mt-3 text-sm text-[color:var(--muted)]">
                Tente outro termo de busca.
              </p>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
