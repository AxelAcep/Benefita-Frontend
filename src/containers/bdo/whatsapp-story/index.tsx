"use client";

import AppLayout from "@/components/app-layout";
import { DataTable, type ColumnDef } from "@/components/base/data-table";
import type { WhatsappStoryItem } from "./data";
import { useWhatsappStoryManage } from "./manage";

const JUDUL = "WhatsApp Story";

export default function WhatsappStoryContainer() {
  const m = useWhatsappStoryManage();
  const columns: ColumnDef<WhatsappStoryItem>[] = [
    {
      key: "no",
      label: "No",
      render: (_value, _row, i) => (m.page - 1) * m.pageSize + i + 1,
    },
    { key: "tanggalPelatihan", label: "Tanggal Pelatihan" },
    { key: "tanggalUji", label: "Tanggal Uji" },
    {
      key: "judulTraining",
      label: "Judul Training",
      className: "min-w-64 whitespace-normal font-medium",
    },
    { key: "lokasiOffline", label: "Lokasi Offline" },
    { key: "online", label: "Online" },
  ];

  return (
    <AppLayout breadcrumbs={[{ label: "BDO" }, { label: "Aset Marketing" }, { label: JUDUL }]}>
      <div className="mb-4">
        <h1 className="text-lg font-semibold">{JUDUL}</h1>
        <p className="text-sm text-zinc-500">Halaman ini menampilkan jadwal contoh.</p>
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
        searchPlaceholder="Cari judul atau tanggal pelatihan..."
      />
    </AppLayout>
  );
}
