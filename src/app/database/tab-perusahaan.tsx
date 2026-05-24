"use client";

import React from "react";
import { Building2 } from "lucide-react";
import SearchInput from "@/components/base/search-input";
import TableButton from "@/components/base/table-button";
import { usePerusahaan } from "@/hooks/use-perusahaan";
import { useRouter } from "next/navigation";
import Anchor from "@/components/base/anchor";

export default function TabPerusahaan() {
  const {
    data,
    meta,
    loading,
    error,
    search,
    currentPage,
    handleSearch,
    handlePageChange,
    reload,
  } = usePerusahaan();
  const router = useRouter();
  return (
    <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
      {/* Toolbar */}
      <div className="px-5 py-4 border-b border-zinc-100 flex flex-wrap items-center justify-between gap-3">
        <span className="font-bold text-zinc-800 text-sm flex items-center gap-2">
          <Building2 className="w-4 h-4 text-emerald-500" />
          List Perusahaan
        </span>
        <div className="flex items-center gap-2">
          <SearchInput
            value={search}
            onChange={handleSearch}
            placeholder="Cari perusahaan..."
          />
          <TableButton
            icon="plus"
            onClick={() => {
              router.push("database/perusahaan/create");
            }}
          >
            Tambah Data
          </TableButton>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="px-5 py-3 bg-red-50 border-b border-red-100 text-xs text-red-600 flex items-center justify-between">
          {error}
          <button onClick={reload} className="underline font-medium">
            Coba lagi
          </button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-zinc-100 bg-zinc-50/60">
              <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-10">
                No
              </th>
              <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left">
                Perusahaan/Instansi
              </th>
              <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left">
                Alamat Pusat
              </th>
              <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-36">
                No. Telp
              </th>
              <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-36">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="text-center py-4">
                  Loading...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-4">
                  Tidak ada data tersedia.
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr key={row.id} className="border-b border-zinc-50">
                  <td className="px-4 py-3 text-xs text-zinc-400">
                    {(currentPage - 1) * meta.pageSize + index + 1}
                  </td>
                  <td className="px-4 py-3 text-xs text-zinc-700 font-medium">
                    {row.nama}
                  </td>
                  <td className="px-4 py-3 text-xs text-zinc-600">
                    {row.alamatPusat}
                  </td>
                  <td className="px-4 py-3 text-xs text-zinc-600">
                    {row.noTelp || "-"}
                  </td>
                  <td className="px-4 py-3 text-xs text-zinc-600">
                    <Anchor
                      name="Lihat Detail"
                      route={`/database/perusahaan/${row.id}`}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-zinc-100">
        <p className="text-[11px] text-zinc-400">
          Menampilkan{" "}
          {meta.total === 0 ? 0 : (currentPage - 1) * meta.pageSize + 1}–
          {Math.min(currentPage * meta.pageSize, meta.total)} dari {meta.total}{" "}
          data
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || loading}
            className="px-3 py-1.5 text-[11px] border border-zinc-200 rounded-lg text-zinc-500 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ‹ Sebelumnya
          </button>

          {/* Page number buttons */}
          {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map(
            (page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                disabled={loading}
                className={`px-3 py-1.5 text-[11px] border rounded-lg ${
                  page === currentPage
                    ? "bg-emerald-500 text-white border-emerald-500"
                    : "border-zinc-200 text-zinc-500 hover:bg-zinc-50"
                }`}
              >
                {page}
              </button>
            ),
          )}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === meta.totalPages || loading}
            className="px-3 py-1.5 text-[11px] border border-zinc-200 rounded-lg text-zinc-500 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Selanjutnya ›
          </button>
        </div>
      </div>
    </div>
  );
}
