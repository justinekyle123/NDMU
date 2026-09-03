import { neon } from "@neondatabase/serverless";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { drizzle as drizzlePostgres } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { getDatabaseTarget, getDatabaseUrl } from "./config";
import * as schema from "./schema";

const databaseTarget = getDatabaseTarget();
const databaseUrl = getDatabaseUrl();

export const db =
  databaseTarget === "neon"
    ? drizzleNeon(neon(databaseUrl), { schema })
    : drizzlePostgres(new Pool({ connectionString: databaseUrl }), { schema });
