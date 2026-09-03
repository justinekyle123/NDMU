# NDMU

A Next.js application using TypeScript, Tailwind CSS, and Drizzle ORM.

## Project Structure

```text
.
├── public/                 # Static assets
├── src/
│   ├── app/                # App Router routes, layouts, and global styles
│   ├── components/         # Shared React components
│   │   └── ui/             # Shared UI primitives
│   ├── db/                 # Drizzle client and database schema
│   ├── features/           # Feature-first product modules
│   │   ├── home/            # Home page feature
│   │   └── README.md        # Feature module conventions
│   ├── hooks/              # Shared React hooks
│   ├── lib/                # Shared utilities and integrations
│   └── types/              # Shared TypeScript types
├── drizzle/               # Generated database migrations
├── drizzle.config.ts      # Drizzle Kit configuration
└── public/                # Publicly served static files
```

Use the `@/*` alias for imports from `src`. Import feature APIs through their
barrel file and keep route files thin:

```tsx
import { HomePage } from "@/features/home";
import { db } from "@/db";
```

## Commands

```bash
npm run dev
npm run build
npm run lint
npm run db:generate
npm run db:migrate
```
