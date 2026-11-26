"use client";

import { useState } from "react";
import Link from "next/link";
import AppLayout from "@/components/app-layout";
import { DataTable, type ColumnDef } from "@/components/base/data-table";
import { DetailModal } from "@/components/karyawan/DetailModal";
import type { KaryawanCutiItem, RiwayatIzinItem } from "@/lib/types/cuti";
import { useKaryawanCutiManage, useRiwayatIzinManage } from "./manage";

const JUDUL = "Riwayat Cuti/Sakit";
const format = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" });
const tanggal = (value: string) => format.format(new Date(value));
const status = { PENDING: "Menunggu", DISETUJUI: "Disetujui", DITOLAK: "Ditolak" };

function ListError({ error, retry }: { error: string; retry: () => void }) {
  return (
    <div role="alert" className="mb-4 flex gap-3 text-sm text-red-700">
      <p>{error}</p>
      <button type="button" onClick={retry} className="font-medium underline">Coba lagi</button>
    </div>
  );
}

function RiwayatTab() {
  const m = useRiwayatIzinManage();
  const columns: ColumnDef<RiwayatIzinItem>[] = [
    { key: "no", label: "No", render: (_v, _row, i) => (m.page - 1) * m.limit + i + 1 },
    { key: "createdAt", label: "Tanggal Pengajuan", render: (_v, row) => tanggal(row.createdAt) },
    { key: "nama", label: "Nama", render: (_v, row) => row.pegawai?.nama ?? "–" },
    { key: "jenisIzin", label: "Jenis Izin" },
    { key: "periode", label: "Periode", render: (_v, row) => `${tanggal(row.tanggalMulai)} – ${tanggal(row.tanggalSelesai)}` },
    { key: "alasan", label: "Alasan", className: "min-w-40 whitespace-normal" },
    { key: "status", label: "Status", render: (_v, row) => status[row.status] },
    {
      key: "detail",
      label: "Detail",
      render: (_v, row) => (
        <button type="button" onClick={() => m.setSelected(row)} className="font-medium text-emerald-700 hover:underline">
          Lihat Detail
        </button>
      ),
    },
  ];

  return (
    <>
      {m.error && <ListError error={m.error} retry={m.refetch} />}
      <DataTable
        columns={columns}
        data={m.error ? [] : m.data}
        totalData={m.error ? 0 : m.total}
        currentPage={m.page}
        totalPages={Math.max(1, m.totalPages)}
        pageSize={m.limit}
        onPageChange={m.setPage}
        searchValue={m.search}
        onSearchChange={m.setSearch}
        searchPlaceholder="Cari nama pegawai..."
        isLoading={m.loading}
        emptyMessage={m.error ? "Data gagal dimuat." : undefined}
      />
      {m.selected && <DetailModal key={m.selected.id} item={m.selected} onClose={() => m.setSelected(null)} isView />}
    </>
  );
}

function KaryawanTab() {
  const m = useKaryawanCutiManage();
  const columns: ColumnDef<KaryawanCutiItem>[] = [
    { key: "no", label: "No", render: (_v, _row, i) => (m.page - 1) * m.limit + i + 1 },
    { key: "nama", label: "Nama" },
    { key: "jabatan", label: "Divisi / Jabatan", render: (_v, row) => [row.departemen, row.jabatan].filter(Boolean).join(" · ") || "–" },
    { key: "totalCutiDanIzin", label: "Pengajuan Cuti/Izin Disetujui" },
    { key: "totalSakit", label: "Pengajuan Sakit Disetujui" },
    {
      key: "detail",
      label: "Detail",
      render: (_v, row) => (
        <Link href={`/karyawan/riwayat-cuti/karyawan/${encodeURIComponent(row.id)}`} className="font-medium text-emerald-700 hover:underline">
          Lihat Detail
        </Link>
      ),
    },
  ];

  return (
    <>
      {m.error && <ListError error={m.error} retry={m.refetch} />}
      <DataTable
        columns={columns}
        data={m.error ? [] : m.data}
        totalData={m.error ? 0 : m.total}
        currentPage={m.page}
        totalPages={Math.max(1, m.totalPages)}
        pageSize={m.limit}
        onPageChange={m.setPage}
        searchValue={m.search}
        onSearchChange={m.setSearch}
        searchPlaceholder="Cari nama pegawai..."
        isLoading={m.loading}
        emptyMessage={m.error ? "Data gagal dimuat." : undefined}
      />
    </>
  );
}

export default function RiwayatIzinContainer() {
  const [tab, setTab] = useState<"Riwayat" | "Karyawan">("Riwayat");

  return (
    <AppLayout breadcrumbs={[{ label: "Karyawan & Aktivitas" }, { label: JUDUL }]}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-lg font-semibold">{JUDUL}</h1>
        <Link href="/karyawan/list-cuti" className="text-sm font-medium text-emerald-700 hover:underline">
          Kembali ke Konfirmasi
        </Link>
      </div>
      <div className="mb-4 flex gap-2 border-b border-zinc-200">
        {(["Riwayat", "Karyawan"] as const).map((label) => (
          <button
            type="button"
            key={label}
            aria-pressed={tab === label}
            onClick={() => setTab(label)}
            className="border-b-2 border-transparent px-4 py-2 text-sm font-medium text-zinc-600 aria-pressed:border-emerald-600 aria-pressed:text-emerald-700"
          >
            {label}
          </button>
        ))}
      </div>
      {tab === "Riwayat" ? <RiwayatTab /> : <KaryawanTab />}
    </AppLayout>
  );
}
