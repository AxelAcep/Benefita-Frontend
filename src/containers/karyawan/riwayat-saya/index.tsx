"use client";

import Link from "next/link";
import AppLayout from "@/components/app-layout";
import { useAuth } from "@/context/AuthContext";
import { useUserDetail } from "@/hooks/use-user-detail";
import { RiwayatPegawai } from "@/containers/karyawan/riwayat-izin/components/riwayat-pegawai";

export default function RiwayatSayaContainer() {
  const { user } = useAuth();
  const profil = useUserDetail(user?.id);
  const pegawaiId = profil.data?.pegawaiId;

  return (
    <AppLayout breadcrumbs={[
      { label: "Karyawan & Aktivitas" },
      { label: "Form Cuti/Sakit", href: "/karyawan/form-cuti" },
      { label: "Riwayat Pengajuan" },
    ]}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-lg font-semibold">Riwayat Pengajuan Cuti/Sakit</h1>
        <Link href="/karyawan/form-cuti" className="text-sm font-medium text-emerald-700 hover:underline">
          Kembali ke Form
        </Link>
      </div>
      {profil.loading && <p role="status" className="text-sm text-zinc-500">Memuat identitas pegawai...</p>}
      {profil.error && (
        <div role="alert" className="text-sm text-red-700">
          <p>{profil.error}</p>
          <button type="button" onClick={profil.retry} className="mt-2 font-medium underline">Coba lagi</button>
        </div>
      )}
      {pegawaiId && <RiwayatPegawai key={pegawaiId} pegawaiId={pegawaiId} limit={10} />}
    </AppLayout>
  );
}
