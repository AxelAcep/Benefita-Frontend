"use client";

import { useRouter } from "next/navigation";
import AppLayout from "@/components/app-layout";
import { useNeraca2023Manage } from "./manage";
import TablePagination from "@/components/base/table-pagination";
import { kodeOptions } from "./data-contoh";

function SortIcon() {
  return (
    <svg
      width="8"
      height="8"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M7 15l5 5 5-5" />
      <path d="M7 9l5-5 5 5" />
    </svg>
  );
}

const formatRp = (val: number) =>
    val === 0 ? "0" : `Rp${val.toLocaleString("id-ID")}`;

const cols = [
    "No",
    "Kode",
    "Tanggal",
    "Uraian",
    "No. Bukti",
    "Debet",
    "Kredit",
    "Saldo",
    "Aksi",
  ];

export default function Neraca2023Container() {
  const { search, setSearch, tanggal, setTanggal, kode, setKode, page, setPage, perPage, totalPages, paginated, total, totalDebet, totalKredit, totalSaldo } = useNeraca2023Manage();
  const router = useRouter();

  return (
    <AppLayout breadcrumbs={[{ label: "Accounting", href: "/accounting/beranda" }, { label: "Neraca 2023" }]}>
      <div className="space-y-4">
        {/* Back */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-800 transition-colors font-medium"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Kembali
        </button>

        {/* Table Card */}
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
          {/* ── Toolbar row 1: Title + Tambah ── */}
          <div className="flex items-center justify-between px-5 pt-4 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-emerald-50 rounded-lg flex items-center justify-center">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2"
                >
                  <rect x="2" y="7" width="20" height="14" rx="2" />
                  <path d="M16 3H8a2 2 0 0 0-2 2v2h12V5a2 2 0 0 0-2-2z" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                  <line x1="8" y1="16" x2="12" y2="16" />
                </svg>
              </div>
              <p className="font-bold text-zinc-800 text-sm">
                Neraca Keuangan
              </p>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg transition-colors">
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Tambah Peserta
            </button>
          </div>

          {/* ── Toolbar row 2: Filters + Search ── */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 pb-4 border-b border-zinc-100">
            {/* Left: filters */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Tanggal */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-zinc-500 font-medium">
                  Tanggal
                </span>
                <div className="relative">
                  <input
                    type="date"
                    value={tanggal}
                    onChange={(e) => setTanggal(e.target.value)}
                    className="border border-zinc-200 rounded-lg pl-3 pr-8 py-1.5 text-xs text-zinc-700 outline-none focus:border-emerald-300 w-36 appearance-none"
                  />
                  <svg
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-300 pointer-events-none"
                    width="11"
                    height="11"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
              </div>

              {/* Kode */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-zinc-500 font-medium">
                  Kode
                </span>
                <div className="relative">
                  <select
                    value={kode}
                    onChange={(e) => {
                      setKode(e.target.value);
                      setPage(1);
                    }}
                    className="border border-zinc-200 rounded-lg pl-3 pr-8 py-1.5 text-xs text-zinc-700 outline-none focus:border-emerald-300 w-36 appearance-none bg-white"
                  >
                    <option value="">Pilih Kode</option>
                    {kodeOptions.map((k) => (
                      <option key={k} value={k}>
                        {k}
                      </option>
                    ))}
                  </select>
                  <svg
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-300 pointer-events-none"
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </div>

              {/* Terapkan + Cetak */}
              <button
                onClick={() => setPage(1)}
                className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                Terapkan
              </button>
              <button className="px-3 py-1.5 border border-zinc-200 text-zinc-600 hover:bg-zinc-50 text-xs font-semibold rounded-lg transition-colors">
                Cetak
              </button>
            </div>

            {/* Right: search */}
            <div className="relative">
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
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-7 pr-3 py-1.5 border border-zinc-200 rounded-lg text-xs text-zinc-700 outline-none focus:border-emerald-300 w-48"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-zinc-100">
                  {cols.map((h) => (
                    <th
                      key={h}
                      className={`px-4 py-3 text-[11px] font-semibold text-zinc-400 whitespace-nowrap ${h === "Aksi" ? "text-right" : "text-left"}`}
                    >
                      <span
                        className={`flex items-center gap-1 ${h === "Aksi" ? "justify-end" : ""}`}
                      >
                        {h}
                        {h !== "Aksi" && <SortIcon />}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map((row, i) => (
                  <tr
                    key={row.id}
                    className="border-b border-zinc-50 hover:bg-zinc-50 transition-colors"
                  >
                    <td className="px-4 py-3 text-xs text-zinc-500">
                      {(page - 1) * perPage + i + 1}
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-700 font-medium">
                      {row.kode}
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-600">
                      {row.tanggal}
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-700">
                      {row.uraian}
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-600">
                      {row.noBukti}
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-700">
                      {row.debet}
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-700">
                      {row.kredit}
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-700">
                      {row.saldo}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="text-[11px] text-emerald-500 hover:text-emerald-600 font-semibold transition-colors">
                          Edit
                        </button>
                        <button className="text-[11px] text-red-400 hover:text-red-500 font-semibold transition-colors">
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {paginated.length === 0 && (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-4 py-8 text-center text-xs text-zinc-400"
                    >
                      Tidak ada data ditemukan
                    </td>
                  </tr>
                )}

                {/* Total row */}
                {paginated.length > 0 && (
                  <tr className="bg-zinc-50 border-t border-zinc-200">
                    <td
                      colSpan={5}
                      className="px-4 py-3 text-xs font-bold text-zinc-700 text-right"
                    >
                      Total
                    </td>
                    <td className="px-4 py-3 text-xs font-bold text-zinc-800">
                      {formatRp(totalDebet)}
                    </td>
                    <td className="px-4 py-3 text-xs font-bold text-zinc-800">
                      {formatRp(totalKredit)}
                    </td>
                    <td className="px-4 py-3 text-xs font-bold text-zinc-800">
                      {formatRp(totalSaldo)}
                    </td>
                    <td />
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <TablePagination
            page={page}
            limit={perPage}
            total={total}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      </div>
    </AppLayout>
  );
}
