"use client";
import AppLayout from "@/components/app-layout";
import { useLabaRugi2023Manage } from "./manage";
import { labaRugiData, type LabaRugiRow } from "./data-contoh";


function LabaRugiTableRow({ row }: { row: LabaRugiRow }) {
  if (row.type === "section-header") {
    return (
      <tr className="bg-zinc-50 border-b border-zinc-100">
        <td colSpan={4} className="px-5 py-2.5">
          <span className="text-xs font-bold text-zinc-700 tracking-wide uppercase">
            {row.deskripsi}
          </span>
        </td>
      </tr>
    );
  }

  if (row.type === "group-header") {
    return (
      <tr className="border-b border-zinc-50">
        <td colSpan={4} className="px-5 py-2.5 pl-8">
          <span className="text-xs font-semibold text-zinc-700">
            {row.deskripsi}
          </span>
        </td>
      </tr>
    );
  }

  if (row.type === "subtotal") {
    return (
      <tr className="border-b border-zinc-100">
        <td className="px-5 py-2.5 pl-5">
          <span className="text-xs font-semibold text-zinc-800">
            {row.deskripsi}
          </span>
        </td>
        <td className="px-5 py-2.5">
          <span className="text-xs font-semibold text-zinc-800">
            {row.komersial}
          </span>
        </td>
        <td className="px-5 py-2.5 text-xs text-zinc-400">
          {row.koreksiFiskal || ""}
        </td>
        <td className="px-5 py-2.5 text-xs text-zinc-400">
          {row.laporanKeuanganFiskal || ""}
        </td>
      </tr>
    );
  }

  if (row.type === "total") {
    return (
      <tr className="bg-zinc-50 border-b border-zinc-100">
        <td className="px-5 py-3">
          <span className="text-xs font-bold text-zinc-900">
            {row.deskripsi}
          </span>
        </td>
        <td className="px-5 py-3">
          <span className="text-xs font-bold text-zinc-900">
            {row.komersial}
          </span>
        </td>
        <td className="px-5 py-3 text-xs text-zinc-400">
          {row.koreksiFiskal || ""}
        </td>
        <td className="px-5 py-3 text-xs text-zinc-400">
          {row.laporanKeuanganFiskal || ""}
        </td>
      </tr>
    );
  }

  // item
  const isBold = row.deskripsi === "PENDAPATAN";
  return (
    <tr className="border-b border-zinc-50 hover:bg-zinc-50 transition-colors">
      <td
        className={`px-5 py-2.5 pl-10 text-xs ${isBold ? "font-bold text-zinc-900 pl-5" : "text-zinc-700"}`}
      >
        {row.deskripsi}
      </td>
      <td
        className={`px-5 py-2.5 text-xs ${isBold ? "font-bold text-zinc-900" : "text-zinc-700"}`}
      >
        {row.komersial}
      </td>
      <td className="px-5 py-2.5 text-xs text-zinc-400">{row.koreksiFiskal}</td>
      <td className="px-5 py-2.5 text-xs text-zinc-400">
        {row.laporanKeuanganFiskal}
      </td>
    </tr>
  );
}

export default function LabaRugi2023Container() {
  const { tanggal, setTanggal } = useLabaRugi2023Manage();

  return (
    <AppLayout breadcrumbs={[{ label: "Accounting", href: "/accounting/beranda" }, { label: "Laporan Laba Rugi 2023" }]}>
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        {/* Card Header */}
        <div className="px-5 pt-5 pb-4 border-b border-zinc-100 space-y-3">
          {/* Title row */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-emerald-50 rounded-lg flex items-center justify-center">
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
              >
                <rect x="2" y="7" width="20" height="14" rx="2" />
                <path d="M16 3H8a2 2 0 0 0-2 2v2h12V5a2 2 0 0 0-2-2z" />
                <line x1="8" y1="12" x2="16" y2="12" />
                <line x1="8" y1="16" x2="12" y2="16" />
              </svg>
            </div>
            <p className="font-bold text-zinc-800 text-sm">
              Laporan Laba Rugi 2023
            </p>
          </div>

          {/* Filter row */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500 font-medium">
              Tanggal
            </span>
            <div className="relative">
              <input
                type="date"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                className="border border-zinc-200 rounded-lg pl-3 pr-8 py-1.5 text-xs text-zinc-700 outline-none focus:border-emerald-300 w-36 appearance-none"
                placeholder="Pilih Tanggal"
              />
              <svg
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-300 pointer-events-none"
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <button className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg transition-colors">
              Terapkan
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px]">
            <thead>
              <tr className="border-b border-zinc-100">
                <th className="px-5 py-3 text-[11px] font-semibold text-zinc-400 text-left w-[40%]">
                  Deskripsi
                </th>
                <th className="px-5 py-3 text-[11px] font-semibold text-zinc-400 text-left">
                  Komersial
                </th>
                <th className="px-5 py-3 text-[11px] font-semibold text-zinc-400 text-left whitespace-nowrap">
                  Koreksi Fiskal
                </th>
                <th className="px-5 py-3 text-[11px] font-semibold text-zinc-400 text-left whitespace-nowrap">
                  Laporan Keuangan Fiskal
                </th>
              </tr>
            </thead>
            <tbody>
              {labaRugiData.map((row) => (
                <LabaRugiTableRow key={row.id} row={row} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
