import { createFileRoute } from "@tanstack/react-router";
import { ProdutosCapilaresLayout } from "../components/ui/produtos-capilares-layout";

export const Route = createFileRoute("/produtos-capilares")({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title:
          "Produtos Capilares DNA VITAL | Dra. Cristiana Valente",
      },
      {
        name: "description",
        content:
          "Produtos capilares DNA VITAL selecionados para complementar protocolos, Home Care e cuidados personalizados com a Dra. Cristiana Valente.",
      },
    ],
    links: [
      {
        rel: "canonical",
        href:
          "https://www.dracristianavalente.com.br/produtos-capilares",
      },
    ],
  }),
  component: ProdutosCapilaresPage,
});

function ProdutosCapilaresPage() {
  const irParaProdutos = () => {
    const destino = document.getElementById("catalogo-produtos");

    if (destino) {
      destino.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <ProdutosCapilaresLayout
      onConhecerProdutos={irParaProdutos}
    />
  );
}
