import { neon } from "@neondatabase/serverless";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { drizzle as drizzlePostgres } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { getDatabaseTarget, getDatabaseUrl } from "./config";

const databaseTarget = getDatabaseTarget();
const databaseUrl = getDatabaseUrl();

export const db =
  databaseTarget === "neon"
    ? drizzleNeon(neon(databaseUrl))
    : drizzlePostgres(new Pool({ connectionString: databaseUrl }));
