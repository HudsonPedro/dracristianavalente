CREATE TABLE "admin_role_permissions" (
	"id" varchar(120) PRIMARY KEY NOT NULL,
	"role_id" varchar(120) NOT NULL,
	"module" varchar(80) NOT NULL,
	"action" varchar(40) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "admin_roles" (
	"id" varchar(120) PRIMARY KEY NOT NULL,
	"code" varchar(80) NOT NULL,
	"name" varchar(160) NOT NULL,
	"description" text,
	"system_role" boolean DEFAULT false NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "admin_users" (
	"id" varchar(120) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" text,
	"department" varchar(80) NOT NULL,
	"status" varchar(40) DEFAULT 'INVITED' NOT NULL,
	"role_id" varchar(120) NOT NULL,
	"failed_login_attempts" integer DEFAULT 0 NOT NULL,
	"locked_until" timestamp with time zone,
	"last_login_at" timestamp with time zone,
	"password_changed_at" timestamp with time zone,
	"auth_version" integer DEFAULT 1 NOT NULL,
	"must_change_password" boolean DEFAULT true NOT NULL,
	"email_verified_at" timestamp with time zone,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "admin_role_permissions" ADD CONSTRAINT "admin_role_permissions_role_id_admin_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."admin_roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admin_users" ADD CONSTRAINT "admin_users_role_id_admin_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."admin_roles"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "admin_role_permissions_unique" ON "admin_role_permissions" USING btree ("role_id","module","action");--> statement-breakpoint
CREATE INDEX "admin_role_permissions_role_idx" ON "admin_role_permissions" USING btree ("role_id");--> statement-breakpoint
CREATE UNIQUE INDEX "admin_roles_code_unique" ON "admin_roles" USING btree ("code");--> statement-breakpoint
CREATE INDEX "admin_roles_active_idx" ON "admin_roles" USING btree ("active");--> statement-breakpoint
CREATE UNIQUE INDEX "admin_users_email_unique" ON "admin_users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "admin_users_role_idx" ON "admin_users" USING btree ("role_id");--> statement-breakpoint
CREATE INDEX "admin_users_status_idx" ON "admin_users" USING btree ("status");--> statement-breakpoint
CREATE INDEX "admin_users_department_idx" ON "admin_users" USING btree ("department");