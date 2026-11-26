"use client";

import { useState } from "react";
import { DataTable, type ColumnDef } from "@/components/base/data-table";
import type { SertifikatPelatihan } from "@/lib/types/rekap-sertifikat";

const PAGE_SIZE = 20;

function noRegistrasi(row: SertifikatPelatihan) {
  if (row.noReg) return row.noReg;
  if (row.ujian === "Pelatihan" || row.ujian === "Refresh & Ujian") return "Training Saja";
  return "–";
}

export function SertifikatTable({ rows, ujian = false, loading, onEdit }: {
  rows: SertifikatPelatihan[];
  ujian?: boolean;
  loading: boolean;
  onEdit?: (row: SertifikatPelatihan) => void;
}) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const query = search.trim().toLowerCase();
  const filtered = rows.filter((row) => [row.nama, row.instansi, row.noSertifikat, noRegistrasi(row)]
    .some((value) => value?.toLowerCase().includes(query)));
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const columns: ColumnDef<SertifikatPelatihan>[] = [
    { key: "no", label: "No.", render: (_value, _row, index) => start + index + 1 },
    { key: "nama", label: "Nama", className: "font-medium whitespace-normal" },
    { key: "instansi", label: "Instansi", className: "whitespace-normal" },
    { key: "noSertifikat", label: "No. Sertifikat" },
    ...(ujian ? [{ key: "ujian", label: "Ujian" }] : []),
    { key: "noReg", label: "No. Reg", render: (_value, row) => noRegistrasi(row) },
    ...(onEdit ? [{
      key: "update", label: "Update",
      render: (_value: unknown, row: SertifikatPelatihan) => (
        <button type="button" onClick={() => onEdit(row)} className="font-medium text-emerald-700 hover:underline">Update</button>
      ),
    }] : []),
  ];
  return (
    <section>
      <h2 className="mb-3 text-base font-semibold text-zinc-800">{ujian ? "Ujian Saja" : "Daftar Absensi Peserta Training"}</h2>
      <DataTable
        columns={columns}
        data={filtered.slice(start, start + PAGE_SIZE)}
        totalData={filtered.length}
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
        searchValue={search}
        onSearchChange={(value) => { setSearch(value); setPage(1); }}
        searchPlaceholder="Cari nama, instansi, atau sertifikat..."
        isLoading={loading}
        emptyMessage={ujian ? "Belum ada peserta ujian saja." : "Belum ada data sertifikat."}
      />
    </section>
  );
}
