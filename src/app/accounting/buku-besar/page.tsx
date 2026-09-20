"use client";

import React, { useState } from "react";
import { BookOpenCheck, Lock, X, Loader2 } from "lucide-react";
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
    <AppLayout
      breadcrumbs={[
        { label: "Accounting", href: "/accounting" },
        { label: "Buku Besar" },
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

          {isFinance ? (
            <button
              onClick={onOpenTutupBuku}
              className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-500 hover:bg-red-600 text-white transition-colors whitespace-nowrap"
            >
              <Lock className="w-3.5 h-3.5" /> Tutup Buku
            </button>
          ) : null}
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
                    Belum ada data akun.
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
                              Belum ada mutasi.
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

      {tutupBukuOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.35)" }}
          onClick={onCloseTutupBuku}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
              <p className="font-bold text-zinc-800 text-sm">Tutup Buku</p>
              <button
                onClick={onCloseTutupBuku}
                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-zinc-100 transition-colors text-zinc-400 hover:text-zinc-600 shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-3">
              <p className="text-[11px] text-zinc-500 leading-relaxed">
                Menutup periode akan mengunci seluruh transaksi POSTED di periode tersebut dan
                memindahkan laba/rugi bersih ke akun Modal &quot;Laba Ditahan&quot;. Tindakan ini
                tidak bisa dibatalkan.
              </p>
              <div>
                <label className="block text-[11px] font-semibold text-zinc-500 mb-1.5">Periode</label>
                <select
                  value={selectedPeriode}
                  onChange={(e) => setSelectedPeriode(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-200 rounded-xl text-xs text-zinc-700 outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 transition-all bg-white"
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
            </div>
            <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-zinc-100">
              <button
                onClick={onCloseTutupBuku}
                disabled={closing}
                className="px-4 py-2 rounded-xl text-xs font-semibold border border-zinc-200 text-zinc-600 hover:bg-zinc-50 transition-colors disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={onSubmitTutupBuku}
                disabled={closing || !selectedPeriode}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-500 hover:bg-red-600 text-white transition-colors disabled:opacity-50 inline-flex items-center gap-1.5 min-w-[110px] justify-center"
              >
                {closing ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Menutup...
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" /> Tutup Buku
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </AppLayout>
  );
}
