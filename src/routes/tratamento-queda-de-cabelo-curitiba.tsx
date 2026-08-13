import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/tratamento-queda-de-cabelo-curitiba"
)({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },

      {
        title: "Queda de Cabelo em Curitiba | Dra. Cristiana Valente",
      },

      {
        name: "description",
        content:
          "Tratamento para queda de cabelo em Curitiba com avaliação individualizada da saúde capilar e do couro cabeludo. Conheça e agende sua avaliação.",
      },

      {
        property: "og:title",
        content:
          "Tratamento para Queda de Cabelo em Curitiba | Dra. Cristiana Valente",
      },

      {
        property: "og:description",
        content:
          "Avaliação e tratamento personalizado para queda de cabelo, alopecia e alterações do couro cabeludo em Curitiba.",
      },

      {
        property: "og:type",
        content: "website",
      },

      {
        property: "og:url",
        content:
          "https://www.dracristianavalente.com.br/tratamento-queda-de-cabelo-curitiba",
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
          "https://www.dracristianavalente.com.br/tratamento-queda-de-cabelo-curitiba",
      },
    ],
  }),

  component: TratamentoQuedaCabeloCuritiba,
});

function TratamentoQuedaCabeloCuritiba() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",

    mainEntity: [
      {
        "@type": "Question",
        name: "Qual é o melhor tratamento para queda de cabelo?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "O tratamento depende das características e possíveis causas da queda. Por isso, a avaliação individualizada é importante antes da indicação do protocolo capilar.",
        },
      },

      {
        "@type": "Question",
        name: "Quando a queda de cabelo precisa de avaliação?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Quando a queda é persistente, aumenta de intensidade, provoca redução do volume dos fios ou surgem alterações no couro cabeludo, é indicado realizar uma avaliação profissional.",
        },
      },

      {
        "@type": "Question",
        name: "Alopecia e calvície podem causar queda de cabelo?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Sim. Existem diferentes tipos de alopecia e padrões de perda capilar. A identificação das características do quadro ajuda a determinar a abordagem mais adequada.",
        },
      },

      {
        "@type": "Question",
        name: "Como funciona uma avaliação para queda de cabelo?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "A avaliação considera o histórico, padrão da queda, características dos fios e condições do couro cabeludo. Conforme o caso, a tricoscopia pode auxiliar na análise capilar.",
        },
      },

      {
        "@type": "Question",
        name: "Onde fazer tratamento para queda de cabelo em Curitiba?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "A Dra. Cristiana Valente realiza avaliação e tratamentos capilares em Curitiba, com atendimento individualizado para queda de cabelo, alopecia, calvície e saúde do couro cabeludo.",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />

      <main>

        {/* HERO */}
        <section className="container pt-24 pb-20 md:pt-36 md:pb-28">

          <div className="max-w-4xl">

            <div className="kicker mb-7">
              Tratamento capilar em Curitiba
            </div>

            <h1 className="display text-5xl md:text-7xl leading-tight">
              Tratamento para Queda de Cabelo em Curitiba
            </h1>

            <p className="text-lg md:text-xl text-[color:var(--muted)] mt-7 max-w-3xl leading-relaxed">
              A Dra. Cristiana Valente realiza avaliação individualizada
              para compreender as características da queda de cabelo,
              saúde dos fios e condições do couro cabeludo, definindo
              protocolos capilares de acordo com cada necessidade.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-10">

              <a
                href="/#lead-form"
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

        </section>


        {/* INTRODUÇÃO */}
        <section className="container py-20">

          <div className="max-w-4xl mx-auto">

            <h2 className="display text-4xl md:text-5xl">
              Queda de cabelo: quando procurar uma avaliação?
            </h2>

            <p className="text-lg text-[color:var(--muted)] mt-7 leading-relaxed">
              Perder alguns fios diariamente faz parte do ciclo natural
              do cabelo. Entretanto, quando a queda se torna persistente,
              aumenta de intensidade ou começa a provocar redução de
              volume, afinamento dos fios ou falhas visíveis, é importante
              investigar suas características.
            </p>

            <p className="text-lg text-[color:var(--muted)] mt-5 leading-relaxed">
              Diferentes condições podem estar associadas à perda capilar.
              Por isso, o tratamento para queda de cabelo deve começar
              com uma avaliação individualizada, considerando histórico,
              padrão da queda, fios e couro cabeludo.
            </p>

          </div>

        </section>


        {/* SINAIS */}
        <section className="container py-20">

          <div className="max-w-5xl mx-auto">

            <h2 className="display text-4xl md:text-5xl text-center">
              Sinais que merecem atenção
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">

              <div className="card p-7">
                <h3 className="text-xl font-semibold">
                  Queda persistente
                </h3>

                <p className="text-[color:var(--muted)] mt-3 leading-relaxed">
                  Aumento perceptível da quantidade de fios que caem
                  durante o banho, ao pentear ou ao longo do dia.
                </p>
              </div>


              <div className="card p-7">
                <h3 className="text-xl font-semibold">
                  Afinamento dos fios
                </h3>

                <p className="text-[color:var(--muted)] mt-3 leading-relaxed">
                  Fios progressivamente mais finos ou redução da
                  densidade e do volume capilar.
                </p>
              </div>


              <div className="card p-7">
                <h3 className="text-xl font-semibold">
                  Falhas no couro cabeludo
                </h3>

                <p className="text-[color:var(--muted)] mt-3 leading-relaxed">
                  Áreas com menor quantidade de cabelo ou regiões em que
                  o couro cabeludo se torna mais aparente.
                </p>
              </div>


              <div className="card p-7">
                <h3 className="text-xl font-semibold">
                  Alterações no couro cabeludo
                </h3>

                <p className="text-[color:var(--muted)] mt-3 leading-relaxed">
                  Oleosidade excessiva, descamação, sensibilidade ou
                  outras alterações associadas à saúde capilar.
                </p>
              </div>


              <div className="card p-7">
                <h3 className="text-xl font-semibold">
                  Queda após períodos específicos
                </h3>

                <p className="text-[color:var(--muted)] mt-3 leading-relaxed">
                  Mudanças importantes na quantidade de fios após
                  determinados períodos ou acontecimentos.
                </p>
              </div>


              <div className="card p-7">
                <h3 className="text-xl font-semibold">
                  Histórico de alopecia
                </h3>

                <p className="text-[color:var(--muted)] mt-3 leading-relaxed">
                  Padrões de perda capilar que precisam ser avaliados
                  individualmente para definição da abordagem adequada.
                </p>
              </div>

            </div>

          </div>

        </section>


        {/* AVALIAÇÃO */}
        <section className="container py-20">

          <div className="max-w-4xl mx-auto">

            <div className="kicker mb-6">
              Avaliação capilar
            </div>

            <h2 className="display text-4xl md:text-5xl">
              O primeiro passo para tratar a queda de cabelo
            </h2>

            <p className="text-lg text-[color:var(--muted)] mt-7 leading-relaxed">
              Antes de definir um tratamento, é importante compreender
              como a queda está acontecendo e quais características
              estão presentes em cada paciente.
            </p>

            <p className="text-lg text-[color:var(--muted)] mt-5 leading-relaxed">
              Durante a avaliação capilar são considerados o histórico,
              padrão da queda, espessura e qualidade dos fios e condições
              do couro cabeludo. Conforme a necessidade, a tricoscopia
              pode auxiliar nessa análise.
            </p>

          </div>

        </section>


        {/* TRATAMENTOS */}
        <section className="container py-20">

          <div className="max-w-5xl mx-auto">

            <h2 className="display text-4xl md:text-5xl">
              Tratamentos capilares para queda de cabelo
            </h2>

            <p className="text-lg text-[color:var(--muted)] mt-6 max-w-4xl leading-relaxed">
              O protocolo é definido de forma individualizada após a
              avaliação. Dependendo das características do quadro,
              diferentes estratégias de cuidado capilar podem ser
              consideradas.
            </p>

            <div className="grid md:grid-cols-2 gap-5 mt-12">

              <div className="card p-8">
                <span className="tag">
                  Capilar
                </span>

                <h3 className="text-2xl font-semibold mt-4">
                  Terapia Capilar Avançada
                </h3>

                <p className="text-[color:var(--muted)] mt-4 leading-relaxed">
                  Protocolos direcionados à saúde dos fios e do couro
                  cabeludo, definidos de acordo com cada avaliação.
                </p>
              </div>


              <div className="card p-8">
                <span className="tag">
                  Avaliação
                </span>

                <h3 className="text-2xl font-semibold mt-4">
                  Tricoscopia Capilar
                </h3>

                <p className="text-[color:var(--muted)] mt-4 leading-relaxed">
                  Recurso de avaliação que permite observar características
                  dos fios e do couro cabeludo com maior detalhamento.
                </p>
              </div>


              <div className="card p-8">
                <span className="tag">
                  Queda capilar
                </span>

                <h3 className="text-2xl font-semibold mt-4">
                  Protocolos para Alopecia
                </h3>

                <p className="text-[color:var(--muted)] mt-4 leading-relaxed">
                  Abordagens personalizadas para diferentes padrões de
                  perda capilar, conforme avaliação individual.
                </p>
              </div>


              <div className="card p-8">
                <span className="tag">
                  Couro cabeludo
                </span>

                <h3 className="text-2xl font-semibold mt-4">
                  Saúde do Couro Cabeludo
                </h3>

                <p className="text-[color:var(--muted)] mt-4 leading-relaxed">
                  Cuidados direcionados às condições do couro cabeludo
                  que podem interferir na saúde e qualidade dos fios.
                </p>
              </div>

            </div>

          </div>

        </section>


        {/* LOCAL SEO */}
        <section className="container py-20">

          <div className="max-w-4xl mx-auto">

            <div className="kicker mb-6">
              Atendimento em Curitiba
            </div>

            <h2 className="display text-4xl md:text-5xl">
              Tratamento para queda de cabelo com a Dra. Cristiana
              Valente em Curitiba
            </h2>

            <p className="text-lg text-[color:var(--muted)] mt-7 leading-relaxed">
              A Dra. Cristiana Valente realiza atendimento capilar em
              Curitiba com foco em queda de cabelo, alopecia, afinamento
              capilar e saúde do couro cabeludo.
            </p>

            <p className="text-lg text-[color:var(--muted)] mt-5 leading-relaxed">
              O atendimento é individualizado e o protocolo é definido
              somente após avaliação das necessidades de cada paciente.
            </p>

            <a
              href="/#lead-form"
              className="btn btn-wa mt-9"
            >
              Agendar minha avaliação
            </a>

          </div>

        </section>


        {/* FAQ */}
        <section className="container py-24 max-w-3xl">

          <h2 className="display text-4xl md:text-5xl mb-10 text-center">
            Dúvidas sobre Queda de Cabelo
          </h2>

          <div>

            <details className="faq">
              <summary>
                Qual é o melhor tratamento para queda de cabelo?
                <span className="pl">+</span>
              </summary>

              <p className="pb-5 text-[color:var(--muted)] leading-relaxed">
                O tratamento depende das características e possíveis
                causas da queda. Por isso, uma avaliação individualizada
                deve preceder a definição do protocolo capilar.
              </p>
            </details>


            <details className="faq">
              <summary>
                Quando a queda de cabelo precisa de avaliação?
                <span className="pl">+</span>
              </summary>

              <p className="pb-5 text-[color:var(--muted)] leading-relaxed">
                Quando ela se torna persistente, aumenta de intensidade,
                provoca redução de volume ou surgem alterações no couro
                cabeludo.
              </p>
            </details>


            <details className="faq">
              <summary>
                Alopecia e calvície podem causar queda de cabelo?
                <span className="pl">+</span>
              </summary>

              <p className="pb-5 text-[color:var(--muted)] leading-relaxed">
                Existem diferentes tipos e padrões de perda capilar.
                A avaliação ajuda a identificar as características do
                quadro e orientar a estratégia de cuidado.
              </p>
            </details>


            <details className="faq">
              <summary>
                Como funciona a avaliação para queda de cabelo?
                <span className="pl">+</span>
              </summary>

              <p className="pb-5 text-[color:var(--muted)] leading-relaxed">
                São avaliados histórico, padrão de queda, características
                dos fios e condições do couro cabeludo. Conforme o caso,
                a tricoscopia pode complementar a análise.
              </p>
            </details>


            <details className="faq">
              <summary>
                Onde fazer tratamento para queda de cabelo em Curitiba?
                <span className="pl">+</span>
              </summary>

              <p className="pb-5 text-[color:var(--muted)] leading-relaxed">
                A Dra. Cristiana Valente realiza avaliações e tratamentos
                capilares em Curitiba, com atendimento individualizado
                para queda de cabelo, alopecia e saúde do couro cabeludo.
              </p>
            </details>

          </div>

        </section>


        {/* CTA FINAL */}
        <section className="container py-24">

          <div className="card p-8 md:p-12 max-w-4xl mx-auto text-center">

            <div className="kicker mx-auto mb-6">
              Avaliação capilar em Curitiba
            </div>

            <h2 className="display text-4xl md:text-5xl">
              Sua queda de cabelo merece uma avaliação individualizada
            </h2>

            <p className="text-lg text-[color:var(--muted)] mt-6 max-w-2xl mx-auto leading-relaxed">
              Converse com a Dra. Cristiana Valente e conheça as
              possibilidades de cuidado indicadas de acordo com as
              necessidades dos seus cabelos e couro cabeludo.
            </p>

            <a
              href="/#lead-form"
              className="btn btn-wa mt-9"
            >
              Agendar avaliação
            </a>

          </div>

        </section>


        {/* LINK INTERNO */}
        <section className="container pb-24">

          <div className="text-center">

            <p className="text-[color:var(--muted)]">
              Conheça também todos os{" "}
              <a
                href="/#protocolos"
                className="underline"
              >
                tratamentos capilares da Dra. Cristiana Valente
              </a>
              .
            </p>

          </div>

        </section>

      </main>
    </>
  );
}
