"use client";

// Laporan Laba Rugi — padanan sheet "IS". Satu baris per akun.
// Versi dengan beban digabung per grup ada di /accounting/laba-rugi-rinci.
import React, { useState } from "react";
import { TrendingUp, FileDown, Loader2 } from "lucide-react";
import Notification from "@/components/base/notifications";
import { useBoolean } from "@/hooks/use-boolean";
import { useLaporanLabaRugi } from "@/hooks/use-laporan-keuangan";
import { exportLabaRugiExcel } from "@/lib/services/jurnal-keuangan.service";
import { LaporanShell, usePeriodeAwal } from "@/components/laporan-shell";
import { LabaRugiTabel, dariAkun } from "@/components/laba-rugi-tabel";

export default function LabaRugiPage() {
  const { data, loading, fetchData } = useLaporanLabaRugi();
  const { startDate, setStartDate, endDate, setEndDate } = usePeriodeAwal(fetchData);
  // Kolom pembanding opsional (sheet IS menampilkan periode sebelumnya).
  const [bandingStart, setBandingStart] = useState("");
  const [bandingEnd, setBandingEnd] = useState("");

  function onTampilkan() {
    fetchData(
      startDate,
      endDate,
      bandingStart && bandingEnd ? { startDate: bandingStart, endDate: bandingEnd } : undefined,
    );
  }
  const { value: exporting, onTrue: onExportingTrue, onFalse: onExportingFalse } = useBoolean(false);
  const [notif, setNotif] = useState<{ message: string; type: "success" | "error"; key: number } | null>(null);

  async function onExportExcel() {
    onExportingTrue();
    try {
      await exportLabaRugiExcel(startDate, endDate);
    } catch (err) {
      setNotif({
        message: err instanceof Error ? err.message : "Gagal mengunduh Excel",
        type: "error",
        key: Date.now(),
      });
    } finally {
      onExportingFalse();
    }
  }

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
            disabled={exporting || !data}
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
        <Notification key={notif.key} message={notif.message} type={notif.type} onClose={() => setNotif(null)} />
      ) : null}

      {data ? (
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
