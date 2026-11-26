"use client";

import AppLayout from "@/components/app-layout";
import { BarChart3 } from "lucide-react";
import { useLaporanKlhkManage } from "./manage";

function tanggalPanjang(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    // Tanggal ujian disimpan sebagai tanggal murni; tanpa UTC, zona waktu
    // lokal bisa menggesernya satu hari.
    timeZone: "UTC",
  });
}

const TH = "px-4 py-2 text-[10px] font-semibold text-zinc-400";
const TD = "px-4 py-3 text-xs";

export default function LaporanKlhkContainer() {
  const m = useLaporanKlhkManage();

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Training", href: "/training" },
        { label: "Laporan KLHK" },
      ]}
    >
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-zinc-100 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center">
              <BarChart3 className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <span className="font-bold text-zinc-800 text-sm">
              Laporan KLHK — Rekap Ujian
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-zinc-500 font-medium">Tahun</span>
            <input
              type="number"
              placeholder="Semua tahun"
              value={m.tahun}
              onChange={(e) => m.setTahun(e.target.value)}
              className="w-28 px-2.5 py-1.5 border border-zinc-200 rounded-lg text-[11px] text-zinc-600 outline-none focus:border-emerald-300 transition-all"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-zinc-500 font-medium">Skema</span>
            <select
              value={m.skemaId}
              onChange={(e) =>
                m.setSkemaId(e.target.value ? Number(e.target.value) : "")
              }
              className="px-2.5 py-1.5 border border-zinc-200 rounded-lg text-[11px] text-zinc-600 outline-none focus:border-emerald-300 transition-all bg-white"
            >
              <option value="">Semua Skema</option>
              {m.skemaOptions.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.kode}
                </option>
              ))}
            </select>
          </div>

          <div className="ml-auto flex items-center gap-3 text-[11px] text-zinc-500">
            <span>
              Total K:{" "}
              <span className="font-semibold text-emerald-600">{m.total.k}</span>
            </span>
            <span>
              Total BK:{" "}
              <span className="font-semibold text-red-500">{m.total.bk}</span>
            </span>
            <span>
              Total:{" "}
              <span className="font-semibold text-zinc-700">
                {m.total.semua}
              </span>
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px]">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/60">
                <th className={`${TH} text-left w-10`}>No</th>
                <th className={`${TH} text-left w-36`}>Tgl Ujian</th>
                <th className={`${TH} text-left w-24`}>Kode Skema</th>
                <th className={`${TH} text-left`}>Kualifikasi</th>
                <th className={`${TH} text-center w-16`}>K</th>
                <th className={`${TH} text-center w-16`}>BK</th>
                <th className={`${TH} text-center w-16`}>Jml</th>
              </tr>
            </thead>
            <tbody>
              {m.loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-12 text-center text-xs text-zinc-400"
                  >
                    Memuat data...
                  </td>
                </tr>
              ) : m.error ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-12 text-center text-xs text-red-500"
                  >
                    {m.error}
                  </td>
                </tr>
              ) : m.data.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-12 text-center text-xs text-zinc-400"
                  >
                    Tidak ada data tersedia.
                  </td>
                </tr>
              ) : (
                m.data.map((row, i) => (
                  <tr
                    key={`${row.tglUjian}-${row.kodeSkema}`}
                    className="border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors"
                  >
                    <td className={`${TD} text-zinc-400`}>{i + 1}</td>
                    <td className={`${TD} text-zinc-700 font-medium whitespace-nowrap`}>
                      {tanggalPanjang(row.tglUjian)}
                    </td>
                    <td className={`${TD} text-zinc-600 whitespace-nowrap`}>
                      {row.kodeSkema}
                    </td>
                    <td className={`${TD} text-zinc-600`}>{row.namaSkema}</td>
                    <td className={`${TD} text-emerald-600 font-semibold text-center`}>
                      {row.jumlahK}
                    </td>
                    <td className={`${TD} text-red-500 font-semibold text-center`}>
                      {row.jumlahBk}
                    </td>
                    <td className={`${TD} text-zinc-700 font-semibold text-center`}>
                      {row.jumlahTotal}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
