"use client";

import AppLayout from "@/components/app-layout";
import { DataTable, type ColumnDef } from "@/components/base/data-table";
import { TextInput } from "@/components/base/form-field";
import { JAM, type RekapAktivitas } from "./data";
import { useRekapHarianManage } from "./manage";

const JUDUL = "Rekap Aktivitas Harian";

export default function RekapHarianContainer() {
  const m = useRekapHarianManage();

  const columns: ColumnDef<RekapAktivitas>[] = [
    {
      key: "no",
      label: "No",
      render: (_value, _row, i) => (m.page - 1) * m.pageSize + i + 1,
    },
    { key: "nama", label: "Nama AE" },
    ...JAM.map((jam): ColumnDef<RekapAktivitas> => ({
      key: jam,
      label: `${jam}:00`,
      className: "text-center",
      render: (_value, row) => row.jam[jam] ?? 0,
    })),
    { key: "diLuarJam", label: "Di luar 08–17", className: "text-center" },
    {
      key: "total",
      label: "Total",
      className: "text-center font-semibold",
      render: (_value, row) => JAM.reduce((total, jam) => total + (row.jam[jam] ?? 0), row.diLuarJam),
    },
  ];

  return (
    <AppLayout breadcrumbs={[{ label: "BDO" }, { label: JUDUL }]}>
      <div className="mb-4">
        <h1 className="text-lg font-semibold">{JUDUL}</h1>
        <p className="text-sm text-zinc-500">Jumlah aktivitas kontak per AE menurut jam WIB, termasuk aktivitas di luar pukul 08–17.</p>
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
        emptyMessage={m.error || `Tidak ada aktivitas untuk ${m.labelTanggal}.`}
        filterSlot={
          <>
            <label htmlFor="rekap-tanggal" className="text-xs font-medium text-zinc-600">
              Tanggal
            </label>
            <TextInput
              id="rekap-tanggal"
              type="date"
              value={m.draftTanggal}
              onChange={(event) => m.setDraftTanggal(event.target.value)}
            />
            <button
              type="button"
              onClick={m.terapkanTanggal}
              disabled={!m.draftTanggal}
              className="rounded-lg bg-emerald-500 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-600 disabled:opacity-50"
            >
              Terapkan
            </button>
            <p role="status" className="text-xs text-zinc-600">{m.labelTanggal}</p>
          </>
        }
      />
    </AppLayout>
  );
}
