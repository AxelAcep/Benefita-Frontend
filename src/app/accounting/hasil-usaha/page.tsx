"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/sidebar";
import { generatePastelBg, generatePastelText } from "@/lib/pastelColor";
import { useLaporanHasilUsaha } from "@/hooks/use-laporan-hasil-usaha";

type SortBy = "kode" | "keterangan" | "anggaran" | "realisasi";

export default function LaporanHasilUsahaPage() {
  const router = useRouter();

  // ─── State ──────────────────────────────────────────────────────
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 1000; // ambil semua data agar search client-side berfungsi

  // Filter bulan
  const [currentMonth, setCurrentMonth] = useState<number>(
    new Date().getMonth() + 1,
  );
  const [currentYear, setCurrentYear] = useState<number>(
    new Date().getFullYear(),
  );
  const [isCustomRange, setIsCustomRange] = useState(false);
  const [customStartMonth, setCustomStartMonth] =
    useState<number>(currentMonth);
  const [customStartYear, setCustomStartYear] = useState<number>(currentYear);
  const [customEndMonth, setCustomEndMonth] = useState<number>(currentMonth);
  const [customEndYear, setCustomEndYear] = useState<number>(currentYear);

  // Sorting
  const [sortBy, setSortBy] = useState<SortBy>("realisasi");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // ─── API params ────────────────────────────────────────────────
  const getApiParams = useCallback(() => {
    const params: any = {
      page: 1,
      limit,
      sortBy,
      order: sortOrder,
    };
    if (isCustomRange) {
      params.startMonth = customStartMonth;
      params.startYear = customStartYear;
      params.endMonth = customEndMonth;
      params.endYear = customEndYear;
    } else {
      params.startMonth = currentMonth;
      params.startYear = currentYear;
    }
    return params;
  }, [
    limit,
    sortBy,
    sortOrder,
    isCustomRange,
    customStartMonth,
    customStartYear,
    customEndMonth,
    customEndYear,
    currentMonth,
    currentYear,
  ]);

  const { data, grandTotal, loading, error, refetch } =
    useLaporanHasilUsaha(getApiParams());

  // ─── Effect: refresh saat filter berubah ──────────────────────
  useEffect(() => {
    refetch(getApiParams());
    setPage(1);
  }, [
    sortBy,
    sortOrder,
    currentMonth,
    currentYear,
    isCustomRange,
    customStartMonth,
    customStartYear,
    customEndMonth,
    customEndYear,
  ]);

  // ─── Filter client-side (search) ──────────────────────────────
  const filteredData = useMemo(() => {
    if (!search.trim()) return data;
    const s = search.toLowerCase();
    return data.filter(
      (item) =>
        item.kode.toLowerCase().includes(s) ||
        item.keterangan.toLowerCase().includes(s),
    );
  }, [data, search]);

  // Reset page saat search berubah
  useEffect(() => {
    setPage(1);
  }, [search]);

  // ─── Pagination manual ─────────────────────────────────────────
  const itemsPerPage = 10;
  const totalFiltered = filteredData.length;
  const totalPages = Math.ceil(totalFiltered / itemsPerPage) || 1;
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // ─── Navigasi bulan ────────────────────────────────────────────
  const goToPrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };
  const goToNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };
  const goToCurrentMonth = () => {
    const now = new Date();
    setCurrentMonth(now.getMonth() + 1);
    setCurrentYear(now.getFullYear());
    setIsCustomRange(false);
  };
  const handleApplyCustomRange = () => setIsCustomRange(true);
  const handleUseCurrentMonth = () => setIsCustomRange(false);

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
  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6">Error: {error.message}</div>;

  // ─── Render ────────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen bg-zinc-100 overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 md:ml-[250px] min-w-0 overflow-x-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-white border-b border-zinc-100 flex items-center justify-between">
          <div>
            <p className="text-xs text-zinc-400">
              Perusahaan &rsaquo;{" "}
              <span className="font-semibold text-zinc-700">
                Laporan Hasil Usaha
              </span>
            </p>
            <p className="text-xs text-zinc-400 mt-0.5">
              Hari ini:{" "}
              {new Date().toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <p className="text-xs font-semibold text-zinc-800">Nanang</p>
              <p className="text-[10px] text-zinc-400">Super Admin</p>
            </div>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
              style={{
                backgroundColor: generatePastelBg("Nanang"),
                color: generatePastelText("Nanang"),
              }}
            >
              N
            </div>
          </div>
        </div>

        {/* Content */}
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
                onClick={goToPrevMonth}
                disabled={isCustomRange}
                className={`p-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-50 transition-colors ${
                  isCustomRange ? "opacity-40 cursor-not-allowed" : ""
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
                value={`${currentYear}-${String(currentMonth).padStart(2, "0")}`}
                onChange={(e) => {
                  const [year, month] = e.target.value.split("-").map(Number);
                  setCurrentYear(year);
                  setCurrentMonth(month);
                }}
                disabled={isCustomRange}
                className={`border border-zinc-200 rounded-lg px-2 py-1 text-sm font-medium text-zinc-700 focus:border-emerald-300 outline-none ${
                  isCustomRange
                    ? "bg-zinc-100 text-zinc-400 cursor-not-allowed"
                    : ""
                }`}
              />
              <button
                onClick={goToNextMonth}
                disabled={isCustomRange}
                className={`p-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-50 transition-colors ${
                  isCustomRange ? "opacity-40 cursor-not-allowed" : ""
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
                onClick={goToCurrentMonth}
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
                value={`${customStartYear}-${String(customStartMonth).padStart(2, "0")}`}
                onChange={(e) => {
                  const [year, month] = e.target.value.split("-").map(Number);
                  setCustomStartYear(year);
                  setCustomStartMonth(month);
                }}
                className="border border-zinc-200 rounded-lg px-2 py-1 text-xs"
              />
              <span className="text-xs text-zinc-400">sampai</span>
              <input
                type="month"
                value={`${customEndYear}-${String(customEndMonth).padStart(2, "0")}`}
                onChange={(e) => {
                  const [year, month] = e.target.value.split("-").map(Number);
                  setCustomEndYear(year);
                  setCustomEndMonth(month);
                }}
                className="border border-zinc-200 rounded-lg px-2 py-1 text-xs"
              />
              <button
                onClick={handleApplyCustomRange}
                className="px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                Terapkan
              </button>
              {isCustomRange && (
                <button
                  onClick={handleUseCurrentMonth}
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
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortBy)}
                className="border border-zinc-200 rounded-lg px-2 py-1 text-xs"
              >
                <option value="kode">Kode</option>
                <option value="keterangan">Keterangan</option>
                <option value="anggaran">Anggaran</option>
                <option value="realisasi">Realisasi</option>
              </select>
              <button
                onClick={() =>
                  setSortOrder(sortOrder === "desc" ? "asc" : "desc")
                }
                className="p-1 rounded border border-zinc-200 hover:bg-zinc-50 text-xs"
              >
                {sortOrder === "desc" ? "↓" : "↑"}
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
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
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
                  {paginatedData.map((row, i) => (
                    <tr
                      key={row.kode}
                      className="border-t border-zinc-100 hover:bg-zinc-50/50 transition-colors"
                    >
                      <td className="px-5 py-3 text-xs text-zinc-500">
                        {startIndex + i + 1}
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
                  {paginatedData.length === 0 && (
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
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-5 py-3 border-t border-zinc-100">
              <p className="text-[11px] text-zinc-400">
                Menampilkan{" "}
                <span className="font-semibold text-zinc-600">
                  {paginatedData.length}
                </span>{" "}
                dari{" "}
                <span className="font-semibold text-zinc-600">
                  {totalFiltered}
                </span>{" "}
                data
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 text-[11px] border border-zinc-200 rounded-lg text-zinc-500 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  ‹ Sebelumnya
                </button>
                <span className="text-xs text-zinc-500 px-2">
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages || totalPages === 0}
                  className="px-3 py-1.5 text-[11px] border border-zinc-200 rounded-lg text-zinc-500 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Selanjutnya ›
                </button>
              </div>
            </div>

            {/* Grand Total */}
            <div className="flex flex-wrap items-center justify-end gap-6 px-5 py-3 bg-zinc-50 border-t border-zinc-100">
              <div className="flex items-center gap-1 text-xs">
                <span className="text-zinc-500">Total Realisasi:</span>
                <span className="font-bold text-emerald-600">
                  {formatRupiah(grandTotal.totalRealisasi)}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <span className="text-zinc-500">Total Anggaran:</span>
                <span className="font-bold text-zinc-500">
                  {formatRupiah(grandTotal.totalAnggaran)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
