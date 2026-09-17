"use client";

import React, { useEffect, useState } from "react";
import { BookText, Plus } from "lucide-react";
import AppLayout from "@/components/app-layout";
import Notification from "@/components/base/notifications";
import { useBoolean } from "@/hooks/use-boolean";
import { useJurnal } from "@/hooks/use-jurnal";
import { useJurnalMutation } from "@/hooks/use-jurnal";
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

  function onSearch() {
    setPage(1);
    refetch({ page: 1, search: search || undefined });
  }

  function onChangePage(newPage: number) {
    setPage(newPage);
    refetch({ page: newPage });
  }

  async function onSubmitJurnal(payload: Parameters<typeof create>[0]) {
    await create(payload);
    showNotif("Jurnal berhasil disimpan.", "success");
    onCloseModal();
    refetch({ page: 1 });
    setPage(1);
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-xl font-semibold text-gray-800">
              <BookText size={22} /> Jurnal Keuangan
            </h1>
            <p className="text-sm text-gray-500">
              Pencatatan jurnal double-entry (debit = kredit) untuk seluruh transaksi keuangan.
            </p>
          </div>
          {isFinance ? (
            <button
              onClick={onOpenModal}
              className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Plus size={16} /> Tambah Jurnal
            </button>
          ) : null}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
            placeholder="Cari deskripsi atau no. jurnal..."
            className="w-full max-w-sm rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
          <button
            onClick={onSearch}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600"
          >
            Cari
          </button>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs font-medium uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">No. Jurnal</th>
                <th className="px-4 py-3">Tanggal</th>
                <th className="px-4 py-3">Deskripsi</th>
                <th className="px-4 py-3">Sumber</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Nominal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-gray-400">
                    Memuat data...
                  </td>
                </tr>
              ) : data && data.length > 0 ? (
                data.map((item) => {
                  return (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-700">{item.noJurnal}</td>
                      <td className="px-4 py-3 text-gray-600">{formatTanggal(item.tanggal)}</td>
                      <td className="px-4 py-3 text-gray-600">{item.deskripsi}</td>
                      <td className="px-4 py-3 text-gray-500">{item.sumber}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${
                            item.status === "CLOSED"
                              ? "bg-gray-100 text-gray-600"
                              : "bg-emerald-50 text-emerald-600"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-gray-700">
                        {formatRupiah(item.totalNominal)}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-gray-400">
                    Belum ada data jurnal.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {pagination.totalPages > 1 ? (
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => onChangePage(Math.max(1, page - 1))}
              disabled={page <= 1}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm disabled:opacity-40"
            >
              Sebelumnya
            </button>
            <span className="text-sm text-gray-500">
              Halaman {pagination.page} dari {pagination.totalPages}
            </span>
            <button
              onClick={() => onChangePage(Math.min(pagination.totalPages, page + 1))}
              disabled={page >= pagination.totalPages}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm disabled:opacity-40"
            >
              Berikutnya
            </button>
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

      {notif ? (
        <Notification message={notif.message} type={notif.type} onClose={() => setNotif(null)} />
      ) : null}
    </AppLayout>
  );
}
