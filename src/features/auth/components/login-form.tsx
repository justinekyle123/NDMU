"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/lib/auth/actions";

const initialState: LoginState = {};

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="mt-8 space-y-5" noValidate>
      <div aria-live="polite" className="min-h-5">
        {state?.error ? (
          <p className="rounded-md border border-[#e7b8ac] bg-[#fff5f2] px-3 py-2 text-sm font-medium text-[#9d392a]">
            {state.error}
          </p>
        ) : null}
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-[#22322b]" htmlFor="email">
          Email address
        </label>
        <input
          autoComplete="email"
          className="h-12 w-full rounded-md border border-[#c6d0ca] bg-white px-4 text-base text-[#18251e] outline-none transition placeholder:text-[#839087] focus:border-[#2b684a] focus:ring-4 focus:ring-[#2b684a]/15"
          id="email"
          name="email"
          placeholder="you@example.com"
          required
          type="email"
        />
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between gap-4">
          <label className="block text-sm font-semibold text-[#22322b]" htmlFor="password">
            Password
          </label>
          <span className="text-xs font-medium text-[#78877d]">Required</span>
        </div>
        <input
          autoComplete="current-password"
          className="h-12 w-full rounded-md border border-[#c6d0ca] bg-white px-4 text-base text-[#18251e] outline-none transition placeholder:text-[#839087] focus:border-[#2b684a] focus:ring-4 focus:ring-[#2b684a]/15"
          id="password"
          name="password"
          placeholder="Enter your password"
          required
          type="password"
        />
      </div>

      <div className="flex items-center gap-3 pt-1">
        <input
          className="h-4 w-4 rounded border-[#b4c2b8] accent-[#2b684a]"
          id="remember"
          name="remember"
          type="checkbox"
        />
        <label className="text-sm text-[#5e6d63]" htmlFor="remember">
          Keep me signed in on this device
        </label>
      </div>

      <button
        className="flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[#235b40] px-5 text-sm font-bold text-white shadow-[0_8px_18px_rgba(35,91,64,0.16)] transition hover:bg-[#194a32] focus:outline-none focus:ring-4 focus:ring-[#2b684a]/25 disabled:cursor-wait disabled:opacity-65"
        disabled={isPending}
        type="submit"
      >
        {isPending ? (
          <>
            <span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            Signing in...
          </>
        ) : (
          "Sign in"
        )}
      </button>

      <p className="flex items-center justify-center gap-2 pt-1 text-xs text-[#718078]">
        <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#6a9c78]" />
        Secure access for NDMU School Farm
      </p>
    </form>
  );
}
