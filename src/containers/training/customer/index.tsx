"use client";

import React from "react";
import { BookOpen, X } from "lucide-react";
import AppLayout from "@/components/app-layout";
import SearchInput from "@/components/base/search-input";
import { TablePagination } from "@/components/base/table-pagination";
import {
  BIDANG_AKUN,
  tanggalAkun,
  type BidangAkun,
} from "@/lib/types/customer-training";
import { UKURAN_HALAMAN, useCustomerManage } from "./manage";

// Warna per kolom akun. Inline style supaya tidak terpangkas Tailwind.
const GAYA_SEL: Record<BidangAkun, React.CSSProperties> = {
  env: { backgroundColor: "#dbeafe", color: "#1d4ed8" },
  csr: { backgroundColor: "#d1fae5", color: "#065f46" },
  tsm: { backgroundColor: "#fce7f3", color: "#9d174d" },
  epm: { backgroundColor: "#fef9c3", color: "#854d0e" },
};

const GAYA_HEADER: Record<BidangAkun, React.CSSProperties> = {
  env: { backgroundColor: "#bfdbfe", color: "#1d4ed8" },
  csr: { backgroundColor: "#a7f3d0", color: "#065f46" },
  tsm: { backgroundColor: "#fbcfe8", color: "#9d174d" },
  epm: { backgroundColor: "#fde68a", color: "#854d0e" },
};

const TH = "px-4 py-2 text-[10px] font-semibold text-zinc-400";
const JUMLAH_KOLOM = 6 + BIDANG_AKUN.length;
/** Sisanya diringkas jadi "+n" supaya lebar kolom tidak meledak. */
const BATAS_TAG = 6;

export default function CustomerTrainingContainer() {
  const m = useCustomerManage();

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Training", href: "/training" },
        { label: "Kebutuhan Training per Customer" },
      ]}
    >
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-zinc-100 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center">
              <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <span className="font-bold text-zinc-800 text-sm">
              Kebutuhan Training per Customer
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-zinc-500 font-medium">Kode</span>
            <select
              value={m.draftKode}
              onChange={(e) => m.setDraftKode(e.target.value)}
              aria-label="Filter kode training"
              className="h-9 w-40 pl-2 pr-6 border border-zinc-200 rounded-lg text-xs text-zinc-600 outline-none focus:border-emerald-300 bg-white cursor-pointer"
            >
              <option value="">Semua</option>
              {m.kodeOptions.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
            <button
              onClick={m.terapkanFilter}
              className="h-8 px-3 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition-colors"
            >
              Terapkan
            </button>
            {m.kodeAktif && (
              <button
                onClick={m.resetFilter}
                className="h-8 px-3 rounded-lg text-xs font-semibold border border-zinc-200 text-zinc-600 hover:bg-zinc-50 transition-colors inline-flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                Reset
              </button>
            )}
          </div>

          <div className="ml-auto w-full sm:w-56">
            <SearchInput
              value={m.search}
              onChange={m.setSearch}
              placeholder="Cari perusahaan, no induk, lini bisnis..."
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px]">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/60">
                <th className={`${TH} text-left w-10`}>No</th>
                <th className={`${TH} text-left w-28`}>No. Induk</th>
                <th className={`${TH} text-left`}>Perusahaan/Instansi</th>
                <th className={`${TH} text-center w-24`}>Total Peserta</th>
                <th
                  colSpan={BIDANG_AKUN.length}
                  className="py-2 text-[10px] font-semibold text-zinc-400 text-center"
                >
                  Akun
                </th>
                <th className={`${TH} text-left`}>Line of Business</th>
                <th className={`${TH} text-left w-44`}>Kebutuhan Training</th>
              </tr>
              <tr className="border-b border-zinc-100">
                <th colSpan={4} />
                {BIDANG_AKUN.map((col) => (
                  <th
                    key={col}
                    style={GAYA_HEADER[col]}
                    className="px-3 py-1.5 text-[10px] font-bold text-center w-16"
                  >
                    {col.toUpperCase()}
                  </th>
                ))}
                <th colSpan={2} />
              </tr>
            </thead>

            <tbody>
              {m.loading ? (
                <tr>
                  <td
                    colSpan={JUMLAH_KOLOM}
                    className="px-4 py-12 text-center text-xs text-zinc-400"
                  >
                    Memuat data...
                  </td>
                </tr>
              ) : m.error ? (
                <tr>
                  <td
                    colSpan={JUMLAH_KOLOM}
                    className="px-4 py-12 text-center text-xs text-red-500"
                  >
                    {m.error}
                  </td>
                </tr>
              ) : m.data.length === 0 ? (
                <tr>
                  <td
                    colSpan={JUMLAH_KOLOM}
                    className="px-4 py-12 text-center text-xs text-zinc-400"
                  >
                    Tidak ada data tersedia.
                  </td>
                </tr>
              ) : (
                m.data.map((row, i) => (
                  <tr
                    key={row.noInduk}
                    className="border-b border-zinc-50 align-top"
                  >
                    <td className="px-4 py-3 text-xs text-zinc-400">
                      {(m.page - 1) * UKURAN_HALAMAN + i + 1}
                    </td>
                    <td className="px-4 py-3 text-xs text-emerald-600 font-semibold whitespace-nowrap">
                      {row.noInduk}
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-600">
                      {row.perusahaan ?? "-"}
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-600 text-center">
                      {row.totalPeserta}
                    </td>

                    {BIDANG_AKUN.map((col) => {
                      const entri = row.akun[col];
                      const tgl = tanggalAkun(entri?.tanggal ?? null);
                      return (
                        <td
                          key={col}
                          style={GAYA_SEL[col]}
                          // Tanggal entri dan catatan kontak terakhir
                          // ditaruh di tooltip supaya kolom tetap sempit.
                          title={
                            [
                              tgl ? `Tanggal: ${tgl}` : null,
                              row.kontakTerakhir[col]
                                ? `Kontak terakhir: ${row.kontakTerakhir[col]}`
                                : null,
                            ]
                              .filter(Boolean)
                              .join("\n") || undefined
                          }
                          className="px-3 py-3 text-center text-xs font-semibold w-16"
                        >
                          {entri?.kode ?? "-"}
                        </td>
                      );
                    })}

                    <td className="px-4 py-3 text-xs text-zinc-600">
                      {row.liniBisnis?.nama ?? row.lineOfBusiness ?? "-"}
                    </td>
                    <td className="px-4 py-3">
                      {row.kebutuhanTraining.length === 0 ? (
                        <span className="text-xs text-zinc-300">-</span>
                      ) : (
                        <div
                          className="flex flex-wrap items-center gap-0.5"
                          title={row.kebutuhanTraining.join(", ")}
                        >
                          {row.kebutuhanTraining
                            .slice(0, BATAS_TAG)
                            .map((tag) => (
                              <span
                                key={tag}
                                className="px-1 py-0.5 rounded text-[8px] font-semibold bg-zinc-100 text-zinc-500 whitespace-nowrap"
                              >
                                {tag}
                              </span>
                            ))}
                          {row.kebutuhanTraining.length > BATAS_TAG && (
                            <span className="text-[8px] text-zinc-400">
                              +{row.kebutuhanTraining.length - BATAS_TAG}
                            </span>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <TablePagination
          page={m.page}
          limit={m.limit}
          total={m.total}
          totalPages={m.totalPages}
          onPageChange={m.setPage}
        />
      </div>
    </AppLayout>
  );
}
