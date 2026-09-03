"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { users } from "@/db/schema";
import { createSession } from "./session";
import { verifyPassword } from "./password";

export type LoginState = {
  error?: string;
};

const INVALID_CREDENTIALS = "The email or password is incorrect.";

export async function login(
  _previousState: LoginState | undefined,
  formData: FormData,
): Promise<LoginState | undefined> {
  const emailValue = formData.get("email");
  const passwordValue = formData.get("password");
  const email = typeof emailValue === "string" ? emailValue.trim().toLowerCase() : "";
  const password = typeof passwordValue === "string" ? passwordValue : "";
  const rememberMe = formData.get("remember") === "on";

  if (!email || !password || email.length > 254 || password.length > 1024) {
    return { error: INVALID_CREDENTIALS };
  }

  let user: { id: number; passwordHash: string | null } | undefined;

  try {
    const result = await db
      .select({
        id: users.id,
        passwordHash: users.passwordHash,
      })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    user = result[0];
    const passwordMatches = await verifyPassword(
      password,
      user?.passwordHash ?? null,
    );

    if (!user || !passwordMatches) {
      return { error: INVALID_CREDENTIALS };
    }

    await createSession(user.id, rememberMe);
  } catch (error) {
    console.error("Login action failed", error);
    return { error: "Sign in is temporarily unavailable. Please try again." };
  }

  redirect("/dashboard");
}

export async function logout() {
  const { deleteSession } = await import("./session");
  await deleteSession();
  redirect("/login");
}
