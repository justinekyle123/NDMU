# NDMU

A Next.js application using TypeScript, Tailwind CSS, PostgreSQL, and Drizzle ORM to manage the NDMU School Farm.

## Project Structure

```text
.
├── public/                 # Static assets
├── src/
│   ├── app/                # App Router routes, layouts, and global styles
│   ├── components/         # Shared React components
│   │   └── ui/             # Shared UI primitives
│   ├── db/                 # Drizzle client, config, and schema
│   ├── features/           # Feature-first product modules
│   │   ├── home/            # Home page feature
│   │   └── README.md        # Feature module conventions
│   ├── hooks/              # Shared React hooks
│   ├── lib/                # Shared utilities and integrations
│   └── types/              # Shared TypeScript types
├── drizzle/               # Generated database migrations
├── compose.yaml            # Local PostgreSQL service
├── drizzle.config.ts      # Drizzle Kit configuration
└── public/                # Publicly served static files
```

Use the `@/*` alias for imports from `src`. Import feature APIs through their
barrel file and keep route files thin:

```tsx
import { HomePage } from "@/features/home";
import { db } from "@/db";
```

## Database Setup

The project supports two PostgreSQL targets. `DATABASE_TARGET` selects which
connection is used by both the application and Drizzle Kit.

### Local PostgreSQL

Docker Desktop or Docker Engine is required.

```bash
npm run db:local:up
npm run db:migrate
npm run dev
```

The local service uses PostgreSQL 16 and the default credentials from
`compose.yaml`. Change `LOCAL_DATABASE_URL` in `.env` if you customize them.

Stop the local database with:

```bash
npm run db:local:down
```

### Neon PostgreSQL

Create a Neon project and copy its pooled connection string from the Neon
Console. Put it in `.env` as `NEON_DATABASE_URL`, set `DATABASE_TARGET=neon`,
and run the migration:

```bash
npm run db:migrate
npm run dev
```

Do not commit `.env`. Use `.env.example` as the shareable template. The
Neon setup link is available at:

https://neon.tech

## Farm Management Schema

The database is intentionally modeled for **one farm only**: the NDMU School
Farm. The `farms` table uses a fixed primary key and database checks requiring
`id = 1` and `institution = 'NDMU'`. Farm-specific data is therefore linked to
the singleton farm implicitly, while locations, animals, and feed items remain
separate entities.

The schema in `src/db/schema.ts` includes:

- `users`: application users with `admin`, `boss`, or `worker` roles.
- `workers`: employment/profile details for users with the `worker` role.
- `farms`: the singleton NDMU School Farm profile and settings.
- `locations`: barns, pastures, coops, stables, and pens within the farm.
- `species`, `breeds`, and `animals`: animal identity, lineage, location, and status.
- `mortality_records`: one auditable mortality record per deceased animal, including date and cause.
- `animal_sales`: one auditable sale record per sold animal, including buyer and sale price.
- `animal_health_records`: checkups, vaccinations, treatments, illnesses, and injuries.
- `animal_movements`: auditable transfers between farm locations.
- `breeding_records`: breeding events, expected births, and outcomes.
- `production_records`: milk, eggs, wool, honey, and other production measurements.
- `feed_items` and `feed_transactions`: feed stock and an auditable inventory ledger.
- `expenses`: general farm expense ledger with categories, vendors, receipts, and amounts.

### Role permissions

- **Admin**: manage all users, worker profiles, farm settings, animals, locations,
  health, breeding, production, movement, feed records, mortality, sales, and expenses.
- **Boss**: view all farm records and reports; no mutations.
- **Worker**: view operational records and perform only the operational writes
  explicitly granted by the application (for example, recording health,
  movement, or production events).

The database stores roles and audit fields, but authorization must be enforced
in authenticated server actions, route handlers, and service functions. Do not
rely on UI visibility alone. Only an authenticated `admin` should be allowed to
create or update mortality, sale, and expense records; `boss` remains read-only
and `worker` should not write these financial/lifecycle records. The schema does
not hard-code a user count; seed one admin and one boss initially, then add
worker users as needed.

Mortality and sale rows use restrictive foreign keys and one-record-per-animal
constraints to preserve history. When recording either event, update the
animal's status to `deceased` or `sold` in the same transaction. Do not delete
animals to represent either event.

## Commands

```bash
npm run dev
npm run build
npm run lint
npm run db:generate
npm run db:migrate
npm run db:local:up
npm run db:local:down
npm run db:local:logs
```
