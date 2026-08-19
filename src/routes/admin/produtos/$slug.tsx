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

function translateUsageType(value: string) {
  switch (value) {
    case "PROFESSIONAL":
      return "Profissional";

    case "HOME_CARE":
      return "Home Care";

    case "PROFESSIONAL_AND_HOME_CARE":
      return "Profissional e Home Care";

    default:
      return value;
  }
}

function translateStatus(value: string) {
  switch (value) {
    case "ACTIVE":
      return "Ativo";

    case "INACTIVE":
      return "Inativo";

    case "DRAFT":
      return "Rascunho";

    case "OUT_OF_STOCK":
      return "Sem estoque";

    default:
      return value;
  }
}

function translatePriceVisibility(value: string) {
  switch (value) {
    case "SHOW_PRICE":
      return "Exibir preço";

    case "HIDE_PRICE":
      return "Ocultar preço";

    case "CONTACT_FOR_PRICE":
      return "Consultar preço";

    case "REQUIRES_EVALUATION":
      return "Requer avaliação";

    case "REQUIRES_PROTOCOL":
      return "Requer protocolo";

    default:
      return value;
  }
}

function translateAvailability(value: string) {
  switch (value) {
    case "AVAILABLE":
      return "Disponível";

    case "UNAVAILABLE":
      return "Indisponível";

    case "UNDER_CONSULTATION":
      return "Sob consulta";

    default:
      return value;
  }
}

function formatPrice(value?: number) {
  if (typeof value !== "number") {
    return undefined;
  }

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

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
                O produto solicitado não foi encontrado.
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
                  Consulte os dados comerciais e as configurações
                  atuais deste produto.
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

        <section className="container py-10 pb-24">
          <div className="grid items-start gap-6 lg:grid-cols-[380px_1fr]">

            {/* IMAGEM */}
            <div className="card overflow-hidden">
              {mainImage ? (
                <img
                  src={mainImage.url}
                  alt={mainImage.alt || product.name}
                  className="block h-auto w-full"
                />
              ) : (
                <div className="flex min-h-[320px] items-center justify-center p-8 text-center text-sm text-[color:var(--muted)]">
                  Produto sem imagem cadastrada
                </div>
              )}
            </div>

            {/* DADOS */}
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
                  value={translateUsageType(product.usageType)}
                />

                <AdminField
                  label="Status"
                  value={translateStatus(product.status)}
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
                  value={translatePriceVisibility(
                    product.priceVisibility,
                  )}
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
                  value={translateAvailability(
                    product.availability,
                  )}
                />

                <AdminField
                  label="Selo"
                  value={product.badge}
                />

                <AdminField
                  label="Preço"
                  value={formatPrice(product.price)}
                />

                <AdminField
                  label="Preço promocional"
                  value={formatPrice(
                    product.promotionalPrice,
                  )}
                />
              </div>

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
