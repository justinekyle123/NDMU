# NDMU

A Next.js application using TypeScript, Tailwind CSS, PostgreSQL, and Drizzle ORM.

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
