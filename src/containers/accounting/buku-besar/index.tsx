"use client";

import React from "react";
import { BookOpenCheck, X, FileDown, Loader2, Search } from "lucide-react";
import AppLayout from "@/components/app-layout";
import Notification from "@/components/base/notifications";
import { JENIS_AKUN_OPTIONS, type JenisAkun } from "@/lib/services/accounting.service";
import { useBukuBesarManage } from "./manage";

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

export default function BukuBesarContainer() {
  const m = useBukuBesarManage();

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Accounting", href: "/accounting" },
        { label: "Buku Besar" },
      ]}
    >
      {m.notif ? (
        <Notification
          key={m.notif.key}
          message={m.notif.message}
          type={m.notif.type}
          onClose={() => m.setNotif(null)}
        />
      ) : null}

      {m.error && <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-xs text-red-600">{m.error.message}</div>}

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="px-5 py-3 border-b border-zinc-100 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center">
              <BookOpenCheck className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <span className="font-bold text-zinc-800 text-sm">Buku Besar</span>
          </div>

          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-300" />
            <input
              type="text"
              placeholder="Cari nama atau kode akun..."
              value={m.search}
              onChange={(e) => m.onSearch(e.target.value)}
              className="w-56 pl-7 pr-3 py-1.5 border border-zinc-200 rounded-lg text-[11px] text-zinc-700 outline-none focus:border-emerald-300 transition-all"
            />
          </div>

          <select
            value={m.jenisFilter}
            onChange={(e) => m.onFilterJenis(e.target.value as JenisAkun | "")}
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
              value={m.startDate}
              onChange={(e) => m.setStartDate(e.target.value)}
              className="px-2.5 py-1.5 border border-zinc-200 rounded-lg text-[11px] text-zinc-600 outline-none focus:border-emerald-300 transition-all"
            />
            <span className="text-[11px] text-zinc-400">s/d</span>
            <input
              type="date"
              value={m.endDate}
              onChange={(e) => m.setEndDate(e.target.value)}
              className="px-2.5 py-1.5 border border-zinc-200 rounded-lg text-[11px] text-zinc-600 outline-none focus:border-emerald-300 transition-all"
            />
            <button
              onClick={m.onFilterTanggal}
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
              {m.loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-xs text-zinc-400">
                    Memuat data...
                  </td>
                </tr>
              ) : m.data && m.data.length > 0 ? (
                m.data.map((item) => {
                  return (
                    <tr
                      key={item.akun.id}
                      onClick={() => m.onRowClick(item.akun.id)}
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

      {m.detailOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.35)" }}
          onClick={m.onCloseDetailModal}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
              <p className="font-bold text-zinc-800 text-sm">
                {m.detail ? `${m.detail.akun.kode ? m.detail.akun.kode + " - " : ""}${m.detail.akun.nama}` : "Detail Akun"}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={m.onExportExcel}
                  disabled={m.exporting || !m.detail}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border border-zinc-200 text-zinc-600 hover:bg-zinc-50 transition-colors disabled:opacity-50 whitespace-nowrap"
                >
                  {m.exporting ? <Loader2 className="w-3 h-3 animate-spin" /> : <FileDown className="w-3 h-3" />}
                  Export Excel
                </button>
                <button
                  onClick={m.onCloseDetailModal}
                  className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-zinc-100 transition-colors text-zinc-400 hover:text-zinc-600 shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="px-6 py-4">
              {m.detailError ? (
                <p className="py-8 text-center text-xs text-red-500">{m.detailError.message}</p>
              ) : m.detailLoading ? (
                <p className="py-8 text-center text-xs text-zinc-400">Memuat data...</p>
              ) : m.detail ? (
                <>
                  <div className="mb-3 flex justify-between text-xs text-zinc-500">
                    <span>Saldo Awal: <span className="font-semibold text-zinc-700">{formatRupiah(m.detail.saldoAwal)}</span></span>
                    <span>Saldo Akhir: <span className="font-semibold text-zinc-700">{formatRupiah(m.detail.saldoAkhir)}</span></span>
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
                            {formatRupiah(m.detail.saldoAwal)}
                          </td>
                        </tr>
                        {m.detail.rows && m.detail.rows.length > 0 ? (
                          m.detail.rows.map((row) => {
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
