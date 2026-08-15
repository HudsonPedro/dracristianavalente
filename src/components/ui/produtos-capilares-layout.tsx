type ProdutosCapilaresLayoutProps = {
  onConhecerProdutos?: () => void;
};

export function ProdutosCapilaresLayout({
  onConhecerProdutos,
}: ProdutosCapilaresLayoutProps) {
  return (
    <div className="min-h-screen bg-[#f7f4ef] text-[#252525]">
      <section className="relative flex min-h-[92vh] items-center overflow-hidden">
        <div className="mx-auto w-full max-w-7xl px-6 py-24 md:px-10 lg:px-12">
          <div className="max-w-4xl">
            <div className="mb-7 text-xs font-semibold uppercase tracking-[0.22em] text-[#9a7a50]">
              Dra. Cristiana Valente · Terapia Capilar
            </div>

            <h1 className="max-w-4xl font-serif text-5xl leading-[0.98] tracking-[-0.04em] md:text-7xl lg:text-[86px]">
              Sua rotina capilar também faz parte do tratamento.
            </h1>

            <p className="mt-8 max-w-2xl text-base leading-7 text-black/60 md:text-lg">
              Produtos selecionados para complementar protocolos de terapia
              capilar, manutenção e cuidados personalizados.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={onConhecerProdutos}
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#252525] px-7 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-black"
              >
                Conhecer produtos
              </button>

              <a
                href="/avaliacao-capilar-curitiba"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-black/15 px-7 text-sm font-semibold transition duration-300 hover:border-black/30 hover:bg-white"
              >
                Agendar avaliação capilar
              </a>
            </div>
          </div>
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 top-1/2 h-[460px] w-[460px] -translate-y-1/2 rounded-full border border-black/[0.06] md:h-[650px] md:w-[650px]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-12 top-1/2 h-[300px] w-[300px] -translate-y-1/2 rounded-full border border-black/[0.05] md:h-[470px] md:w-[470px]"
        />
      </section>
    </div>
  );
}
