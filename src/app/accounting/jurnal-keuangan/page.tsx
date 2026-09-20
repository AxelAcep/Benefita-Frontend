"use client";

import React, { useEffect, useState } from "react";
import { BookText, Plus, Search } from "lucide-react";
import AppLayout from "@/components/app-layout";
import Notification from "@/components/base/notifications";
import { useBoolean } from "@/hooks/use-boolean";
import { useJurnal, useJurnalMutation } from "@/hooks/use-jurnal";
import { getAkunList, type AkunItem } from "@/lib/services/accounting.service";
import { JurnalModal } from "@/components/finance/JurnalModal";
import { useRole } from "@/hooks/use-role";

const PAGE_SIZE = 10;

interface NotifState {
  message: string;
  type: "success" | "error";
  key: number;
}

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

export default function JurnalKeuanganPage() {
  const { isFinance } = useRole();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data, pagination, loading, refetch } = useJurnal({ page, limit: PAGE_SIZE });
  const { loading: saving, create } = useJurnalMutation();
  const { value: modalOpen, onTrue: onOpenModal, onFalse: onCloseModal } = useBoolean(false);

  const [akunList, setAkunList] = useState<AkunItem[]>([]);
  const [notif, setNotif] = useState<NotifState | null>(null);

  function showNotif(message: string, type: "success" | "error") {
    setNotif({ message, type, key: Date.now() });
  }

  useEffect(() => {
    async function loadAkun() {
      try {
        const res = await getAkunList({ limit: 1000, isActive: true });
        setAkunList(res.data);
      } catch {
        // silent — akun dropdown akan kosong, ditangani via validasi form
      }
    }
    loadAkun();
  }, []);

  function onSearch(v: string) {
    setSearch(v);
    setPage(1);
    refetch({ page: 1, search: v || undefined });
  }

  function onChangePage(newPage: number) {
    setPage(newPage);
    refetch({ page: newPage });
  }

  async function onSubmitJurnal(payload: Parameters<typeof create>[0]) {
    await create(payload);
    showNotif("Jurnal berhasil disimpan.", "success");
    onCloseModal();
    setPage(1);
    refetch({ page: 1 });
  }

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Accounting", href: "/accounting" },
        { label: "Jurnal Keuangan" },
      ]}
    >
      {notif && (
        <Notification
          key={notif.key}
          message={notif.message}
          type={notif.type}
          onClose={() => setNotif(null)}
        />
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
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              className="w-64 pl-7 pr-3 py-1.5 border border-zinc-200 rounded-lg text-xs text-zinc-700 outline-none focus:border-emerald-300 transition-all"
            />
          </div>

          {isFinance ? (
            <button
              onClick={onOpenModal}
              className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition-colors whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              Tambah Jurnal
            </button>
          ) : null}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/60">
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left">No. Jurnal</th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-28">Tanggal</th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left">Deskripsi</th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-32">Sumber</th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-center w-24">Status</th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-right w-36">Nominal</th>
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
                    <tr key={item.id} className="border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors">
                      <td className="px-4 py-3 text-xs text-zinc-700 font-medium align-top whitespace-nowrap">
                        {item.noJurnal}
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-600 align-top whitespace-nowrap">
                        {formatTanggal(item.tanggal)}
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-600 align-top">{item.deskripsi}</td>
                      <td className="px-4 py-3 text-xs text-zinc-400 align-top">{item.sumber}</td>
                      <td className="px-4 py-3 text-center align-top">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold whitespace-nowrap ${
                            item.status === "CLOSED"
                              ? "bg-zinc-100 text-zinc-500"
                              : "bg-emerald-50 text-emerald-600"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-700 font-semibold text-right align-top whitespace-nowrap">
                        {formatRupiah(item.totalNominal)}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-xs text-zinc-400">
                    Belum ada data jurnal.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 ? (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-5 py-3 border-t border-zinc-100">
            <p className="text-[11px] text-zinc-400">
              Halaman <span className="font-semibold text-zinc-600">{pagination.page}</span> dari{" "}
              <span className="font-semibold text-zinc-600">{pagination.totalPages}</span>
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => onChangePage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 text-[11px] border border-zinc-200 rounded-lg text-zinc-500 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium"
              >
                ‹ Sebelumnya
              </button>
              <button
                onClick={() => onChangePage(Math.min(pagination.totalPages, page + 1))}
                disabled={page === pagination.totalPages}
                className="px-3 py-1.5 text-[11px] border border-zinc-200 rounded-lg text-zinc-500 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Selanjutnya ›
              </button>
            </div>
          </div>
        ) : null}
      </div>

      <JurnalModal
        open={modalOpen}
        akunList={akunList}
        saving={saving}
        onClose={onCloseModal}
        onSubmit={onSubmitJurnal}
      />
    </AppLayout>
  );
}
