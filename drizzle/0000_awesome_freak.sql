CREATE TABLE "store_addresses" (
	"id" varchar(120) PRIMARY KEY NOT NULL,
	"customer_id" varchar(120),
	"label" varchar(80),
	"recipient_name" varchar(255) NOT NULL,
	"postal_code" varchar(20) NOT NULL,
	"street" varchar(255) NOT NULL,
	"number" varchar(40) NOT NULL,
	"complement" varchar(255),
	"neighborhood" varchar(160) NOT NULL,
	"city" varchar(160) NOT NULL,
	"state" varchar(40) NOT NULL,
	"country" varchar(80) DEFAULT 'Brasil' NOT NULL,
	"is_default" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "store_customers" (
	"id" varchar(120) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(40) NOT NULL,
	"cpf" varchar(20),
	"status" varchar(30) DEFAULT 'ACTIVE' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "store_inventory" (
	"id" varchar(120) PRIMARY KEY NOT NULL,
	"product_id" varchar(120) NOT NULL,
	"stock_enabled" boolean DEFAULT true NOT NULL,
	"quantity_available" integer DEFAULT 0 NOT NULL,
	"quantity_reserved" integer DEFAULT 0 NOT NULL,
	"minimum_stock" integer DEFAULT 0 NOT NULL,
	"allow_backorder" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "store_order_items" (
	"id" varchar(120) PRIMARY KEY NOT NULL,
	"order_id" varchar(120) NOT NULL,
	"product_id" varchar(120),
	"product_name" varchar(255) NOT NULL,
	"quantity" integer NOT NULL,
	"unit_price" numeric(12, 2) NOT NULL,
	"total" numeric(12, 2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "store_orders" (
	"id" varchar(120) PRIMARY KEY NOT NULL,
	"order_number" varchar(80) NOT NULL,
	"customer_id" varchar(120),
	"customer_name" varchar(255) NOT NULL,
	"customer_email" varchar(255) NOT NULL,
	"customer_phone" varchar(40) NOT NULL,
	"subtotal" numeric(12, 2) NOT NULL,
	"discount" numeric(12, 2) DEFAULT '0' NOT NULL,
	"shipping" numeric(12, 2) DEFAULT '0' NOT NULL,
	"total" numeric(12, 2) NOT NULL,
	"fulfillment_type" varchar(30) NOT NULL,
	"delivery_address" jsonb,
	"status" varchar(40) DEFAULT 'PENDING' NOT NULL,
	"payment_status" varchar(40) DEFAULT 'PENDING' NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "store_products" (
	"id" varchar(120) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"brand" varchar(160) NOT NULL,
	"manufacturer" varchar(160),
	"line" varchar(180),
	"category_id" varchar(120),
	"category_ids" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"usage_type" varchar(40) NOT NULL,
	"short_description" text NOT NULL,
	"description" text,
	"ingredients" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"components" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"benefits" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"usage_instructions" text,
	"images" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"price" numeric(12, 2),
	"promotional_price" numeric(12, 2),
	"price_visibility" varchar(40) NOT NULL,
	"sale_enabled" boolean DEFAULT false NOT NULL,
	"requires_evaluation" boolean DEFAULT false NOT NULL,
	"requires_protocol" boolean DEFAULT false NOT NULL,
	"professional_product" boolean DEFAULT false NOT NULL,
	"home_care" boolean DEFAULT false NOT NULL,
	"availability" varchar(40) NOT NULL,
	"badge" varchar(120),
	"featured" boolean DEFAULT false NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"official_source" text,
	"seo" jsonb,
	"status" varchar(30) DEFAULT 'DRAFT' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "store_settings" (
	"id" varchar(120) PRIMARY KEY NOT NULL,
	"store_enabled" boolean DEFAULT true NOT NULL,
	"cart_enabled" boolean DEFAULT true NOT NULL,
	"checkout_enabled" boolean DEFAULT false NOT NULL,
	"payment_enabled" boolean DEFAULT false NOT NULL,
	"inventory_enabled" boolean DEFAULT true NOT NULL,
	"pickup_enabled" boolean DEFAULT false NOT NULL,
	"delivery_enabled" boolean DEFAULT false NOT NULL,
	"whatsapp_enabled" boolean DEFAULT true NOT NULL,
	"whatsapp_number" varchar(40),
	"currency" varchar(10) DEFAULT 'BRL' NOT NULL,
	"minimum_order_value" numeric(12, 2),
	"default_stock_minimum" integer DEFAULT 2 NOT NULL,
	"allow_sale_without_stock_control" boolean DEFAULT false NOT NULL,
	"require_customer_identification" boolean DEFAULT true NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "store_addresses" ADD CONSTRAINT "store_addresses_customer_id_store_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."store_customers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "store_inventory" ADD CONSTRAINT "store_inventory_product_id_store_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."store_products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "store_order_items" ADD CONSTRAINT "store_order_items_order_id_store_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."store_orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "store_order_items" ADD CONSTRAINT "store_order_items_product_id_store_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."store_products"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "store_orders" ADD CONSTRAINT "store_orders_customer_id_store_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."store_customers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "store_customers_email_unique" ON "store_customers" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "store_inventory_product_unique" ON "store_inventory" USING btree ("product_id");--> statement-breakpoint
CREATE UNIQUE INDEX "store_orders_number_unique" ON "store_orders" USING btree ("order_number");--> statement-breakpoint
CREATE UNIQUE INDEX "store_products_slug_unique" ON "store_products" USING btree ("slug");