# Test Users

These accounts are created by `npm run db:seed`. They are for local or test
systems only. The seeder stores a salted `scrypt` password hash in the
`users.password_hash` column; it does not store these plaintext passwords in
the database.

| Role | Name | Email | Password |
| --- | --- | --- | --- |
| Admin | Test Admin | `admin.test@ndmu.local` | `Admin123!` |
| Boss | Test Boss | `boss.test@ndmu.local` | `Boss123!` |
| Worker | Test Worker | `worker.test@ndmu.local` | `Worker123!` |

## Local Setup

1. Ensure `.env` contains:

   ```dotenv
   DATABASE_TARGET=local
   LOCAL_DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ndmu
   ```

2. Start PostgreSQL and apply all pending migrations:

   ```bash
   npm run db:local:up
   npm run db:migrate
   ```

3. Insert or update the three test users:

   ```bash
   npm run db:seed
   ```

4. Start the application:

   ```bash
   npm run dev
   ```

To stop the local database, run `npm run db:local:down`.

## Neon Setup

1. Copy the pooled connection string from the Neon Console into `.env`:

   ```dotenv
   DATABASE_TARGET=neon
   NEON_DATABASE_URL=postgresql://user:password@ep-example.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

2. Apply the migrations to the Neon database:

   ```bash
   npm run db:migrate
   ```

3. Seed the three test users in Neon:

   ```bash
   npm run db:seed
   ```

The commands use the database selected by `DATABASE_TARGET`. Run them from the
project root, and never commit `.env`. The seed is idempotent by email, so
running it again updates the test users instead of creating duplicates. For
the worker account, it also creates or updates the matching `workers` profile
with employee number `TEST-WORKER-001` and position `Farm Worker`.

## Important

These credentials are intentionally predictable test credentials. Change or
remove them before using a shared, staging, or production database.The application now provides a server-side login flow at `/login`. It verifies passwords against
`users.password_hash` with a constant-time `scrypt` routine and stores only a SHA-256 digest of
each random session token in the `sessions` table. Apply migrations before signing in.
