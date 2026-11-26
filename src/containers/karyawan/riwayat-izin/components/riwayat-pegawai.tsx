"use client";

import { useState } from "react";
import { DataTable, type ColumnDef } from "@/components/base/data-table";
import { DetailModal } from "@/components/karyawan/DetailModal";
import { useRiwayatPegawai } from "@/hooks/use-riwayat-pegawai";
import type { RiwayatIzinItem } from "@/lib/types/cuti";

const JENIS = { CUTI: "Cuti", SAKIT: "Sakit", IZIN: "Izin" };
const STATUS = {
  PENDING: { label: "Menunggu", warna: "bg-amber-100 text-amber-800" },
  DISETUJUI: { label: "Disetujui", warna: "bg-emerald-100 text-emerald-800" },
  DITOLAK: { label: "Ditolak", warna: "bg-red-100 text-red-800" },
};

const format = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" });
const tanggal = (value: string | null) => value ? format.format(new Date(value)) : "–";

interface RiwayatPegawaiProps {
  pegawaiId: string;
  limit: number;
  tampilkanRingkasan?: boolean;
}

export function RiwayatPegawai({ pegawaiId, limit, tampilkanRingkasan = false }: RiwayatPegawaiProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<RiwayatIzinItem | null>(null);
  const m = useRiwayatPegawai(pegawaiId, page, limit);
  const query = search.trim().toLowerCase();
  const rows = m.data?.data ?? [];
  const filtered = rows.filter((row) =>
    row.alasan.toLowerCase().includes(query) || JENIS[row.jenisIzin].toLowerCase().includes(query),
  );
  const summary = m.data?.summary;
  const pegawai = rows[0]?.pegawai;

  const columns: ColumnDef<RiwayatIzinItem>[] = [
    { key: "createdAt", label: "Tanggal Pengajuan", render: (_value, row) => tanggal(row.createdAt) },
    { key: "tanggalKonfirmasi", label: "Tanggal Diproses", render: (_value, row) => tanggal(row.tanggalKonfirmasi) },
    { key: "jenisIzin", label: "Jenis Izin", render: (_value, row) => JENIS[row.jenisIzin] },
    {
      key: "periode",
      label: "Periode",
      render: (_value, row) => `${tanggal(row.tanggalMulai)} – ${tanggal(row.tanggalSelesai)}`,
    },
    { key: "alasan", label: "Alasan", className: "min-w-40 whitespace-normal" },
    {
      key: "status",
      label: "Status",
      render: (_value, row) => (
        <span className={`rounded-full px-2 py-1 text-xs font-medium ${STATUS[row.status].warna}`}>
          {STATUS[row.status].label}
        </span>
      ),
    },
    {
      key: "detail",
      label: "Detail",
      render: (_value, row) => (
        <button type="button" onClick={() => setSelected(row)} className="font-medium text-emerald-700 hover:underline">
          Lihat Detail
        </button>
      ),
    },
  ];

  return (
    <>
      {m.error && (
        <div role="alert" className="mb-4 flex gap-3 text-sm text-red-700">
          <p>{m.error}</p>
          <button type="button" onClick={m.retry} className="font-medium underline">Coba lagi</button>
        </div>
      )}
      {tampilkanRingkasan && summary && (
        <section className="mb-4 rounded-xl border border-zinc-200 bg-white p-5">
          {pegawai && (
            <div className="mb-3">
              <h2 className="font-semibold">{pegawai.nama}</h2>
              <p className="text-sm text-zinc-600">
                {[pegawai.jabatan, pegawai.departemen].filter(Boolean).join(" · ")}
              </p>
            </div>
          )}
          <dl className="grid gap-3 text-sm sm:grid-cols-3">
            <div><dt className="text-zinc-500">Total cuti dan izin</dt><dd className="font-semibold">{summary.totalCutiDanIzin} hari</dd></div>
            <div><dt className="text-zinc-500">Total sakit</dt><dd className="font-semibold">{summary.totalSakit} hari</dd></div>
            <div><dt className="text-zinc-500">Sisa kuota</dt><dd className="font-semibold">{12 - summary.totalCutiDanIzin - summary.totalSakit} hari</dd></div>
          </dl>
        </section>
      )}
      <DataTable
        columns={columns}
        data={filtered}
        totalData={m.data?.meta.total ?? 0}
        currentPage={page}
        totalPages={Math.max(1, m.data?.meta.totalPage ?? page)}
        pageSize={limit}
        onPageChange={(next) => { setPage(next); setSearch(""); }}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Cari di halaman ini..."
        isLoading={m.loading}
        emptyMessage={m.error ? "Data gagal dimuat." : undefined}
      />
      {selected && <DetailModal key={selected.id} item={selected} onClose={() => setSelected(null)} isView />}
    </>
  );
}
