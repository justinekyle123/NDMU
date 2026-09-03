import { relations, sql } from "drizzle-orm";
import {
  AnyPgColumn,
  check,
  date,
  index,
  integer,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", [
  "admin",
  "boss",
  "worker",
]);
export const locationTypeEnum = pgEnum("location_type", [
  "barn",
  "pasture",
  "coop",
  "stable",
  "pen",
  "other",
]);
export const animalSexEnum = pgEnum("animal_sex", ["female", "male"]);
export const animalStatusEnum = pgEnum("animal_status", [
  "active",
  "sold",
  "deceased",
  "transferred",
]);
export const healthRecordTypeEnum = pgEnum("health_record_type", [
  "checkup",
  "vaccination",
  "treatment",
  "illness",
  "injury",
]);
export const movementReasonEnum = pgEnum("movement_reason", [
  "transfer",
  "grazing",
  "quarantine",
  "sale",
  "other",
]);
export const breedingOutcomeEnum = pgEnum("breeding_outcome", [
  "planned",
  "successful",
  "unsuccessful",
  "cancelled",
]);
export const productionTypeEnum = pgEnum("production_type", [
  "milk",
  "eggs",
  "wool",
  "honey",
  "other",
]);
export const feedTransactionTypeEnum = pgEnum("feed_transaction_type", [
  "purchase",
  "usage",
  "adjustment",
]);
export const mortalityCauseEnum = pgEnum("mortality_cause", [
  "disease",
  "injury",
  "old_age",
  "birthing_complication",
  "predator",
  "unknown",
  "other",
]);
export const expenseCategoryEnum = pgEnum("expense_category", [
  "feed",
  "veterinary",
  "labor",
  "equipment",
  "utilities",
  "transport",
  "maintenance",
  "other",
]);

/** Application users; password hashes are optional for local/test authentication. */
export const users = pgTable("users", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  /** Nullable to support users managed by an external auth provider. */
  passwordHash: text("password_hash"),
  role: userRoleEnum("role").default("boss").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

/** Opaque browser sessions; only a one-way token digest is persisted. */
export const sessions = pgTable(
  "sessions",
  {
    id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    tokenHash: text("token_hash").notNull().unique(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [index("sessions_user_id_idx").on(table.userId)],
);

/** Profile and employment information for users with the worker role. */
export const workers = pgTable(
  "workers",
  {
    id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    employeeNumber: text("employee_number").notNull().unique(),
    phone: text("phone"),
    position: text("position"),
    hiredOn: date("hired_on"),
    endedOn: date("ended_on"),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [unique("workers_user_id_unique").on(table.userId)],
);

/**
 * The single farm operated by NDMU School.
 * The check constraint makes id=1 the only valid farm row.
 */
export const farm = pgTable(
  "farms",
  {
    id: integer("id").default(1).primaryKey(),
    name: text("name").default("NDMU School Farm").notNull(),
    code: text("code").default("NDMU-SCHOOL-FARM").notNull().unique(),
    institution: text("institution").default("NDMU").notNull(),
    address: text("address"),
    timezone: text("timezone").default("UTC").notNull(),
    createdBy: integer("created_by").references(() => users.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    check("farms_singleton_id_check", sql`${table.id} = 1`),
    check("farms_ndmu_institution_check", sql`${table.institution} = 'NDMU'`),
  ],
);

export const locations = pgTable("locations", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
  name: text("name").notNull().unique(),
  type: locationTypeEnum("type").notNull(),
  capacity: integer("capacity"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const species = pgTable("species", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
});

export const breeds = pgTable(
  "breeds",
  {
    id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
    speciesId: integer("species_id")
      .notNull()
      .references(() => species.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description"),
  },
  (table) => [
    unique("breeds_species_name_unique").on(table.speciesId, table.name),
    index("breeds_species_id_idx").on(table.speciesId),
  ],
);

export const animals = pgTable(
  "animals",
  {
    id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
    locationId: integer("location_id").references(() => locations.id, {
      onDelete: "set null",
    }),
    speciesId: integer("species_id")
      .notNull()
      .references(() => species.id, { onDelete: "restrict" }),
    breedId: integer("breed_id").references(() => breeds.id, {
      onDelete: "set null",
    }),
    tagNumber: text("tag_number").notNull().unique(),
    name: text("name"),
    sex: animalSexEnum("sex").notNull(),
    status: animalStatusEnum("status").default("active").notNull(),
    birthDate: date("birth_date"),
    acquisitionDate: date("acquisition_date"),
    motherId: integer("mother_id").references((): AnyPgColumn => animals.id, {
      onDelete: "set null",
    }),
    fatherId: integer("father_id").references((): AnyPgColumn => animals.id, {
      onDelete: "set null",
    }),
    notes: text("notes"),
    createdBy: integer("created_by").references(() => users.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("animals_location_id_idx").on(table.locationId),
    index("animals_species_id_idx").on(table.speciesId),
    index("animals_status_idx").on(table.status),
  ],
);

/** One immutable lifecycle record for an animal that has died. */
export const mortalityRecords = pgTable(
  "mortality_records",
  {
    id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
    animalId: integer("animal_id")
      .notNull()
      .references(() => animals.id, { onDelete: "restrict" }),
    diedOn: date("died_on").notNull(),
    cause: mortalityCauseEnum("cause").notNull(),
    locationId: integer("location_id").references(() => locations.id, {
      onDelete: "set null",
    }),
    incidentReference: text("incident_reference"),
    details: text("details"),
    recordedBy: integer("recorded_by")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    unique("mortality_records_animal_id_unique").on(table.animalId),
    index("mortality_records_died_on_idx").on(table.diedOn),
  ],
);

/** One completed sale record per animal. Mark the animal as sold after recording. */
export const animalSales = pgTable(
  "animal_sales",
  {
    id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
    animalId: integer("animal_id")
      .notNull()
      .references(() => animals.id, { onDelete: "restrict" }),
    saleDate: date("sale_date").notNull(),
    saleReference: text("sale_reference"),
    buyerName: text("buyer_name").notNull(),
    buyerContact: text("buyer_contact"),
    salePrice: numeric("sale_price", { precision: 12, scale: 2 }).notNull(),
    currency: text("currency").notNull(),
    notes: text("notes"),
    recordedBy: integer("recorded_by")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    unique("animal_sales_animal_id_unique").on(table.animalId),
    index("animal_sales_sale_date_idx").on(table.saleDate),
  ],
);

export const animalHealthRecords = pgTable(
  "animal_health_records",
  {
    id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
    animalId: integer("animal_id")
      .notNull()
      .references(() => animals.id, { onDelete: "cascade" }),
    type: healthRecordTypeEnum("type").notNull(),
    recordedAt: timestamp("recorded_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    diagnosis: text("diagnosis"),
    treatment: text("treatment"),
    veterinarian: text("veterinarian"),
    cost: numeric("cost", { precision: 12, scale: 2 }),
    notes: text("notes"),
    recordedBy: integer("recorded_by").references(() => users.id, {
      onDelete: "set null",
    }),
  },
  (table) => [index("animal_health_records_animal_id_idx").on(table.animalId)],
);

export const animalMovements = pgTable(
  "animal_movements",
  {
    id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
    animalId: integer("animal_id")
      .notNull()
      .references(() => animals.id, { onDelete: "cascade" }),
    fromLocationId: integer("from_location_id").references(() => locations.id, {
      onDelete: "set null",
    }),
    toLocationId: integer("to_location_id").references(() => locations.id, {
      onDelete: "set null",
    }),
    reason: movementReasonEnum("reason").notNull(),
    movedAt: timestamp("moved_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    notes: text("notes"),
    recordedBy: integer("recorded_by").references(() => users.id, {
      onDelete: "set null",
    }),
  },
  (table) => [index("animal_movements_animal_id_idx").on(table.animalId)],
);

export const breedingRecords = pgTable(
  "breeding_records",
  {
    id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
    femaleAnimalId: integer("female_animal_id")
      .notNull()
      .references(() => animals.id, { onDelete: "cascade" }),
    maleAnimalId: integer("male_animal_id").references(() => animals.id, {
      onDelete: "set null",
    }),
    breedingDate: date("breeding_date").notNull(),
    expectedBirthDate: date("expected_birth_date"),
    outcome: breedingOutcomeEnum("outcome").default("planned").notNull(),
    notes: text("notes"),
    recordedBy: integer("recorded_by").references(() => users.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("breeding_records_female_animal_id_idx").on(table.femaleAnimalId),
    index("breeding_records_outcome_idx").on(table.outcome),
  ],
);

export const productionRecords = pgTable(
  "production_records",
  {
    id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
    animalId: integer("animal_id")
      .notNull()
      .references(() => animals.id, { onDelete: "cascade" }),
    type: productionTypeEnum("type").notNull(),
    quantity: numeric("quantity", { precision: 12, scale: 3 }).notNull(),
    unit: text("unit").notNull(),
    recordedAt: timestamp("recorded_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    qualityNotes: text("quality_notes"),
    recordedBy: integer("recorded_by").references(() => users.id, {
      onDelete: "set null",
    }),
  },
  (table) => [
    index("production_records_animal_id_idx").on(table.animalId),
    index("production_records_recorded_at_idx").on(table.recordedAt),
  ],
);

/** General farm expense ledger; creation should be restricted to admins. */
export const expenses = pgTable(
  "expenses",
  {
    id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
    category: expenseCategoryEnum("category").notNull(),
    description: text("description").notNull(),
    amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
    currency: text("currency").notNull(),
    expenseDate: date("expense_date").notNull(),
    vendor: text("vendor"),
    receiptReference: text("receipt_reference"),
    notes: text("notes"),
    recordedBy: integer("recorded_by")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    check("expenses_amount_non_negative_check", sql`${table.amount} >= 0`),
    index("expenses_category_idx").on(table.category),
    index("expenses_expense_date_idx").on(table.expenseDate),
  ],
);

export const feedItems = pgTable(
  "feed_items",
  {
    id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
    name: text("name").notNull().unique(),
    unit: text("unit").notNull(),
    quantityOnHand: numeric("quantity_on_hand", {
      precision: 12,
      scale: 3,
    })
      .default("0")
      .notNull(),
    reorderLevel: numeric("reorder_level", { precision: 12, scale: 3 })
      .default("0")
      .notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
);

export const feedTransactions = pgTable(
  "feed_transactions",
  {
    id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
    feedItemId: integer("feed_item_id")
      .notNull()
      .references(() => feedItems.id, { onDelete: "cascade" }),
    type: feedTransactionTypeEnum("type").notNull(),
    quantity: numeric("quantity", { precision: 12, scale: 3 }).notNull(),
    occurredAt: timestamp("occurred_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    notes: text("notes"),
    recordedBy: integer("recorded_by").references(() => users.id, {
      onDelete: "set null",
    }),
  },
  (table) => [
    index("feed_transactions_feed_item_id_idx").on(table.feedItemId),
    index("feed_transactions_occurred_at_idx").on(table.occurredAt),
  ],
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type Worker = typeof workers.$inferSelect;
export type NewWorker = typeof workers.$inferInsert;
export type Farm = typeof farm.$inferSelect;
export type Animal = typeof animals.$inferSelect;
export type NewAnimal = typeof animals.$inferInsert;
export type MortalityRecord = typeof mortalityRecords.$inferSelect;
export type AnimalSale = typeof animalSales.$inferSelect;
export const usersRelations = relations(users, ({ one, many }) => ({
  workerProfile: one(workers),
  createdFarms: many(farm, { relationName: "farmCreatedBy" }),
  createdAnimals: many(animals, { relationName: "animalCreatedBy" }),
  mortalityRecords: many(mortalityRecords, {
    relationName: "mortalityRecordedBy",
  }),
  animalSales: many(animalSales, { relationName: "animalSaleRecordedBy" }),
  healthRecords: many(animalHealthRecords, {
    relationName: "healthRecordRecordedBy",
  }),
  animalMovements: many(animalMovements, {
    relationName: "animalMovementRecordedBy",
  }),
  breedingRecords: many(breedingRecords, {
    relationName: "breedingRecordedBy",
  }),
  productionRecords: many(productionRecords, {
    relationName: "productionRecordedBy",
  }),
  expenses: many(expenses, { relationName: "expenseRecordedBy" }),
  feedTransactions: many(feedTransactions, {
    relationName: "feedTransactionRecordedBy",
  }),
}));

export const workersRelations = relations(workers, ({ one }) => ({
  user: one(users, {
    fields: [workers.userId],
    references: [users.id],
  }),
}));

export const farmRelations = relations(farm, ({ one }) => ({
  createdByUser: one(users, {
    fields: [farm.createdBy],
    references: [users.id],
    relationName: "farmCreatedBy",
  }),
}));

export const animalsRelations = relations(animals, ({ one }) => ({
  createdByUser: one(users, {
    fields: [animals.createdBy],
    references: [users.id],
    relationName: "animalCreatedBy",
  }),
}));

export const mortalityRecordsRelations = relations(
  mortalityRecords,
  ({ one }) => ({
    recordedByUser: one(users, {
      fields: [mortalityRecords.recordedBy],
      references: [users.id],
      relationName: "mortalityRecordedBy",
    }),
    animal: one(animals, {
      fields: [mortalityRecords.animalId],
      references: [animals.id],
    }),
    location: one(locations, {
      fields: [mortalityRecords.locationId],
      references: [locations.id],
    }),
  }),
);

export const animalSalesRelations = relations(animalSales, ({ one }) => ({
  recordedByUser: one(users, {
    fields: [animalSales.recordedBy],
    references: [users.id],
    relationName: "animalSaleRecordedBy",
  }),
  animal: one(animals, {
    fields: [animalSales.animalId],
    references: [animals.id],
  }),
}));

export const animalHealthRecordsRelations = relations(
  animalHealthRecords,
  ({ one }) => ({
    recordedByUser: one(users, {
      fields: [animalHealthRecords.recordedBy],
      references: [users.id],
      relationName: "healthRecordRecordedBy",
    }),
    animal: one(animals, {
      fields: [animalHealthRecords.animalId],
      references: [animals.id],
    }),
  }),
);

export const animalMovementsRelations = relations(
  animalMovements,
  ({ one }) => ({
    recordedByUser: one(users, {
      fields: [animalMovements.recordedBy],
      references: [users.id],
      relationName: "animalMovementRecordedBy",
    }),
    animal: one(animals, {
      fields: [animalMovements.animalId],
      references: [animals.id],
    }),
    fromLocation: one(locations, {
      fields: [animalMovements.fromLocationId],
      references: [locations.id],
      relationName: "animalMovementFromLocation",
    }),
    toLocation: one(locations, {
      fields: [animalMovements.toLocationId],
      references: [locations.id],
      relationName: "animalMovementToLocation",
    }),
  }),
);

export const breedingRecordsRelations = relations(
  breedingRecords,
  ({ one }) => ({
    recordedByUser: one(users, {
      fields: [breedingRecords.recordedBy],
      references: [users.id],
      relationName: "breedingRecordedBy",
    }),
    femaleAnimal: one(animals, {
      fields: [breedingRecords.femaleAnimalId],
      references: [animals.id],
      relationName: "breedingFemaleAnimal",
    }),
    maleAnimal: one(animals, {
      fields: [breedingRecords.maleAnimalId],
      references: [animals.id],
      relationName: "breedingMaleAnimal",
    }),
  }),
);

export const productionRecordsRelations = relations(
  productionRecords,
  ({ one }) => ({
    recordedByUser: one(users, {
      fields: [productionRecords.recordedBy],
      references: [users.id],
      relationName: "productionRecordedBy",
    }),
    animal: one(animals, {
      fields: [productionRecords.animalId],
      references: [animals.id],
    }),
  }),
);

export const expensesRelations = relations(expenses, ({ one }) => ({
  recordedByUser: one(users, {
    fields: [expenses.recordedBy],
    references: [users.id],
    relationName: "expenseRecordedBy",
  }),
}));

export const feedTransactionsRelations = relations(
  feedTransactions,
  ({ one }) => ({
    recordedByUser: one(users, {
      fields: [feedTransactions.recordedBy],
      references: [users.id],
      relationName: "feedTransactionRecordedBy",
    }),
    feedItem: one(feedItems, {
      fields: [feedTransactions.feedItemId],
      references: [feedItems.id],
    }),
  }),
);

export type Expense = typeof expenses.$inferSelect;
