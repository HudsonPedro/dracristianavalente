/**
 * Catálogo central de produtos da loja.
 * Validado para produção.
 */
import type { Product } from "../types/product";

const officialSource =
  "https://www.dnavital.com.br/exclusivos-clinicas/";

export const products: Product[] = [
  {
    id: "bio-smart-profissional",
    name: "Linha Bio Smart Profissional",
    slug: "bio-smart-profissional",

    brand: "DNA VITAL",
    manufacturer: "DNA VITAL",

    categoryId: "profissional",

    categoryIds: [
      "profissional",
      "controle-queda",
      "couro-cabeludo",
      "tratamentos-especificos",
    ],

    line: "Linha Bio Smart",
    usageType: "PROFESSIONAL",

    shortDescription:
      "Linha profissional desenvolvida para regeneração celular, reposição de nutrientes e cuidado das displasias capilares.",

    description:
      "Linha desenvolvida para promover regeneração celular, reposição de nutrientes e prevenir diferentes tipos de displasias capilares.",

    activeIngredients: [
      {
        name: "Calêndula",
        description:
          "Cicatrizante, antialérgica e restauradora de tecidos.",
      },
      {
        name: "Alfa bisabolol",
        description:
          "Anti-inflamatório, cicatrizante e antimicótico.",
      },
      {
        name: "Capilia longa (cúrcuma)",
        description:
          "Reativa o crescimento, reduz a queda e promove proteção natural.",
      },
    ],

    images: [
      "/images/produtos/dna-vital/bio-smart-profissional.webp",
    ],

    priceVisibility: "REQUIRES_PROTOCOL",

    saleEnabled: false,
    requiresEvaluation: true,
    requiresProtocol: true,

    professionalProduct: true,
    homeCare: false,

    stockEnabled: false,
    availability: "UNDER_CONSULTATION",

    badge: "Uso profissional",

    officialSource,

    status: "ACTIVE",
  },

  {
    id: "bio-smart-home-care",
    name: "Linha Bio Smart Home Care",
    slug: "bio-smart-home-care",

    brand: "DNA VITAL",
    manufacturer: "DNA VITAL",

    categoryId: "home-care",

    categoryIds: [
      "home-care",
      "couro-cabeludo",
      "tratamentos-especificos",
    ],

    line: "Linha Bio Smart",
    usageType: "HOME_CARE",

    shortDescription:
      "Linha desenvolvida para manutenção em casa do tratamento realizado na clínica.",

    description:
      "Desenvolvida para promover a manutenção do tratamento realizado na clínica. Contém os mesmos ativos da linha profissional em concentrações inferiores e conta com peeling ozonizado.",

    activeIngredients: [
      {
        name: "Óleo de Oliva Ozonizado",
        description:
          "Atividade antimicrobiana contra fungos, bactérias e vírus, ativa a microcirculação e melhora o metabolismo celular.",
      },
      {
        name: "Cristais de Quartzo",
        description:
          "Renovador celular mineral orgânico que estimula a renovação dos queratinócitos na epiderme.",
      },
      {
        name: "Melaleuca e Calêndula",
        description:
          "Antissépticas, tonificantes e cicatrizantes.",
      },
    ],

    images: [
      "/images/produtos/dna-vital/bio-smart-home-care.webp",
    ],

    priceVisibility: "CONTACT_FOR_PRICE",

    saleEnabled: false,
    requiresEvaluation: false,
    requiresProtocol: false,

    professionalProduct: false,
    homeCare: true,

    stockEnabled: false,
    availability: "UNDER_CONSULTATION",

    badge: "Home Care",

    officialSource,

    status: "ACTIVE",
  },

  {
    id: "linha-crescimento-profissional",
    name: "Linha de Crescimento Profissional",
    slug: "linha-crescimento-profissional",

    brand: "DNA VITAL",
    manufacturer: "DNA VITAL",

    categoryId: "crescimento",

    categoryIds: [
      "crescimento",
      "controle-queda",
      "couro-cabeludo",
      "profissional",
      "tratamentos-especificos",
    ],

    line: "Linha de Crescimento",
    usageType: "PROFESSIONAL",

    shortDescription:
      "Linha profissional com Regenerador Homeostático, Redutor de Queda e Estimulador de Crescimento.",

    description:
      "Linha profissional estruturada em três componentes para equilíbrio do couro cabeludo, redução da queda e estímulo ao crescimento.",

    components: [
      {
        id: "regenerador-homeostatico",
        name: "Regenerador Homeostático",
        description:
          "Contém simbióticos, um blend de pré, pró e parabióticos que auxilia no equilíbrio da flora cutânea e na redução de processos inflamatórios, irritabilidade e sensibilidade do couro cabeludo. Atua também em descamação, coceira e vermelhidão.",
      },
      {
        id: "redutor-de-queda",
        name: "Redutor de Queda",
        description:
          "Auxilia nos aspectos causadores da queda, como desordem e desnutrição celular, falta de oxigenação e traumas. Auxilia também no controle da 5-alfa-redutase e nos danos capilares causados pelo estresse.",
      },
      {
        id: "estimulador-de-crescimento",
        name: "Estimulador de Crescimento",
        description:
          "Auxilia no crescimento de novos fios saudáveis, estimula a vascularização, aumenta o calibre da haste capilar e aumenta a fase anágena.",
      },
    ],

    images: [
      "/images/produtos/dna-vital/linha-crescimento.webp",
    ],

    priceVisibility: "REQUIRES_PROTOCOL",

    saleEnabled: false,
    requiresEvaluation: true,
    requiresProtocol: true,

    professionalProduct: true,
    homeCare: false,

    stockEnabled: false,
    availability: "UNDER_CONSULTATION",

    badge: "Uso profissional",

    officialSource,

    status: "ACTIVE",
  },

  {
    id: "shaft-care-profissional",
    name: "Shaft Care Profissional",
    slug: "shaft-care-profissional",

    brand: "DNA VITAL",
    manufacturer: "DNA VITAL",

    categoryId: "reestruturacao",

    categoryIds: [
      "reestruturacao",
      "profissional",
      "controle-queda",
      "tratamentos-especificos",
    ],

    line: "Shaft Care",
    usageType: "PROFESSIONAL",

    shortDescription:
      "Linha profissional para reestruturação dos fios, promovendo maior resistência e saúde capilar.",

    description:
      "Promove reestruturação, proporcionando fios mais saudáveis e resistentes. Mantém o resultado por períodos prolongados por meio da liberação controlada de ativos.",

    activeIngredients: [
      {
        name: "Calêndula",
        description:
          "Cicatrizante, antialérgica e restauradora de tecidos.",
      },
      {
        name: "Alfa bisabolol",
        description:
          "Anti-inflamatório, cicatrizante e antimicótico.",
      },
      {
        name: "Capilia longa (cúrcuma)",
        description:
          "Reativa o crescimento, reduz a queda e promove proteção natural.",
      },
    ],

    images: [
      "/images/produtos/dna-vital/shaft-care-profissional.webp",
    ],

    priceVisibility: "REQUIRES_PROTOCOL",

    saleEnabled: false,
    requiresEvaluation: true,
    requiresProtocol: true,

    professionalProduct: true,
    homeCare: false,

    stockEnabled: false,
    availability: "UNDER_CONSULTATION",

    badge: "Uso profissional",

    officialSource,

    status: "ACTIVE",
  },

  {
    id: "shaft-care-home-care",
    name: "Shaft Care Home Care",
    slug: "shaft-care-home-care",

    brand: "DNA VITAL",
    manufacturer: "DNA VITAL",

    categoryId: "home-care",

    categoryIds: [
      "home-care",
      "reestruturacao",
    ],

    line: "Shaft Care",
    usageType: "HOME_CARE",

    shortDescription:
      "Linha Home Care para manutenção do tratamento realizado na clínica.",

    description:
      "Desenvolvida para promover manutenção do tratamento feito na clínica, com os mesmos ativos da linha profissional em concentrações inferiores.",

    components: [
      {
        id: "shaft-care-shampoo",
        name: "Shampoo",
        description:
          "Limpeza eficaz de uso diário para todos os tipos de cabelo, promovendo fios saudáveis e brilhosos.",
      },
      {
        id: "shaft-care-condicionador",
        name: "Condicionador",
        description:
          "Nutrição e desembaraço de uso diário para todos os tipos de cabelo, promovendo sedosidade e brilho.",
      },
      {
        id: "shaft-care-leave-in",
        name: "Leave-in",
        description:
          "Protege do calor e das agressões externas, com ação antifrizz e efeito antioxidante.",
      },
    ],

    images: [
      "/images/produtos/dna-vital/shaft-care-home-care.webp",
    ],

    priceVisibility: "CONTACT_FOR_PRICE",

    saleEnabled: false,
    requiresEvaluation: false,
    requiresProtocol: false,

    professionalProduct: false,
    homeCare: true,

    stockEnabled: false,
    availability: "UNDER_CONSULTATION",

    badge: "Home Care",

    officialSource,

    status: "ACTIVE",
  },

  {
    id: "monodoses-profissional",
    name: "Monodoses Profissional",
    slug: "monodoses-profissional",

    brand: "DNA VITAL",
    manufacturer: "DNA VITAL",

    categoryId: "monodoses",

    categoryIds: [
      "monodoses",
      "profissional",
      "controle-queda",
      "couro-cabeludo",
      "crescimento",
      "tratamentos-especificos",
    ],

    line: "Monodoses",
    usageType: "PROFESSIONAL",

    shortDescription:
      "Cinco monodoses profissionais com funcionalidades específicas para diferentes necessidades do couro cabeludo e sistema capilar.",

    description:
      "Linha profissional composta por cinco monodoses destinadas a diferentes necessidades relacionadas à microbiota, inflamação, regeneração dérmica, queda e estímulo capilar.",

    components: [
      {
        id: "arm",
        name: "A.R.M. — Antifúngico e regulador da microbiota",
        description:
          "Atua contra fungos e bactérias por meio de reguladores da microbiota. Promove homeostasia do couro cabeludo e é indicada pela DNA VITAL para situações relacionadas a vermelhidão, coceira e descamação.",
      },
      {
        id: "aic",
        name: "A.I.C. — Anti-inflamatório e Calmante",
        description:
          "Auxilia quando o couro cabeludo está sensível e inflamado, contribuindo para acalmar e favorecer os processos de cicatrização e regeneração.",
      },
      {
        id: "rn",
        name: "R.N. — Regenerador dérmico",
        description:
          "Promove regeneração celular e renovação do estrato córneo, contribuindo para devolver a integridade do couro cabeludo.",
      },
      {
        id: "rqb5",
        name: "R.Q.B.5 — Redutor de queda",
        description:
          "Atua na redução da queda e promove aumento da microcirculação com nutrientes e minerais para favorecer um ciclo capilar mais equilibrado.",
      },
      {
        id: "en",
        name: "E.N. — Estimulante e nutritiva",
        description:
          "Promove estímulo, oxigenação e vascularização com nutrientes, vitaminas e minerais para favorecer crescimento e revitalização do sistema capilar.",
      },
    ],

    images: [
      "/images/produtos/dna-vital/monodoses.webp",
    ],

    priceVisibility: "REQUIRES_PROTOCOL",

    saleEnabled: false,
    requiresEvaluation: true,
    requiresProtocol: true,

    professionalProduct: true,
    homeCare: false,

    stockEnabled: false,
    availability: "UNDER_CONSULTATION",

    badge: "Uso profissional",

    officialSource,

    status: "ACTIVE",
  },

  {
    id: "mask-repair-profissional",
    name: "Mask Repair Profissional",
    slug: "mask-repair-profissional",

    brand: "DNA VITAL",
    manufacturer: "DNA VITAL",

    categoryId: "reestruturacao",

    categoryIds: [
      "reestruturacao",
      "profissional",
      "tratamentos-especificos",
    ],

    line: "Mask Repair",
    usageType: "PROFESSIONAL",

    shortDescription:
      "Máscara dupla para reparação interna e externa dos fios.",

    description:
      "Máscara dupla que promove reparação dentro e fora do fio por preenchimento intersticial e restauração das fissuras cuticulares.",

    components: [
      {
        id: "inside",
        name: "INSIDE",
        description:
          "Etapa interna composta por Nano Matrix, Cisteína e Creatina.",
      },
      {
        id: "outside",
        name: "OUTSIDE",
        description:
          "Etapa externa composta por Manteiga de Manga, amino-funcionais e óleos vegetais.",
      },
    ],

    activeIngredients: [
      {
        name: "Nano Matrix",
        description:
          "Nanoestruturas lipídicas ricas em aminoácidos que repõem massa intersticial do córtex.",
      },
      {
        name: "Cisteína",
        description:
          "Aminoácido que auxilia no crescimento de novos fios.",
      },
      {
        name: "Creatina",
        description:
          "Contribui para aumentar a resistência do fio.",
      },
      {
        name: "Manteiga de Manga",
        description:
          "Hidratante, emoliente, nutritiva e antioxidante.",
      },
      {
        name: "Amino-funcionais",
        description:
          "Aminoácidos de baixo peso molecular que conferem leveza e sedosidade.",
      },
      {
        name: "Óleos vegetais",
        description:
          "Promovem brilho e maciez.",
      },
    ],

    images: [
      "/images/produtos/dna-vital/mask-repair.webp",
    ],

    priceVisibility: "REQUIRES_PROTOCOL",

    saleEnabled: false,
    requiresEvaluation: true,
    requiresProtocol: true,

    professionalProduct: true,
    homeCare: false,

    stockEnabled: false,
    availability: "UNDER_CONSULTATION",

    badge: "Uso profissional",

    officialSource,

    status: "ACTIVE",
  },

  {
    id: "biomimetic-line-profissional",
    name: "Biomimetic Line Profissional",
    slug: "biomimetic-line-profissional",

    brand: "DNA VITAL",
    manufacturer: "DNA VITAL",

    categoryId: "reestruturacao",

    categoryIds: [
      "reestruturacao",
      "profissional",
      "tratamentos-especificos",
    ],

    line: "Biomimetic Line",
    usageType: "PROFESSIONAL",

    shortDescription:
      "Linha profissional para reestruturação e resistência dos fios com liberação controlada de ativos.",

    description:
      "Promove reestruturação, proporcionando fios mais saudáveis e resistentes. Mantém o resultado por períodos prolongados por meio da liberação controlada dos ativos.",

    components: [
      {
        id: "esfera-colageno-c3",
        name: "Esfera de colágeno C III",
      },
      {
        id: "soro-polivitaminico",
        name: "Soro polivitamínico",
      },
      {
        id: "locao-biomimetica",
        name: "Loção Biomimética",
      },
    ],

    images: [
      "/images/produtos/dna-vital/biomimetic.webp",
    ],

    priceVisibility: "REQUIRES_PROTOCOL",

    saleEnabled: false,
    requiresEvaluation: true,
    requiresProtocol: true,

    professionalProduct: true,
    homeCare: false,

    stockEnabled: false,
    availability: "UNDER_CONSULTATION",

    badge: "Uso profissional",

    officialSource,

    status: "ACTIVE",
  },

  {
    id: "pos-transplante-home-care",
    name: "Pós-Transplante Home Care",
    slug: "pos-transplante-home-care",

    brand: "DNA VITAL",
    manufacturer: "DNA VITAL",

    categoryId: "pos-transplante",

    categoryIds: [
      "pos-transplante",
      "home-care",
      "couro-cabeludo",
      "tratamentos-especificos",
    ],

    line: "Pós-Transplante",
    usageType: "HOME_CARE",

    shortDescription:
      "Linha Home Care desenvolvida para os cuidados do couro cabeludo após o transplante capilar.",

    description:
      "Linha voltada ao cuidado pós-transplante, com foco em cicatrização, redução de inflamação e coceira, prevenção de descamação e foliculite e auxílio no processo de ancoragem dos fios.",

    benefits: [
      {
        title: "Cicatrização",
        description:
          "Auxilia no processo de cicatrização do couro cabeludo.",
      },
      {
        title: "Conforto",
        description:
          "Contribui para redução de inflamação e coceira.",
      },
      {
        title: "Cuidados do couro cabeludo",
        description:
          "Auxilia na prevenção de descamação e foliculite.",
      },
      {
        title: "Ancoragem",
        description:
          "Auxilia no processo de ancoragem dos novos fios.",
      },
    ],

    components: [
      {
        id: "tonico-pos-transplante",
        name: "Tônico pós-transplante capilar",
        description:
          "Promove bem-estar e homeostasia para o couro cabeludo pós-transplantado. Auxilia na cicatrização e na ancoragem dos novos fios.",
      },
      {
        id: "espuma-pos-transplante",
        name: "Espuma pós-transplante capilar",
        description:
          "Shampoo em espuma calmante e anti-inflamatório para higienização e assepsia no pós-transplante. Auxilia na retirada de crostas e nos cuidados relacionados a coceira, vermelhidão, foliculite e descamação.",
      },
    ],

    images: [
      "/images/produtos/dna-vital/pos-transplante.webp",
    ],

    priceVisibility: "CONTACT_FOR_PRICE",

    saleEnabled: false,
    requiresEvaluation: false,
    requiresProtocol: false,

    professionalProduct: false,
    homeCare: true,

    stockEnabled: false,
    availability: "UNDER_CONSULTATION",

    badge: "Pós-Transplante",

    officialSource,

    status: "ACTIVE",
  },
];
