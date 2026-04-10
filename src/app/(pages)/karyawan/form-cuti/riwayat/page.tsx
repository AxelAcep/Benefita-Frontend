"use client";
import { useState } from "react";
import { Search, Filter, ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";
import { generatePastelBg, generatePastelText } from "@/lib/pastelColor";
import { Icons } from "@/assets";
import Sidebar from "@/components/sidebar";
import { DetailModal } from "@/components/karyawan/DetailModal";

interface PengajuanItem {
  id: number;
  tanggalPengajuan: string;
  nama: string;
  jabatan: string;
  divisi: string;
  jenisIzin: string;
  periodeAwal: string;
  periodeAkhir: string;
  alasan: string;
  lampiran: string | null;
}


// ─── Types ───
interface CutiRow {
  no: number;
  tglPengajuan: string;
  tglDiproses: string | null;
  jenisIzin: "Sakit" | "Cuti";
  periode: string;
  alasan: string;
  status: "Disetujui" | "Menunggu" | "Ditolak";
}

// ─── Dummy Data ───
const data: CutiRow[] = [
  { no: 1, tglPengajuan: "03 Feb 2026, 14:30 WIB", tglDiproses: "03 Feb 2026, 14:30 WIB", jenisIzin: "Sakit", periode: "03 Feb 2026 – 04 Feb 2026", alasan: "Sakit tenggorokan bisa disebabkan oleh infeksi virus atau bakteri yang menyebabkan...", status: "Disetujui" },
  { no: 2, tglPengajuan: "03 Feb 2026, 11:15 WIB", tglDiproses: null,                       jenisIzin: "Cuti",  periode: "03 Feb 2026 – 04 Feb 2026", alasan: "Saya merasa tidak enak badan karena flu yang membuat aktivitas terganggu...", status: "Menunggu" },
  { no: 3, tglPengajuan: "02 Feb 2026, 09:45 WIB", tglDiproses: "02 Feb 2026, 09:45 WIB", jenisIzin: "Sakit", periode: "03 Feb 2026 – 04 Feb 2026", alasan: "Sakit Tenggorokan", status: "Disetujui" },
  { no: 4, tglPengajuan: "01 Feb 2026, 16:20 WIB", tglDiproses: null,                       jenisIzin: "Cuti",  periode: "03 Feb 2026 – 04 Feb 2026", alasan: "Acara Keluarga", status: "Menunggu" },
  { no: 5, tglPengajuan: "31 Jan 2026, 10:05 WIB", tglDiproses: "31 Jan 2026, 10:05 WIB", jenisIzin: "Sakit", periode: "03 Feb 2026 – 04 Feb 2026", alasan: "Sakit Tenggorokan", status: "Disetujui" },
  { no: 6, tglPengajuan: "30 Jan 2026, 15:45 WIB", tglDiproses: null,                       jenisIzin: "Cuti",  periode: "03 Feb 2026 – 04 Feb 2026", alasan: "Acara Keluarga", status: "Menunggu" },
  { no: 7, tglPengajuan: "28 Jan 2026, 08:30 WIB", tglDiproses: "28 Jan 2026, 08:30 WIB", jenisIzin: "Sakit", periode: "03 Feb 2026 – 04 Feb 2026", alasan: "Sakit Tenggorokan", status: "Disetujui" },
  { no: 8, tglPengajuan: "25 Jan 2026, 13:20 WIB", tglDiproses: "25 Jan 2026, 13:20 WIB", jenisIzin: "Cuti",  periode: "03 Feb 2026 – 04 Feb 2026", alasan: "Acara Keluarga", status: "Disetujui" },
  { no: 9, tglPengajuan: "28 Jan 2026, 08:30 WIB", tglDiproses: "28 Jan 2026, 08:30 WIB", jenisIzin: "Sakit", periode: "03 Feb 2026 – 04 Feb 2026", alasan: "Sakit Tenggorokan", status: "Ditolak" },
];

const statusStyle: Record<CutiRow["status"], string> = {
  Disetujui: "bg-emerald-100 text-emerald-600",
  Menunggu:  "bg-yellow-100 text-yellow-600",
  Ditolak:   "bg-red-100 text-red-500",
};

export default function RiwayatCuti() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 3;
  const [selectedItem, setSelectedItem] = useState<CutiRow | null>(null);

  const filtered = data.filter((r) =>
    r.alasan.toLowerCase().includes(search.toLowerCase()) ||
    r.jenisIzin.toLowerCase().includes(search.toLowerCase())
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
              <span className="font-semibold text-zinc-700">Form Cuti/Sakit</span>
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
                <span className="text-emerald-500">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0"/><path d="M12 8v4l3 3"/>
                  </svg>
                </span>
                <span className="font-semibold text-zinc-800 text-xs">Riwayat Pengajuan Cuti/Sakit</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 bg-zinc-50 border border-zinc-200 rounded-lg px-2.5 py-1.5 flex-1 sm:flex-none">
                  <Search size={11} className="text-zinc-400 shrink-0" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari Informasi..."
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
              <table className="w-full text-xs" style={{ minWidth: "780px" }}>
                <thead>
                  <tr className="border-b border-zinc-100 text-zinc-400 text-[10px]">
                    {[
                      { label: "No",                sortable: false },
                      { label: "Tanggal Pengajuan", sortable: true  },
                      { label: "Tanggal Diproses",  sortable: true  },
                      { label: "Jenis Izin",        sortable: true  },
                      { label: "Periode Pengajuan", sortable: true  },
                      { label: "Alasan",            sortable: false },
                      { label: "Status",            sortable: true  },
                      { label: "Detail",            sortable: false },
                    ].map(({ label, sortable }) => (
                      <th key={label} className="text-left px-4 py-2.5 font-medium whitespace-nowrap">
                        <span className="flex items-center gap-1">
                          {label}
                          {sortable && <ArrowUpDown size={10} className="text-zinc-300" />}
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
                      <td className="px-4 py-3 text-zinc-400 w-10">{row.no}</td>
                      <td className="px-4 py-3 text-zinc-600 whitespace-nowrap">{row.tglPengajuan}</td>
                      <td className="px-4 py-3 text-zinc-500 whitespace-nowrap">
                        {row.tglDiproses ?? <span className="text-zinc-300">–</span>}
                      </td>
                      <td className="px-4 py-3 text-zinc-600 whitespace-nowrap">{row.jenisIzin}</td>
                      <td className="px-4 py-3 text-zinc-500 whitespace-nowrap">{row.periode}</td>
                      <td className="px-4 py-3 text-zinc-500 max-w-[200px]"> 
                        <span className="line-clamp-2 leading-relaxed">{row.alasan}</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-medium ${statusStyle[row.status]}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <button onClick={() => setSelectedItem(row)} className="text-emerald-500 hover:text-emerald-600 cursor-pointer flex items-center gap-0.5 text-xs">
                          Lihat Detail
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-4 py-3 border-t border-zinc-100">
              <span className="text-[11px] text-zinc-400">
                Menampilkan <span className="font-semibold text-zinc-600">{filtered.length}</span> dari{" "}
                <span className="font-semibold text-zinc-600">{data.length}</span> data
              </span>
              <div className="overflow-x-auto">
                <div className="flex items-center gap-1 w-max">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="px-2 py-1 rounded-md text-xs text-zinc-400 hover:bg-zinc-100 transition-colors flex items-center gap-0.5"
                  >
                    <ChevronLeft size={12} /> Prev
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
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
    
    <DetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    
    </div>
  );
}