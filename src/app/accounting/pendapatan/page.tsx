"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/sidebar";
import { generatePastelBg, generatePastelText } from "@/lib/pastelColor";
import { usePendapatan } from "@/hooks/use-pendapatan";

type JenisTab = "ALL" | "REG" | "INH" | "KON";

export default function RekapPotensiPendapatanPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<JenisTab>("ALL");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 1000; // Ambil semua data agar search client-side berfungsi

  // State untuk filter bulan
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

  // State sorting
  const [sortBy, setSortBy] = useState<
    "totalPeserta" | "pendapatan" | "tglSelesai"
  >("pendapatan");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Parameter API
  const getApiParams = useCallback(() => {
    const params: any = {
      page: 1, // Selalu halaman 1 karena kita ambil semua data
      limit,
      sortBy,
      order: sortOrder,
    };
    if (activeTab !== "ALL") {
      params.jenis = activeTab;
    }
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
    activeTab,
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
    usePendapatan(getApiParams());

  // Refresh ketika filter berubah (kecuali page dan search)
  useEffect(() => {
    refetch(getApiParams());
    setPage(1); // Reset ke halaman 1 saat filter berubah
  }, [
    activeTab,
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

  // Filter data client-side (search)
  const filteredData = useMemo(() => {
    if (!search.trim()) return data;
    return data.filter(
      (item) =>
        item.kodePelatihan.toLowerCase().includes(search.toLowerCase()) ||
        item.judulLengkap.toLowerCase().includes(search.toLowerCase()) ||
        item.judulTraining.toLowerCase().includes(search.toLowerCase()),
    );
  }, [data, search]);

  // Reset page ketika search berubah
  useEffect(() => {
    setPage(1);
  }, [search]);

  // Pagination manual setelah filter client-side
  const itemsPerPage = 10;
  const totalFiltered = filteredData.length;
  const totalPages = Math.ceil(totalFiltered / itemsPerPage) || 1;
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // Navigasi bulan
  const goToPrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };
  const goToCurrentMonth = () => {
    const now = new Date();
    setCurrentMonth(now.getMonth() + 1);
    setCurrentYear(now.getFullYear());
    setIsCustomRange(false);
  };

  const handleTabChange = (tab: JenisTab) => {
    setActiveTab(tab);
  };

  const handleApplyCustomRange = () => {
    setIsCustomRange(true);
  };
  const handleUseCurrentMonth = () => {
    setIsCustomRange(false);
  };

  // Format Rupiah
  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(num);
  };

  const cols = [
    "No",
    "Kode",
    "Judul",
    "Tanggal",
    "Harga",
    "Total Peserta",
    "Pendapatan",
  ];

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6">Error: {error.message}</div>;

  return (
    <div className="flex min-h-screen bg-zinc-100 overflow-hidden">
      <Sidebar />

      <div className="flex flex-col flex-1 md:ml-[250px] min-w-0 overflow-x-hidden">
        {/* Page Header */}
        <div className="px-6 py-4 bg-white border-b border-zinc-100 flex items-center justify-between">
          <div>
            <p className="text-xs text-zinc-400">
              Perusahaan &rsaquo;{" "}
              <span className="font-semibold text-zinc-700">
                Rekap Pendapatan
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

          {/* Tabs */}
          <div className="flex items-center gap-0 border-b border-zinc-200">
            {(["ALL", "REG", "INH", "KON"] as JenisTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`px-4 pb-2.5 text-xs font-semibold capitalize transition-colors border-b-2 -mb-px ${
                  activeTab === tab
                    ? "border-emerald-500 text-emerald-500"
                    : "border-transparent text-zinc-400 hover:text-zinc-600"
                }`}
              >
                {tab === "ALL"
                  ? "Semua"
                  : tab === "REG"
                    ? "Reguler"
                    : tab === "INH"
                      ? "Inhouse"
                      : "Konsultasi"}
              </button>
            ))}
          </div>

          {/* Filter Bulan & Sorting */}
          {/* Filter Bulan & Sorting */}
          <div className="flex flex-wrap items-center gap-4 bg-white p-3 rounded-xl border border-zinc-200 shadow-sm">
            {/* Single Month */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (isCustomRange) {
                    // Jika sedang rentang, pindah ke single month dengan bulan sekarang
                    const now = new Date();
                    setCurrentMonth(now.getMonth() + 1);
                    setCurrentYear(now.getFullYear());
                    setIsCustomRange(false);
                  } else {
                    goToPrevMonth();
                  }
                }}
                className={`p-1.5 rounded-lg border hover:bg-zinc-50 ${isCustomRange ? "opacity-50 cursor-not-allowed" : "border-zinc-200"}`}
                disabled={isCustomRange}
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
                  setIsCustomRange(false); // Pindah ke single month
                }}
                className={`border rounded-lg px-2 py-1 text-sm font-medium text-zinc-700 focus:border-emerald-300 outline-none ${isCustomRange ? "bg-zinc-100 text-zinc-400 border-zinc-200" : "border-zinc-200"}`}
                disabled={isCustomRange}
              />

              <button
                onClick={() => {
                  if (isCustomRange) {
                    const now = new Date();
                    setCurrentMonth(now.getMonth() + 1);
                    setCurrentYear(now.getFullYear());
                    setIsCustomRange(false);
                  } else {
                    goToNextMonth();
                  }
                }}
                className={`p-1.5 rounded-lg border hover:bg-zinc-50 ${isCustomRange ? "opacity-50 cursor-not-allowed" : "border-zinc-200"}`}
                disabled={isCustomRange}
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
                onClick={() => {
                  const now = new Date();
                  setCurrentMonth(now.getMonth() + 1);
                  setCurrentYear(now.getFullYear());
                  setIsCustomRange(false);
                }}
                className="px-3 py-1 text-xs font-medium text-emerald-600 border border-emerald-200 rounded-lg hover:bg-emerald-50"
              >
                Bulan Ini
              </button>
            </div>

            <div className="w-px h-6 bg-zinc-200" />

            {/* Rentang */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-500">Rentang:</span>
              <input
                type="month"
                value={`${customStartYear}-${String(customStartMonth).padStart(2, "0")}`}
                onChange={(e) => {
                  const [year, month] = e.target.value.split("-").map(Number);
                  setCustomStartYear(year);
                  setCustomStartMonth(month);
                  setIsCustomRange(true);
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
                  setIsCustomRange(true);
                }}
                className="border border-zinc-200 rounded-lg px-2 py-1 text-xs"
              />
              <button
                onClick={() => {
                  setIsCustomRange(true);
                }}
                className="px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                Terapkan
              </button>
              {isCustomRange && (
                <button
                  onClick={() => {
                    // Kembali ke single month (bulan sekarang)
                    const now = new Date();
                    setCurrentMonth(now.getMonth() + 1);
                    setCurrentYear(now.getFullYear());
                    setIsCustomRange(false);
                    // Reset rentang ke bulan sekarang juga
                    setCustomStartMonth(now.getMonth() + 1);
                    setCustomStartYear(now.getFullYear());
                    setCustomEndMonth(now.getMonth() + 1);
                    setCustomEndYear(now.getFullYear());
                  }}
                  className="px-3 py-1 text-xs text-zinc-500 hover:text-zinc-700 underline"
                >
                  Pakai satu bulan
                </button>
              )}
            </div>

            <div className="w-px h-6 bg-zinc-200" />

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-500">Urutkan:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="border border-zinc-200 rounded-lg px-2 py-1 text-xs"
              >
                <option value="totalPeserta">Total Peserta</option>
                <option value="pendapatan">Pendapatan</option>
                <option value="tglSelesai">Tanggal</option>
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
                  Rekap Potensi dan Realisasi Pendapatan
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
                  placeholder="Cari kode / judul..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                  className="pl-7 pr-3 py-1.5 border border-zinc-200 rounded-lg text-xs text-zinc-700 outline-none focus:border-emerald-300 w-48"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="border-b border-zinc-100">
                    {cols.map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-[11px] font-semibold text-zinc-400 text-left whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((row, i) => (
                    <tr
                      key={row.kodePelatihan + i}
                      className="border-b border-zinc-50 hover:bg-zinc-50 transition-colors"
                    >
                      <td className="px-4 py-3 text-xs text-zinc-500">
                        {startIndex + i + 1}
                      </td>
                      <td className="px-4 py-3">
                        <a href={`/input/${row.kodeJadwal}`}>
                          <span className="text-xs text-emerald-500 font-medium hover:text-emerald-600 cursor-pointer transition-colors">
                            {row.kodePelatihan}
                          </span>
                        </a>
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-700 max-w-xs truncate">
                        {row.judulLengkap}
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-700">
                        {row.tglSelesai
                          ? new Date(row.tglSelesai).toLocaleDateString(
                              "id-ID",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )
                          : "-"}
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-700">
                        {formatRupiah(row.biaya)}
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-700 font-medium">
                        {row.totalPeserta}
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-700 font-medium">
                        {formatRupiah(row.pendapatan)}
                      </td>
                    </tr>
                  ))}
                  {paginatedData.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-4 py-8 text-center text-xs text-zinc-400"
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
                <span className="text-zinc-500">Total Peserta:</span>
                <span className="font-bold text-zinc-800">
                  {grandTotal.totalPeserta}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <span className="text-zinc-500">Total Pendapatan:</span>
                <span className="font-bold text-emerald-600">
                  {formatRupiah(grandTotal.pendapatan)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
