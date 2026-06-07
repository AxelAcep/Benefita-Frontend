"use client";

import React, { useState } from "react";
import { ShieldCheck } from "lucide-react";
import SearchInput from "@/components/base/search-input";
import Anchor from "@/components/base/anchor";
import { usePermohonanHakAkses } from "@/hooks/use-perusahaan";

export default function TabAlokasiAkun() {
  const {
    data,
    pagination,
    loading,
    error,
    search,
    currentPage,
    handleSearch,
    handlePageChange,
    refetch,
    updateStatus,
  } = usePermohonanHakAkses();

  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const handleUpdateStatus = async (id: string, terima: boolean) => {
    setConfirmingId(id);
    try {
      await updateStatus(id, terima);
    } finally {
      setConfirmingId(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
      {/* Toolbar */}
      <div className="px-5 py-4 border-b border-zinc-100 flex flex-wrap items-center justify-between gap-3">
        <span className="font-bold text-zinc-800 text-sm flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          List Permohonan Hak Akses
        </span>
        <SearchInput
          value={search}
          onChange={handleSearch}
          placeholder="Cari permohonan..."
        />
      </div>

      {/* Error */}
      {error && (
        <div className="px-5 py-3 bg-red-50 border-b border-red-100 text-xs text-red-600 flex items-center justify-between">
          {error}
          <button onClick={refetch} className="underline font-medium">
            Coba lagi
          </button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-zinc-100 bg-zinc-50/60">
              <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-10">
                No
              </th>
              <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left">
                No Induk
              </th>
              <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left">
                Instansi
              </th>
              <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left">
                Akun Di-Request
              </th>
              <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left">
                Posisi Acc
              </th>
              <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left">
                Nama Pengaju
              </th>
              <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left">
                Tanggal
              </th>
              <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left">
                Status
              </th>
              <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-32">
                Konfirmasi
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={9}
                  className="text-center py-8 text-xs text-zinc-400"
                >
                  Memuat data...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="text-center py-8 text-xs text-zinc-400"
                >
                  Tidak ada data tersedia.
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr
                  key={row.id}
                  className="border-b border-zinc-50 hover:bg-zinc-50/40 transition-colors"
                >
                  <td className="px-4 py-3 text-xs text-zinc-400">
                    {(currentPage - 1) * pagination.limit + index + 1}
                  </td>

                  {/* No Induk */}
                  <td className="px-4 py-3 text-xs">
                    <Anchor
                      name={row.kodePerusahaan}
                      route={`/database/perusahaan/${row.kodePerusahaan}`}
                    />
                  </td>

                  {/* Instansi */}
                  <td className="px-4 py-3 text-xs text-zinc-700 font-medium">
                    {row.namaPerusahaan}
                  </td>

                  {/* Akun Di-Request */}
                  <td className="px-4 py-3 text-xs">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-700 font-semibold text-[10px]">
                      {row.jenisAkses}
                    </span>
                  </td>

                  {/* Posisi Acc */}
                  <td className="px-4 py-3 text-xs text-zinc-600">
                    {(row.pegawaiAssigned ?? []).filter((p) => p != null)
                      .length > 0 ? (
                      (row.pegawaiAssigned ?? [])
                        .filter((p) => p != null)
                        .map((p) => p.nama)
                        .join(", ")
                    ) : (
                      <span className="text-zinc-300">—</span>
                    )}
                  </td>

                  {/* Nama Pengaju */}
                  <td className="px-4 py-3 text-xs text-zinc-600">
                    {row.pegawaiPengaju.nama}
                  </td>

                  {/* Tanggal */}
                  <td className="px-4 py-3 text-xs text-zinc-500">
                    {new Date(row.tanggal).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3 text-xs">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                        row.status === "diterima"
                          ? "bg-emerald-50 text-emerald-600"
                          : row.status === "ditolak"
                            ? "bg-red-50 text-red-500"
                            : "bg-amber-50 text-amber-500"
                      }`}
                    >
                      {row.status === "diterima"
                        ? "Diterima"
                        : row.status === "ditolak"
                          ? "Ditolak"
                          : "Pending"}
                    </span>
                  </td>

                  {/* Konfirmasi */}
                  <td className="px-4 py-3 text-xs">
                    {row.status !== "pending" ? (
                      <span className="text-zinc-300">—</span>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleUpdateStatus(row.id, true)}
                          disabled={confirmingId === row.id}
                          className="px-2.5 py-1 text-[10px] font-semibold bg-emerald-500 hover:bg-emerald-600 text-white rounded-md disabled:opacity-40 transition-colors"
                        >
                          Terima
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(row.id, false)}
                          disabled={confirmingId === row.id}
                          className="px-2.5 py-1 text-[10px] font-semibold border border-red-200 text-red-500 hover:bg-red-50 rounded-md disabled:opacity-40 transition-colors"
                        >
                          Tolak
                        </button>
                      </div>
                    )}
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
          {pagination.totalData === 0
            ? 0
            : (currentPage - 1) * pagination.limit + 1}
          –{Math.min(currentPage * pagination.limit, pagination.totalData)} dari{" "}
          {pagination.totalData} data
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || loading}
            className="px-3 py-1.5 text-[11px] border border-zinc-200 rounded-lg text-zinc-500 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ‹ Sebelumnya
          </button>

          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
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
            disabled={currentPage === pagination.totalPages || loading}
            className="px-3 py-1.5 text-[11px] border border-zinc-200 rounded-lg text-zinc-500 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Selanjutnya ›
          </button>
        </div>
      </div>
    </div>
  );
}
