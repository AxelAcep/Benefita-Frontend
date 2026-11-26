"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { DataTable, type ColumnDef } from "@/components/base/data-table";
import { useResource } from "@/hooks/use-resource";
import { databaseDaftarService } from "@/lib/services/database-daftar.service";
import type { Perusahaan } from "@/lib/types/database-daftar";

export function DaftarInstansi({ slug, label, jenisInstansi }: {
  slug: string;
  label: string;
  jenisInstansi: string;
}) {
  const m = useResource<Perusahaan>(databaseDaftarService, { filter: { jenisInstansi } });
  const base = `/database/${slug}`;
  const columns: ColumnDef<Perusahaan>[] = [
    { key: "no", label: "No", render: (_v, _row, i) => (m.page - 1) * m.limit + i + 1 },
    { key: "nama", label: "Perusahaan/Instansi", className: "font-medium" },
    { key: "alamatPusat", label: "Alamat Pusat", className: "min-w-48 whitespace-normal" },
    { key: "noTelp", label: "No. Telp" },
    {
      key: "detail",
      label: "Aksi",
      render: (_v, row) => (
        <Link href={`${base}/${encodeURIComponent(row.id)}`} className="font-medium text-emerald-700 hover:underline">
          Lihat Detail
        </Link>
      ),
    },
  ];
  return (
    <>
      <h2 className="mb-3 text-base font-semibold">Daftar {label}</h2>
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
        searchPlaceholder="Cari perusahaan atau instansi..."
        isLoading={m.loading}
        emptyMessage={m.error ? "Data gagal dimuat." : undefined}
        actionSlot={
          <Link href={`${base}/create`} className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700">
            <Plus className="size-4" /> Tambah Data
          </Link>
        }
      />
    </>
  );
}
