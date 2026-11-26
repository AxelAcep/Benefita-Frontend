"use client";

import Link from "next/link";
import AppLayout from "@/components/app-layout";
import { DataTable, type ColumnDef } from "@/components/base/data-table";
import { DetailModal } from "@/components/karyawan/DetailModal";
import type { PengajuanIzinListItem } from "@/lib/types/cuti";
import { useListCutiManage } from "./manage";

const JUDUL = "Konfirmasi Cuti/Sakit";
const format = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" });
const tanggal = (value: string) => format.format(new Date(value));

export default function ListCutiContainer() {
  const m = useListCutiManage();
  const columns: ColumnDef<PengajuanIzinListItem>[] = [
    { key: "no", label: "No", render: (_v, _row, i) => (m.page - 1) * m.limit + i + 1 },
    { key: "nama", label: "Nama", render: (_v, row) => row.pegawai.nama },
    { key: "createdAt", label: "Tanggal Pengajuan", render: (_v, row) => tanggal(row.createdAt) },
    { key: "jenisIzin", label: "Jenis Izin" },
    { key: "periode", label: "Periode", render: (_v, row) => `${tanggal(row.tanggalMulai)} – ${tanggal(row.tanggalSelesai)}` },
    { key: "alasan", label: "Alasan", className: "min-w-40 whitespace-normal" },
    {
      key: "detail",
      label: "Aksi",
      render: (_v, row) => (
        <button type="button" onClick={() => m.open(row)} className="font-medium text-emerald-700 hover:underline">
          Lihat Detail
        </button>
      ),
    },
  ];

  return (
    <AppLayout breadcrumbs={[{ label: "Karyawan & Aktivitas" }, { label: JUDUL }]}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-lg font-semibold">{JUDUL}</h1>
        <Link href="/karyawan/riwayat-cuti" className="text-sm font-medium text-emerald-700 hover:underline">
          Riwayat Cuti/Sakit
        </Link>
      </div>
      {m.error && (
        <div role="alert" className="mb-4 flex gap-3 text-sm text-red-700">
          <p>{m.error}</p>
          <button type="button" onClick={m.refetch} className="font-medium underline">Coba lagi</button>
        </div>
      )}
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
        emptyMessage={m.error ? "Data gagal dimuat." : "Tidak ada pengajuan menunggu pada halaman ini."}
      />
      {m.selected && (
        <DetailModal
          key={m.selected.id}
          item={m.selected}
          onClose={m.close}
          isProcessing={m.isProcessing}
          onTerima={(id) => m.process(id, { status: "DISETUJUI" })}
          onTolak={(id, alasanTolak) => m.process(id, { status: "DITOLAK", alasanTolak })}
        />
      )}
    </AppLayout>
  );
}
