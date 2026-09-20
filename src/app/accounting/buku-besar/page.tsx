"use client";

import React, { useEffect, useState } from "react";
import { BookOpenCheck, X } from "lucide-react";
import AppLayout from "@/components/app-layout";
import { useBoolean } from "@/hooks/use-boolean";
import { useBukuBesarRingkasan, useBukuBesarAkun } from "@/hooks/use-buku-besar";
import { JENIS_AKUN_OPTIONS, type JenisAkun } from "@/lib/services/accounting.service";

const JENIS_LABEL: Record<JenisAkun, string> = {
  ASET: "Aset",
  LIABILITAS: "Liabilitas",
  MODAL: "Modal",
  PENDAPATAN: "Pendapatan",
  BEBAN: "Beban",
};

const JENIS_BADGE: Record<JenisAkun, string> = {
  ASET: "bg-blue-50 text-blue-600",
  LIABILITAS: "bg-orange-50 text-orange-600",
  MODAL: "bg-purple-50 text-purple-600",
  PENDAPATAN: "bg-emerald-50 text-emerald-600",
  BEBAN: "bg-red-50 text-red-600",
};

function formatRupiah(val: number | string) {
  const num = Number(val);
  if (isNaN(num)) return "-";
  return `Rp${num.toLocaleString("id-ID")}`;
}

function formatTanggal(val: string) {
  return new Date(val).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function awalBulanIni() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10);
}

function hariIni() {
  return new Date().toISOString().slice(0, 10);
}

export default function BukuBesarPage() {
  const [jenisFilter, setJenisFilter] = useState<JenisAkun | "">("");
  const [startDate, setStartDate] = useState(awalBulanIni());
  const [endDate, setEndDate] = useState(hariIni());
  const { data, loading, refetch } = useBukuBesarRingkasan({ startDate, endDate });
  const {
    data: detail,
    loading: detailLoading,
    fetchDetail,
    reset: resetDetail,
  } = useBukuBesarAkun();

  const { value: detailOpen, onTrue: onOpenDetail, onFalse: onCloseDetail } = useBoolean(false);

  function onFilterJenis(value: JenisAkun | "") {
    setJenisFilter(value);
    refetch({ jenis: value || undefined, startDate, endDate });
  }

  function onFilterTanggal() {
    refetch({ jenis: jenisFilter || undefined, startDate, endDate });
  }

  function onRowClick(akunId: number) {
    onOpenDetail();
    fetchDetail(akunId, { startDate, endDate });
  }

  function onCloseDetailModal() {
    onCloseDetail();
    resetDetail();
  }

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Accounting", href: "/accounting" },
        { label: "Buku Besar" },
      ]}
    >
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="px-5 py-3 border-b border-zinc-100 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center">
              <BookOpenCheck className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <span className="font-bold text-zinc-800 text-sm">Buku Besar</span>
          </div>

          <select
            value={jenisFilter}
            onChange={(e) => onFilterJenis(e.target.value as JenisAkun | "")}
            className="px-2.5 py-1.5 border border-zinc-200 rounded-lg text-[11px] text-zinc-600 outline-none focus:border-emerald-300 transition-all bg-white"
          >
            <option value="">Semua Jenis</option>
            {JENIS_AKUN_OPTIONS && JENIS_AKUN_OPTIONS.length > 0
              ? JENIS_AKUN_OPTIONS.map((j) => {
                  return (
                    <option key={j} value={j}>
                      {JENIS_LABEL[j]}
                    </option>
                  );
                })
              : null}
          </select>

          <div className="flex items-center gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-2.5 py-1.5 border border-zinc-200 rounded-lg text-[11px] text-zinc-600 outline-none focus:border-emerald-300 transition-all"
            />
            <span className="text-[11px] text-zinc-400">s/d</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-2.5 py-1.5 border border-zinc-200 rounded-lg text-[11px] text-zinc-600 outline-none focus:border-emerald-300 transition-all"
            />
            <button
              onClick={onFilterTanggal}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition-colors whitespace-nowrap"
            >
              Terapkan
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/60">
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-24">Kode</th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left">Nama Akun</th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-28">Jenis</th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-right w-36">Total Debit</th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-right w-36">Total Kredit</th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-right w-36">Saldo Akhir</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-xs text-zinc-400">
                    Memuat data...
                  </td>
                </tr>
              ) : data && data.length > 0 ? (
                data.map((item) => {
                  return (
                    <tr
                      key={item.akun.id}
                      onClick={() => onRowClick(item.akun.id)}
                      className="border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors cursor-pointer"
                    >
                      <td className="px-4 py-3 text-xs text-zinc-600 align-top whitespace-nowrap">
                        {item.akun.kode ?? <span className="text-zinc-300">-</span>}
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-700 font-medium align-top">{item.akun.nama}</td>
                      <td className="px-4 py-3 align-top">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold whitespace-nowrap ${JENIS_BADGE[item.akun.jenis]}`}
                        >
                          {JENIS_LABEL[item.akun.jenis]}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-600 text-right align-top whitespace-nowrap">
                        {formatRupiah(item.totalDebit)}
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-600 text-right align-top whitespace-nowrap">
                        {formatRupiah(item.totalKredit)}
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-700 font-semibold text-right align-top whitespace-nowrap">
                        {formatRupiah(item.saldoAkhir)}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-xs text-zinc-400">
                    Belum ada data akun di rentang tanggal ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {detailOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.35)" }}
          onClick={onCloseDetailModal}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
              <p className="font-bold text-zinc-800 text-sm">
                {detail ? `${detail.akun.kode ? detail.akun.kode + " - " : ""}${detail.akun.nama}` : "Detail Akun"}
              </p>
              <button
                onClick={onCloseDetailModal}
                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-zinc-100 transition-colors text-zinc-400 hover:text-zinc-600 shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="px-6 py-4">
              {detailLoading ? (
                <p className="py-8 text-center text-xs text-zinc-400">Memuat data...</p>
              ) : detail ? (
                <>
                  <div className="mb-3 flex justify-between text-xs text-zinc-500">
                    <span>Saldo Awal: <span className="font-semibold text-zinc-700">{formatRupiah(detail.saldoAwal)}</span></span>
                    <span>Saldo Akhir: <span className="font-semibold text-zinc-700">{formatRupiah(detail.saldoAkhir)}</span></span>
                  </div>
                  <div className="overflow-x-auto rounded-xl border border-zinc-100">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-zinc-100 bg-zinc-50/60">
                          <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left">No. Jurnal</th>
                          <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left">Tanggal</th>
                          <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left">Keterangan</th>
                          <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-right">Debit</th>
                          <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-right">Kredit</th>
                          <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-right">Saldo</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-zinc-50 bg-zinc-50/40">
                          <td className="px-3 py-2 text-xs text-zinc-400 italic" colSpan={5}>
                            Beginning Balance
                          </td>
                          <td className="px-3 py-2 text-xs font-medium text-zinc-700 text-right whitespace-nowrap">
                            {formatRupiah(detail.saldoAwal)}
                          </td>
                        </tr>
                        {detail.rows && detail.rows.length > 0 ? (
                          detail.rows.map((row) => {
                            return (
                              <tr key={row.transaksiId + row.noJurnal} className="border-b border-zinc-50">
                                <td className="px-3 py-2 text-xs text-zinc-600 whitespace-nowrap">{row.noJurnal}</td>
                                <td className="px-3 py-2 text-xs text-zinc-600 whitespace-nowrap">{formatTanggal(row.tanggal)}</td>
                                <td className="px-3 py-2 text-xs text-zinc-600">{row.keterangan}</td>
                                <td className="px-3 py-2 text-xs text-zinc-600 text-right whitespace-nowrap">{formatRupiah(row.debit)}</td>
                                <td className="px-3 py-2 text-xs text-zinc-600 text-right whitespace-nowrap">{formatRupiah(row.kredit)}</td>
                                <td className="px-3 py-2 text-xs text-zinc-700 font-medium text-right whitespace-nowrap">
                                  {formatRupiah(row.saldo)}
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={6} className="px-3 py-8 text-center text-xs text-zinc-400">
                              Belum ada mutasi di rentang tanggal ini.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </AppLayout>
  );
}
