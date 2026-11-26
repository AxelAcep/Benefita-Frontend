"use client";

import AppLayout from "@/components/app-layout";
import { DataTable, type ColumnDef } from "@/components/base/data-table";
import type { DaftarASAP } from "./data";
import { useAsapManage } from "./manage";

export default function AsapContainer() {
  const m = useAsapManage();
  const columns: ColumnDef<DaftarASAP>[] = [
    {
      key: "no",
      label: "No",
      render: (_value, _row, index) => (m.page - 1) * m.pageSize + index + 1,
    },
    { key: "perusahaan", label: "Perusahaan/Instansi", className: "font-semibold" },
    { key: "asap", label: "ASAP" },
    { key: "akun", label: "Akun" },
    { key: "kategori", label: "Kategori" },
  ];

  return (
    <AppLayout breadcrumbs={[{ label: "BDO" }, { label: "Daftar ASAP" }]}>
      <div className="mb-4">
        <h1 className="text-lg font-semibold">Daftar ASAP</h1>
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
        searchPlaceholder="Cari perusahaan, ASAP, atau akun..."
      />
    </AppLayout>
  );
}
