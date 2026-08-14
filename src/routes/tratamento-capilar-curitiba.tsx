import { createFileRoute } from "@tanstack/react-router";
import { SeoTreatmentPage } from "../components/ui/seo-treatment-page";

export const Route = createFileRoute("/tratamento-capilar-curitiba")({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Tratamento Capilar em Curitiba | Dra. Cristiana Valente" },
      {
        name: "description",
        content:
          "Tratamento capilar em Curitiba para queda, afinamento e saúde do couro cabeludo. Conheça a Dra. Cristiana Valente e agende sua avaliação.",
      },
      {
        property: "og:title",
        content: "Tratamento Capilar em Curitiba | Dra. Cristiana Valente",
      },
      {
        property: "og:description",
        content:
          "Avaliação e tratamento capilar personalizado para queda de cabelo, afinamento dos fios e saúde do couro cabeludo em Curitiba.",
      },
      { property: "og:type", content: "website" },
      {
        property: "og:url",
        content:
          "https://www.dracristianavalente.com.br/tratamento-capilar-curitiba",
      },
      { name: "twitter:card", content: "summary_large_image" },
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <SeoTreatmentPage
        eyebrow="Tratamento capilar em Curitiba"
        title="Tratamento Capilar em Curitiba"
        intro="A Dra. Cristiana Valente realiza avaliação capilar individualizada para compreender a queda de cabelo, o afinamento dos fios e as condições do couro cabeludo, definindo protocolos personalizados para cada necessidade."
        primaryHref="/#lead-form"
        secondaryHref="/#protocolos"
        introTitle="Quando procurar um tratamento capilar?"
        introParagraphs={[
          "Alterações como queda persistente, afinamento dos fios, diminuição do volume, enfraquecimento ou mudanças no couro cabeludo podem indicar a necessidade de uma avaliação capilar mais detalhada.",
          "Cada pessoa apresenta características diferentes. Por isso, o tratamento capilar deve começar pela compreensão do quadro e das necessidades individuais, evitando protocolos genéricos.",
        ]}
        cardsTitle="Principais alterações avaliadas"
        cardsIntro="A avaliação capilar permite observar diferentes alterações relacionadas aos fios e ao couro cabeludo."
        cards={[
          {
            tag: "Capilar",
            title: "Queda de cabelo",
            description:
              "Avaliação das características da queda capilar para compreender intensidade, duração e alterações percebidas pelo paciente.",
          },
          {
            tag: "Fios",
            title: "Afinamento capilar",
            description:
              "Investigação do afinamento e da redução de volume dos fios para orientar um protocolo individualizado.",
          },
          {
            tag: "Couro cabeludo",
            title: "Saúde do couro cabeludo",
            description:
              "Avaliação das condições do couro cabeludo como parte importante do cuidado e da saúde capilar.",
          },
          {
            tag: "Capilar",
            title: "Alopecia",
            description:
              "Avaliação individualizada de alterações compatíveis com diferentes padrões de perda capilar.",
          },
          {
            tag: "Fortalecimento",
            title: "Fios enfraquecidos",
            description:
              "Protocolos definidos conforme as características de fios fragilizados e as necessidades observadas na avaliação.",
          },
          {
            tag: "Crescimento",
            title: "Redução de volume",
            description:
              "Avaliação de mudanças percebidas na densidade e no volume capilar para direcionar os cuidados.",
          },
        ]}
        evaluationEyebrow="Avaliação capilar"
        evaluationTitle="O primeiro passo é compreender o seu quadro"
        evaluationParagraphs={[
          "A avaliação considera histórico, padrão de queda, características dos fios e condições do couro cabeludo.",
          "Conforme a necessidade, a tricoscopia pode auxiliar na análise e no planejamento do cuidado capilar.",
        ]}
        stepsTitle="Como funciona o tratamento capilar?"
        steps={[
          {
            number: "01",
            title: "Avaliação",
            description:
              "Análise individualizada das queixas, características dos fios e condições do couro cabeludo.",
          },
          {
            number: "02",
            title: "Estratégia",
            description:
              "Definição do protocolo capilar de acordo com as necessidades identificadas durante a avaliação.",
          },
          {
            number: "03",
            title: "Acompanhamento",
            description:
              "Acompanhamento da evolução para orientar a continuidade dos cuidados capilares.",
          },
        ]}
        localEyebrow="Atendimento em Curitiba"
        localTitle="Tratamento capilar com a Dra. Cristiana Valente em Curitiba"
        localParagraphs={[
          "Atendimento individualizado para queda de cabelo, afinamento dos fios, alopecia e saúde do couro cabeludo.",
          "O protocolo é definido somente após avaliação das necessidades de cada paciente.",
        ]}
        faqTitle="Dúvidas sobre Tratamento Capilar"
        faqItems={faqItems}
        finalEyebrow="Avaliação capilar em Curitiba"
        finalTitle="Cuide da saúde dos seus cabelos"
        finalText="Agende uma avaliação com a Dra. Cristiana Valente para compreender as necessidades dos seus fios e do couro cabeludo."
        finalHref="/#lead-form"
        relatedHref="/tratamento-queda-de-cabelo-curitiba"
        relatedLabel="Saiba mais sobre tratamento para queda de cabelo em Curitiba"
      />
    </>
  );
}
