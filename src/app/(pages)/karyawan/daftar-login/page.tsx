"use client";
import { useState } from "react";
import Sidebar from "@/components/sidebar";
import { Filter, Search } from "lucide-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Icons } from "@/assets";
import { generatePastelBg, generatePastelText } from "@/lib/pastelColor";

interface LogLogin {
  no: number;
  userId: string;
  tglLogin: string;
  ipAddress: string;
}

const data: LogLogin[] = [
  { no: 1,  userId: "admin_super",    tglLogin: "03 Feb 2026, 08:30:15", ipAddress: "192.168.1.185" },
  { no: 2,  userId: "eni_sales",      tglLogin: "03 Feb 2026, 06:15:22", ipAddress: "10.0.0.52"     },
  { no: 3,  userId: "sylva_marketing",tglLogin: "03 Feb 2026, 08:05:41", ipAddress: "192.168.1.201" },
  { no: 4,  userId: "dimas_jr",       tglLogin: "03 Feb 2026, 07:55:10", ipAddress: "172.16.254.1"  },
  { no: 5,  userId: "rifqi_sales",    tglLogin: "02 Feb 2026, 17:45:30", ipAddress: "10.0.0.18"     },
  { no: 6,  userId: "admin_super",    tglLogin: "02 Feb 2026, 13:20:05", ipAddress: "192.168.1.185" },
  { no: 7,  userId: "eni_sales",      tglLogin: "02 Feb 2026, 08:22:15", ipAddress: "10.0.0.52"     },
  { no: 8,  userId: "sylva_marketing",tglLogin: "01 Feb 2026, 09:10:45", ipAddress: "192.168.1.201" },
  { no: 9,  userId: "rifqi_sales",    tglLogin: "01 Feb 2026, 08:05:30", ipAddress: "10.0.0.18"     },
  { no: 10, userId: "dimas_jr",       tglLogin: "31 Jan 2026, 08:50:12", ipAddress: "172.16.254.1"  },
];

export default function DaftarLoginPage() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 7;

  const filtered = data.filter((r) =>
    r.userId.toLowerCase().includes(search.toLowerCase()) ||
    r.ipAddress.includes(search)
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
              <span className="font-semibold text-zinc-700">Daftar Login</span>
            </p>
            <p className="text-xs text-zinc-400 mt-0.5">Hari ini: Selasa, 3 Februari 2026</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-zinc-800">Nanang</p>
              <p className="text-[10px] text-zinc-400">Super Admin</p>
            </div>
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
              style={{ backgroundColor: generatePastelBg("Nanang"), color: generatePastelText("Nanang") }}
            >
              N
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-3 sm:p-6">
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">

            {/* Table Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-4 py-3 border-b border-zinc-100">
              <div className="flex items-center gap-1.5 shrink-0">
                <img src={Icons.Perubahan.src} className="w-4 h-auto" alt="Login" />
                <span className="font-semibold text-zinc-800 text-xs">Log Login</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 bg-zinc-50 border border-zinc-200 rounded-lg px-2.5 py-1.5 flex-1 sm:flex-none">
                  <Search size={11} className="text-zinc-400 shrink-0" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari User ID atau IP..."
                    className="text-xs bg-transparent outline-none text-zinc-600 w-full sm:w-36 placeholder:text-zinc-300"
                  />
                </div>
                <button className="flex items-center gap-1 border border-zinc-200 rounded-lg px-2.5 py-1.5 text-xs text-zinc-600 hover:bg-zinc-50 transition-colors shrink-0">
                  <Filter size={11} />
                  Filter
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs" style={{ minWidth: "400px" }}>
                <thead>
                  <tr className="border-b border-zinc-100 text-zinc-400 uppercase text-[10px]">
                    {["No", "User ID", "Tgl. Login", "IP Address"].map((h) => (
                      <th key={h} className="text-left px-4 py-2.5 font-medium whitespace-nowrap">
                        <span className="flex items-center gap-1">
                          {h}
                          {["User ID", "Tgl. Login"].includes(h) && (
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
                      <td className="px-4 py-2.5 text-zinc-400 w-10">{row.no}</td>
                      <td className="px-4 py-2.5 font-medium text-zinc-700 whitespace-nowrap">{row.userId}</td>
                      <td className="px-4 py-2.5 text-zinc-500 whitespace-nowrap">{row.tglLogin}</td>
                      <td className="px-4 py-2.5 text-zinc-400 font-mono whitespace-nowrap">{row.ipAddress}</td>
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
                        currentPage === p ? "bg-emerald-500 text-white" : "text-zinc-400 hover:bg-zinc-100"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <span className="text-zinc-300 text-xs px-1">...</span>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className={`w-7 h-7 rounded-md text-xs font-medium transition-colors ${
                      currentPage === totalPages ? "bg-emerald-500 text-white" : "text-zinc-400 hover:bg-zinc-100"
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