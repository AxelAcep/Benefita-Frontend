"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import AppLayout from "@/components/app-layout";
import { DataTable, type ColumnDef } from "@/components/base/data-table";
import { useDaftarPesertaJadwal } from "@/hooks/use-daftar-peserta-jadwal";
import type { PesertaTrainingListItem } from "@/lib/services/input.service";

function PindahPesertaJadwal({ noJadwal }: { noJadwal: string }) {
  const m = useDaftarPesertaJadwal(noJadwal);
  const href = `/input/${encodeURIComponent(noJadwal)}`;

  const columns: ColumnDef<PesertaTrainingListItem>[] = [
    { key: "no", label: "No", render: (_v, _row, i) => (m.page - 1) * m.limit + i + 1 },
    { key: "nama", label: "Nama", className: "font-medium" },
    { key: "perusahaan", label: "Perusahaan/Instansi", render: (_v, row) => row.perusahaan?.company ?? "–" },
    { key: "accExecutive", label: "AE" },
    { key: "status", label: "Status" },
    { key: "catatan", label: "Catatan", className: "min-w-40 whitespace-normal" },
  ];

  return (
    <AppLayout breadcrumbs={[{ label: "Input Data", href }, { label: "Pindah Jadwal Peserta" }]}>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold">Pindah Jadwal Peserta</h1>
          <p className="text-sm text-zinc-600">Pemindahan peserta belum tersedia.</p>
          {m.jadwal && <p className="mt-2 text-sm font-medium">{m.jadwal.judulLengkap}</p>}
        </div>
        <Link href={href} className="text-sm font-medium text-emerald-700 hover:underline">Kembali ke Input</Link>
      </div>
      {m.error && (
        <div role="alert" className="mb-4 flex gap-3 text-sm text-red-700">
          <p>{m.error}</p>
          <button type="button" onClick={m.refetch} className="font-medium underline">Coba lagi</button>
        </div>
      )}
      <DataTable
        columns={columns}
        data={m.rows}
        totalData={m.meta?.total ?? 0}
        currentPage={m.page}
        totalPages={Math.max(1, m.meta?.totalPages ?? m.page)}
        pageSize={m.limit}
        onPageChange={m.setPage}
        searchValue={m.search}
        onSearchChange={m.changeSearch}
        searchPlaceholder="Cari peserta atau perusahaan..."
        isLoading={m.loading}
        emptyMessage={m.error ? "Data gagal dimuat." : undefined}
      />
    </AppLayout>
  );
}

export default function PindahPesertaContainer() {
  const { id } = useParams<{ id: string }>();
  return <PindahPesertaJadwal key={id} noJadwal={id} />;
}
