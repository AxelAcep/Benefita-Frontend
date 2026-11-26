"use client";

import AppLayout from "@/components/app-layout";
import PerusahaanLink from "@/components/base/perusahaan-link";
import { DataTable, type ColumnDef } from "@/components/base/data-table";
import type { PengirimanBrosur } from "./data";
import { usePengirimanBrosurManage } from "./manage";

const JUDUL = "Pengiriman Brosur (POS)";

const columns: ColumnDef<PengirimanBrosur>[] = [
  { key: "tanggalKirim", label: "Tanggal kirim", render: (_value, row) => row.tanggalKirim ? new Date(row.tanggalKirim).toLocaleDateString("id-ID", { timeZone: "Asia/Jakarta" }) : "–" },
  { key: "acc", label: "ACC", className: "font-medium" },
  { key: "nama", label: "Nama" },
  { key: "jabatan", label: "Jabatan" },
  { key: "perusahaan", label: "Perusahaan/Instansi", className: "font-semibold", render: (_value, row) => <PerusahaanLink {...row} label={row.perusahaan} /> },
  { key: "followUp", label: "Follow Up", className: "whitespace-normal" },
];

export default function PengirimanBrosurContainer() {
  const m = usePengirimanBrosurManage();

  return (
    <AppLayout breadcrumbs={[{ label: "BDO" }, { label: JUDUL }]}>
      <div className="mb-4">
        <h1 className="text-lg font-semibold">{JUDUL}</h1>
        <p className="text-sm text-zinc-500">Daftar penerima brosur dan catatan follow-up pengiriman POS.</p>
      </div>
      {m.error && <p role="alert" className="mb-3 text-sm text-red-600">{m.error}</p>}
      <DataTable
        columns={columns}
        data={m.error ? [] : m.data}
        isLoading={m.loading}
        totalData={m.total}
        currentPage={m.page}
        totalPages={m.totalPages}
        pageSize={m.pageSize}
        onPageChange={m.loading ? undefined : m.setPage}
        searchValue={m.search}
        onSearchChange={m.changeSearch}
        searchPlaceholder="Cari nama, perusahaan, atau jabatan..."
      />
    </AppLayout>
  );
}
