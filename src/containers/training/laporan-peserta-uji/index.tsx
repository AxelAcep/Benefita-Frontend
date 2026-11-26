"use client";

/**
 * Kerangka bersama untuk tiga laporan peserta uji yang hanya berbeda pada
 * judul, ikon, filter tetap, dan kolom ekornya:
 *
 *   Daftar Asesi        statusHasil "K"
 *   Daftar Asesi BK     statusHasil "BK"
 *   Calon Peserta Uji   status "CALON"
 *
 * Sebelumnya ketiganya menyalin tabel, keadaan memuat, keadaan kosong, dan
 * penomoran barisnya masing-masing. Di sini ditulis sekali; tiap halaman
 * cukup menyerahkan kolom ekornya.
 */
import React from "react";
import AppLayout from "@/components/app-layout";
import {
  PesertaUjiReportFilter,
  ReportPagination,
} from "@/components/training/PesertaUjiReportFilter";
import { usePesertaUjiReport } from "@/hooks/use-peserta-uji-report";
import type { PesertaUji } from "@/lib/services/peserta-uji.service";

/** Teks kosong jadi strip abu, supaya sel kosong tidak terlihat seperti galat. */
export function Dash({ children }: { children: React.ReactNode }) {
  if (!children) return <span className="text-zinc-300">-</span>;
  return <>{children}</>;
}

export function tanggalRingkas(iso: string | null) {
  if (!iso) return <span className="text-zinc-300">-</span>;
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export interface KolomLaporan {
  label: string;
  /** Lebar kolom ala Tailwind, misal "w-32". */
  lebar?: string;
  /** Kelas sel isi, misal "text-center". */
  kelasSel?: string;
  render: (row: PesertaUji) => React.ReactNode;
}

export interface LaporanPesertaUjiProps {
  judulHalaman: string;
  judulKartu: string;
  ikon: React.ReactNode;
  /** Kelas latar bulatan ikon, misal "bg-red-50". */
  warnaIkon: string;
  /** Filter yang dipaku untuk halaman ini. */
  filterTetap: { status?: string; statusHasil?: string };
  /** Kolom setelah No, Nama, Instansi, dan Skema. */
  kolomTambahan: KolomLaporan[];
}

const KELAS_TH =
  "px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left";
const KELAS_TD = "px-4 py-3 text-xs text-zinc-600 align-top";

export function LaporanPesertaUji({
  judulHalaman,
  judulKartu,
  ikon,
  warnaIkon,
  filterTetap,
  kolomTambahan,
}: LaporanPesertaUjiProps) {
  const {
    data,
    pagination,
    loading,
    error,
    page,
    search,
    tahun,
    skemaId,
    setPage,
    handleSearch,
    handleTahun,
    handleSkemaId,
  } = usePesertaUjiReport(filterTetap);

  const jumlahKolom = 4 + kolomTambahan.length;

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Training", href: "/training" },
        { label: judulHalaman },
      ]}
    >
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-zinc-100 flex items-center gap-2">
          <div
            className={`w-6 h-6 rounded-lg flex items-center justify-center ${warnaIkon}`}
          >
            {ikon}
          </div>
          <span className="font-bold text-zinc-800 text-sm">{judulKartu}</span>
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
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/60">
                <th className={`${KELAS_TH} w-10`}>No</th>
                <th className={`${KELAS_TH} w-40`}>Nama</th>
                <th className={`${KELAS_TH} w-40`}>Instansi</th>
                <th className={`${KELAS_TH} w-24`}>Skema</th>
                {kolomTambahan.map((k) => (
                  <th key={k.label} className={`${KELAS_TH} ${k.lebar ?? ""}`}>
                    {k.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={jumlahKolom}
                    className="px-4 py-12 text-center text-xs text-zinc-400"
                  >
                    Memuat data...
                  </td>
                </tr>
              ) : error ? (
                // Dulu galat diam-diam tampil sebagai "tidak ada data", jadi
                // gangguan jaringan tidak bisa dibedakan dari daftar kosong.
                <tr>
                  <td
                    colSpan={jumlahKolom}
                    className="px-4 py-12 text-center text-xs text-red-500"
                  >
                    {error}
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td
                    colSpan={jumlahKolom}
                    className="px-4 py-12 text-center text-xs text-zinc-400"
                  >
                    Tidak ada data tersedia.
                  </td>
                </tr>
              ) : (
                data.map((row, i) => (
                  <tr
                    key={row.id}
                    className="border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-xs text-zinc-400 align-top">
                      {(page - 1) * pagination.limit + i + 1}
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-700 font-medium align-top whitespace-nowrap">
                      {row.nama}
                    </td>
                    <td className={`${KELAS_TD} max-w-[180px] truncate`}>
                      <Dash>{row.instansi}</Dash>
                    </td>
                    <td className={`${KELAS_TD} whitespace-nowrap`}>
                      {row.skema.kode}
                    </td>
                    {kolomTambahan.map((k) => (
                      <td
                        key={k.label}
                        className={`${KELAS_TD} ${k.kelasSel ?? ""}`}
                      >
                        {k.render(row)}
                      </td>
                    ))}
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
