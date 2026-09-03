import "dotenv/config";
import { promisify } from "node:util";
import { randomBytes, scrypt as scryptCallback } from "node:crypto";
import pg from "pg";

const { Pool } = pg;
const scrypt = promisify(scryptCallback);
const databaseTarget = process.env.DATABASE_TARGET ?? "local";
const databaseUrl =
  databaseTarget === "neon"
    ? process.env.NEON_DATABASE_URL
    : process.env.LOCAL_DATABASE_URL;

if (databaseTarget !== "local" && databaseTarget !== "neon") {
  throw new Error(
    `DATABASE_TARGET must be either "local" or "neon", received "${databaseTarget}"`,
  );
}

if (!databaseUrl) {
  const variableName =
    databaseTarget === "neon" ? "NEON_DATABASE_URL" : "LOCAL_DATABASE_URL";
  throw new Error(
    `${variableName} is required when DATABASE_TARGET=${databaseTarget}`,
  );
}

const testUsers = [
  {
    name: "Test Admin",
    email: "admin.test@ndmu.local",
    role: "admin",
    password: "Admin123!",
  },
  {
    name: "Test Boss",
    email: "boss.test@ndmu.local",
    role: "boss",
    password: "Boss123!",
  },
  {
    name: "Test Worker",
    email: "worker.test@ndmu.local",
    role: "worker",
    password: "Worker123!",
  },
];

async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = await scrypt(password, salt, 64);
  return `scrypt:${salt}:${derivedKey.toString("hex")}`;
}

const pool = new Pool({ connectionString: databaseUrl });

try {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    for (const user of testUsers) {
      const passwordHash = await hashPassword(user.password);
      const { rows } = await client.query(
        `
          INSERT INTO users (name, email, password_hash, role)
          VALUES ($1, $2, $3, $4::user_role)
          ON CONFLICT (email) DO UPDATE SET
            name = EXCLUDED.name,
            password_hash = EXCLUDED.password_hash,
            role = EXCLUDED.role,
            updated_at = now()
          RETURNING id
        `,
        [user.name, user.email, passwordHash, user.role],
      );

      if (user.role === "worker") {
        await client.query(
          `
            INSERT INTO workers (user_id, employee_number, position)
            VALUES ($1, $2, $3)
            ON CONFLICT (user_id) DO UPDATE SET
              employee_number = EXCLUDED.employee_number,
              position = EXCLUDED.position,
              updated_at = now()
          `,
          [rows[0].id, "TEST-WORKER-001", "Farm Worker"],
        );
      }
    }

    await client.query("COMMIT");
    console.log(
      `Seeded ${testUsers.length} test users for ${databaseTarget} database.`,
    );
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
} finally {
  await pool.end();
}
