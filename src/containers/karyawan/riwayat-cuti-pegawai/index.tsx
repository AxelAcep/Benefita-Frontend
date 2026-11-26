"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import AppLayout from "@/components/app-layout";
import { RiwayatPegawai } from "@/containers/karyawan/riwayat-izin/components/riwayat-pegawai";

export default function RiwayatCutiPegawaiContainer() {
  const { id } = useParams<{ id: string }>();

  return (
    <AppLayout breadcrumbs={[
      { label: "Karyawan & Aktivitas" },
      { label: "Riwayat Cuti/Sakit", href: "/karyawan/riwayat-cuti" },
      { label: "Riwayat Pegawai" },
    ]}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-lg font-semibold">Riwayat Cuti/Sakit Pegawai</h1>
        <Link href="/karyawan/riwayat-cuti" className="text-sm font-medium text-emerald-700 hover:underline">
          Kembali ke Riwayat
        </Link>
      </div>
      {id && <RiwayatPegawai key={id} pegawaiId={id} limit={9} tampilkanRingkasan />}
    </AppLayout>
  );
}
