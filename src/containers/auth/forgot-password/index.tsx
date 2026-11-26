import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, LockKeyhole } from "lucide-react";
import { Icons } from "@/assets";

export default function ForgotPasswordContainer() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-100">
      <header className="flex items-center gap-2 p-4">
        <Image src={Icons.Benefita} alt="Logo Benefita" width={32} height={32} />
        <span className="text-sm font-bold text-zinc-800">CRM Benefita</span>
      </header>
      <main className="flex flex-1 items-center justify-center px-4 pb-12">
        <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <LockKeyhole className="size-5" aria-hidden="true" />
          </div>
          <h1 className="text-xl font-bold text-zinc-800">Lupa Kata Sandi</h1>
          <p className="mt-2 text-sm text-zinc-600">
            Hubungi administrator Benefita untuk memulihkan akses ke akun Anda.
          </p>
          <Link href="/" className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700 hover:underline">
            <ArrowLeft className="size-4" aria-hidden="true" />
            Kembali ke Login
          </Link>
        </div>
      </main>
    </div>
  );
}
