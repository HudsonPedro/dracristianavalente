import { createFileRoute } from "@tanstack/react-router";

import { ProdutosCapilaresLayout } from "../../components/ui/produtos-capilares-layout";

export const Route = createFileRoute("/produtos-capilares/")({
  component: ProdutosCapilaresPage,
});

function ProdutosCapilaresPage() {
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
      onConhecerProdutos={handleConhecerProdutos}
    />
  );
}
