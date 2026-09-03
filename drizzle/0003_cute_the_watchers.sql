CREATE TYPE "public"."expense_category" AS ENUM('feed', 'veterinary', 'labor', 'equipment', 'utilities', 'transport', 'maintenance', 'other');--> statement-breakpoint
CREATE TYPE "public"."mortality_cause" AS ENUM('disease', 'injury', 'old_age', 'birthing_complication', 'predator', 'unknown', 'other');--> statement-breakpoint
CREATE TABLE "animal_sales" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "animal_sales_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"animal_id" integer NOT NULL,
	"sale_date" date NOT NULL,
	"sale_reference" text,
	"buyer_name" text NOT NULL,
	"buyer_contact" text,
	"sale_price" numeric(12, 2) NOT NULL,
	"currency" text NOT NULL,
	"notes" text,
	"recorded_by" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "animal_sales_animal_id_unique" UNIQUE("animal_id")
);
--> statement-breakpoint
CREATE TABLE "expenses" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "expenses_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"category" "expense_category" NOT NULL,
	"description" text NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"currency" text NOT NULL,
	"expense_date" date NOT NULL,
	"vendor" text,
	"receipt_reference" text,
	"notes" text,
	"recorded_by" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "expenses_amount_non_negative_check" CHECK ("expenses"."amount" >= 0)
);
--> statement-breakpoint
CREATE TABLE "mortality_records" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "mortality_records_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"animal_id" integer NOT NULL,
	"died_on" date NOT NULL,
	"cause" "mortality_cause" NOT NULL,
	"location_id" integer,
	"incident_reference" text,
	"details" text,
	"recorded_by" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "mortality_records_animal_id_unique" UNIQUE("animal_id")
);
--> statement-breakpoint
ALTER TABLE "animal_sales" ADD CONSTRAINT "animal_sales_animal_id_animals_id_fk" FOREIGN KEY ("animal_id") REFERENCES "public"."animals"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "animal_sales" ADD CONSTRAINT "animal_sales_recorded_by_users_id_fk" FOREIGN KEY ("recorded_by") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_recorded_by_users_id_fk" FOREIGN KEY ("recorded_by") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mortality_records" ADD CONSTRAINT "mortality_records_animal_id_animals_id_fk" FOREIGN KEY ("animal_id") REFERENCES "public"."animals"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mortality_records" ADD CONSTRAINT "mortality_records_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mortality_records" ADD CONSTRAINT "mortality_records_recorded_by_users_id_fk" FOREIGN KEY ("recorded_by") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "animal_sales_sale_date_idx" ON "animal_sales" USING btree ("sale_date");--> statement-breakpoint
CREATE INDEX "expenses_category_idx" ON "expenses" USING btree ("category");--> statement-breakpoint
CREATE INDEX "expenses_expense_date_idx" ON "expenses" USING btree ("expense_date");--> statement-breakpoint
CREATE INDEX "mortality_records_died_on_idx" ON "mortality_records" USING btree ("died_on");