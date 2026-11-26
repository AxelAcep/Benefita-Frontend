"use client";

import { DataTable, type ColumnDef } from "@/components/base/data-table";
import { useResource } from "@/hooks/use-resource";
import { perusahaanPesertaService } from "@/lib/services/perusahaan-peserta.service";
import type { PesertaLengkapPerusahaan } from "@/lib/types/perusahaan-peserta";

const columns: ColumnDef<PesertaLengkapPerusahaan>[] = [
  { key: "nama", label: "Nama", className: "font-medium whitespace-normal" },
  { key: "jabatan", label: "Jabatan", className: "whitespace-normal" },
  {
    key: "statusKaryawan", label: "Status",
    render: (value) => {
      const status = typeof value === "string" ? value.trim() : "";
      const active = ["aktif", "a"].includes(status.toLowerCase());
      return <span title={status || undefined} className={active ? "font-medium text-emerald-700" : "text-zinc-600"}>{active ? "A" : status || "–"}</span>;
    },
  },
  {
    key: "pelatihan", label: "Pelatihan",
    render: (_value, row) => (
      <div>
        <p className="font-medium text-zinc-700">{row.kodePelatihan || "–"}</p>
        {row.periodePelatihan && <p className="mt-1 text-xs text-zinc-500">{row.periodePelatihan}</p>}
      </div>
    ),
  },
];

export default function TabPeserta({ id }: { id: string }) {
  const m = useResource<PesertaLengkapPerusahaan>(perusahaanPesertaService, {
    filter: { noInduk: id },
    pesanGagal: "Gagal mengambil peserta perusahaan.",
  });
  return (
    <section>
      <h2 className="mb-3 text-base font-semibold text-zinc-800">Peserta Lengkap</h2>
      {m.error && (
        <div role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <p>{m.error}</p>
          <button type="button" onClick={m.refetch} className="mt-2 font-medium underline">Coba lagi</button>
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
        searchPlaceholder="Cari nama, jabatan, atau pelatihan..."
        isLoading={m.loading}
        emptyMessage={m.error ? "Data gagal dimuat." : "Belum ada riwayat peserta untuk perusahaan ini."}
      />
    </section>
  );
}
