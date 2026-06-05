"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/sidebar";
import { generatePastelBg, generatePastelText } from "@/lib/pastelColor";

// ─── Types ────────────────────────────────────────────────────────────────────
interface RekapItem {
  id: number;
  kode: string;
  harga: string;
  peserta: string;
  pendapatan: string;
  isStrikethrough?: boolean;
}

type ActiveTab = "reguler" | "inhouse";

// ─── Dummy Data (replace with API fetch) ──────────────────────────────────────
const regulerData: RekapItem[] = [
  {
    id: 1,
    kode: "ENG-01",
    harga: "Rp5.900.000",
    peserta: "Agus Kurniawan",
    pendapatan: "Rp95.900.000",
  },
  {
    id: 2,
    kode: "ENG-01",
    harga: "Rp5.900.000",
    peserta: "Firza Muldani",
    pendapatan: "0",
  },
  {
    id: 3,
    kode: "ENG-01",
    harga: "Rp5.900.000",
    peserta: "Gihon Andre Asmitra Harahap",
    pendapatan: "0",
  },
  {
    id: 4,
    kode: "ENG-01",
    harga: "Rp5.900.000",
    peserta: "Murra Candra Wicaksana",
    pendapatan: "0",
    isStrikethrough: true,
  },
  {
    id: 5,
    kode: "ENG-02",
    harga: "Rp6.500.000",
    peserta: "Budi Santoso",
    pendapatan: "Rp13.000.000",
  },
  {
    id: 6,
    kode: "ENG-02",
    harga: "Rp6.500.000",
    peserta: "Dewi Rahayu",
    pendapatan: "0",
  },
  {
    id: 7,
    kode: "ENG-03",
    harga: "Rp7.200.000",
    peserta: "Hendra Wijaya",
    pendapatan: "Rp21.600.000",
  },
  {
    id: 8,
    kode: "ENG-03",
    harga: "Rp7.200.000",
    peserta: "Indah Permata Sari",
    pendapatan: "0",
  },
  {
    id: 9,
    kode: "EM-05",
    harga: "Rp5.900.000",
    peserta: "Joko Priyono",
    pendapatan: "Rp5.900.000",
  },
  {
    id: 10,
    kode: "EM-05",
    harga: "Rp5.900.000",
    peserta: "Kartika Dewi",
    pendapatan: "0",
  },
  {
    id: 11,
    kode: "EM-06",
    harga: "Rp8.000.000",
    peserta: "Lutfi Hakim",
    pendapatan: "Rp8.000.000",
  },
  {
    id: 12,
    kode: "EM-06",
    harga: "Rp8.000.000",
    peserta: "Maya Sari",
    pendapatan: "0",
  },
  {
    id: 13,
    kode: "ENV-01",
    harga: "Rp4.750.000",
    peserta: "Nanda Pratama",
    pendapatan: "Rp9.500.000",
  },
  {
    id: 14,
    kode: "ENV-01",
    harga: "Rp4.750.000",
    peserta: "Oka Setiawan",
    pendapatan: "0",
  },
  {
    id: 15,
    kode: "ENV-02",
    harga: "Rp5.200.000",
    peserta: "Putri Handayani",
    pendapatan: "Rp5.200.000",
  },
  {
    id: 16,
    kode: "ENV-02",
    harga: "Rp5.200.000",
    peserta: "Qori Amalia",
    pendapatan: "0",
  },
  {
    id: 17,
    kode: "HSE-01",
    harga: "Rp3.900.000",
    peserta: "Rizki Ramadhan",
    pendapatan: "Rp7.800.000",
  },
  {
    id: 18,
    kode: "HSE-01",
    harga: "Rp3.900.000",
    peserta: "Sari Mulyani",
    pendapatan: "0",
  },
  {
    id: 19,
    kode: "HSE-02",
    harga: "Rp4.200.000",
    peserta: "Tono Subekti",
    pendapatan: "Rp4.200.000",
  },
  {
    id: 20,
    kode: "HSE-02",
    harga: "Rp4.200.000",
    peserta: "Umar Faruq",
    pendapatan: "0",
  },
  {
    id: 21,
    kode: "K3-01",
    harga: "Rp3.500.000",
    peserta: "Vera Susanti",
    pendapatan: "Rp3.500.000",
  },
  {
    id: 22,
    kode: "K3-01",
    harga: "Rp3.500.000",
    peserta: "Wawan Hermawan",
    pendapatan: "0",
  },
  {
    id: 23,
    kode: "K3-02",
    harga: "Rp3.800.000",
    peserta: "Xenia Claudia",
    pendapatan: "Rp3.800.000",
  },
  {
    id: 24,
    kode: "K3-02",
    harga: "Rp3.800.000",
    peserta: "Yudi Prasetyo",
    pendapatan: "0",
  },
  {
    id: 25,
    kode: "K3-03",
    harga: "Rp4.100.000",
    peserta: "Zahra Nabila",
    pendapatan: "Rp4.100.000",
  },
  {
    id: 26,
    kode: "K3-03",
    harga: "Rp4.100.000",
    peserta: "Ahmad Fauzi",
    pendapatan: "0",
  },
  {
    id: 27,
    kode: "PPPU-01",
    harga: "Rp5.900.000",
    peserta: "Bela Cantika",
    pendapatan: "Rp5.900.000",
  },
  {
    id: 28,
    kode: "PPPU-01",
    harga: "Rp5.900.000",
    peserta: "Cahya Nugraha",
    pendapatan: "0",
  },
];

const inhouseData: RekapItem[] = [
  {
    id: 1,
    kode: "IH-01",
    harga: "Rp45.000.000",
    peserta: "PT Sumber Energi Tbk",
    pendapatan: "Rp45.000.000",
  },
  {
    id: 2,
    kode: "IH-01",
    harga: "Rp45.000.000",
    peserta: "PT Maju Bersama",
    pendapatan: "0",
  },
  {
    id: 3,
    kode: "IH-02",
    harga: "Rp38.500.000",
    peserta: "PT Karya Mandiri",
    pendapatan: "Rp38.500.000",
  },
  {
    id: 4,
    kode: "IH-02",
    harga: "Rp38.500.000",
    peserta: "PT Nusantara Jaya",
    pendapatan: "0",
  },
  {
    id: 5,
    kode: "IH-03",
    harga: "Rp52.000.000",
    peserta: "PT Indo Energi",
    pendapatan: "Rp52.000.000",
  },
  {
    id: 6,
    kode: "IH-03",
    harga: "Rp52.000.000",
    peserta: "PT Global Konstruksi",
    pendapatan: "0",
  },
  {
    id: 7,
    kode: "IH-04",
    harga: "Rp29.750.000",
    peserta: "PT Alam Raya",
    pendapatan: "Rp29.750.000",
  },
  {
    id: 8,
    kode: "IH-04",
    harga: "Rp29.750.000",
    peserta: "PT Bumi Pertiwi",
    pendapatan: "0",
  },
  {
    id: 9,
    kode: "IH-05",
    harga: "Rp61.000.000",
    peserta: "PT Cipta Karya Utama",
    pendapatan: "Rp61.000.000",
  },
  {
    id: 10,
    kode: "IH-05",
    harga: "Rp61.000.000",
    peserta: "PT Delta Solusi",
    pendapatan: "0",
  },
  {
    id: 11,
    kode: "IH-06",
    harga: "Rp33.000.000",
    peserta: "PT Ekuator Indonesia",
    pendapatan: "Rp33.000.000",
  },
  {
    id: 12,
    kode: "IH-06",
    harga: "Rp33.000.000",
    peserta: "PT Fajar Terang",
    pendapatan: "0",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function SortIcon() {
  return (
    <svg
      width="8"
      height="8"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M7 15l5 5 5-5" />
      <path d="M7 9l5-5 5 5" />
    </svg>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function RekapPotensiPendapatanPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("reguler");
  const [search, setSearch] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [appliedTanggal, setAppliedTanggal] = useState("");
  const [page, setPage] = useState(1);
  const router = useRouter();
  const perPage = 4;

  // Data sudah ditarik — tinggal ganti dengan hasil fetch API
  const rawData = activeTab === "reguler" ? regulerData : inhouseData;

  const filtered = rawData.filter(
    (d) =>
      d.kode.toLowerCase().includes(search.toLowerCase()) ||
      d.peserta.toLowerCase().includes(search.toLowerCase()) ||
      d.harga.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    setPage(1);
    setSearch("");
  };

  const pageNumbers = (): (number | string)[] => {
    if (totalPages <= 5)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | string)[] = [1, 2, 3];
    if (page > 4 && page < totalPages - 1) {
      pages.push("...");
      pages.push(page);
    }
    pages.push("...");
    pages.push(totalPages);
    return [...new Set(pages)];
  };

  const cols = ["No", "Kode", "Harga", "Peserta", "Pendapatan"];

  return (
    <div className="flex min-h-screen bg-zinc-100 overflow-hidden">
      <Sidebar />

      <div className="flex flex-col flex-1 md:ml-[250px] min-w-0 overflow-x-hidden">
        {/* Page Header */}
        <div className="px-6 py-4 bg-white border-b border-zinc-100 flex items-center justify-between">
          <div>
            <p className="text-xs text-zinc-400">
              Perusahaan &rsaquo;{" "}
              <span className="font-semibold text-zinc-700">Input Data</span>
            </p>
            <p className="text-xs text-zinc-400 mt-0.5">
              Hari ini: Selasa, 3 Februari 2026
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <p className="text-xs font-semibold text-zinc-800">Nanang</p>
              <p className="text-[10px] text-zinc-400">Super Admin</p>
            </div>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
              style={{
                backgroundColor: generatePastelBg("Nanang"),
                color: generatePastelText("Nanang"),
              }}
            >
              N
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Back */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-800 transition-colors font-medium"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Kembali
          </button>

          {/* Tabs */}
          <div className="flex items-center gap-0 border-b border-zinc-200">
            {(["reguler", "inhouse"] as ActiveTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`px-4 pb-2.5 text-xs font-semibold capitalize transition-colors border-b-2 -mb-px ${
                  activeTab === tab
                    ? "border-emerald-500 text-emerald-500"
                    : "border-transparent text-zinc-400 hover:text-zinc-600"
                }`}
              >
                {tab === "reguler" ? "Reguler" : "In House"}
              </button>
            ))}
          </div>

          {/* Table Card */}
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-zinc-100">
              <div className="flex items-center gap-3">
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
                    Rekap Potensi dan Realisasi Pendapatan
                  </p>
                </div>

                {/* Date filter */}
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
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  </div>
                  <button
                    onClick={() => {
                      setAppliedTanggal(tanggal);
                      setPage(1);
                    }}
                    className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg transition-colors"
                  >
                    Terapkan
                  </button>
                </div>
              </div>

              {/* Search */}
              <div className="relative">
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
                    setPage(1);
                  }}
                  className="pl-7 pr-3 py-1.5 border border-zinc-200 rounded-lg text-xs text-zinc-700 outline-none focus:border-emerald-300 w-48"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[550px]">
                <thead>
                  <tr className="border-b border-zinc-100">
                    {cols.map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-[11px] font-semibold text-zinc-400 text-left whitespace-nowrap"
                      >
                        <span className="flex items-center gap-1">
                          {h}
                          <SortIcon />
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((row, i) => (
                    <tr
                      key={row.id}
                      className="border-b border-zinc-50 hover:bg-zinc-50 transition-colors"
                    >
                      <td className="px-4 py-3 text-xs text-zinc-500">
                        {(page - 1) * perPage + i + 1}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-emerald-500 font-medium hover:text-emerald-600 cursor-pointer transition-colors">
                          {row.kode}
                        </span>
                      </td>
                      <td
                        className={`px-4 py-3 text-xs text-zinc-700 ${row.isStrikethrough ? "line-through text-zinc-400" : ""}`}
                      >
                        {row.harga}
                      </td>
                      <td
                        className={`px-4 py-3 text-xs text-zinc-700 ${row.isStrikethrough ? "line-through text-zinc-400" : ""}`}
                      >
                        {row.peserta}
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-700">
                        {row.pendapatan}
                      </td>
                    </tr>
                  ))}
                  {paginated.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-8 text-center text-xs text-zinc-400"
                      >
                        Tidak ada data ditemukan
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-5 py-3 border-t border-zinc-100">
              <p className="text-[11px] text-zinc-400">
                Menampilkan{" "}
                <span className="font-semibold text-zinc-600">
                  {paginated.length}
                </span>{" "}
                dari{" "}
                <span className="font-semibold text-zinc-600">
                  {filtered.length}
                </span>{" "}
                data
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 text-[11px] border border-zinc-200 rounded-lg text-zinc-500 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  ‹ Sebelumnya
                </button>
                {pageNumbers().map((p, idx) =>
                  p === "..." ? (
                    <span
                      key={`e-${idx}`}
                      className="w-7 h-7 flex items-center justify-center text-[11px] text-zinc-400"
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setPage(p as number)}
                      className={`w-7 h-7 rounded-lg text-[11px] font-semibold transition-colors ${p === page ? "bg-emerald-500 text-white" : "border border-zinc-200 text-zinc-500 hover:bg-zinc-50"}`}
                    >
                      {p}
                    </button>
                  ),
                )}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages || totalPages === 0}
                  className="px-3 py-1.5 text-[11px] border border-zinc-200 rounded-lg text-zinc-500 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Selanjutnya ›
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
