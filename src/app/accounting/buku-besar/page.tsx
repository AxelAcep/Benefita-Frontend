"use client";

import React, { useState } from "react";
import { BookOpenCheck, Lock, X } from "lucide-react";
import AppLayout from "@/components/app-layout";
import Notification from "@/components/base/notifications";
import { useBoolean } from "@/hooks/use-boolean";
import { useBukuBesarRingkasan, useBukuBesarAkun, usePeriode } from "@/hooks/use-buku-besar";
import { JENIS_AKUN_OPTIONS, type JenisAkun } from "@/lib/services/accounting.service";
import { useRole } from "@/hooks/use-role";

interface NotifState {
  message: string;
  type: "success" | "error";
  key: number;
}

const JENIS_LABEL: Record<JenisAkun, string> = {
  ASET: "Aset",
  LIABILITAS: "Liabilitas",
  MODAL: "Modal",
  PENDAPATAN: "Pendapatan",
  BEBAN: "Beban",
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

export default function BukuBesarPage() {
  const { isFinance } = useRole();
  const [jenisFilter, setJenisFilter] = useState<JenisAkun | "">("");
  const { data, loading, refetch } = useBukuBesarRingkasan();
  const {
    data: detail,
    loading: detailLoading,
    fetchDetail,
    reset: resetDetail,
  } = useBukuBesarAkun();
  const { data: periodeList, loading: periodeLoading, closing, closePeriode } = usePeriode();

  const { value: detailOpen, onTrue: onOpenDetail, onFalse: onCloseDetail } = useBoolean(false);
  const { value: tutupBukuOpen, onTrue: onOpenTutupBuku, onFalse: onCloseTutupBuku } = useBoolean(false);
  const [selectedPeriode, setSelectedPeriode] = useState("");
  const [notif, setNotif] = useState<NotifState | null>(null);

  function showNotif(message: string, type: "success" | "error") {
    setNotif({ message, type, key: Date.now() });
  }

  function onFilterJenis(value: JenisAkun | "") {
    setJenisFilter(value);
    refetch(value ? { jenis: value } : undefined);
  }

  function onRowClick(akunId: number) {
    onOpenDetail();
    fetchDetail(akunId);
  }

  function onCloseDetailModal() {
    onCloseDetail();
    resetDetail();
  }

  async function onSubmitTutupBuku() {
    if (!selectedPeriode) {
      showNotif("Pilih periode dulu.", "error");
      return;
    }
    try {
      const result = await closePeriode(selectedPeriode);
      showNotif(
        `Periode ${selectedPeriode} berhasil ditutup. Laba/Rugi bersih: ${formatRupiah(result.data.labaRugiBersih)}.`,
        "success",
      );
      onCloseTutupBuku();
      setSelectedPeriode("");
      refetch(jenisFilter ? { jenis: jenisFilter } : undefined);
    } catch (err) {
      showNotif(err instanceof Error ? err.message : "Gagal menutup buku.", "error");
    }
  }

  const openPeriode = periodeList.filter((p) => p.status === "OPEN");

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-xl font-semibold text-gray-800">
              <BookOpenCheck size={22} /> Buku Besar
            </h1>
            <p className="text-sm text-gray-500">
              Saldo akun berjalan hasil rekap seluruh jurnal keuangan.
            </p>
          </div>
          {isFinance ? (
            <button
              onClick={onOpenTutupBuku}
              className="flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              <Lock size={16} /> Tutup Buku
            </button>
          ) : null}
        </div>

        <div className="flex gap-2">
          <select
            value={jenisFilter}
            onChange={(e) => onFilterJenis(e.target.value as JenisAkun | "")}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
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
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs font-medium uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Kode</th>
                <th className="px-4 py-3">Nama Akun</th>
                <th className="px-4 py-3">Jenis</th>
                <th className="px-4 py-3 text-right">Total Debit</th>
                <th className="px-4 py-3 text-right">Total Kredit</th>
                <th className="px-4 py-3 text-right">Saldo Akhir</th>
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
                    <tr
                      key={item.akun.id}
                      onClick={() => onRowClick(item.akun.id)}
                      className="cursor-pointer hover:bg-gray-50"
                    >
                      <td className="px-4 py-3 text-gray-600">{item.akun.kode ?? "-"}</td>
                      <td className="px-4 py-3 font-medium text-gray-700">{item.akun.nama}</td>
                      <td className="px-4 py-3 text-gray-500">{JENIS_LABEL[item.akun.jenis]}</td>
                      <td className="px-4 py-3 text-right text-gray-600">
                        {formatRupiah(item.totalDebit)}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-600">
                        {formatRupiah(item.totalKredit)}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-gray-700">
                        {formatRupiah(item.saldoAkhir)}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-gray-400">
                    Belum ada data akun.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {detailOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white shadow-lg">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-800">
                {detail ? `${detail.akun.kode ? detail.akun.kode + " - " : ""}${detail.akun.nama}` : "Detail Akun"}
              </h2>
              <button onClick={onCloseDetailModal} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="px-6 py-4">
              {detailLoading ? (
                <p className="py-6 text-center text-gray-400">Memuat data...</p>
              ) : detail ? (
                <>
                  <div className="mb-3 flex justify-between text-sm text-gray-600">
                    <span>Saldo Awal: {formatRupiah(detail.saldoAwal)}</span>
                    <span className="font-semibold">Saldo Akhir: {formatRupiah(detail.saldoAkhir)}</span>
                  </div>
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-left text-xs font-medium uppercase text-gray-500">
                      <tr>
                        <th className="px-3 py-2">No. Jurnal</th>
                        <th className="px-3 py-2">Tanggal</th>
                        <th className="px-3 py-2">Keterangan</th>
                        <th className="px-3 py-2 text-right">Debit</th>
                        <th className="px-3 py-2 text-right">Kredit</th>
                        <th className="px-3 py-2 text-right">Saldo</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {detail.rows && detail.rows.length > 0 ? (
                        detail.rows.map((row) => {
                          return (
                            <tr key={row.transaksiId + row.noJurnal}>
                              <td className="px-3 py-2 text-gray-600">{row.noJurnal}</td>
                              <td className="px-3 py-2 text-gray-600">{formatTanggal(row.tanggal)}</td>
                              <td className="px-3 py-2 text-gray-600">{row.keterangan}</td>
                              <td className="px-3 py-2 text-right text-gray-600">{formatRupiah(row.debit)}</td>
                              <td className="px-3 py-2 text-right text-gray-600">{formatRupiah(row.kredit)}</td>
                              <td className="px-3 py-2 text-right font-medium text-gray-700">
                                {formatRupiah(row.saldo)}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={6} className="px-3 py-6 text-center text-gray-400">
                            Belum ada mutasi.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      {tutupBukuOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-lg">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-800">Tutup Buku</h2>
              <button onClick={onCloseTutupBuku} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-3 px-6 py-4">
              <p className="text-sm text-gray-500">
                Menutup periode akan mengunci seluruh transaksi POSTED di periode tersebut dan
                memindahkan laba/rugi bersih ke akun Modal &quot;Laba Ditahan&quot;. Tindakan ini
                tidak bisa dibatalkan.
              </p>
              <select
                value={selectedPeriode}
                onChange={(e) => setSelectedPeriode(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="">Pilih periode</option>
                {periodeLoading ? (
                  <option disabled>Memuat...</option>
                ) : openPeriode && openPeriode.length > 0 ? (
                  openPeriode.map((p) => {
                    return (
                      <option key={p.periode} value={p.periode}>
                        {p.periode}
                      </option>
                    );
                  })
                ) : (
                  <option disabled>Tidak ada periode terbuka</option>
                )}
              </select>
            </div>
            <div className="flex justify-end gap-2 border-t px-6 py-4">
              <button
                onClick={onCloseTutupBuku}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600"
              >
                Batal
              </button>
              <button
                onClick={onSubmitTutupBuku}
                disabled={closing || !selectedPeriode}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
              >
                {closing ? "Menutup..." : "Tutup Buku"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {notif ? (
        <Notification message={notif.message} type={notif.type} onClose={() => setNotif(null)} />
      ) : null}
    </AppLayout>
  );
}
