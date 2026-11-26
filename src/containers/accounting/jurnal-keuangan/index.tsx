"use client";

import React from "react";
import { BookText, Plus, Pencil, Search, ChevronDown, ChevronRight } from "lucide-react";
import AppLayout from "@/components/app-layout";
import Notification from "@/components/base/notifications";
import { JurnalModal } from "./components/jurnal-modal";
import { useJurnalKeuanganManage } from "./manage";
import type { JurnalTransaksiItem } from "@/lib/services/jurnal-keuangan.service";

function formatRupiah(val: string) {
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

function akunLabel(akun: { kode: string | null; nama: string }) {
  return akun.kode ? `${akun.kode} - ${akun.nama}` : akun.nama;
}

// Ringkasan "Dari Akun -> Ke Akun" buat entry 2 baris (Simple). Entry
// Advanced (3+ baris) gak punya satu pasangan tunggal yang mewakili,
// jadi cukup dikasih jumlah akun — detail lengkapnya di baris expand.
function ringkasanAkun(item: JurnalTransaksiItem) {
  if (!item.baris || item.baris.length !== 2) {
    return `${item.baris?.length ?? 0} akun terlibat`;
  }
  const kredit = item.baris.find((b) => Number(b.kredit) > 0);
  const debit = item.baris.find((b) => Number(b.debit) > 0);
  if (!kredit || !debit) return `${item.baris.length} akun terlibat`;
  return `${akunLabel(kredit.akun)} → ${akunLabel(debit.akun)}`;
}

// Harus sama dengan SUMBER_BISA_DIUBAH di
// Benefita-Backend/src/controllers/jurnal.controller.js. Jurnal hasil import
// Excel diperlakukan sama persis dengan jurnal yang diinput manual.
// REQUEST_KEUANGAN gak masuk karena punya alur approval sendiri.
const SUMBER_BISA_DIEDIT = ["MANUAL", "IMPORT_EXCEL"];

export default function JurnalKeuanganPage() {
  const m = useJurnalKeuanganManage();

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Accounting", href: "/accounting" },
        { label: "Jurnal Keuangan" },
      ]}
    >
      {m.notif && (
        <Notification
          key={m.notif.key}
          message={m.notif.message}
          type={m.notif.type}
          onClose={() => m.setNotif(null)}
        />
      )}
      {m.error && (
        <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-xs text-red-600">
          {m.error.message}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="px-5 py-3 border-b border-zinc-100 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center">
              <BookText className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <span className="font-bold text-zinc-800 text-sm">Jurnal Keuangan</span>
          </div>

          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-300" />
            <input
              type="text"
              placeholder="Cari deskripsi atau no. jurnal..."
              value={m.search}
              onChange={(e) => m.onSearch(e.target.value)}
              className="w-64 pl-7 pr-3 py-1.5 border border-zinc-200 rounded-lg text-xs text-zinc-700 outline-none focus:border-emerald-300 transition-all"
            />
          </div>

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
              onClick={m.filterDates}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-zinc-200 text-zinc-600 hover:bg-zinc-50 transition-colors whitespace-nowrap"
            >
              Terapkan
            </button>
          </div>

          {m.isFinance ? (
            <button
              onClick={m.openAdd}
              className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition-colors whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              Tambah Jurnal
            </button>
          ) : null}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/60">
                <th className="px-2 py-2 w-8"></th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left">No. Jurnal</th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-24">Tanggal</th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left">Deskripsi</th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-56">Dari Akun → Ke Akun</th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-28">Sumber</th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-right w-32">Nominal</th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-center w-16">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {m.loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-xs text-zinc-400">
                    Memuat data...
                  </td>
                </tr>
              ) : m.data && m.data.length > 0 ? (
                m.data.map((item) => {
                  const isExpanded = m.expandedId === item.id;
                  return (
                    <React.Fragment key={item.id}>
                      <tr
                        onClick={() => m.toggleExpand(item.id)}
                        className="border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors cursor-pointer"
                      >
                        <td className="px-2 py-3 align-top text-zinc-400">
                          {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                        </td>
                        <td className="px-4 py-3 text-xs text-zinc-700 font-medium align-top whitespace-nowrap">
                          {item.noJurnal}
                        </td>
                        <td className="px-4 py-3 text-xs text-zinc-600 align-top whitespace-nowrap">
                          {formatTanggal(item.tanggal)}
                        </td>
                        <td className="px-4 py-3 text-xs text-zinc-600 align-top">{item.deskripsi}</td>
                        <td className="px-4 py-3 text-xs text-zinc-600 align-top">{ringkasanAkun(item)}</td>
                        <td className="px-4 py-3 text-xs text-zinc-400 align-top">{item.sumber}</td>
                        <td className="px-4 py-3 text-xs text-zinc-700 font-semibold text-right align-top whitespace-nowrap">
                          {formatRupiah(item.totalNominal)}
                        </td>
                        <td className="px-4 py-3 text-center align-top">
                          {m.isFinance && SUMBER_BISA_DIEDIT.includes(item.sumber) ? (
                            <button
                              onClick={(e) => m.openEdit(item, e)}
                              title="Edit"
                              className="text-zinc-400 hover:text-emerald-600 transition-colors"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                          ) : null}
                        </td>
                      </tr>
                      {isExpanded ? (
                        <tr className="border-b border-zinc-100 bg-zinc-50/40">
                          <td colSpan={8} className="px-4 py-3">
                            <table className="w-full max-w-2xl ml-8">
                              <thead>
                                <tr className="text-[10px] font-semibold text-zinc-400">
                                  <th className="text-left pb-1">Akun</th>
                                  <th className="text-right pb-1 w-32">Debit</th>
                                  <th className="text-right pb-1 w-32">Kredit</th>
                                </tr>
                              </thead>
                              <tbody>
                                {item.baris && item.baris.length > 0
                                  ? item.baris.map((b) => {
                                      return (
                                        <tr key={b.id} className="text-xs">
                                          <td className="py-1 text-zinc-700">{akunLabel(b.akun)}</td>
                                          <td className="py-1 text-right text-zinc-600">
                                            {Number(b.debit) > 0 ? formatRupiah(b.debit) : "-"}
                                          </td>
                                          <td className="py-1 text-right text-zinc-600">
                                            {Number(b.kredit) > 0 ? formatRupiah(b.kredit) : "-"}
                                          </td>
                                        </tr>
                                      );
                                    })
                                  : null}
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      ) : null}
                    </React.Fragment>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-xs text-zinc-400">
                    Belum ada data jurnal.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {m.pagination.totalPages > 1 ? (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-5 py-3 border-t border-zinc-100">
            <p className="text-[11px] text-zinc-400">
              Halaman <span className="font-semibold text-zinc-600">{m.pagination.page}</span> dari{" "}
              <span className="font-semibold text-zinc-600">{m.pagination.totalPages}</span>
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => m.changePage(Math.max(1, m.page - 1))}
                disabled={m.page === 1}
                className="px-3 py-1.5 text-[11px] border border-zinc-200 rounded-lg text-zinc-500 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium"
              >
                ‹ Sebelumnya
              </button>
              <button
                onClick={() => m.changePage(Math.min(m.pagination.totalPages, m.page + 1))}
                disabled={m.page === m.pagination.totalPages}
                className="px-3 py-1.5 text-[11px] border border-zinc-200 rounded-lg text-zinc-500 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Selanjutnya ›
              </button>
            </div>
          </div>
        ) : null}
      </div>

      <JurnalModal
        open={m.modalOpen}
        akunList={m.akunList}
        saving={m.saving}
        editData={m.editTarget}
        onClose={m.closeModalAndReset}
        onSubmit={m.submitJurnal}
      />
    </AppLayout>
  );
}
