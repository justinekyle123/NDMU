import Image from "next/image";
import type { Metadata } from "next";
import ndmuLogo from "../../../assets/NDMU-Logo1.avif";
import { LoginForm } from "@/features/auth";

export const metadata: Metadata = {
  title: "Sign in | NDMU School Farm",
  description: "Secure sign in for the NDMU School Farm management system.",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#f4f7f3] text-[#18251e]">
      <div className="mx-auto grid min-h-screen max-w-[1440px] lg:grid-cols-[minmax(0,1.03fr)_minmax(440px,0.97fr)]">
        <section className="relative hidden overflow-hidden bg-[#17482f] lg:flex lg:flex-col lg:justify-between lg:p-14 xl:p-20">
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-[#23633f]/35" />
          <div className="relative z-10 flex items-center gap-4">
            <Image
              alt="Notre Dame of Maryland University"
              className="h-14 w-14 object-contain"
              height={56}
              priority
              src={ndmuLogo}
              width={56}
            />
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#c7e0c8]">NDMU</p>
              <p className="mt-1 text-sm text-white/70">School Farm</p>
            </div>
          </div>

          <div className="relative z-10 max-w-xl pb-12">
            <p className="mb-5 text-sm font-bold uppercase tracking-[0.2em] text-[#c7e0c8]">Farm management system</p>
            <h1 className="max-w-lg text-5xl font-semibold leading-[1.08] tracking-tight text-white xl:text-6xl">
              Good stewardship starts with good records.
            </h1>
            <p className="mt-7 max-w-md text-lg leading-8 text-white/70">
              Keep your animals, people, and daily operations moving forward with one trusted source of farm information.
            </p>
          </div>

          <p className="relative z-10 text-xs text-white/45">Notre Dame of Marbel University</p>
        </section>

        <section className="flex min-h-screen items-center justify-center px-6 py-10 sm:px-10 lg:px-14 xl:px-24">
          <div className="w-full max-w-[430px]">
            <div className="mb-10 flex items-center gap-3 lg:hidden">
              <Image
                alt="Notre Dame of Maryland University"
                className="h-12 w-12 object-contain"
                height={48}
                priority
                src={ndmuLogo}
                width={48}
              />
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#235b40]">NDMU</p>
                <p className="text-sm text-[#718078]">School Farm</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#73927c]">Welcome back</p>
              <h2 className="mt-3 text-4xl font-semibold tracking-tight text-[#1d2f24]">Sign in to your account</h2>
              <p className="mt-4 text-base leading-7 text-[#68776d]">
                Enter your credentials to access your farm workspace.
              </p>
            </div>

            <LoginForm />

            <div className="mt-12 border-t border-[#dce4dd] pt-5 text-center text-xs leading-5 text-[#7d8a81]">
              Access is limited to authorized NDMU School Farm staff.
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
