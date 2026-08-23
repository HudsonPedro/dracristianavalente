CREATE TABLE "admin_password_reset_tokens" (
	"id" varchar(120) PRIMARY KEY NOT NULL,
	"user_id" varchar(120) NOT NULL,
	"token_hash" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"used_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "admin_password_reset_tokens" ADD CONSTRAINT "admin_password_reset_tokens_user_id_admin_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."admin_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "admin_password_reset_tokens_hash_unique" ON "admin_password_reset_tokens" USING btree ("token_hash");--> statement-breakpoint
CREATE INDEX "admin_password_reset_tokens_user_idx" ON "admin_password_reset_tokens" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "admin_password_reset_tokens_expires_idx" ON "admin_password_reset_tokens" USING btree ("expires_at");