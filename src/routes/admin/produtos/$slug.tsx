import { createFileRoute, Link } from "@tanstack/react-router";

import { getStoreProductBySlug } from "../../../functions/store-products";
import { CSS } from "../../index";

export const Route = createFileRoute("/admin/produtos/$slug")({
  loader: async ({ params }) => {
    return getStoreProductBySlug({
      data: params.slug,
    });
  },

  component: AdminProdutoPage,
});

function AdminProdutoPage() {
  const product = Route.useLoaderData();

  if (!product) {
    return (
      <>
        <style
          dangerouslySetInnerHTML={{
            __html: CSS,
          }}
        />

        <main className="min-h-screen bg-[color:var(--bg)] text-[color:var(--ink)]">
          <section className="container flex min-h-[70vh] items-center justify-center py-20">
            <div className="card max-w-xl p-8 text-center md:p-10">
              <div className="kicker mb-6">
                Administração da loja
              </div>

              <h1 className="display text-4xl">
                Produto não encontrado.
              </h1>

              <p className="mt-5 text-sm leading-6 text-[color:var(--muted)]">
                O produto solicitado não existe no banco de produção.
              </p>

              <Link
                to="/admin/produtos"
                className="btn btn-wa mt-8"
              >
                Voltar aos produtos
              </Link>
            </div>
          </section>
        </main>
      </>
    );
  }

  const mainImage =
    product.images.find(
      (image) => image.main,
    ) ?? product.images[0];

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
          <div className="container py-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="kicker mb-4">
                  Administração da loja
                </div>

                <h1 className="display text-4xl md:text-5xl">
                  {product.name}
                </h1>

                <p className="mt-4 max-w-2xl text-sm leading-6 text-[color:var(--muted)]">
                  Visualização administrativa do produto
                  carregado diretamente do banco Neon.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  to="/admin/produtos"
                  className="btn btn-ghost"
                >
                  ← Produtos
                </Link>

                <a
                  href={`/produtos-capilares/${product.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-wa"
                >
                  Ver página →
                </a>
              </div>
            </div>
          </div>
        </header>

        {/* =====================================================
            CONTEÚDO
            ===================================================== */}
        <section className="container py-10 pb-24">
          <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
            {/* =================================================
                IMAGEM
                ================================================= */}
            <div className="card overflow-hidden">
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
                <div className="flex aspect-square items-center justify-center p-8 text-center text-sm text-[color:var(--muted)]">
                  Produto sem imagem cadastrada
                </div>
              )}
            </div>

            {/* =================================================
                DADOS
                ================================================= */}
            <div className="card p-7 md:p-9">
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[color:var(--rose2)]">
                Dados atuais
              </div>

              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                <AdminField
                  label="ID"
                  value={product.id}
                />

                <AdminField
                  label="Slug"
                  value={product.slug}
                />

                <AdminField
                  label="Marca"
                  value={product.brand}
                />

                <AdminField
                  label="Fabricante"
                  value={product.manufacturer}
                />

                <AdminField
                  label="Linha"
                  value={product.line}
                />

                <AdminField
                  label="Categoria principal"
                  value={product.categoryId}
                />

                <AdminField
                  label="Tipo"
                  value={product.usageType}
                />

                <AdminField
                  label="Status"
                  value={product.status}
                />

                <AdminField
                  label="Venda online"
                  value={
                    product.saleEnabled
                      ? "Liberada"
                      : "Bloqueada"
                  }
                />

                <AdminField
                  label="Exibição de preço"
                  value={product.priceVisibility}
                />

                <AdminField
                  label="Avaliação obrigatória"
                  value={
                    product.requiresEvaluation
                      ? "Sim"
                      : "Não"
                  }
                />

                <AdminField
                  label="Protocolo obrigatório"
                  value={
                    product.requiresProtocol
                      ? "Sim"
                      : "Não"
                  }
                />

                <AdminField
                  label="Produto profissional"
                  value={
                    product.professionalProduct
                      ? "Sim"
                      : "Não"
                  }
                />

                <AdminField
                  label="Home Care"
                  value={
                    product.homeCare
                      ? "Sim"
                      : "Não"
                  }
                />

                <AdminField
                  label="Controle de estoque"
                  value="Gerenciado separadamente"
                />

                <AdminField
                  label="Disponibilidade"
                  value={product.availability}
                />

                <AdminField
                  label="Selo"
                  value={product.badge}
                />

                <AdminField
                  label="Preço"
                  value={
                    typeof product.price === "number"
                      ? new Intl.NumberFormat(
                          "pt-BR",
                          {
                            style: "currency",
                            currency: "BRL",
                          },
                        ).format(product.price)
                      : undefined
                  }
                />

                <AdminField
                  label="Preço promocional"
                  value={
                    typeof product.promotionalPrice ===
                    "number"
                      ? new Intl.NumberFormat(
                          "pt-BR",
                          {
                            style: "currency",
                            currency: "BRL",
                          },
                        ).format(
                          product.promotionalPrice,
                        )
                      : undefined
                  }
                />
              </div>

              {/* =================================================
                  DESCRIÇÃO
                  ================================================= */}
              <div className="hair my-8" />

              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[color:var(--rose2)]">
                  Descrição
                </div>

                <p className="mt-3 leading-7 text-[color:var(--muted)]">
                  {product.description ??
                    product.shortDescription}
                </p>
              </div>

              {/* =================================================
                  CATEGORIAS
                  ================================================= */}
              {product.categoryIds.length > 0 && (
                <>
                  <div className="hair my-8" />

                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[color:var(--rose2)]">
                      Categorias
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {product.categoryIds.map(
                        (category) => (
                          <span
                            key={category}
                            className="tag"
                          >
                            {category}
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* =================================================
                  STATUS DA INTEGRAÇÃO
                  ================================================= */}
              <div className="mt-8 rounded-[18px] border border-[color:var(--line)] bg-[color:var(--bg2)]/50 p-6">
                <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[color:var(--rose2)]">
                  Arquitetura da loja
                </div>

                <h2 className="serif mt-3 text-2xl">
                  Produto conectado ao Neon
                </h2>

                <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">
                  Os dados deste produto são
                  carregados diretamente do banco de
                  produção. O controle de estoque é
                  mantido separadamente em
                  store_inventory e será integrado ao
                  painel na próxima etapa.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

function AdminField({
  label,
  value,
}: {
  label: string;
  value?: string;
}) {
  return (
    <div className="rounded-[14px] border border-[color:var(--line)] bg-white/70 p-4">
      <div className="text-[9px] font-bold uppercase tracking-[0.14em] text-[color:var(--muted)]">
        {label}
      </div>

      <div className="mt-2 break-words text-sm font-semibold">
        {value ?? "—"}
      </div>
    </div>
  );
}
