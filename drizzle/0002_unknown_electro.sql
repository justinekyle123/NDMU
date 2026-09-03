ALTER TYPE "public"."user_role" ADD VALUE 'worker';--> statement-breakpoint
CREATE TABLE "workers" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "workers_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" integer NOT NULL,
	"employee_number" text NOT NULL,
	"phone" text,
	"position" text,
	"hired_on" date,
	"ended_on" date,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "workers_employee_number_unique" UNIQUE("employee_number"),
	CONSTRAINT "workers_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "feed_items" DROP CONSTRAINT "feed_items_farm_name_unique";--> statement-breakpoint
ALTER TABLE "locations" DROP CONSTRAINT "locations_farm_name_unique";--> statement-breakpoint
ALTER TABLE "animals" DROP CONSTRAINT "animals_farm_id_farms_id_fk";
--> statement-breakpoint
ALTER TABLE "feed_items" DROP CONSTRAINT "feed_items_farm_id_farms_id_fk";
--> statement-breakpoint
ALTER TABLE "locations" DROP CONSTRAINT "locations_farm_id_farms_id_fk";
--> statement-breakpoint
DROP INDEX "animals_farm_id_idx";--> statement-breakpoint
DROP INDEX "feed_items_farm_id_idx";--> statement-breakpoint
DROP INDEX "locations_farm_id_idx";--> statement-breakpoint
ALTER TABLE "farms" ALTER COLUMN "id" DROP IDENTITY;--> statement-breakpoint
ALTER TABLE "farms" ALTER COLUMN "id" SET DEFAULT 1;--> statement-breakpoint
ALTER TABLE "farms" ALTER COLUMN "name" SET DEFAULT 'NDMU School Farm';--> statement-breakpoint
ALTER TABLE "farms" ALTER COLUMN "code" SET DEFAULT 'NDMU-SCHOOL-FARM';--> statement-breakpoint
ALTER TABLE "farms" ADD COLUMN "institution" text DEFAULT 'NDMU' NOT NULL;--> statement-breakpoint
ALTER TABLE "workers" ADD CONSTRAINT "workers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "animals" DROP COLUMN "farm_id";--> statement-breakpoint
ALTER TABLE "feed_items" DROP COLUMN "farm_id";--> statement-breakpoint
ALTER TABLE "locations" DROP COLUMN "farm_id";--> statement-breakpoint
ALTER TABLE "feed_items" ADD CONSTRAINT "feed_items_name_unique" UNIQUE("name");--> statement-breakpoint
ALTER TABLE "locations" ADD CONSTRAINT "locations_name_unique" UNIQUE("name");--> statement-breakpoint
ALTER TABLE "farms" ADD CONSTRAINT "farms_singleton_id_check" CHECK ("farms"."id" = 1);--> statement-breakpoint
ALTER TABLE "farms" ADD CONSTRAINT "farms_ndmu_institution_check" CHECK ("farms"."institution" = 'NDMU');