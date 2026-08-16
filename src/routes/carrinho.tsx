import { createFileRoute } from "@tanstack/react-router";

import { CSS } from "./index";
import {
  getProductSalePrice,
  useCart,
} from "../contexts/cart-context";

export const Route = createFileRoute("/carrinho")({
  component: CarrinhoPage,
});

function formatPrice(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function CarrinhoPage() {
  const {
    items,
    totalItems,
    subtotal,
    isEmpty,
    isHydrated,
    incrementItem,
    decrementItem,
    removeItem,
    clearCart,
  } = useCart();

  if (!isHydrated) {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: CSS }} />

        <main className="wrap min-h-screen">
          <section className="container flex min-h-[70vh] items-center justify-center py-20">
            <p className="text-sm text-[color:var(--muted)]">
              Carregando carrinho...
            </p>
          </section>
        </main>
      </>
    );
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <main className="wrap min-h-screen">
        {/* =====================================================
            HERO
            ===================================================== */}
        <section className="container pb-12 pt-28 md:pb-16 md:pt-36">
          <div className="max-w-4xl">
            <div className="kicker mb-6">
              Loja Dra. Cristiana Valente
            </div>

            <h1 className="display text-5xl md:text-7xl">
              Seu{" "}
              <span className="rosetext italic">
                carrinho.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-[color:var(--muted)]">
              Confira os produtos selecionados antes de continuar
              para a próxima etapa da compra.
            </p>
          </div>
        </section>

        {/* =====================================================
            CARRINHO VAZIO
            ===================================================== */}
        {isEmpty ? (
          <section className="container pb-24">
            <div className="card mx-auto max-w-4xl p-8 text-center md:p-12">
              <div className="serif rosetext text-5xl">
                0
              </div>

              <h2 className="display mt-5 text-3xl md:text-4xl">
                Seu carrinho está vazio.
              </h2>

              <p className="mx-auto mt-5 max-w-xl leading-relaxed text-[color:var(--muted)]">
                Explore os produtos capilares disponíveis e adicione
                ao carrinho aqueles que estiverem liberados para
                compra online.
              </p>

              <a
                href="/produtos-capilares"
                className="btn btn-wa mt-8"
              >
                Conhecer produtos →
              </a>
            </div>
          </section>
        ) : (
          <section className="container pb-24">
            <div className="grid gap-10 lg:grid-cols-[1fr_360px] lg:items-start">
              {/* =================================================
                  PRODUTOS
                  ================================================= */}
              <div>
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[color:var(--rose2)]">
                      Produtos selecionados
                    </div>

                    <h2 className="serif mt-2 text-3xl">
                      {totalItems}{" "}
                      {totalItems === 1
                        ? "item"
                        : "itens"}
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={clearCart}
                    className="text-sm font-semibold text-[color:var(--muted)] transition hover:text-[color:var(--ink)]"
                  >
                    Limpar carrinho
                  </button>
                </div>

                <div className="grid gap-5">
                  {items.map(({ product, quantity }) => {
                    const unitPrice =
                      getProductSalePrice(product);

                    const itemTotal =
                      unitPrice * quantity;

                    return (
                      <article
                        key={product.id}
                        className="card protocol overflow-hidden"
                      >
                        <div className="grid md:grid-cols-[180px_1fr]">
                          {/* IMAGEM */}
                          <a
                            href={`/produtos-capilares/${product.slug}`}
                            className="block bg-[#f1ece5]"
                          >
                            {product.images[0] ? (
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="aspect-square h-full w-full object-cover md:aspect-auto"
                              />
                            ) : (
                              <div className="flex aspect-square items-center justify-center p-6 text-center text-sm text-[color:var(--muted)]">
                                Imagem do produto
                              </div>
                            )}
                          </a>

                          {/* CONTEÚDO */}
                          <div className="flex flex-col p-6 md:p-7">
                            <div>
                              <div className="text-[10px] font-bold uppercase tracking-[0.17em] text-[color:var(--rose2)]">
                                {product.brand}
                                {product.line
                                  ? ` · ${product.line}`
                                  : ""}
                              </div>

                              <a
                                href={`/produtos-capilares/${product.slug}`}
                              >
                                <h3 className="serif mt-2 text-2xl transition hover:text-[color:var(--rose2)]">
                                  {product.name}
                                </h3>
                              </a>

                              <p className="mt-3 max-w-xl text-sm leading-6 text-[color:var(--muted)]">
                                {product.shortDescription}
                              </p>
                            </div>

                            <div className="mt-6 flex flex-col gap-5 border-t border-[color:var(--line)] pt-5 sm:flex-row sm:items-end sm:justify-between">
                              {/* QUANTIDADE */}
                              <div>
                                <div className="mb-2 text-[9px] font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">
                                  Quantidade
                                </div>

                                <div className="inline-flex items-center overflow-hidden rounded-full border border-[color:var(--line)] bg-white">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      decrementItem(
                                        product.id,
                                      )
                                    }
                                    aria-label={`Diminuir quantidade de ${product.name}`}
                                    className="flex h-10 w-10 items-center justify-center text-lg transition hover:bg-[color:var(--bg2)]"
                                  >
                                    −
                                  </button>

                                  <span className="min-w-10 text-center text-sm font-semibold">
                                    {quantity}
                                  </span>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      incrementItem(
                                        product.id,
                                      )
                                    }
                                    aria-label={`Aumentar quantidade de ${product.name}`}
                                    className="flex h-10 w-10 items-center justify-center text-lg transition hover:bg-[color:var(--bg2)]"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>

                              {/* PREÇO */}
                              <div className="sm:text-right">
                                <div className="text-xs text-[color:var(--muted)]">
                                  {formatPrice(
                                    unitPrice,
                                  )}{" "}
                                  cada
                                </div>

                                <div className="serif mt-1 text-2xl">
                                  {formatPrice(
                                    itemTotal,
                                  )}
                                </div>

                                <button
                                  type="button"
                                  onClick={() =>
                                    removeItem(
                                      product.id,
                                    )
                                  }
                                  className="mt-2 text-xs font-semibold text-[color:var(--muted)] transition hover:text-[color:var(--rose2)]"
                                >
                                  Remover
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>

                <a
                  href="/produtos-capilares"
                  className="btn btn-ghost mt-8"
                >
                  ← Continuar escolhendo
                </a>
              </div>

              {/* =================================================
                  RESUMO
                  ================================================= */}
              <aside className="card sticky top-6 p-7 md:p-8">
                <div className="kicker mb-5">
                  Resumo
                </div>

                <h2 className="serif text-3xl">
                  Sua compra
                </h2>

                <div className="mt-7 grid gap-4">
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-[color:var(--muted)]">
                      Produtos
                    </span>

                    <span>
                      {formatPrice(
                        subtotal,
                      )}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-[color:var(--muted)]">
                      Frete
                    </span>

                    <span className="text-[color:var(--muted)]">
                      Próxima etapa
                    </span>
                  </div>
                </div>

                <div className="hair my-6" />

                <div className="flex items-end justify-between gap-4">
                  <div>
                    <div className="text-[9px] font-bold uppercase tracking-[0.17em] text-[color:var(--muted)]">
                      Subtotal
                    </div>

                    <div className="serif mt-1 text-3xl">
                      {formatPrice(
                        subtotal,
                      )}
                    </div>
                  </div>

                  <span className="text-xs text-[color:var(--muted)]">
                    {totalItems}{" "}
                    {totalItems === 1
                      ? "item"
                      : "itens"}
                  </span>
                </div>

                {/* O checkout ainda será criado.
                    Não apontamos para pagamento inexistente. */}
                <button
                  type="button"
                  disabled
                  className="btn btn-wa mt-7 w-full cursor-not-allowed opacity-55"
                >
                  Continuar compra
                </button>

                <p className="mt-4 text-center text-xs leading-5 text-[color:var(--muted)]">
                  A etapa de identificação, entrega e pagamento
                  será habilitada na sequência.
                </p>

                <div className="hair my-6" />

                <div className="grid gap-3 text-xs leading-5 text-[color:var(--muted)]">
                  <p>
                    ✓ Somente produtos liberados para venda online
                    podem entrar no carrinho.
                  </p>

                  <p>
                    ✓ Produtos sujeitos a avaliação ou protocolo
                    continuam no atendimento profissional.
                  </p>

                  <p>
                    ✓ Valores e disponibilidade são validados a
                    partir do catálogo atual.
                  </p>
                </div>
              </aside>
            </div>
          </section>
        )}
      </main>
    </>
  );
}
