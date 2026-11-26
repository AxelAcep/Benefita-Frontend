"use client";

import type { ColumnDef } from "@/components/base/data-table";
import { TabelContoh } from "@/containers/input/components/tabel-contoh";
import { DATA_CONTOH, type PerusahaanTargetItem } from "./data";

const BADGE: Record<string, string> = {
  SL: "bg-emerald-50 text-emerald-700",
  FIX: "bg-blue-50 text-blue-700",
  Cancel: "bg-red-50 text-red-700",
  "R&U": "bg-purple-50 text-purple-700",
};

const akunColumns = (["ENV", "CSR", "TSM", "EPM"] as const)
  .map((kategori): ColumnDef<PerusahaanTargetItem> => ({
    key: `akun${kategori}`,
    label: `Akun ${kategori}`,
    render: (_v, row) => {
      const kode = row[`akun${kategori}`];
      return (
        <span className={`rounded-full px-2 py-1 text-xs font-semibold ${BADGE[kode] ?? "bg-zinc-100 text-zinc-600"}`}>
          {kode}
        </span>
      );
    },
  }));

const columns: ColumnDef<PerusahaanTargetItem>[] = [
  { key: "noInduk", label: "No. Induk" },
  { key: "perusahaanInstansi", label: "Perusahaan/Instansi", className: "font-medium" },
  { key: "totalPeserta", label: "Total Peserta" },
  ...akunColumns,
  { key: "alamat", label: "Alamat", className: "min-w-48 whitespace-normal" },
  { key: "noTelp", label: "No. Telepon", className: "min-w-40 whitespace-normal" },
];

export default function PerusahaanTargetContainer() {
  return (
    <TabelContoh
      judul="Perusahaan Target"
      columns={columns}
      data={DATA_CONTOH}
      pageSize={4}
      searchPlaceholder="Cari no. induk, perusahaan, atau alamat..."
      match={(row, query) => [row.noInduk, row.perusahaanInstansi, row.alamat].some((value) => value.toLowerCase().includes(query))}
    />
  );
}
