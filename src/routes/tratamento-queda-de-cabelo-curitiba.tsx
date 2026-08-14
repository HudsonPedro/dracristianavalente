import { createFileRoute } from "@tanstack/react-router";
import { SeoTreatmentPage } from "../components/SeoTreatmentPage";

export const Route = createFileRoute(
  "/tratamento-queda-de-cabelo-curitiba"
)({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Queda de Cabelo em Curitiba | Dra. Cristiana Valente" },
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
      { property: "og:type", content: "website" },
      {
        property: "og:url",
        content:
          "https://www.dracristianavalente.com.br/tratamento-queda-de-cabelo-curitiba",
      },
      { name: "twitter:card", content: "summary_large_image" },
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

const faqItems = [
  {
    question: "Qual é o melhor tratamento para queda de cabelo?",
    answer:
      "O tratamento depende das características e possíveis causas da queda. Por isso, uma avaliação individualizada deve preceder a definição do protocolo capilar.",
  },
  {
    question: "Quando a queda de cabelo precisa de avaliação?",
    answer:
      "Quando ela se torna persistente, aumenta de intensidade, provoca redução de volume ou surgem alterações no couro cabeludo.",
  },
  {
    question: "Alopecia e calvície podem causar queda de cabelo?",
    answer:
      "Existem diferentes tipos e padrões de perda capilar. A avaliação ajuda a identificar as características do quadro e orientar a estratégia de cuidado.",
  },
  {
    question: "Como funciona a avaliação para queda de cabelo?",
    answer:
      "São avaliados histórico, padrão de queda, características dos fios e condições do couro cabeludo. Conforme o caso, a tricoscopia pode complementar a análise.",
  },
  {
    question: "Onde fazer tratamento para queda de cabelo em Curitiba?",
    answer:
      "A Dra. Cristiana Valente realiza avaliações e tratamentos capilares em Curitiba, com atendimento individualizado para queda de cabelo, alopecia e saúde do couro cabeludo.",
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

function TratamentoQuedaCabeloCuritiba() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <SeoTreatmentPage
        eyebrow="Tratamento capilar em Curitiba"
        title="Tratamento para Queda de Cabelo em Curitiba"
        intro="A Dra. Cristiana Valente realiza avaliação individualizada para compreender as características da queda de cabelo, saúde dos fios e condições do couro cabeludo, definindo protocolos capilares de acordo com cada necessidade."
        primaryHref="/#lead-form"
        secondaryHref="/#protocolos"
        introTitle="Queda de cabelo: quando procurar uma avaliação?"
        introParagraphs={[
          "Perder alguns fios diariamente faz parte do ciclo natural do cabelo. Entretanto, quando a queda se torna persistente, aumenta de intensidade ou começa a provocar redução de volume, afinamento dos fios ou falhas visíveis, é importante investigar suas características.",
          "Diferentes condições podem estar associadas à perda capilar. Por isso, o tratamento para queda de cabelo deve começar com uma avaliação individualizada, considerando histórico, padrão da queda, fios e couro cabeludo.",
        ]}
        cardsTitle="Sinais que merecem atenção"
        cards={[
          {
            title: "Queda persistente",
            description:
              "Aumento perceptível da quantidade de fios que caem durante o banho, ao pentear ou ao longo do dia.",
          },
          {
            title: "Afinamento dos fios",
            description:
              "Fios progressivamente mais finos ou redução da densidade e do volume capilar.",
          },
          {
            title: "Falhas no couro cabeludo",
            description:
              "Áreas com menor quantidade de cabelo ou regiões em que o couro cabeludo se torna mais aparente.",
          },
          {
            title: "Alterações no couro cabeludo",
            description:
              "Oleosidade excessiva, descamação, sensibilidade ou outras alterações associadas à saúde capilar.",
          },
          {
            title: "Queda após períodos específicos",
            description:
              "Mudanças importantes na quantidade de fios após determinados períodos ou acontecimentos.",
          },
          {
            title: "Histórico de alopecia",
            description:
              "Padrões de perda capilar que precisam ser avaliados individualmente para definição da abordagem adequada.",
          },
        ]}
        evaluationEyebrow="Avaliação capilar"
        evaluationTitle="O primeiro passo para tratar a queda de cabelo"
        evaluationParagraphs={[
          "Antes de definir um tratamento, é importante compreender como a queda está acontecendo e quais características estão presentes em cada paciente.",
          "Durante a avaliação capilar são considerados o histórico, padrão da queda, espessura e qualidade dos fios e condições do couro cabeludo. Conforme a necessidade, a tricoscopia pode auxiliar nessa análise.",
        ]}
        stepsTitle="Tratamentos capilares para queda de cabelo"
        steps={[
          {
            number: "01",
            title: "Terapia Capilar",
            description:
              "Protocolos direcionados à saúde dos fios e do couro cabeludo, definidos de acordo com cada avaliação.",
          },
          {
            number: "02",
            title: "Tricoscopia",
            description:
              "Recurso de avaliação para observar características dos fios e do couro cabeludo com maior detalhamento.",
          },
          {
            number: "03",
            title: "Acompanhamento",
            description:
              "Monitoramento da evolução e ajustes conforme a resposta individual ao plano de cuidado.",
          },
        ]}
        localEyebrow="Atendimento em Curitiba"
        localTitle="Tratamento para queda de cabelo com a Dra. Cristiana Valente em Curitiba"
        localParagraphs={[
          "A Dra. Cristiana Valente realiza atendimento capilar em Curitiba com foco em queda de cabelo, alopecia, afinamento capilar e saúde do couro cabeludo.",
          "O atendimento é individualizado e o protocolo é definido somente após avaliação das necessidades de cada paciente.",
        ]}
        faqTitle="Dúvidas sobre Queda de Cabelo"
        faqItems={faqItems}
        finalEyebrow="Avaliação capilar em Curitiba"
        finalTitle="Sua queda de cabelo merece uma avaliação individualizada"
        finalText="Converse com a Dra. Cristiana Valente e conheça as possibilidades de cuidado indicadas de acordo com as necessidades dos seus cabelos e couro cabeludo."
        finalHref="/#lead-form"
        relatedHref="/tratamento-capilar-curitiba"
        relatedLabel="Conheça também o tratamento capilar em Curitiba"
      />
    </>
  );
}
