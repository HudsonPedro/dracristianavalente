import { createFileRoute } from "@tanstack/react-router";
import { CSS } from "./index";

export const Route = createFileRoute("/tratamento-capilar-curitiba")({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Tratamento Capilar em Curitiba | Dra. Cristiana Valente",
      },
      {
        name: "description",
        content:
          "Tratamento capilar em Curitiba para queda, afinamento e saúde do couro cabeludo. Conheça a Dra. Cristiana Valente e agende sua avaliação.",
      },
      {
        property: "og:title",
        content:
          "Tratamento Capilar em Curitiba | Dra. Cristiana Valente",
      },
      {
        property: "og:description",
        content:
          "Avaliação e tratamento capilar personalizado para queda de cabelo, afinamento dos fios e saúde do couro cabeludo em Curitiba.",
      },
      {
        property: "og:type",
        content: "website",
      },
      {
        property: "og:url",
        content:
          "https://www.dracristianavalente.com.br/tratamento-capilar-curitiba",
      },
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
    ],
    links: [
      {
        rel: "canonical",
        href:
          "https://www.dracristianavalente.com.br/tratamento-capilar-curitiba",
      },
    ],
  }),

  component: TratamentoCapilarCuritiba,
});

const WA =
  "https://wa.me/5541991599558?text=Ol%C3%A1%20Dra.%20Cristiana%2C%20gostaria%20de%20agendar%20uma%20avalia%C3%A7%C3%A3o%20capilar.";

const faqItems = [
  {
    question: "O que é um tratamento capilar?",
    answer:
      "O tratamento capilar é definido após avaliação individualizada dos fios e do couro cabeludo, considerando queixas como queda, afinamento, enfraquecimento e alterações da saúde capilar.",
  },
  {
    question: "Quando devo procurar uma avaliação capilar?",
    answer:
      "A avaliação pode ser indicada quando há queda persistente, afinamento dos fios, redução de volume, falhas visíveis ou alterações no couro cabeludo.",
  },
  {
    question: "Tratamento capilar ajuda na queda de cabelo?",
    answer:
      "A queda de cabelo pode ter diferentes características e causas. A avaliação permite compreender o quadro e definir um protocolo capilar adequado para cada necessidade.",
  },
  {
    question: "Como é feita a avaliação capilar?",
    answer:
      "A avaliação considera o histórico do paciente, as características dos fios, o padrão de queda e as condições do couro cabeludo para orientar a estratégia de tratamento.",
  },
  {
    question: "Onde fazer tratamento capilar em Curitiba?",
    answer:
      "A Dra. Cristiana Valente realiza avaliação e protocolos capilares personalizados em Curitiba, com atendimento individualizado de acordo com cada necessidade.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

function TratamentoCapilarCuritiba() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />

      <main className="wrap">
        {/* HERO */}
        <header
          id="topo"
          className="container pt-36 pb-20 md:pt-44 md:pb-28"
        >
          <div className="max-w-4xl">
            <div className="reveal kicker">
              Tratamento Capilar em Curitiba
            </div>

            <h1 className="reveal display text-5xl md:text-7xl mt-7">
              Tratamento Capilar
              <br />
              em Curitiba
            </h1>

            <p className="reveal text-lg md:text-xl text-[color:var(--muted)] max-w-3xl mt-7 leading-relaxed">
              A Dra. Cristiana Valente realiza avaliação capilar
              individualizada para compreender a queda de cabelo, o
              afinamento dos fios e as condições do couro cabeludo,
              definindo protocolos personalizados para cada necessidade.
            </p>

            <div className="reveal flex flex-col sm:flex-row gap-4 mt-10">
              <a
                href={WA}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-wa"
              >
                Agendar avaliação
              </a>

              <a
                href="/#protocolos"
                className="btn btn-ghost"
              >
                Conhecer tratamentos
              </a>
            </div>
          </div>
        </header>

        {/* INTRODUÇÃO */}
        <section className="container py-20">
          <div className="max-w-4xl mx-auto">
            <div className="reveal kicker mb-6">
              Saúde dos fios e couro cabeludo
            </div>

            <h2 className="reveal display text-4xl md:text-5xl">
              Quando procurar um tratamento capilar?
            </h2>

            <div className="reveal mt-7 space-y-5 text-[color:var(--muted)] leading-relaxed text-lg">
              <p>
                Alterações como queda persistente, afinamento dos fios,
                diminuição do volume, enfraquecimento ou mudanças no couro
                cabeludo podem indicar a necessidade de uma avaliação
                capilar mais detalhada.
              </p>

              <p>
                Cada pessoa apresenta características diferentes. Por isso,
                o tratamento capilar deve começar pela compreensão do quadro
                e das necessidades individuais, evitando protocolos
                genéricos.
              </p>

              <p>
                Em Curitiba, a Dra. Cristiana Valente realiza atendimento
                individualizado com foco na saúde capilar, buscando
                compreender as características dos fios e do couro cabeludo
                antes da definição do protocolo.
              </p>
            </div>
          </div>
        </section>

        {/* PRINCIPAIS QUEIXAS */}
        <section className="container py-20">
          <div className="reveal max-w-3xl">
            <div className="kicker mb-6">
              Avaliação capilar
            </div>

            <h2 className="display text-4xl md:text-5xl">
              Principais alterações avaliadas
            </h2>

            <p className="text-[color:var(--muted)] mt-6 text-lg leading-relaxed">
              A avaliação capilar permite observar diferentes alterações
              relacionadas aos fios e ao couro cabeludo.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
            <div className="reveal card p-8 protocol">
              <span className="tag">Capilar</span>
              <h3 className="text-2xl mt-4">
                Queda de cabelo
              </h3>
              <p className="text-[color:var(--muted)] mt-4 leading-relaxed">
                Avaliação das características da queda capilar para
                compreender intensidade, duração e alterações percebidas
                pelo paciente.
              </p>
            </div>

            <div className="reveal card p-8 protocol">
              <span className="tag">Fios</span>
              <h3 className="text-2xl mt-4">
                Afinamento capilar
              </h3>
              <p className="text-[color:var(--muted)] mt-4 leading-relaxed">
                Investigação do afinamento e da redução de volume dos fios
                para orientar um protocolo individualizado.
              </p>
            </div>

            <div className="reveal card p-8 protocol">
              <span className="tag">Couro cabeludo</span>
              <h3 className="text-2xl mt-4">
                Saúde do couro cabeludo
              </h3>
              <p className="text-[color:var(--muted)] mt-4 leading-relaxed">
                Avaliação das condições do couro cabeludo como parte
                importante do cuidado e da saúde capilar.
              </p>
            </div>

            <div className="reveal card p-8 protocol">
              <span className="tag">Capilar</span>
              <h3 className="text-2xl mt-4">
                Alopecia
              </h3>
              <p className="text-[color:var(--muted)] mt-4 leading-relaxed">
                Avaliação individualizada de alterações compatíveis com
                diferentes padrões de perda capilar.
              </p>
            </div>

            <div className="reveal card p-8 protocol">
              <span className="tag">Fortalecimento</span>
              <h3 className="text-2xl mt-4">
                Fios enfraquecidos
              </h3>
              <p className="text-[color:var(--muted)] mt-4 leading-relaxed">
                Protocolos definidos conforme as características de fios
                fragilizados e as necessidades observadas na avaliação.
              </p>
            </div>

            <div className="reveal card p-8 protocol">
              <span className="tag">Crescimento</span>
              <h3 className="text-2xl mt-4">
                Redução de volume
              </h3>
              <p className="text-[color:var(--muted)] mt-4 leading-relaxed">
                Avaliação de mudanças percebidas na densidade e no volume
                capilar para direcionar os cuidados.
              </p>
            </div>
          </div>
        </section>

        {/* COMO FUNCIONA */}
        <section className="container py-20">
          <div className="max-w-4xl mx-auto">
            <div className="reveal kicker mb-6">
              Atendimento personalizado
            </div>

            <h2 className="reveal display text-4xl md:text-5xl">
              Como funciona o tratamento capilar?
            </h2>

            <div className="grid md:grid-cols-3 gap-5 mt-12">
              <div className="reveal card p-8">
                <span className="tag">01</span>
                <h3 className="text-xl mt-4">
                  Avaliação
                </h3>
                <p className="text-[color:var(--muted)] mt-4 leading-relaxed">
                  Análise individualizada das queixas, características dos
                  fios e condições do couro cabeludo.
                </p>
              </div>

              <div className="reveal card p-8">
                <span className="tag">02</span>
                <h3 className="text-xl mt-4">
                  Estratégia
                </h3>
                <p className="text-[color:var(--muted)] mt-4 leading-relaxed">
                  Definição do protocolo capilar de acordo com as
                  necessidades identificadas durante a avaliação.
                </p>
              </div>

              <div className="reveal card p-8">
                <span className="tag">03</span>
                <h3 className="text-xl mt-4">
                  Acompanhamento
                </h3>
                <p className="text-[color:var(--muted)] mt-4 leading-relaxed">
                  Acompanhamento da evolução para orientar a continuidade
                  dos cuidados capilares.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* LINK SEO PARA PÁGINA DE QUEDA */}
        <section className="container py-16">
          <div className="reveal card p-8 md:p-10 max-w-4xl mx-auto">
            <span className="tag">Queda capilar</span>

            <h2 className="display text-3xl md:text-4xl mt-5">
              Está enfrentando queda de cabelo?
            </h2>

            <p className="text-[color:var(--muted)] mt-5 leading-relaxed">
              A queda persistente pode apresentar diferentes
              características. Conheça também nossa página específica sobre
              avaliação e tratamento para queda de cabelo em Curitiba.
            </p>

            <a
              href="/tratamento-queda-de-cabelo-curitiba"
              className="inline-flex mt-6 text-sm font-semibold underline underline-offset-4"
            >
              Saiba mais sobre tratamento para queda de cabelo em Curitiba
            </a>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="container py-20">
          <div className="max-w-4xl mx-auto">
            <div className="reveal kicker mb-6">
              Dúvidas frequentes
            </div>

            <h2 className="reveal display text-4xl md:text-5xl">
              Tratamento Capilar em Curitiba: perguntas frequentes
            </h2>

            <div className="mt-10 space-y-4">
              {faqItems.map((item) => (
                <details
                  key={item.question}
                  className="reveal card p-6"
                >
                  <summary className="font-semibold cursor-pointer">
                    {item.question}
                  </summary>

                  <p className="text-[color:var(--muted)] mt-4 leading-relaxed">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="container py-20">
          <div className="reveal card p-8 md:p-12 max-w-4xl mx-auto text-center">
            <div className="kicker mb-6 mx-auto">
              Avaliação capilar em Curitiba
            </div>

            <h2 className="display text-4xl md:text-5xl">
              Cuide da saúde dos seus cabelos
            </h2>

            <p className="text-[color:var(--muted)] mt-6 max-w-2xl mx-auto leading-relaxed text-lg">
              Agende uma avaliação com a Dra. Cristiana Valente para
              compreender as necessidades dos seus fios e do couro cabeludo
              e conhecer as possibilidades de tratamento capilar.
            </p>

            <a
              href={WA}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-wa mt-8"
            >
              Agendar avaliação
            </a>
          </div>
        </section>
      </main>
    </>
  );
}
