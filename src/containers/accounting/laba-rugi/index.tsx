"use client";

// Laporan Laba Rugi — padanan sheet "IS". Satu baris per akun.
// Versi dengan beban digabung per grup ada di /accounting/laba-rugi-rinci.
import { TrendingUp, FileDown, Loader2 } from "lucide-react";
import Notification from "@/components/base/notifications";
import { LaporanShell } from "@/components/laporan-shell";
import { LabaRugiTabel, dariAkun } from "@/components/laba-rugi-tabel";
import { useLabaRugiManage } from "./manage";

export default function LabaRugiContainer() {
  const {
    data,
    loading,
    error,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    bandingStart,
    setBandingStart,
    bandingEnd,
    setBandingEnd,
    onTampilkan,
    exporting,
    notif,
    onExportExcel,
    closeNotif,
  } = useLabaRugiManage();

  return (
    <LaporanShell
      judul="Laporan Laba Rugi"
      icon={TrendingUp}
      startDate={startDate}
      endDate={endDate}
      onStartDate={setStartDate}
      onEndDate={setEndDate}
      onFilter={onTampilkan}
      loading={loading}
      badge={
        <>
          <span className="text-[11px] text-zinc-400">bandingkan</span>
          <input
            type="date"
            value={bandingStart}
            onChange={(e) => setBandingStart(e.target.value)}
            className="px-2 py-1.5 border border-zinc-200 rounded-lg text-[11px] text-zinc-700 outline-none focus:border-emerald-300"
          />
          <input
            type="date"
            value={bandingEnd}
            onChange={(e) => setBandingEnd(e.target.value)}
            className="px-2 py-1.5 border border-zinc-200 rounded-lg text-[11px] text-zinc-700 outline-none focus:border-emerald-300"
          />
          <button
            onClick={onExportExcel}
            disabled={exporting || loading || Boolean(error) || !data}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-zinc-200 text-zinc-600 hover:bg-zinc-50 transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            {exporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileDown className="w-3.5 h-3.5" />}
            Export Excel
          </button>
          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-600 whitespace-nowrap">
            Real-time
          </span>
        </>
      }
    >
      {notif ? (
        <Notification key={notif.key} message={notif.message} type={notif.type} onClose={closeNotif} />
      ) : null}

      {error ? (
        <p role="alert" className="py-12 text-center text-xs text-red-600">{error.message}</p>
      ) : data ? (
        <LabaRugiTabel
          data={data}
          pendapatanUsaha={dariAkun(data.pendapatanUsaha)}
          hargaPokok={dariAkun(data.hargaPokok)}
          bebanPenjualan={dariAkun(data.bebanPenjualan)}
          bebanAdministrasi={dariAkun(data.bebanAdministrasi)}
          pendapatanLain={dariAkun(data.pendapatanLain)}
          bebanLain={dariAkun(data.bebanLain)}
          pajakPenghasilan={dariAkun(data.pajakPenghasilan)}
        />
      ) : null}
    </LaporanShell>
  );
}
