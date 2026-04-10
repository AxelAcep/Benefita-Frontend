"use client";
import { useState } from "react";
import Sidebar from "@/components/sidebar";
import { Filter, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { generatePastelBg, generatePastelText } from "@/lib/pastelColor";
import { Icons } from "@/assets";

interface LogRow {
  no: number;
  instansi: string;
  account: string;
  userUpdate: { initial: string; name: string };
  tglUpdate: string;
  userInput: { initial: string; name: string } | null;
}

const data: LogRow[] = [
  { no: 1, instansi: "PT Pertamina (Persero)",  account: "RL", userUpdate: { initial: "A", name: "Ahmad" },      tglUpdate: "03 Feb 2026, 14:30 WIB", userInput: null },
  { no: 2, instansi: "PT Telkom Indonesia",      account: "MU", userUpdate: { initial: "D", name: "Dian" },       tglUpdate: "03 Feb 2026, 11:15 WIB", userInput: null },
  { no: 3, instansi: "PT Bank Mandiri Tbk",      account: "FA", userUpdate: { initial: "R", name: "Rifqi" },      tglUpdate: "02 Feb 2026, 09:45 WIB", userInput: null },
  { no: 4, instansi: "PT Unilever Indonesia",    account: "EL", userUpdate: { initial: "A", name: "Ahmad" },      tglUpdate: "01 Feb 2026, 16:20 WIB", userInput: { initial: "DW", name: "Dian W." } },
  { no: 5, instansi: "PT Astra International",   account: "RL", userUpdate: { initial: "E", name: "Eni" },        tglUpdate: "31 Jan 2026, 10:05 WIB", userInput: null },
  { no: 6, instansi: "PT Indofood CBP",          account: "RW", userUpdate: { initial: "R", name: "Rifqi" },      tglUpdate: "30 Jan 2026, 15:45 WIB", userInput: { initial: "AD", name: "Ahmad Dian" } },
  { no: 7, instansi: "PT PLN (Persero)",         account: "NW", userUpdate: { initial: "S", name: "Sylva" },      tglUpdate: "28 Jan 2026, 08:30 WIB", userInput: null },
  { no: 8, instansi: "PT Adaro Energy",          account: "MU", userUpdate: { initial: "D", name: "Dimas" },      tglUpdate: "25 Jan 2026, 13:20 WIB", userInput: null },
];

function Avatar({ name, initial }: { name: string; initial: string }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
        style={{ backgroundColor: generatePastelBg(name), color: generatePastelText(name) }}
      >
        {initial}
      </div>
      <span className="text-xs text-zinc-700">{name}</span>
    </div>
  );
}

export default function PerubahanDataPage() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 7;

  const filtered = data.filter((r) =>
    r.instansi.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-zinc-100 overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 md:ml-[250px] min-w-0 overflow-x-hidden">

        {/* Page Header */}
        <div className="px-4 sm:px-6 py-3 bg-white border-b border-zinc-100 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs text-zinc-400 truncate">
              Karyawan & Aktivitas &rsaquo;{" "}
              <span className="font-semibold text-zinc-700">Perubahan Data Perusahaan</span>
            </p>
            <p className="text-xs text-zinc-400 mt-0.5">Hari ini: Selasa, 3 Februari 2026</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ backgroundColor: generatePastelBg("Nanang"), color: generatePastelText("Nanang") }}
            >
              N
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-zinc-800">Nanang</p>
              <p className="text-[10px] text-zinc-400">Super Admin</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-3 sm:p-6">
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">

            {/* Table Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-4 py-3 border-b border-zinc-100">
              {/* Judul */}
              <div className="flex items-center gap-1.5 shrink-0">
                <img src={Icons.Perubahan.src} className="w-4 h-auto" alt="Perubahan" />
                <span className="font-semibold text-zinc-800 text-xs">Log Perubahan Data Perusahaan</span>
              </div>
              {/* Search + Filter */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 bg-zinc-50 border border-zinc-200 rounded-lg px-2.5 py-1.5 flex-1 sm:flex-none">
                  <Search size={11} className="text-zinc-400 shrink-0" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari perusahaan..."
                    className="text-xs bg-transparent outline-none text-zinc-600 w-full sm:w-36 placeholder:text-zinc-300"
                  />
                </div>
                <button className="flex items-center gap-1 border border-zinc-200 rounded-lg px-2.5 py-1.5 text-xs text-zinc-600 hover:bg-zinc-50 transition-colors shrink-0">
                  <Filter size={11} />
                  <span>Filter</span>
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs" style={{ minWidth: "560px" }}>
                <thead>
                  <tr className="border-b border-zinc-100 text-zinc-400 uppercase text-[10px]">
                    {["No", "Instansi", "Account", "User Update", "Tgl. Update", "User Input"].map((h) => (
                      <th key={h} className="text-left px-4 py-2.5 font-medium whitespace-nowrap">
                        <span className="flex items-center gap-1">
                          {h}
                          {["Instansi", "Account", "User Update", "Tgl. Update", "User Input"].includes(h) && (
                            <span className="text-zinc-300">⇅</span>
                          )}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((row, index) => (
                    <tr
                      key={row.no}
                      className={`border-b border-zinc-50 hover:bg-zinc-50 transition-colors ${
                        index % 2 !== 0 ? "bg-zinc-50/50" : "bg-white"
                      }`}
                    >
                      <td className="px-4 py-2.5 text-zinc-400">{row.no}</td>
                      <td className="px-4 py-2.5 font-medium text-zinc-700 whitespace-nowrap">{row.instansi}</td>
                      <td className="px-4 py-2.5 text-zinc-500 whitespace-nowrap">{row.account}</td>
                      <td className="px-4 py-2.5">
                        <Avatar name={row.userUpdate.name} initial={row.userUpdate.initial} />
                      </td>
                      <td className="px-4 py-2.5 text-zinc-500 whitespace-nowrap">{row.tglUpdate}</td>
                      <td className="px-4 py-2.5">
                        {row.userInput ? (
                          <Avatar name={row.userInput.name} initial={row.userInput.initial} />
                        ) : (
                          <span className="text-zinc-300">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-4 py-3 border-t border-zinc-100">
              <span className="text-[11px] text-zinc-400">
                Menampilkan <span className="font-semibold text-zinc-600">10</span> dari{" "}
                <span className="font-semibold text-zinc-600">70</span> data
              </span>
              <div className="overflow-x-auto">
                <div className="flex items-center gap-1 w-max">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="px-2 py-1 rounded-md text-xs text-zinc-400 hover:bg-zinc-100 transition-colors flex items-center gap-0.5"
                  >
                    <ChevronLeft size={12} /> Prev
                  </button>
                  {[1, 2, 3].map((p) => (
                    <button
                      key={p}
                      onClick={() => setCurrentPage(p)}
                      className={`w-7 h-7 rounded-md text-xs font-medium transition-colors ${
                        currentPage === p
                          ? "bg-emerald-500 text-white"
                          : "text-zinc-400 hover:bg-zinc-100"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <span className="text-zinc-300 text-xs px-1">...</span>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className={`w-7 h-7 rounded-md text-xs font-medium transition-colors ${
                      currentPage === totalPages
                        ? "bg-emerald-500 text-white"
                        : "text-zinc-400 hover:bg-zinc-100"
                    }`}
                  >
                    {totalPages}
                  </button>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="px-2 py-1 rounded-md text-xs text-zinc-400 hover:bg-zinc-100 transition-colors flex items-center gap-0.5"
                  >
                    Next <ChevronRight size={12} />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}