import type { Product } from "../types/product";

export const products: Product[] = [
  {
    id: "bio-smart-profissional",
    name: "Bio Smart Profissional",
    slug: "bio-smart-profissional",
    brand: "DNA VITAL",
    categoryId: "profissional",

    shortDescription:
      "Linha profissional DNA VITAL destinada ao uso em protocolos realizados em clínica.",

    description:
      "Linha Bio Smart de uso profissional, apresentada oficialmente pela DNA VITAL dentro da linha exclusiva para clínicas.",

    images: [],

    priceVisibility: "REQUIRES_EVALUATION",

    saleEnabled: false,
    requiresEvaluation: true,
    requiresProtocol: true,

    professionalProduct: true,
    homeCare: false,

    stockEnabled: false,
    availability: "UNDER_CONSULTATION",

    badge: "Indicação profissional",

    status: "ACTIVE",
  },

  {
    id: "bio-smart-home-care",
    name: "Bio Smart Home Care",
    slug: "bio-smart-home-care",
    brand: "DNA VITAL",
    categoryId: "home-care",

    shortDescription:
      "Linha Home Care desenvolvida para manutenção dos cuidados realizados na clínica.",

    description:
      "Linha Bio Smart Home Care apresentada pela DNA VITAL como complemento para manutenção do tratamento realizado em clínica.",

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

    status: "ACTIVE",
  },

  {
    id: "linha-crescimento-profissional",
    name: "Linha de Crescimento Profissional",
    slug: "linha-crescimento-profissional",
    brand: "DNA VITAL",
    categoryId: "crescimento",

    shortDescription:
      "Linha profissional DNA VITAL voltada aos protocolos de crescimento capilar.",

    description:
      "Linha de Crescimento de uso profissional apresentada pela DNA VITAL dentro do portfólio exclusivo para clínicas.",

    images: [],

    priceVisibility: "REQUIRES_PROTOCOL",

    saleEnabled: false,
    requiresEvaluation: true,
    requiresProtocol: true,

    professionalProduct: true,
    homeCare: false,

    stockEnabled: false,
    availability: "UNDER_CONSULTATION",

    badge: "Produto profissional",

    status: "ACTIVE",
  },
];
