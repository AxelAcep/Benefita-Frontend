"use client";

import AppLayout from "@/components/app-layout";
import { useAuth } from "@/context/AuthContext";
import { useUserDetail } from "@/hooks/use-user-detail";

export default function ProfilContainer() {
  const { user } = useAuth();
  const { data: profil, error, loading, retry } = useUserDetail(user?.id);

  return (
    <AppLayout breadcrumbs={[{ label: "Karyawan & Aktivitas" }, { label: "Profil" }]}>
      <section className="max-w-2xl rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h1 className="text-lg font-semibold text-zinc-800">Profil</h1>

        {loading && <p className="mt-4 text-sm text-zinc-500" role="status">Memuat profil...</p>}
        {error && (
          <div className="mt-4 text-sm text-red-700" role="alert">
            <p>{error}</p>
            <button type="button" onClick={retry} className="mt-2 font-medium underline">Coba lagi</button>
          </div>
        )}
        {profil && (
          <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
            <div><dt className="text-zinc-500">Nama</dt><dd className="font-medium">{profil.pegawai.nama}</dd></div>
            <div><dt className="text-zinc-500">Role</dt><dd className="font-medium">{profil.role}</dd></div>
            <div><dt className="text-zinc-500">Email</dt><dd className="break-all font-medium">{profil.email || "–"}</dd></div>
            <div><dt className="text-zinc-500">Nomor WhatsApp</dt><dd className="font-medium">{profil.phone || "–"}</dd></div>
          </dl>
        )}

        <p className="mt-6 text-sm text-zinc-500">
          Hubungi administrator untuk mengubah informasi akun atau kata sandi.
        </p>
      </section>
    </AppLayout>
  );
}
