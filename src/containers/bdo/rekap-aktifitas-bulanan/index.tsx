"use client";

import AppLayout from "@/components/app-layout";
import { DataTable, type ColumnDef } from "@/components/base/data-table";
import { TextInput } from "@/components/base/form-field";
import type { RekapDailyAE } from "./data";
import { useRekapBulananManage } from "./manage";

export default function RekapBulananContainer() {
  const m = useRekapBulananManage();

  const columns: ColumnDef<RekapDailyAE>[] = [
    {
      key: "no",
      label: "No",
      render: (_value, _row, i) => (m.page - 1) * m.pageSize + i + 1,
    },
    { key: "nama", label: "Nama AE" },
    ...m.hari.map((hari): ColumnDef<RekapDailyAE> => ({
      key: `hari-${hari}`,
      label: String(hari),
      className: "text-center px-1",
      render: (_value, row) => {
        const nilai = row.hari[hari];
        return nilai === undefined ? null : (
          <span className="inline-block min-w-6 rounded bg-emerald-100 px-1 text-emerald-800">
            {nilai}
          </span>
        );
      },
    })),
    {
      key: "total",
      label: "Total",
      className: "text-center font-semibold bg-yellow-100 text-yellow-900",
      render: (_value, row) => m.hari.reduce((total, hari) => total + (row.hari[hari] ?? 0), 0),
    },
  ];

  return (
    <AppLayout breadcrumbs={[{ label: "BDO" }, { label: "Rekap Daily AE" }]}>
      <div className="mb-4">
        <h1 className="text-lg font-semibold">Rekap Daily AE</h1>
        <p className="text-sm text-zinc-500">Jumlah aktivitas kontak per AE untuk setiap tanggal dalam bulan, menurut waktu WIB.</p>
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
        searchPlaceholder="Cari nama AE..."
        emptyMessage={m.error || `Tidak ada aktivitas untuk ${m.labelBulan}.`}
        filterSlot={
          <>
            <label htmlFor="rekap-bulan" className="text-xs font-medium text-zinc-600">
              Bulan
            </label>
            <TextInput
              id="rekap-bulan"
              type="month"
              value={m.draftBulan}
              onChange={(event) => m.setDraftBulan(event.target.value)}
            />
            <button
              type="button"
              onClick={m.terapkanBulan}
              disabled={!m.draftBulan}
              className="rounded-lg bg-emerald-500 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-600 disabled:opacity-50"
            >
              Terapkan
            </button>
            <p role="status" className="text-xs text-zinc-600">{m.labelBulan}</p>
          </>
        }
      />
    </AppLayout>
  );
}
