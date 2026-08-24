CREATE TABLE "admin_departments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar(80) NOT NULL,
	"name" varchar(120) NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "admin_departments_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "admin_audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"actor_user_id" varchar(120),
	"action" varchar(120) NOT NULL,
	"target_type" varchar(80) NOT NULL,
	"target_id" varchar(120),
	"summary" varchar(500) NOT NULL,
	"previous_data" text,
	"next_data" text,
	"ip_address" varchar(64),
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "admin_user_invitations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"department" varchar(80) NOT NULL,
	"role_id" varchar(120) NOT NULL,
	"token_hash" text NOT NULL,
	"status" varchar(40) DEFAULT 'PENDING' NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"accepted_at" timestamp with time zone,
	"revoked_at" timestamp with time zone,
	"invited_by_user_id" varchar(120) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "admin_user_permission_overrides" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar(120) NOT NULL,
	"module" varchar(80) NOT NULL,
	"action" varchar(40) NOT NULL,
	"effect" varchar(20) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "admin_audit_logs" ADD CONSTRAINT "admin_audit_logs_actor_user_id_admin_users_id_fk" FOREIGN KEY ("actor_user_id") REFERENCES "public"."admin_users"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "admin_user_invitations" ADD CONSTRAINT "admin_user_invitations_department_admin_departments_code_fk" FOREIGN KEY ("department") REFERENCES "public"."admin_departments"("code") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "admin_user_invitations" ADD CONSTRAINT "admin_user_invitations_role_id_admin_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."admin_roles"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "admin_user_invitations" ADD CONSTRAINT "admin_user_invitations_invited_by_user_id_admin_users_id_fk" FOREIGN KEY ("invited_by_user_id") REFERENCES "public"."admin_users"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "admin_user_permission_overrides" ADD CONSTRAINT "admin_user_permission_overrides_user_id_admin_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."admin_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "admin_departments_name_idx" ON "admin_departments" USING btree ("name");--> statement-breakpoint
CREATE INDEX "admin_departments_active_idx" ON "admin_departments" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "admin_audit_logs_actor_idx" ON "admin_audit_logs" USING btree ("actor_user_id");--> statement-breakpoint
CREATE INDEX "admin_audit_logs_action_idx" ON "admin_audit_logs" USING btree ("action");--> statement-breakpoint
CREATE INDEX "admin_audit_logs_target_idx" ON "admin_audit_logs" USING btree ("target_type","target_id");--> statement-breakpoint
CREATE INDEX "admin_audit_logs_created_at_idx" ON "admin_audit_logs" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "admin_user_invitations_email_idx" ON "admin_user_invitations" USING btree ("email");--> statement-breakpoint
CREATE INDEX "admin_user_invitations_status_idx" ON "admin_user_invitations" USING btree ("status");--> statement-breakpoint
CREATE INDEX "admin_user_invitations_expires_idx" ON "admin_user_invitations" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "admin_user_invitations_role_idx" ON "admin_user_invitations" USING btree ("role_id");--> statement-breakpoint
CREATE INDEX "admin_user_invitations_department_idx" ON "admin_user_invitations" USING btree ("department");--> statement-breakpoint
CREATE INDEX "admin_user_invitations_invited_by_idx" ON "admin_user_invitations" USING btree ("invited_by_user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "admin_user_permission_overrides_unique" ON "admin_user_permission_overrides" USING btree ("user_id","module","action");--> statement-breakpoint
CREATE INDEX "admin_user_permission_overrides_user_idx" ON "admin_user_permission_overrides" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "admin_user_permission_overrides_effect_idx" ON "admin_user_permission_overrides" USING btree ("effect");