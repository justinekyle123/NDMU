export type DatabaseTarget = "local" | "neon";

export function getDatabaseTarget(): DatabaseTarget {
  const target = process.env.DATABASE_TARGET ?? "local";

  if (target !== "local" && target !== "neon") {
    throw new Error(
      `DATABASE_TARGET must be either "local" or "neon", received "${target}"`,
    );
  }

  return target;
}

export function getDatabaseUrl(): string {
  const target = getDatabaseTarget();
  const databaseUrl =
    target === "neon"
      ? process.env.NEON_DATABASE_URL
      : process.env.LOCAL_DATABASE_URL;

  if (!databaseUrl) {
    throw new Error(
      `${target === "neon" ? "NEON_DATABASE_URL" : "LOCAL_DATABASE_URL"} is required when DATABASE_TARGET=${target}`,
    );
  }

  return databaseUrl;
}
