"use client";

import { useRouter } from "next/navigation";
import AppLayout from "@/components/app-layout";
import TablePagination from "@/components/base/table-pagination";
import { useHasilUsahaManage } from "./manage";

export default function LaporanHasilUsahaPage() {
  const router = useRouter();
  const m = useHasilUsahaManage();

  // ─── Format Rupiah ─────────────────────────────────────────────
  const formatRupiah = (num: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(num);

  // ─── Table columns ─────────────────────────────────────────────
  const cols = ["No", "Kode", "Keterangan", "Anggaran", "Realisasi"];

  // ─── Loading / Error ───────────────────────────────────────────
  if (m.loading) return <AppLayout breadcrumbs={[{ label: "Accounting", href: "/accounting" }, { label: "Laporan Hasil Usaha" }]}><div className="p-6">Loading...</div></AppLayout>;
  if (m.error) return <AppLayout breadcrumbs={[{ label: "Accounting", href: "/accounting" }, { label: "Laporan Hasil Usaha" }]}><div className="p-6 text-red-600">Error: {m.error.message}</div></AppLayout>;

  // ─── Render ────────────────────────────────────────────────────
  return (
    <AppLayout breadcrumbs={[
      { label: "Accounting", href: "/accounting" },
      { label: "Laporan Hasil Usaha" },
    ]}>
      <div className="p-6 space-y-4">
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

          {/* Filter Bulan & Sorting */}
          <div className="flex flex-wrap items-center gap-4 bg-white p-3 rounded-xl border border-zinc-200 shadow-sm">
            {/* Navigasi Bulan dengan input kalender */}
            <div className="flex items-center gap-2">
              <button
                onClick={m.goToPrevMonth}
                disabled={m.isCustomRange}
                className={`p-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-50 transition-colors ${
                  m.isCustomRange ? "opacity-40 cursor-not-allowed" : ""
                }`}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <input
                type="month"
                value={`${m.currentYear}-${String(m.currentMonth).padStart(2, "0")}`}
                onChange={(e) => {
                  const [year, month] = e.target.value.split("-").map(Number);
                  m.setCurrentYear(year);
                  m.setCurrentMonth(month);
                }}
                disabled={m.isCustomRange}
                className={`border border-zinc-200 rounded-lg px-2 py-1 text-sm font-medium text-zinc-700 focus:border-emerald-300 outline-none ${
                  m.isCustomRange
                    ? "bg-zinc-100 text-zinc-400 cursor-not-allowed"
                    : ""
                }`}
              />
              <button
                onClick={m.goToNextMonth}
                disabled={m.isCustomRange}
                className={`p-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-50 transition-colors ${
                  m.isCustomRange ? "opacity-40 cursor-not-allowed" : ""
                }`}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
              <button
                onClick={m.goToCurrentMonth}
                className="px-3 py-1 text-xs font-medium text-emerald-600 border border-emerald-200 rounded-lg hover:bg-emerald-50 transition-colors"
              >
                Bulan Ini
              </button>
            </div>

            <div className="w-px h-6 bg-zinc-200" />

            {/* Filter Rentang */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-500">Rentang:</span>
              <input
                type="month"
                value={`${m.customStartYear}-${String(m.customStartMonth).padStart(2, "0")}`}
                onChange={(e) => {
                  const [year, month] = e.target.value.split("-").map(Number);
                  m.setCustomStartYear(year);
                  m.setCustomStartMonth(month);
                }}
                className="border border-zinc-200 rounded-lg px-2 py-1 text-xs"
              />
              <span className="text-xs text-zinc-400">sampai</span>
              <input
                type="month"
                value={`${m.customEndYear}-${String(m.customEndMonth).padStart(2, "0")}`}
                onChange={(e) => {
                  const [year, month] = e.target.value.split("-").map(Number);
                  m.setCustomEndYear(year);
                  m.setCustomEndMonth(month);
                }}
                className="border border-zinc-200 rounded-lg px-2 py-1 text-xs"
              />
              <button
                onClick={m.handleApplyCustomRange}
                className="px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                Terapkan
              </button>
              {m.isCustomRange && (
                <button
                  onClick={m.handleUseCurrentMonth}
                  className="px-3 py-1 text-xs text-zinc-500 hover:text-zinc-700 underline"
                >
                  Kembali ke bulan ini
                </button>
              )}
            </div>

            <div className="w-px h-6 bg-zinc-200" />

            {/* Sorting */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-500">Urutkan:</span>
              <select
                value={m.sortBy}
                onChange={(e) => m.setSortBy(e.target.value as typeof m.sortBy)}
                className="border border-zinc-200 rounded-lg px-2 py-1 text-xs"
              >
                <option value="kode">Kode</option>
                <option value="keterangan">Keterangan</option>
                <option value="anggaran">Anggaran</option>
                <option value="realisasi">Realisasi</option>
              </select>
              <button
                onClick={() =>
                  m.setSortOrder(m.sortOrder === "desc" ? "asc" : "desc")
                }
                className="p-1 rounded border border-zinc-200 hover:bg-zinc-50 text-xs"
              >
                {m.sortOrder === "desc" ? "↓" : "↑"}
              </button>
            </div>
          </div>

          {/* Table Card */}
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-zinc-100">
              <div className="flex items-center gap-3">
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
                  Laporan Hasil Usaha
                </p>
              </div>
              {/* Search */}
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
                  placeholder="Cari kode / keterangan..."
                  value={m.search}
                  onChange={(e) => m.setSearch(e.target.value)}
                  className="pl-7 pr-3 py-1.5 border border-zinc-200 rounded-lg text-xs text-zinc-700 outline-none focus:border-emerald-300 w-48"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-zinc-100">
                    {cols.map((h) => (
                      <th
                        key={h}
                        className="px-5 py-3 text-[11px] font-semibold text-zinc-400 text-left whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {m.paginatedData.map((row, i) => (
                    <tr
                      key={row.kode}
                      className="border-t border-zinc-100 hover:bg-zinc-50/50 transition-colors"
                    >
                      <td className="px-5 py-3 text-xs text-zinc-500">
                        {m.startIndex + i + 1}
                      </td>
                      <td className="px-5 py-3 text-xs font-medium text-emerald-600">
                        {row.kode}
                      </td>
                      <td className="px-5 py-3 text-xs text-zinc-700">
                        {row.keterangan}
                      </td>
                      <td className="px-5 py-3 text-xs text-zinc-400">
                        {formatRupiah(row.anggaran)}
                      </td>
                      <td className="px-5 py-3 text-xs font-medium text-zinc-800">
                        {formatRupiah(row.realisasi)}
                      </td>
                    </tr>
                  ))}
                  {m.paginatedData.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-5 py-8 text-center text-xs text-zinc-400"
                      >
                        Tidak ada data ditemukan
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination & Info */}
            <TablePagination
              page={m.page}
              limit={m.itemsPerPage}
              total={m.totalFiltered}
              totalPages={m.totalPages}
              onPageChange={m.setPage}
            />

            {/* Grand Total */}
            <div className="flex flex-wrap items-center justify-end gap-6 px-5 py-3 bg-zinc-50 border-t border-zinc-100">
              <div className="flex items-center gap-1 text-xs">
                <span className="text-zinc-500">Total Realisasi:</span>
                <span className="font-bold text-emerald-600">
                  {formatRupiah(m.grandTotal.totalRealisasi)}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <span className="text-zinc-500">Total Anggaran:</span>
                <span className="font-bold text-zinc-500">
                  {formatRupiah(m.grandTotal.totalAnggaran)}
                </span>
              </div>
            </div>
          </div>
        </div>
    </AppLayout>
  );
}
