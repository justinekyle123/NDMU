import "server-only";

import { createHash, randomBytes } from "node:crypto";
import { and, eq, gt } from "drizzle-orm";
import { cookies } from "next/headers";
import { cache } from "react";
import { db } from "@/db";
import { sessions, users } from "@/db/schema";

const SESSION_COOKIE = "ndmu_session";
const SESSION_TTL_MS = 8 * 60 * 60 * 1000;

function digestToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function cookieOptions(expires: Date) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    expires,
    path: "/",
  };
}

export async function createSession(userId: number, rememberMe = false) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(
    Date.now() + (rememberMe ? 30 * 24 * 60 * 60 * 1000 : SESSION_TTL_MS),
  );

  await db.insert(sessions).values({
    userId,
    tokenHash: digestToken(token),
    expiresAt,
  });

  (await cookies()).set(
    SESSION_COOKIE,
    token,
    cookieOptions(expiresAt),
  );
}

export const getCurrentUser = cache(async () => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) {
    return null;
  }

  const result = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
    })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(
      and(
        eq(sessions.tokenHash, digestToken(token)),
        gt(sessions.expiresAt, new Date()),
      ),
    )
    .limit(1);

  return result[0] ?? null;
});

export async function deleteSession() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;

  if (token) {
    await db
      .delete(sessions)
      .where(eq(sessions.tokenHash, digestToken(token)));
  }

  (await cookies()).set(SESSION_COOKIE, "", cookieOptions(new Date(0)));
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("UNAUTHENTICATED");
  }

  return user;
}
