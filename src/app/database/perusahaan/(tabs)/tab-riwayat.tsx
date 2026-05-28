"use client";

import React, { useState, useEffect } from "react";
import { History } from "lucide-react";
import SearchInput from "@/components/base/search-input";
import { useLogPerusahaan } from "@/hooks/use-perusahaan";

interface TabRiwayatProps {
  id: string;
}

export default function TabRiwayat({ id }: TabRiwayatProps) {
  // ── State Lokal (Sekarang ada di sini biar gak error) ──
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // ── Debounce search logic ──
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1); // Reset ke hal 1 tiap nyari
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // ── Hooks (Passing state ke hook) ──
  const {
    data,
    loading,
    error,
    totalPages,
    totalData,
    refresh, // Pastikan di hook lo return fungsi ini atau ganti jadi refetch
  } = useLogPerusahaan(id, {
    page: currentPage,
    search: debouncedSearch,
  });

  // ── Handlers ──
  const handleSearch = (value: string) => setSearch(value);

  const formatValue = (value: any) => {
    if (value == null) return "-";

    if (typeof value === "string" || typeof value === "number") {
      return value;
    }

    if (typeof value === "object") {
      return Object.entries(value)
        .filter(([key, v]) => key !== "id" && v !== null && v !== "")
        .map(([, v]) => v)
        .join(", ");
    }

    return "-";
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  const renderPageButtons = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }

    return pages.map((p, idx) =>
      p === "..." ? (
        <span
          key={`ellipsis-${idx}`}
          className="px-2 text-xs text-zinc-400 select-none"
        >
          ...
        </span>
      ) : (
        <button
          key={p}
          onClick={() => handlePageChange(p)}
          className={`px-3 py-1.5 text-[11px] border rounded-lg transition-colors ${
            p === currentPage
              ? "bg-emerald-500 text-white border-emerald-500"
              : "border-zinc-200 text-zinc-500 hover:bg-zinc-50"
          }`}
        >
          {p}
        </button>
      ),
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-zinc-100 flex flex-wrap items-center justify-between gap-3">
        <span className="font-bold text-zinc-800 text-sm flex items-center gap-2">
          <History className="w-4 h-4 text-emerald-500" />
          Riwayat Perubahan Data
        </span>
        <div className="flex items-center gap-2">
          <SearchInput
            value={search}
            onChange={handleSearch}
            placeholder="Cari field, editor, atau data..."
          />
        </div>
      </div>

      {error && (
        <div className="px-5 py-3 bg-red-50 border-b border-red-100 text-xs text-red-600 flex items-center justify-between">
          {error}
          <button onClick={() => refresh?.()} className="underline font-medium">
            Coba lagi
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b border-zinc-100 bg-zinc-50/60">
              <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-10">
                No
              </th>
              <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-32">
                Tanggal
              </th>
              <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-40">
                Field
              </th>
              <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left">
                Data Lama
              </th>
              <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left">
                Data Baru
              </th>
              <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-32">
                Oleh
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-8 text-xs text-zinc-400"
                >
                  Memuat riwayat...
                </td>
              </tr>
            ) : data?.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-8 text-xs text-zinc-400"
                >
                  {debouncedSearch
                    ? `Tidak ada hasil untuk "${debouncedSearch}"`
                    : "Belum ada riwayat perubahan."}
                </td>
              </tr>
            ) : (
              data?.map((row, index) => (
                <tr
                  key={row.id}
                  className="border-b border-zinc-50 hover:bg-zinc-50/40 transition-colors"
                >
                  <td className="px-4 py-3 text-xs text-zinc-400">
                    {(currentPage - 1) * 10 + index + 1}
                  </td>
                  <td className="px-4 py-3 text-xs text-zinc-600">
                    {new Date(row.tanggal).toLocaleString("id-ID", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </td>
                  <td className="px-4 py-3 text-xs font-bold text-zinc-700">
                    <span className="bg-zinc-100 px-1.5 py-0.5 rounded text-[10px] uppercase">
                      {row.field.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-red-500  italic bg-red-50/30">
                    {formatValue(row.dataLama)}
                  </td>
                  <td className="px-4 py-3 text-xs text-emerald-600 font-medium bg-emerald-50/30">
                    {formatValue(row.dataBaru)}
                  </td>
                  <td className="px-4 py-3 text-xs text-zinc-500">
                    {row.diubahOleh}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!loading && totalData > 0 && (
        <div className="flex items-center justify-between px-5 py-3 border-t border-zinc-100">
          <p className="text-[11px] text-zinc-400">
            Menampilkan {(currentPage - 1) * 10 + 1}–
            {Math.min(currentPage * 10, totalData)} dari {totalData} log
          </p>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || loading}
              className="px-3 py-1.5 text-[11px] border border-zinc-200 rounded-lg text-zinc-500 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              ‹ Sebelumnya
            </button>
            {renderPageButtons()}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || loading}
              className="px-3 py-1.5 text-[11px] border border-zinc-200 rounded-lg text-zinc-500 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Selanjutnya ›
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
