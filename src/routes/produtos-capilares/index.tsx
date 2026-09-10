import {
  createFileRoute,
  useRouter,
} from "@tanstack/react-router";

import { ProdutosCapilaresLayout } from "../../components/ui/produtos-capilares-layout";
import { listPublicStoreProducts } from "../../functions/public-store-products";

export const Route = createFileRoute("/produtos-capilares/")({
  loader: async () => listPublicStoreProducts(),
  pendingComponent: ProdutosCapilaresPending,
  errorComponent: ProdutosCapilaresError,
  component: ProdutosCapilaresPage,
});

function ProdutosCapilaresPage() {
  const products = Route.useLoaderData();

  const handleConhecerProdutos = () => {
    document
      .getElementById("catalogo-produtos")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  };

  return (
    <ProdutosCapilaresLayout
      products={products}
      onConhecerProdutos={handleConhecerProdutos}
    />
  );
}

function ProdutosCapilaresPending() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center px-6 py-20">
      <p
        aria-live="polite"
        className="text-sm text-[color:var(--muted)]"
      >
        Carregando catálogo...
      </p>
    </main>
  );
}

function ProdutosCapilaresError({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const router = useRouter();

  const handleRetry = () => {
    router.invalidate();
    reset();
  };

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-6 py-20">
      <div className="card max-w-xl p-8 text-center md:p-10">
        <h1 className="display text-3xl md:text-4xl">
          Catálogo temporariamente indisponível
        </h1>

        <p className="mt-4 text-sm leading-6 text-[color:var(--muted)]">
          Não foi possível carregar os produtos agora. Tente novamente em
          alguns instantes.
        </p>

        <button
          type="button"
          onClick={handleRetry}
          className="btn btn-wa mt-8"
        >
          Tentar novamente
        </button>
      </div>
    </main>
  );
}
