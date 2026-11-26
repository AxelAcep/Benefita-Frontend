"use client";

import AppLayout from "@/components/app-layout";
import { DataTable, type ColumnDef } from "@/components/base/data-table";
import { useLogPerubahan } from "@/hooks/use-perubahan-instansi";
import type { LogPerubahanItem } from "@/lib/types/log-perubahan";

const JUDUL = "Log Perubahan Data Perusahaan";
const formatWaktu = new Intl.DateTimeFormat("id-ID", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export default function UpdateDataContainer() {
  const m = useLogPerubahan();
  const columns: ColumnDef<LogPerubahanItem>[] = [
    {
      key: "no",
      label: "No",
      render: (_value, _row, i) => (m.page - 1) * m.limit + i + 1,
    },
    {
      key: "perusahaan",
      label: "Instansi",
      className: "font-medium",
      render: (_value, row) => row.perusahaan?.company ?? "–",
    },
    { key: "field", label: "Kolom Diubah" },
    { key: "diubahOleh", label: "Diubah Oleh" },
    {
      key: "tanggal",
      label: "Tanggal Perubahan",
      render: (_value, row) => formatWaktu.format(new Date(row.tanggal)),
    },
  ];

  return (
    <AppLayout breadcrumbs={[{ label: "Karyawan & Aktivitas" }, { label: "Update Data" }]}>
      <h1 className="mb-4 text-lg font-semibold">{JUDUL}</h1>
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
        searchPlaceholder="Cari perusahaan atau pegawai..."
        isLoading={m.loading}
        emptyMessage={m.error ? "Data gagal dimuat." : undefined}
      />
    </AppLayout>
  );
}
