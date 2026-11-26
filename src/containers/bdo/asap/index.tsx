"use client";

import AppLayout from "@/components/app-layout";
import { DataTable, type ColumnDef } from "@/components/base/data-table";
import type { Asap } from "@/lib/types/bdo";
import { useAsapManage } from "./manage";

const formatTanggal = new Intl.DateTimeFormat("id-ID", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "Asia/Jakarta",
});

export default function AsapContainer() {
  const m = useAsapManage();

  const columns: ColumnDef<Asap>[] = [
    {
      key: "no",
      label: "No",
      render: (_v, _row, index) => (m.page - 1) * 10 + index + 1,
    },
    {
      key: "tanggal",
      label: "Tanggal",
      render: (_v, row) => formatTanggal.format(new Date(row.tanggal)),
    },
    {
      key: "perusahaan",
      label: "Perusahaan/Instansi",
      className: "font-semibold whitespace-normal",
      // Sebagian baris lama menunjuk perusahaan yang sudah tidak ada.
      render: (_v, row) => row.perusahaan?.company ?? row.perusahaanId ?? "-",
    },
    { key: "saran", label: "ASAP", className: "whitespace-normal" },
    {
      key: "akun",
      label: "Akun",
      // kirimKeNama dipakai bila pegawainya tidak ketemu saat migrasi.
      render: (_v, row) => row.kirimKe?.nama ?? row.kirimKeNama ?? "-",
    },
    {
      key: "kategori",
      label: "Kategori",
      render: (_v, row) => row.kategori ?? "-",
    },
  ];

  return (
    <AppLayout breadcrumbs={[{ label: "BDO" }, { label: "Daftar ASAP" }]}>
      <div className="mb-4">
        <h1 className="text-lg font-semibold">Daftar ASAP</h1>
        <p className="text-sm text-zinc-500">
          Saran tindak lanjut per perusahaan.
        </p>
      </div>

      {m.error ? (
        <p className="mb-3 text-sm text-red-600">{m.error}</p>
      ) : null}

      <DataTable
        columns={columns}
        data={m.data}
        isLoading={m.loading}
        totalData={m.total}
        currentPage={m.page}
        totalPages={m.totalPages}
        pageSize={10}
        onPageChange={m.setPage}
        searchValue={m.search}
        onSearchChange={m.setSearch}
        searchPlaceholder="Cari perusahaan, ASAP, atau akun..."
      />
    </AppLayout>
  );
}
