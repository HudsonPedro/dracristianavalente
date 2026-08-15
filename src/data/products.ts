import type { Product } from "../types/product";

export const products: Product[] = [
  {
    id: "bio-smart-profissional",
    name: "Linha Bio Smart Profissional",
    slug: "bio-smart-profissional",
    brand: "DNA VITAL",
    categoryId: "profissional",

    shortDescription:
      "Linha profissional desenvolvida para promover regeneração celular, reposição de nutrientes e cuidado das displasias capilares.",

    description:
      "A Linha Bio Smart Profissional foi desenvolvida pela DNA VITAL para promover regeneração celular, reposição de nutrientes e cuidado de diferentes alterações capilares dentro de protocolos profissionais.",

    images: [],

    priceVisibility: "REQUIRES_PROTOCOL",

    saleEnabled: false,
    requiresEvaluation: true,
    requiresProtocol: true,

    professionalProduct: true,
    homeCare: false,

    stockEnabled: false,
    availability: "UNDER_CONSULTATION",

    badge: "Uso profissional",

    usageInstructions:
      "Uso profissional conforme protocolo e orientação da clínica.",

    composition:
      "Ativos principais divulgados pela DNA VITAL: Calêndula, Alfa bisabolol e Capilia longa (cúrcuma).",

    status: "ACTIVE",
  },

  {
    id: "bio-smart-home-care",
    name: "Linha Bio Smart Home Care",
    slug: "bio-smart-home-care",
    brand: "DNA VITAL",
    categoryId: "home-care",

    shortDescription:
      "Linha desenvolvida para manutenção em casa do tratamento realizado na clínica.",

    description:
      "A Linha Bio Smart Home Care foi desenvolvida para promover a manutenção do tratamento feito em clínica. Segundo a DNA VITAL, utiliza os mesmos ativos da linha profissional em concentrações inferiores e inclui peeling ozonizado.",

    images: [],

    priceVisibility: "CONTACT_FOR_PRICE",

    saleEnabled: false,
    requiresEvaluation: false,
    requiresProtocol: false,

    professionalProduct: false,
    homeCare: true,

    stockEnabled: false,
    availability: "UNDER_CONSULTATION",

    badge: "Home Care",

    composition:
      "Ativos principais divulgados pela DNA VITAL: Óleo de Oliva Ozonizado, Cristais de Quartzo, Melaleuca e Calêndula.",

    status: "ACTIVE",
  },

  {
    id: "linha-crescimento-profissional",
    name: "Linha de Crescimento Profissional",
    slug: "linha-crescimento-profissional",
    brand: "DNA VITAL",
    categoryId: "crescimento",

    shortDescription:
      "Linha profissional composta por soluções voltadas ao equilíbrio do couro cabeludo, controle da queda e estímulo ao crescimento capilar.",

    description:
      "A Linha de Crescimento Profissional da DNA VITAL reúne três frentes principais: Regenerador Homeostático, Redutor de Queda e Estimulador de Crescimento.",

    images: [],

    priceVisibility: "REQUIRES_PROTOCOL",

    saleEnabled: false,
    requiresEvaluation: true,
    requiresProtocol: true,

    professionalProduct: true,
    homeCare: false,

    stockEnabled: false,
    availability: "UNDER_CONSULTATION",

    badge: "Uso profissional",

    usageInstructions:
      "Uso profissional conforme avaliação e protocolo definido pela clínica.",

    status: "ACTIVE",
  },
];
