"use client";

import React from "react";
import { Award } from "lucide-react";
import AppLayout from "@/components/app-layout";
import { usePesertaUjiReport } from "@/hooks/use-peserta-uji-report";
import {
  PesertaUjiReportFilter,
  ReportPagination,
} from "@/components/training/PesertaUjiReportFilter";

function Dash({ children }: { children: React.ReactNode }) {
  if (!children) return <span className="text-zinc-300">-</span>;
  return <>{children}</>;
}

function formatTanggal(iso: string | null) {
  if (!iso) return <span className="text-zinc-300">-</span>;
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function DaftarAsesiPage() {
  const {
    data,
    pagination,
    loading,
    page,
    search,
    tahun,
    skemaId,
    setPage,
    handleSearch,
    handleTahun,
    handleSkemaId,
  } = usePesertaUjiReport({ statusHasil: "K" });

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Training", href: "/training" },
        { label: "Daftar Asesi" },
      ]}
    >
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-zinc-100 flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center">
            <Award className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <span className="font-bold text-zinc-800 text-sm">
            Daftar Asesi — Kompeten (K)
          </span>
        </div>

        <PesertaUjiReportFilter
          search={search}
          onSearch={handleSearch}
          tahun={tahun}
          onTahun={handleTahun}
          skemaId={skemaId}
          onSkemaId={handleSkemaId}
        />

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/60">
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-10">No</th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-40">Nama</th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-40">Instansi</th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-24">Skema</th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-28">No Reg</th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-32">No Ser BNSP</th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-28">Tgl Terbit</th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-center w-20">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-xs text-zinc-400">
                    Memuat data...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-xs text-zinc-400">
                    Tidak ada data tersedia.
                  </td>
                </tr>
              ) : (
                data.map((row, i) => (
                  <tr key={row.id} className="border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors">
                    <td className="px-4 py-3 text-xs text-zinc-400 align-top">
                      {(page - 1) * pagination.limit + i + 1}
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-700 font-medium align-top whitespace-nowrap">
                      {row.nama}
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-600 align-top max-w-[180px] truncate">
                      <Dash>{row.instansi}</Dash>
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-600 align-top whitespace-nowrap">
                      {row.skema.kode}
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-600 align-top">
                      <Dash>{row.noReg}</Dash>
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-600 align-top">
                      <Dash>{row.noSerBNSP}</Dash>
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-600 align-top whitespace-nowrap">
                      {formatTanggal(row.tglTerbit)}
                    </td>
                    <td className="px-4 py-3 text-center align-top">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-600">
                        B Terbit
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <ReportPagination
          page={page}
          limit={pagination.limit}
          total={pagination.total}
          totalPages={pagination.totalPages}
          onPageChange={setPage}
        />
      </div>
    </AppLayout>
  );
}
