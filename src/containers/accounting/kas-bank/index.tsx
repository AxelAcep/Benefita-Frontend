"use client";

import { Wallet2, FileDown, Loader2, Search } from "lucide-react";
import AppLayout from "@/components/app-layout";
import Notification from "@/components/base/notifications";
import { useKasBankManage } from "./manage";

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

export default function KasBankContainer() {
  const {
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    search,
    data,
    loading,
    error,
    exporting,
    notif,
    onFilter,
    onSearch,
    onExportExcel,
    closeNotif,
  } = useKasBankManage();

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Accounting", href: "/accounting/beranda" },
        { label: "Kas & Bank" },
      ]}
    >
      {notif ? (
        <Notification
          key={notif.key}
          message={notif.message}
          type={notif.type}
          onClose={closeNotif}
        />
      ) : null}

      <div className="space-y-4">
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
          <div className="px-5 py-3 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center">
                <Wallet2 className="w-3.5 h-3.5 text-emerald-500" />
              </div>
              <span className="font-bold text-zinc-800 text-sm">Kas & Bank</span>
            </div>

            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-300" />
              <input
                type="text"
                placeholder="Cari nama atau kode akun..."
                value={search}
                onChange={(e) => onSearch(e.target.value)}
                className="w-56 pl-7 pr-3 py-2 border border-zinc-200 rounded-xl text-xs text-zinc-700 outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 transition-all"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-2 border border-zinc-200 rounded-xl text-xs text-zinc-700 outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 transition-all"
              />
              <span className="text-[11px] text-zinc-400">s/d</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-2 border border-zinc-200 rounded-xl text-xs text-zinc-700 outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 transition-all"
              />
              <button
                onClick={onFilter}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition-colors whitespace-nowrap"
              >
                Tampilkan
              </button>
            </div>

            <button
              onClick={onExportExcel}
              disabled={exporting || loading || Boolean(error) || !data}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-zinc-200 text-zinc-600 hover:bg-zinc-50 transition-colors disabled:opacity-50 whitespace-nowrap"
            >
              {exporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileDown className="w-3.5 h-3.5" />}
              Export Excel
            </button>

            {data ? (
              <span className="ml-auto inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-600 whitespace-nowrap">
                Total Saldo Gabungan: {formatRupiah(data.totalSaldoGabungan)}
              </span>
            ) : null}
          </div>
        </div>

        {loading ? (
          <p className="py-12 text-center text-xs text-zinc-400">Memuat data...</p>
        ) : error ? (
          <p role="alert" className="py-12 text-center text-xs text-red-600">{error.message}</p>
        ) : data && data.mutasi && data.mutasi.length > 0 ? (
          data.mutasi.map((akunMutasi) => {
            return (
              <div
                key={akunMutasi.akun.id}
                className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden"
              >
                <div className="px-5 py-2.5 bg-zinc-50/60 border-b border-zinc-100 flex items-center justify-between">
                  <p className="text-[11px] font-semibold text-zinc-500">
                    {akunMutasi.akun.kode ? `${akunMutasi.akun.kode} - ${akunMutasi.akun.nama}` : akunMutasi.akun.nama}
                  </p>
                  <p className="text-xs font-semibold text-zinc-700">
                    Saldo: {formatRupiah(akunMutasi.saldoAkhir)}
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-zinc-100 bg-zinc-50/60">
                        <th className="px-5 py-2 text-[10px] font-semibold text-zinc-400 text-left">No. Jurnal</th>
                        <th className="px-5 py-2 text-[10px] font-semibold text-zinc-400 text-left w-28">Tanggal</th>
                        <th className="px-5 py-2 text-[10px] font-semibold text-zinc-400 text-left">Keterangan</th>
                        <th className="px-5 py-2 text-[10px] font-semibold text-zinc-400 text-right w-32">Masuk</th>
                        <th className="px-5 py-2 text-[10px] font-semibold text-zinc-400 text-right w-32">Keluar</th>
                        <th className="px-5 py-2 text-[10px] font-semibold text-zinc-400 text-right w-32">Saldo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {akunMutasi.rows && akunMutasi.rows.length > 0 ? (
                        akunMutasi.rows.map((row) => {
                          return (
                            <tr key={row.noJurnal + row.tanggal} className="border-b border-zinc-50">
                              <td className="px-5 py-2 text-xs text-zinc-600 whitespace-nowrap">{row.noJurnal}</td>
                              <td className="px-5 py-2 text-xs text-zinc-600 whitespace-nowrap">{formatTanggal(row.tanggal)}</td>
                              <td className="px-5 py-2 text-xs text-zinc-600">{row.keterangan}</td>
                              <td className="px-5 py-2 text-xs text-emerald-600 text-right whitespace-nowrap">{formatRupiah(row.masuk)}</td>
                              <td className="px-5 py-2 text-xs text-red-500 text-right whitespace-nowrap">{formatRupiah(row.keluar)}</td>
                              <td className="px-5 py-2 text-xs text-zinc-700 font-medium text-right whitespace-nowrap">
                                {formatRupiah(row.saldo)}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={6} className="px-5 py-6 text-center text-xs text-zinc-400">
                            Belum ada mutasi.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm">
            <p className="py-12 text-center text-xs text-zinc-400">
              Belum ada akun Kas &amp; Bank aktif. Tandai akun sebagai Kas &amp; Bank di Master Akun.
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
