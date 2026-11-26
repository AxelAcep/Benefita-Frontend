"use client";

import { CalendarX } from "lucide-react";
import AppLayout from "@/components/app-layout";
import TablePagination from "@/components/base/table-pagination";
import { usePesertaCancleManage } from "./manage";

const KODE_OPTIONS = ["Pilih Kode", "ENG-01", "EP-03", "CSR-01"];

const ACCOUNT_OPTIONS = [
  "Pilih Account",
  "Account-01",
  "Account-02",
  "Account-03",
];

const selectStyle = {
    backgroundImage:
      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%23a1a1aa' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 6px center",
  };

export default function PesertaCancleContainer() {
  const {
    PAGE_SIZE,
    search,
    setSearch,
    selectedTanggal,
    setSelectedTanggal,
    selectedKode,
    setSelectedKode,
    selectedAccount,
    setSelectedAccount,
    currentPage,
    setCurrentPage,
    handleTerapkan,
    paginated,
    total,
    totalPages,
  } = usePesertaCancleManage();

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Peserta" },
        { label: "Daftar Peserta CANCEL (Bulanan)" },
      ]}
    >
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="px-5 py-3 border-b border-zinc-100">
          <div className="flex flex-wrap items-center gap-2">
            {/* Title */}
            <div className="flex items-center gap-2 mr-1">
              <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center">
                <CalendarX className="w-3.5 h-3.5 text-emerald-500" />
              </div>
              <span className="font-bold text-zinc-800 text-sm">
                Daftar Peserta CANCEL (Bulanan)
              </span>
            </div>

            {/* Filter Tanggal */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-zinc-500 font-medium">
                Tanggal
              </span>
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Pilih Tanggal"
                  value={selectedTanggal}
                  onChange={(e) => setSelectedTanggal(e.target.value)}
                  className="pl-2.5 pr-7 py-1.5 border border-zinc-200 rounded-lg text-[11px] text-zinc-600 outline-none focus:border-emerald-300 transition-all w-28 placeholder:text-zinc-400"
                />
                <svg
                  className="absolute right-2 text-zinc-400 pointer-events-none"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
            </div>

            {/* Filter Kode */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-zinc-500 font-medium">
                Kode
              </span>
              <select
                value={selectedKode}
                onChange={(e) => setSelectedKode(e.target.value)}
                className="pl-2.5 pr-6 py-1.5 border border-zinc-200 rounded-lg text-[11px] text-zinc-600 outline-none focus:border-emerald-300 transition-all bg-white appearance-none cursor-pointer"
                style={selectStyle}
              >
                {KODE_OPTIONS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter A. Executive */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-zinc-500 font-medium">
                A. Executive
              </span>
              <select
                value={selectedAccount}
                onChange={(e) => setSelectedAccount(e.target.value)}
                className="pl-2.5 pr-6 py-1.5 border border-zinc-200 rounded-lg text-[11px] text-zinc-600 outline-none focus:border-emerald-300 transition-all bg-white appearance-none cursor-pointer"
                style={selectStyle}
              >
                {ACCOUNT_OPTIONS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>

            {/* Terapkan */}
            <button
              onClick={handleTerapkan}
              className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-semibold rounded-lg transition-colors"
            >
              Terapkan
            </button>

            {/* Search */}
            <div className="relative ml-auto">
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
                placeholder="Cari informasi..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full sm:w-52 pl-7 pr-3 py-1.5 border border-zinc-200 rounded-lg text-xs text-zinc-700 outline-none focus:border-emerald-300 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px]">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/60">
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-10">
                  No ↕
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-20">
                  Kode
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-14">
                  AE
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-40">
                  Nama
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-36">
                  Perusahaan/Instansi
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-32">
                  No. Telp
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-40">
                  Email
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-28">
                  Tgl. Training
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-28">
                  Status
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-24">
                  Inputer
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-36">
                  Catatan
                </th>
              </tr>
            </thead>

            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={11}
                    className="px-4 py-12 text-center text-xs text-zinc-400"
                  >
                    Tidak ada data tersedia.
                  </td>
                </tr>
              ) : (
                paginated.map((row, i) => (
                  <tr
                    key={row.id}
                    className="border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-xs text-zinc-400 align-top">
                      {(currentPage - 1) * PAGE_SIZE + i + 1}
                    </td>
                    <td className="px-3 py-3 text-xs text-zinc-600 font-medium align-top">
                      {row.kode}
                    </td>
                    <td className="px-3 py-3 text-xs text-zinc-600 font-medium align-top">
                      {row.ae}
                    </td>
                    <td className="px-3 py-3 text-xs align-top">
                      <span className="text-emerald-600 font-semibold cursor-pointer hover:underline">
                        {row.nama}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-xs align-top">
                      <span className="text-emerald-600 font-semibold cursor-pointer hover:underline">
                        {row.perusahaan}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-xs text-zinc-600 align-top whitespace-nowrap">
                      {row.noTelp}
                    </td>
                    <td className="px-3 py-3 text-xs text-zinc-600 align-top">
                      {row.email ?? (
                        <span className="text-zinc-300 select-none">–</span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-xs text-zinc-600 align-top whitespace-nowrap">
                      {row.tglTraining}
                    </td>
                    <td className="px-3 py-3 text-xs text-zinc-600 align-top">
                      {row.status}
                    </td>
                    <td className="px-3 py-3 text-xs text-zinc-600 align-top">
                      {row.inputer}
                    </td>
                    <td className="px-3 py-3 text-xs text-zinc-600 align-top leading-relaxed">
                      {row.catatan ?? (
                        <span className="text-zinc-300 select-none">–</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <TablePagination
          page={currentPage}
          limit={PAGE_SIZE}
          total={total}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </AppLayout>
  );
}
