"use client";

import { Users } from "lucide-react";
import AppLayout from "@/components/app-layout";
import TablePagination from "@/components/base/table-pagination";
import { usePesertaFinalManage } from "./manage";

const ACCOUNT_OPTIONS = ["Account-01", "Account-02", "Account-03"];

export default function PesertaFinalContainer() {
  const {
    search,
    filterNama,
    setFilterNama,
    filterInstansi,
    setFilterInstansi,
    filterMinat,
    setFilterMinat,
    filterAccount,
    setFilterAccount,
    currentPage,
    setCurrentPage,
    PAGE_SIZE,
    handleTerapkan,
    paginated,
    total,
    totalPages,
    changeSearch,
  } = usePesertaFinalManage();

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Peserta" },
        { label: "Peserta Final" },
      ]}
    >
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="px-5 py-3 border-b border-zinc-100">
          {/* Title */}
          <div className="flex items-center gap-2 mr-1 mb-3">
            <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center">
              <Users className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <span className="font-bold text-zinc-800 text-sm">
              Peserta Final
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {/* Filter Nama */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-zinc-500 font-medium">
                Nama
              </span>
              <input
                type="text"
                placeholder="Cari nama..."
                value={filterNama}
                onChange={(e) => setFilterNama(e.target.value)}
                className="w-28 px-2.5 py-1.5 border border-zinc-200 rounded-lg text-[11px] text-zinc-600 outline-none focus:border-emerald-300 transition-all"
              />
            </div>

            {/* Filter Instansi */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-zinc-500 font-medium">
                Instansi
              </span>
              <input
                type="text"
                placeholder="Cari instansi..."
                value={filterInstansi}
                onChange={(e) => setFilterInstansi(e.target.value)}
                className="w-28 px-2.5 py-1.5 border border-zinc-200 rounded-lg text-[11px] text-zinc-600 outline-none focus:border-emerald-300 transition-all"
              />
            </div>

            {/* Filter Minat */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-zinc-500 font-medium">
                Minat
              </span>
              <input
                type="text"
                placeholder="Cari minat..."
                value={filterMinat}
                onChange={(e) => setFilterMinat(e.target.value)}
                className="w-28 px-2.5 py-1.5 border border-zinc-200 rounded-lg text-[11px] text-zinc-600 outline-none focus:border-emerald-300 transition-all"
              />
            </div>

            {/* Filter Account */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-zinc-500 font-medium">
                Account
              </span>
              <select
                value={filterAccount}
                onChange={(e) => setFilterAccount(e.target.value)}
                className="pl-2.5 pr-6 py-1.5 border border-zinc-200 rounded-lg text-[11px] text-zinc-600 outline-none focus:border-emerald-300 transition-all bg-white appearance-none cursor-pointer"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%23a1a1aa' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 6px center",
                }}
              >
                <option value="">Pilih Account</option>
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
                onChange={(e) => changeSearch(e.target.value)}
                className="w-full sm:w-52 pl-7 pr-3 py-1.5 border border-zinc-200 rounded-lg text-xs text-zinc-700 outline-none focus:border-emerald-300 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1300px]">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/60">
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-10">
                  No ↕
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-36">
                  Nama
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-36">
                  Jabatan
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-28">
                  No. Telp
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-28">
                  Perusahaan/Instansi
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-28">
                  Minat
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-48">
                  Rekom
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-24">
                  Kode | Tgl
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-center w-14">
                  BDO
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-40">
                  Email
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-center w-20">
                  Peserta
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-center w-16">
                  Aksi
                </th>
              </tr>
            </thead>

            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={12}
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
                    {/* No */}
                    <td className="px-4 py-3 text-xs text-zinc-400 align-top">
                      {(currentPage - 1) * PAGE_SIZE + i + 1}
                    </td>
                    {/* Nama */}
                    <td className="px-4 py-3 text-xs text-zinc-700 font-medium align-top">
                      {row.nama}
                    </td>
                    {/* Jabatan */}
                    <td className="px-3 py-3 text-xs text-zinc-600 align-top leading-relaxed">
                      {row.jabatan}
                    </td>
                    {/* No Telp */}
                    <td className="px-3 py-3 text-xs text-zinc-600 align-top whitespace-nowrap">
                      {row.noTelp}
                    </td>
                    {/* Perusahaan */}
                    <td className="px-3 py-3 text-xs align-top">
                      <span className="text-emerald-600 font-semibold cursor-pointer hover:underline">
                        {row.perusahaan}
                      </span>
                    </td>
                    {/* Minat */}
                    <td className="px-3 py-3 text-xs text-zinc-500 align-top">
                      {row.kodeMinat.length > 0 ? (
                        <div className="flex flex-col gap-0.5">
                          {row.kodeMinat.map((k) => (
                            <span key={k} className="text-zinc-500">
                              {k}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-zinc-400">-</span>
                      )}
                    </td>
                    {/* Rekom */}
                    <td className="px-3 py-3 text-xs text-zinc-600 align-top leading-relaxed max-w-[180px]">
                      {row.rekom ?? <span className="text-zinc-400">-</span>}
                    </td>
                    {/* Kode | Tgl */}
                    <td className="px-3 py-3 align-top">
                      <p className="text-xs font-bold text-zinc-700">
                        {row.kode}
                      </p>
                      <p className="text-[10px] text-zinc-400">{row.tgl}</p>
                    </td>
                    {/* BDO */}
                    <td className="px-3 py-3 text-center text-xs font-semibold text-zinc-600 align-top">
                      {row.bdo}
                    </td>
                    {/* Email */}
                    <td className="px-3 py-3 text-xs text-zinc-600 align-top leading-relaxed break-all">
                      {row.email}
                    </td>
                    {/* Peserta */}
                    <td className="px-3 py-3 text-center align-top">
                      <button className="text-[11px] text-emerald-600 font-semibold hover:underline">
                        Edit
                      </button>
                    </td>
                    {/* Aksi */}
                    <td className="px-3 py-3 text-center align-top">
                      <button className="text-[11px] text-emerald-600 font-semibold hover:underline">
                        Lihat
                      </button>
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
