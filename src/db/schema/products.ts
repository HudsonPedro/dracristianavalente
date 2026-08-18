import {
  boolean,
  integer,
  jsonb,
  numeric,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

export const productsTable = pgTable(
  "store_products",
  {
    id: varchar("id", {
      length: 120,
    }).primaryKey(),

    name: varchar("name", {
      length: 255,
    }).notNull(),

    slug: varchar("slug", {
      length: 255,
    }).notNull(),

    brand: varchar("brand", {
      length: 160,
    }).notNull(),

    manufacturer: varchar("manufacturer", {
      length: 160,
    }),

    line: varchar("line", {
      length: 180,
    }),

    categoryId: varchar("category_id", {
      length: 120,
    }),

    categoryIds: jsonb("category_ids").$type<string[]>().notNull().default([]),

    usageType: varchar("usage_type", {
      length: 40,
    }).notNull(),

    shortDescription: text("short_description").notNull(),

    description: text("description"),

    ingredients: jsonb("ingredients")
      .$type<
        Array<{
          id: string;
          name: string;
          description?: string;
        }>
      >()
      .notNull()
      .default([]),

    components: jsonb("components")
      .$type<
        Array<{
          id: string;
          name: string;
          description?: string;
        }>
      >()
      .notNull()
      .default([]),

    benefits: jsonb("benefits")
      .$type<
        Array<{
          id: string;
          title: string;
          description?: string;
        }>
      >()
      .notNull()
      .default([]),

    usageInstructions: text("usage_instructions"),

    images: jsonb("images")
      .$type<
        Array<{
          id: string;
          url: string;
          alt: string;
          position: number;
          main: boolean;
        }>
      >()
      .notNull()
      .default([]),

    price: numeric("price", {
      precision: 12,
      scale: 2,
    }),

    promotionalPrice: numeric("promotional_price", {
      precision: 12,
      scale: 2,
    }),

    priceVisibility: varchar("price_visibility", {
      length: 40,
    }).notNull(),

    saleEnabled: boolean("sale_enabled").notNull().default(false),

    requiresEvaluation: boolean("requires_evaluation").notNull().default(false),

    requiresProtocol: boolean("requires_protocol").notNull().default(false),

    professionalProduct: boolean("professional_product").notNull().default(false),

    homeCare: boolean("home_care").notNull().default(false),

    availability: varchar("availability", {
      length: 40,
    }).notNull(),

    badge: varchar("badge", {
      length: 120,
    }),

    featured: boolean("featured").notNull().default(false),

    displayOrder: integer("display_order").notNull().default(0),

    officialSource: text("official_source"),

    seo: jsonb("seo").$type<{
      title?: string;
      description?: string;
      canonicalUrl?: string;
      noIndex?: boolean;
    }>(),

    status: varchar("status", {
      length: 30,
    })
      .notNull()
      .default("DRAFT"),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
  },
  (table) => [uniqueIndex("store_products_slug_unique").on(table.slug)],
);

export type ProductRow = typeof productsTable.$inferSelect;

export type NewProductRow = typeof productsTable.$inferInsert;
