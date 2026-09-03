CREATE TYPE "public"."animal_sex" AS ENUM('female', 'male');--> statement-breakpoint
CREATE TYPE "public"."animal_status" AS ENUM('active', 'sold', 'deceased', 'transferred');--> statement-breakpoint
CREATE TYPE "public"."breeding_outcome" AS ENUM('planned', 'successful', 'unsuccessful', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."feed_transaction_type" AS ENUM('purchase', 'usage', 'adjustment');--> statement-breakpoint
CREATE TYPE "public"."health_record_type" AS ENUM('checkup', 'vaccination', 'treatment', 'illness', 'injury');--> statement-breakpoint
CREATE TYPE "public"."location_type" AS ENUM('barn', 'pasture', 'coop', 'stable', 'pen', 'other');--> statement-breakpoint
CREATE TYPE "public"."movement_reason" AS ENUM('transfer', 'grazing', 'quarantine', 'sale', 'other');--> statement-breakpoint
CREATE TYPE "public"."production_type" AS ENUM('milk', 'eggs', 'wool', 'honey', 'other');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('admin', 'boss');--> statement-breakpoint
CREATE TABLE "animal_health_records" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "animal_health_records_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"animal_id" integer NOT NULL,
	"type" "health_record_type" NOT NULL,
	"recorded_at" timestamp with time zone DEFAULT now() NOT NULL,
	"diagnosis" text,
	"treatment" text,
	"veterinarian" text,
	"cost" numeric(12, 2),
	"notes" text,
	"recorded_by" integer
);
--> statement-breakpoint
CREATE TABLE "animal_movements" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "animal_movements_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"animal_id" integer NOT NULL,
	"from_location_id" integer,
	"to_location_id" integer,
	"reason" "movement_reason" NOT NULL,
	"moved_at" timestamp with time zone DEFAULT now() NOT NULL,
	"notes" text,
	"recorded_by" integer
);
--> statement-breakpoint
CREATE TABLE "animals" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "animals_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"farm_id" integer NOT NULL,
	"location_id" integer,
	"species_id" integer NOT NULL,
	"breed_id" integer,
	"tag_number" text NOT NULL,
	"name" text,
	"sex" "animal_sex" NOT NULL,
	"status" "animal_status" DEFAULT 'active' NOT NULL,
	"birth_date" date,
	"acquisition_date" date,
	"mother_id" integer,
	"father_id" integer,
	"notes" text,
	"created_by" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "animals_tag_number_unique" UNIQUE("tag_number")
);
--> statement-breakpoint
CREATE TABLE "breeding_records" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "breeding_records_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"female_animal_id" integer NOT NULL,
	"male_animal_id" integer,
	"breeding_date" date NOT NULL,
	"expected_birth_date" date,
	"outcome" "breeding_outcome" DEFAULT 'planned' NOT NULL,
	"notes" text,
	"recorded_by" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "breeds" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "breeds_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"species_id" integer NOT NULL,
	"name" text NOT NULL,
	"description" text,
	CONSTRAINT "breeds_species_name_unique" UNIQUE("species_id","name")
);
--> statement-breakpoint
CREATE TABLE "farms" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "farms_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"code" text NOT NULL,
	"address" text,
	"timezone" text DEFAULT 'UTC' NOT NULL,
	"created_by" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "farms_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "feed_items" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "feed_items_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"farm_id" integer NOT NULL,
	"name" text NOT NULL,
	"unit" text NOT NULL,
	"quantity_on_hand" numeric(12, 3) DEFAULT '0' NOT NULL,
	"reorder_level" numeric(12, 3) DEFAULT '0' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "feed_items_farm_name_unique" UNIQUE("farm_id","name")
);
--> statement-breakpoint
CREATE TABLE "feed_transactions" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "feed_transactions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"feed_item_id" integer NOT NULL,
	"type" "feed_transaction_type" NOT NULL,
	"quantity" numeric(12, 3) NOT NULL,
	"occurred_at" timestamp with time zone DEFAULT now() NOT NULL,
	"notes" text,
	"recorded_by" integer
);
--> statement-breakpoint
CREATE TABLE "locations" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "locations_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"farm_id" integer NOT NULL,
	"name" text NOT NULL,
	"type" "location_type" NOT NULL,
	"capacity" integer,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "locations_farm_name_unique" UNIQUE("farm_id","name")
);
--> statement-breakpoint
CREATE TABLE "production_records" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "production_records_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"animal_id" integer NOT NULL,
	"type" "production_type" NOT NULL,
	"quantity" numeric(12, 3) NOT NULL,
	"unit" text NOT NULL,
	"recorded_at" timestamp with time zone DEFAULT now() NOT NULL,
	"quality_notes" text,
	"recorded_by" integer
);
--> statement-breakpoint
CREATE TABLE "species" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "species_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"description" text,
	CONSTRAINT "species_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "role" "user_role" DEFAULT 'boss' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "animal_health_records" ADD CONSTRAINT "animal_health_records_animal_id_animals_id_fk" FOREIGN KEY ("animal_id") REFERENCES "public"."animals"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "animal_health_records" ADD CONSTRAINT "animal_health_records_recorded_by_users_id_fk" FOREIGN KEY ("recorded_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "animal_movements" ADD CONSTRAINT "animal_movements_animal_id_animals_id_fk" FOREIGN KEY ("animal_id") REFERENCES "public"."animals"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "animal_movements" ADD CONSTRAINT "animal_movements_from_location_id_locations_id_fk" FOREIGN KEY ("from_location_id") REFERENCES "public"."locations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "animal_movements" ADD CONSTRAINT "animal_movements_to_location_id_locations_id_fk" FOREIGN KEY ("to_location_id") REFERENCES "public"."locations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "animal_movements" ADD CONSTRAINT "animal_movements_recorded_by_users_id_fk" FOREIGN KEY ("recorded_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "animals" ADD CONSTRAINT "animals_farm_id_farms_id_fk" FOREIGN KEY ("farm_id") REFERENCES "public"."farms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "animals" ADD CONSTRAINT "animals_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "animals" ADD CONSTRAINT "animals_species_id_species_id_fk" FOREIGN KEY ("species_id") REFERENCES "public"."species"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "animals" ADD CONSTRAINT "animals_breed_id_breeds_id_fk" FOREIGN KEY ("breed_id") REFERENCES "public"."breeds"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "animals" ADD CONSTRAINT "animals_mother_id_animals_id_fk" FOREIGN KEY ("mother_id") REFERENCES "public"."animals"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "animals" ADD CONSTRAINT "animals_father_id_animals_id_fk" FOREIGN KEY ("father_id") REFERENCES "public"."animals"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "animals" ADD CONSTRAINT "animals_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "breeding_records" ADD CONSTRAINT "breeding_records_female_animal_id_animals_id_fk" FOREIGN KEY ("female_animal_id") REFERENCES "public"."animals"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "breeding_records" ADD CONSTRAINT "breeding_records_male_animal_id_animals_id_fk" FOREIGN KEY ("male_animal_id") REFERENCES "public"."animals"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "breeding_records" ADD CONSTRAINT "breeding_records_recorded_by_users_id_fk" FOREIGN KEY ("recorded_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "breeds" ADD CONSTRAINT "breeds_species_id_species_id_fk" FOREIGN KEY ("species_id") REFERENCES "public"."species"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "farms" ADD CONSTRAINT "farms_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feed_items" ADD CONSTRAINT "feed_items_farm_id_farms_id_fk" FOREIGN KEY ("farm_id") REFERENCES "public"."farms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feed_transactions" ADD CONSTRAINT "feed_transactions_feed_item_id_feed_items_id_fk" FOREIGN KEY ("feed_item_id") REFERENCES "public"."feed_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feed_transactions" ADD CONSTRAINT "feed_transactions_recorded_by_users_id_fk" FOREIGN KEY ("recorded_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "locations" ADD CONSTRAINT "locations_farm_id_farms_id_fk" FOREIGN KEY ("farm_id") REFERENCES "public"."farms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "production_records" ADD CONSTRAINT "production_records_animal_id_animals_id_fk" FOREIGN KEY ("animal_id") REFERENCES "public"."animals"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "production_records" ADD CONSTRAINT "production_records_recorded_by_users_id_fk" FOREIGN KEY ("recorded_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "animal_health_records_animal_id_idx" ON "animal_health_records" USING btree ("animal_id");--> statement-breakpoint
CREATE INDEX "animal_movements_animal_id_idx" ON "animal_movements" USING btree ("animal_id");--> statement-breakpoint
CREATE INDEX "animals_farm_id_idx" ON "animals" USING btree ("farm_id");--> statement-breakpoint
CREATE INDEX "animals_location_id_idx" ON "animals" USING btree ("location_id");--> statement-breakpoint
CREATE INDEX "animals_species_id_idx" ON "animals" USING btree ("species_id");--> statement-breakpoint
CREATE INDEX "animals_status_idx" ON "animals" USING btree ("status");--> statement-breakpoint
CREATE INDEX "breeding_records_female_animal_id_idx" ON "breeding_records" USING btree ("female_animal_id");--> statement-breakpoint
CREATE INDEX "breeding_records_outcome_idx" ON "breeding_records" USING btree ("outcome");--> statement-breakpoint
CREATE INDEX "breeds_species_id_idx" ON "breeds" USING btree ("species_id");--> statement-breakpoint
CREATE INDEX "feed_items_farm_id_idx" ON "feed_items" USING btree ("farm_id");--> statement-breakpoint
CREATE INDEX "feed_transactions_feed_item_id_idx" ON "feed_transactions" USING btree ("feed_item_id");--> statement-breakpoint
CREATE INDEX "feed_transactions_occurred_at_idx" ON "feed_transactions" USING btree ("occurred_at");--> statement-breakpoint
CREATE INDEX "locations_farm_id_idx" ON "locations" USING btree ("farm_id");--> statement-breakpoint
CREATE INDEX "production_records_animal_id_idx" ON "production_records" USING btree ("animal_id");--> statement-breakpoint
CREATE INDEX "production_records_recorded_at_idx" ON "production_records" USING btree ("recorded_at");