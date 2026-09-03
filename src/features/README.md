# Feature Modules

Each product domain gets a directory under `src/features`.

```text
src/features/<feature>/
├── components/       # Feature-owned React components
├── hooks/            # Feature-owned React hooks
├── lib/              # Feature-specific helpers and business logic
├── types.ts          # Feature-specific types
└── index.ts          # Public exports for other modules
```

Keep route files in `src/app` focused on Next.js composition: params, metadata,
layouts, loading/error states, and rendering a feature entrypoint. Feature
modules may depend on shared code in `src/components`, `src/hooks`, `src/lib`,
`src/db`, and `src/types`, but shared modules should not import from a feature.

Prefer importing from a feature's `index.ts` rather than reaching into another
feature's internal files:

```tsx
import { HomePage } from "@/features/home";
```
