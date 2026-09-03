import Image from "next/image";
import { redirect } from "next/navigation";
import ndmuLogo from "../../../assets/NDMU-Logo1.avif";
import { logout } from "@/lib/auth/actions";
import { getCurrentUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

const roleLabels = {
  admin: "Administrator",
  boss: "Farm manager",
  worker: "Farm worker",
} as const;

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-[#f4f7f3] text-[#18251e]">
      <header className="border-b border-[#dce4dd] bg-white">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between gap-5 px-6 sm:px-10 lg:px-12">
          <div className="flex items-center gap-3">
            <Image alt="NDMU" className="h-10 w-10 object-contain" height={40} src={ndmuLogo} width={40} />
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#235b40]">NDMU</p>
              <p className="text-sm text-[#718078]">School Farm</p>
            </div>
          </div>
          <form action={logout}>
            <button className="rounded-md border border-[#c6d0ca] px-4 py-2 text-sm font-semibold text-[#31523e] transition hover:border-[#235b40] hover:bg-[#f1f6f2]" type="submit">
              Sign out
            </button>
          </form>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-10 lg:px-12">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#73927c]">Overview</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[#1d2f24]">Welcome, {user.name}</h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-[#68776d]">
          Your secure farm workspace is ready. This is the starting point for animal records, operations, and reporting.
        </p>

        <section className="mt-10 grid gap-5 md:grid-cols-3">
          <div className="rounded-md border border-[#dce4dd] bg-white p-6">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#829188]">Signed in as</p>
            <p className="mt-3 break-words text-lg font-semibold text-[#22382a]">{user.email}</p>
          </div>
          <div className="rounded-md border border-[#dce4dd] bg-white p-6">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#829188]">Access level</p>
            <p className="mt-3 text-lg font-semibold text-[#22382a]">{roleLabels[user.role]}</p>
          </div>
          <div className="rounded-md border border-[#dce4dd] bg-white p-6">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#829188]">Workspace</p>
            <p className="mt-3 text-lg font-semibold text-[#22382a]">NDMU School Farm</p>
          </div>
        </section>
      </div>
    </main>
  );
}
