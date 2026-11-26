"use client";

import type { PermintaanPeserta } from "@/lib/types/peserta-permintaan-offline";
import { ClipboardList } from "lucide-react";
import AppLayout from "@/components/app-layout";
import TablePagination from "@/components/base/table-pagination";
import { usePesertaPermintaanOfflineManage } from "./manage";

const COLUMNS: {
  key: keyof Omit<PermintaanPeserta, "id" | "perusahaan">;
  label: string;
}[] = [
  { key: "csr01", label: "CSR01" },
  { key: "csr03", label: "CSR03" },
  { key: "csr05", label: "CSR05" },
  { key: "em01a", label: "EM01" },
  { key: "em01b", label: "EM01" },
  { key: "em06", label: "EM06" },
  { key: "eng01", label: "ENG01" },
  { key: "eng02", label: "ENG02" },
  { key: "eng03", label: "ENG03" },
  { key: "ep01", label: "EP01" },
  { key: "ep03", label: "EP03" },
  { key: "ep04", label: "EP04" },
  { key: "ep08", label: "EP08" },
  { key: "ep09", label: "EP09" },
  { key: "ep11", label: "EP11" },
  { key: "ep14", label: "EP14" },
  { key: "ep15", label: "EP15" },
  { key: "ep16", label: "EP16" },
  { key: "esg02", label: "ESG02" },
  { key: "haz01", label: "HAZ01" },
];

function Cell({ val }: { val: number | null }) {
  if (val === null)
    return (
      <td className="px-3 py-3 text-center text-xs text-zinc-300 select-none border-r border-zinc-50 last:border-r-0">
        –
      </td>
    );
  return (
    <td className="px-3 py-3 text-center text-xs text-zinc-600 font-medium border-r border-zinc-50 last:border-r-0">
      {val}
    </td>
  );
}

export default function PesertaPermintaanOfflineContainer() {
  const {
    PAGE_SIZE,
    search,
    currentPage,
    setCurrentPage,
    paginated,
    total,
    totalPages,
    changeSearch,
  } = usePesertaPermintaanOfflineManage();

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Peserta" },
        { label: "Daftar Permintaan Peserta (Offline)" },
      ]}
    >
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="px-5 py-3 border-b border-zinc-100">
          <div className="flex items-center gap-2">
            {/* Title */}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center">
                <ClipboardList className="w-3.5 h-3.5 text-emerald-500" />
              </div>
              <span className="font-bold text-zinc-800 text-sm">
                Daftar Permintaan Peserta (Offline)
              </span>
            </div>

            {/* Search — push to right */}
            <div className="relative ml-auto">
              <svg
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-300"
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Cari informasi..."
                value={search}
                onChange={(e) => changeSearch(e.target.value)}
                className="w-full sm:w-52 pl-7 pr-3 py-1.5 border border-zinc-200 rounded-lg text-xs text-zinc-700 outline-none focus:border-emerald-300 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table
            className="w-full"
            style={{ minWidth: `${200 + COLUMNS.length * 72}px` }}
          >
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/60">
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-10 sticky left-0 bg-zinc-50/60 z-10">
                  No ↕
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-40 sticky left-10 bg-zinc-50/60 z-10">
                  Perusahaan/Instansi
                </th>
                {COLUMNS.map((col) => (
                  <th
                    key={col.key}
                    className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-center w-16"
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={COLUMNS.length + 2}
                    className="px-4 py-12 text-center text-xs text-zinc-400"
                  >
                    Tidak ada data tersedia.
                  </td>
                </tr>
              ) : (
                paginated.map((row, i) => (
                  <tr
                    key={row.id}
                    className="border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-xs text-zinc-400 sticky left-0 bg-white z-10">
                      {(currentPage - 1) * PAGE_SIZE + i + 1}
                    </td>
                    <td className="px-4 py-3 text-xs sticky left-10 bg-white z-10">
                      <span className="text-emerald-600 font-semibold cursor-pointer hover:underline whitespace-nowrap">
                        {row.perusahaan}
                      </span>
                    </td>
                    {COLUMNS.map((col) => (
                      <Cell key={col.key} val={row[col.key] as number | null} />
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <TablePagination
          page={currentPage}
          limit={PAGE_SIZE}
          total={total}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </AppLayout>
  );
}
