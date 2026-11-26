"use client";

import AppLayout from "@/components/app-layout";
import PerusahaanLink from "@/components/base/perusahaan-link";
import { DataTable, type ColumnDef } from "@/components/base/data-table";
import { SelectInput } from "@/components/base/form-field";
import type { AkunPerusahaan } from "./data";
import { AKUN, KATEGORI_AKUN, useAkunPerusahaanManage } from "./manage";

const JUDUL = "Akun Perusahaan (BDO)";

const columnsAkun = KATEGORI_AKUN.flatMap((kategori): ColumnDef<AkunPerusahaan>[] => {
  const { kode, kontak, jumlah, label } = AKUN[kategori];
  return [
    { key: kode, label: `ACC ${kategori}`, className: "text-center font-semibold" },
    { key: kontak, label: `Kontak Terakhir ${kategori}`, className: "text-center" },
    { key: jumlah, label: `Hari ${kategori}`, className: "text-center" },
  ];
});

export default function AkunPerusahaanContainer() {
  const m = useAkunPerusahaanManage();

  const columns: ColumnDef<AkunPerusahaan>[] = [
    {
      key: "no",
      label: "No",
      render: (_value, _row, i) => (m.page - 1) * m.pageSize + i + 1,
    },
    { key: "noInduk", label: "No Induk", className: "font-medium", render: (_value, row) => <PerusahaanLink {...row} label={row.noInduk} /> },
    { key: "perusahaan", label: "Perusahaan/Instansi", className: "font-semibold", render: (_value, row) => <PerusahaanLink {...row} label={row.perusahaan} /> },
    { key: "waktu", label: "Waktu" },
    { key: "action", label: "Action", className: "text-center" },
    ...columnsAkun,
    {
      key: "hp",
      label: "HP",
      className: "text-center",
      render: (_value, row) => row.hp ? (
        <span className="rounded-md bg-emerald-50 px-2 py-0.5 font-semibold text-emerald-700">
          {row.hp}
        </span>
      ) : "–",
    },
  ];

  return (
    <AppLayout breadcrumbs={[{ label: "BDO" }, { label: JUDUL }]}>
      <div className="mb-4">
        <h1 className="text-lg font-semibold">{JUDUL}</h1>
        <p className="text-sm text-zinc-500">Hari dihitung sejak kontak terakhir per bidang; kosong berarti belum ada aktivitas kontak tercatat.</p>
      </div>
      {m.optionsError && <p role="alert" className="mb-3 text-sm text-red-600">{m.optionsError}</p>}
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
        searchPlaceholder="Cari perusahaan atau no induk..."
        filterSlot={
          <div className="flex flex-wrap items-end gap-2">
            <SelectInput
              label="Kategori akun"
              aria-label="Kategori akun"
              opsi={KATEGORI_AKUN.map((value) => ({ value, label: value }))}
              value={m.draft.kategori}
              onChange={(event) => {
                const kategori = KATEGORI_AKUN.find((value) => value === event.target.value);
                if (kategori) m.pilihKategori(kategori);
              }}
            />
            <SelectInput
              label="Kode ACC"
              aria-label="Kode ACC"
              opsi={[{ value: "", label: "Semua kode" }, ...m.kodeTersedia.map((value) => ({ value, label: value }))]}
              value={m.draft.kode}
              onChange={(event) => m.pilihKode(event.target.value)}
            />
            <button
              type="button"
              onClick={m.terapkan}
              className="rounded-lg bg-emerald-500 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-600"
            >
              Terapkan
            </button>
            {m.filter.kode && (
              <span role="status" className="self-center text-xs text-zinc-600">
                ACC {m.filter.kategori} {m.filter.kode}
              </span>
            )}
          </div>
        }
      />
    </AppLayout>
  );
}
