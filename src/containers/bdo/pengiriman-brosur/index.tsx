"use client";

import AppLayout from "@/components/app-layout";
import { DataTable, type ColumnDef } from "@/components/base/data-table";
import type { PengirimanBrosur } from "./data";
import { usePengirimanBrosurManage } from "./manage";

const JUDUL = "Pengiriman Brosur (POS)";

const columns: ColumnDef<PengirimanBrosur>[] = [
  { key: "acc", label: "ACC", className: "font-medium" },
  { key: "nama", label: "Nama" },
  { key: "jabatan", label: "Jabatan" },
  { key: "perusahaan", label: "Perusahaan/Instansi", className: "font-semibold" },
  { key: "followUp", label: "Follow Up", className: "whitespace-normal" },
];

export default function PengirimanBrosurContainer() {
  const m = usePengirimanBrosurManage();

  return (
    <AppLayout breadcrumbs={[{ label: "BDO" }, { label: JUDUL }]}>
      <div className="mb-4">
        <h1 className="text-lg font-semibold">{JUDUL}</h1>
        <p className="text-sm text-zinc-500">Halaman ini menampilkan data contoh.</p>
      </div>
      <DataTable
        columns={columns}
        data={m.data}
        totalData={m.total}
        currentPage={m.page}
        totalPages={m.totalPages}
        pageSize={m.pageSize}
        onPageChange={m.setPage}
        searchValue={m.search}
        onSearchChange={m.changeSearch}
        searchPlaceholder="Cari nama, perusahaan, atau jabatan..."
      />
    </AppLayout>
  );
}
