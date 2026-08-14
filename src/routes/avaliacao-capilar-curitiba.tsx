import { createFileRoute } from "@tanstack/react-router";
import { SeoTreatmentPage } from "../components/ui/seo-treatment-page.tsx";

export const Route = createFileRoute("/avaliacao-capilar-curitiba")({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Avaliação Capilar em Curitiba | Dra. Cristiana Valente" },
      {
        name: "description",
        content:
          "Avaliação capilar em Curitiba com análise individualizada dos fios e do couro cabeludo. Conheça a Dra. Cristiana Valente e agende sua avaliação.",
      },
      {
        property: "og:title",
        content: "Avaliação Capilar em Curitiba | Dra. Cristiana Valente",
      },
      {
        property: "og:description",
        content:
          "Avaliação capilar personalizada em Curitiba com análise dos fios, couro cabeludo e planejamento individualizado.",
      },
      { property: "og:type", content: "website" },
      {
        property: "og:url",
        content:
          "https://www.dracristianavalente.com.br/avaliacao-capilar-curitiba",
      },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "canonical",
        href:
          "https://www.dracristianavalente.com.br/avaliacao-capilar-curitiba",
      },
    ],
  }),
  component: AvaliacaoCapilarCuritiba,
});

const faqItems = [
  {
    question: "O que é uma avaliação capilar?",
    answer:
      "A avaliação capilar é uma análise individualizada das queixas, características dos fios e condições do couro cabeludo para orientar o planejamento do cuidado capilar.",
  },
  {
    question: "Quando devo fazer uma avaliação capilar?",
    answer:
      "A avaliação pode ser indicada quando há queda de cabelo, afinamento dos fios, redução de volume, falhas visíveis, alterações no couro cabeludo ou dúvidas sobre a saúde capilar.",
  },
  {
    question: "A avaliação capilar pode incluir tricoscopia?",
    answer:
      "Sim. Conforme a necessidade, a tricoscopia pode ser utilizada como recurso complementar para observar características dos fios e do couro cabeludo com maior detalhamento.",
  },
  {
    question: "A avaliação capilar define o tratamento?",
    answer:
      "A avaliação ajuda a compreender as características de cada caso e permite definir um planejamento individualizado de acordo com as necessidades observadas.",
  },
  {
    question: "Onde fazer avaliação capilar em Curitiba?",
    answer:
      "A Dra. Cristiana Valente realiza avaliação capilar em Curitiba com atendimento individualizado, análise dos fios e couro cabeludo e planejamento personalizado.",
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

function AvaliacaoCapilarCuritiba() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <SeoTreatmentPage
        eyebrow="Avaliação capilar em Curitiba"
        title="Avaliação Capilar Personalizada em Curitiba"
        intro="A Dra. Cristiana Valente realiza avaliação capilar individualizada para compreender as características dos fios, da queda de cabelo e do couro cabeludo, orientando um planejamento personalizado de acordo com cada necessidade."
        primaryHref="/#lead-form"
        primaryLabel="Agendar avaliação"
        secondaryHref="/#protocolos"
        secondaryLabel="Conhecer tratamentos"
        introTitle="Por que começar por uma avaliação capilar?"
        introParagraphs={[
          "Antes de definir qualquer protocolo, é importante compreender como estão os fios, o couro cabeludo e quais alterações estão sendo percebidas pelo paciente.",
          "A avaliação capilar permite reunir informações importantes sobre queda, afinamento, densidade, saúde do couro cabeludo e histórico individual para orientar o planejamento do cuidado.",
        ]}
        cardsTitle="O que pode fazer parte da avaliação capilar"
        cardsIntro="A avaliação é personalizada e pode reunir diferentes etapas conforme as necessidades observadas."
        cards={[
          {
            tag: "Avaliação",
            title: "Anamnese completa",
            description:
              "Levantamento do histórico, queixas principais, hábitos, evolução da queda e informações relevantes para compreender o quadro capilar.",
          },
          {
            tag: "Análise",
            title: "Tricoscopia capilar",
            description:
              "Recurso que pode auxiliar na observação das características dos fios e do couro cabeludo com maior detalhamento.",
          },
          {
            tag: "Planejamento",
            title: "Planejamento individualizado",
            description:
              "Definição de uma estratégia personalizada de acordo com as características observadas durante a avaliação.",
          },
          {
            tag: "Acompanhamento",
            title: "Acompanhamento fotográfico",
            description:
              "Registro da evolução para facilitar a comparação ao longo do acompanhamento capilar.",
          },
          {
            tag: "Avaliação",
            title: "Análise clínica",
            description:
              "Observação das características dos fios, padrão de queda, densidade e condições do couro cabeludo.",
          },
          {
            tag: "Cronograma",
            title: "Plano de acompanhamento",
            description:
              "Organização das próximas etapas e acompanhamento conforme a necessidade individual de cada paciente.",
          },
        ]}
        evaluationEyebrow="Avaliação individualizada"
        evaluationTitle="Cada cabelo precisa ser compreendido antes de ser tratado"
        evaluationParagraphs={[
          "Queda de cabelo, afinamento, falhas, oleosidade, descamação ou sensibilidade podem apresentar características diferentes de pessoa para pessoa.",
          "Por isso, a avaliação capilar é o ponto de partida para entender o quadro e orientar uma estratégia coerente com as necessidades de cada paciente.",
        ]}
        stepsTitle="Como funciona a avaliação capilar?"
        steps={[
          {
            number: "01",
            title: "Entendimento do caso",
            description:
              "Conversa sobre histórico, queixas, evolução dos sintomas e principais objetivos do paciente.",
          },
          {
            number: "02",
            title: "Análise capilar",
            description:
              "Avaliação dos fios e couro cabeludo, podendo incluir tricoscopia conforme a necessidade.",
          },
          {
            number: "03",
            title: "Planejamento",
            description:
              "Definição dos próximos passos e orientação de um plano de cuidado individualizado.",
          },
        ]}
        localEyebrow="Atendimento em Curitiba"
        localTitle="Avaliação capilar com a Dra. Cristiana Valente em Curitiba"
        localParagraphs={[
          "A Dra. Cristiana Valente realiza avaliação capilar em Curitiba com foco em queda de cabelo, afinamento, alopecia e saúde do couro cabeludo.",
          "O atendimento é individualizado e o planejamento é definido somente após a análise das características e necessidades de cada paciente.",
        ]}
        faqTitle="Dúvidas sobre Avaliação Capilar"
        faqItems={faqItems}
        finalEyebrow="Avaliação capilar em Curitiba"
        finalTitle="Entenda o que seus cabelos precisam"
        finalText="Agende uma avaliação com a Dra. Cristiana Valente e conheça uma abordagem individualizada para compreender as características dos seus fios e do couro cabeludo."
        finalHref="/#lead-form"
        finalLabel="Agendar minha avaliação"
        relatedHref="/tratamento-capilar-curitiba"
        relatedLabel="Conheça também o tratamento capilar em Curitiba"
      />
    </>
  );
}
