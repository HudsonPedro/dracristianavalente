import { CSS } from "../../routes/index";

type ProdutosCapilaresLayoutProps = {
  onConhecerProdutos?: () => void;
};

export function ProdutosCapilaresLayout({
  onConhecerProdutos,
}: ProdutosCapilaresLayoutProps) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="cine">
        <div className="l l1" />
        <div className="l l2" />
      </div>

      <main className="wrap min-h-screen">
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
      </main>
    </>
  );
}
