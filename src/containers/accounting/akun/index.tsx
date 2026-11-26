"use client";

import React from "react";
import { Wallet, Plus, Pencil, Power } from "lucide-react";
import AppLayout from "@/components/app-layout";
import Notification from "@/components/base/notifications";
import TablePagination from "@/components/base/table-pagination";
import { JENIS_AKUN_OPTIONS, type JenisAkun } from "@/lib/services/accounting.service";
import { AkunModal } from "./components/akun-modal";
import { useAkunManage } from "./manage";

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

function formatRupiah(val: string) {
  const num = Number(val);
  if (isNaN(num)) return "-";
  return `Rp${num.toLocaleString("id-ID")}`;
}

export default function MasterAkunPage() {
  const m = useAkunManage();

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Accounting", href: "/accounting" },
        { label: "Master Akun" },
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
              <Wallet className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <span className="font-bold text-zinc-800 text-sm">Master Akun</span>
          </div>

          <select
            value={m.jenisFilter}
            onChange={(e) => m.handleJenisFilter(e.target.value as JenisAkun | "")}
            className="px-2.5 py-1.5 border border-zinc-200 rounded-lg text-[11px] text-zinc-600 outline-none focus:border-emerald-300 transition-all bg-white"
          >
            <option value="">Semua Jenis</option>
            {JENIS_AKUN_OPTIONS.map((j) => (
              <option key={j} value={j}>
                {JENIS_LABEL[j]}
              </option>
            ))}
          </select>

          <select
            value={m.statusFilter}
            onChange={(e) =>
              m.handleStatusFilter(e.target.value as "" | "true" | "false")
            }
            className="px-2.5 py-1.5 border border-zinc-200 rounded-lg text-[11px] text-zinc-600 outline-none focus:border-emerald-300 transition-all bg-white"
          >
            <option value="">Semua Status</option>
            <option value="true">Aktif</option>
            <option value="false">Nonaktif</option>
          </select>

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
              placeholder="Cari nama atau kode akun..."
              value={m.search}
              onChange={(e) => m.handleSearch(e.target.value)}
              className="w-56 pl-7 pr-3 py-1.5 border border-zinc-200 rounded-lg text-xs text-zinc-700 outline-none focus:border-emerald-300 transition-all"
            />
          </div>

          <button
            onClick={m.openAdd}
            className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition-colors whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            Tambah Akun
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/60">
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-10">No</th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-28">Kode</th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left">Nama Akun</th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-28">Jenis</th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-right w-36">Saldo Awal</th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-center w-20">Status</th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-center w-24">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {m.loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-xs text-zinc-400">
                    Memuat data...
                  </td>
                </tr>
              ) : m.data.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-xs text-zinc-400">
                    Tidak ada data tersedia.
                  </td>
                </tr>
              ) : (
                m.data.map((row, i) => (
                  <tr key={row.id} className="border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors">
                    <td className="px-4 py-3 text-xs text-zinc-400 align-top">
                      {(m.page - 1) * 10 + i + 1}
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-600 align-top whitespace-nowrap">
                      {row.kode ?? <span className="text-zinc-300">-</span>}
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-700 font-medium align-top">
                      {row.nama}
                    </td>
                    <td className="px-4 py-3 align-top">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold whitespace-nowrap ${JENIS_BADGE[row.jenis]}`}
                      >
                        {JENIS_LABEL[row.jenis]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-600 text-right align-top whitespace-nowrap">
                      {formatRupiah(row.saldoAwal)}
                    </td>
                    <td className="px-4 py-3 text-center align-top">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                          row.isActive
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-zinc-100 text-zinc-500"
                        }`}
                      >
                        {row.isActive ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => m.openEdit(row)}
                          title="Edit"
                          className="text-zinc-400 hover:text-emerald-600 transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => m.toggleRowStatus(row)}
                          title={row.isActive ? "Nonaktifkan" : "Aktifkan"}
                          className={`transition-colors ${
                            row.isActive
                              ? "text-zinc-400 hover:text-red-500"
                              : "text-zinc-400 hover:text-emerald-600"
                          }`}
                        >
                          <Power className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <TablePagination
          page={m.page}
          limit={10}
          total={m.pagination.total}
          totalPages={m.pagination.totalPages}
          onPageChange={m.handlePageChange}
        />
      </div>

      <AkunModal
        open={m.modalOpen}
        onClose={m.closeModal}
        onSubmit={m.save}
        initialData={m.editTarget}
        isLoading={m.isSaving}
      />
    </AppLayout>
  );
}
