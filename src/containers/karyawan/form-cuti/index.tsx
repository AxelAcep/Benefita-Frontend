"use client";

import Link from "next/link";
import AppLayout from "@/components/app-layout";
import { FormCuti } from "./form";
import { useFormCutiManage } from "./manage";

export default function FormCutiContainer() {
  const { profil, kirim } = useFormCutiManage();
  const pegawai = profil.data?.pegawai;

  return (
    <AppLayout breadcrumbs={[{ label: "Karyawan & Aktivitas" }, { label: "Form Cuti/Sakit" }]}>
      <div className="max-w-3xl rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-lg font-semibold">Form Pengajuan Izin</h1>
          <Link href="/karyawan/form-cuti/riwayat" className="text-sm font-medium text-emerald-700 hover:underline">
            Riwayat Pengajuan
          </Link>
        </div>
        {profil.loading && <p role="status" className="text-sm text-zinc-500">Memuat identitas pegawai...</p>}
        {profil.error && (
          <div role="alert" className="text-sm text-red-700">
            <p>{profil.error}</p>
            <button type="button" onClick={profil.retry} className="mt-2 font-medium underline">Coba lagi</button>
          </div>
        )}
        {pegawai && (
          <>
            <p className="mb-4 text-sm text-zinc-600">
              {[pegawai.nama, pegawai.jabatan, pegawai.departemen].filter(Boolean).join(" · ")}
            </p>
            <FormCuti onSubmit={kirim} />
          </>
        )}
      </div>
    </AppLayout>
  );
}
