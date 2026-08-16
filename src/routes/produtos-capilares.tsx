import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/produtos-capilares")({
  component: ProdutosCapilaresRoute,
});

function ProdutosCapilaresRoute() {
  return <Outlet />;
}
