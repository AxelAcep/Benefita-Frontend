"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/sidebar";
import { generatePastelBg, generatePastelText } from "@/lib/pastelColor";

// ─── Types ────────────────────────────────────────────────────────────────────
interface PerusahaanTargetItem {
  id: number;
  noInduk: string;
  perusahaanInstansi: string;
  totalPeserta: number;
  akunENV: string;
  akunCSR: string;
  akunTSM: string;
  akunEPM: string;
  alamat: string;
  noTelp: string;
}

// ─── Dummy Data (replace with API fetch) ──────────────────────────────────────
const perusahaanTargetData: PerusahaanTargetItem[] = [
  {
    id: 1,
    noInduk: "PR00001",
    perusahaanInstansi: "PT ABC",
    totalPeserta: 2,
    akunENV: "SL",
    akunCSR: "SL",
    akunTSM: "FIX",
    akunEPM: "R&U",
    alamat:
      "Perkantoran Hijau Arkadia Menara F Lt. 8 Jl. TB Simatupang Kav. 88 Jakarta Selatan 12520",
    noTelp:
      "021-2997 4000; 52034011(HO); 021-8834 6059-60;88021799 - 021 8834660701",
  },
  {
    id: 2,
    noInduk: "PR00002",
    perusahaanInstansi: "PT BCAA",
    totalPeserta: 0,
    akunENV: "SL",
    akunCSR: "SL",
    akunTSM: "FIX",
    akunEPM: "-",
    alamat:
      "Jl. Jawa 1 Blok J-11 Kawasan Industri MM2100 Cikarang Barat Kab. Bekasi - Jabar 17520",
    noTelp: "021-89812731; 0343-613700",
  },
  {
    id: 3,
    noInduk: "PR00003",
    perusahaanInstansi: "PT ABCCC",
    totalPeserta: 0,
    akunENV: "SL",
    akunCSR: "SL",
    akunTSM: "FIX",
    akunEPM: "R&U",
    alamat: "Jl. Margomulyo No. 44 Kav. E 1-2 Tandos Surabaya - Jatim 60183",
    noTelp: "(021) 28645455; (021) 28645455; (021) 25515555 HO",
  },
  {
    id: 4,
    noInduk: "PR00004",
    perusahaanInstansi: "PT BCASD",
    totalPeserta: 0,
    akunENV: "NW",
    akunCSR: "SL",
    akunTSM: "Cancel",
    akunEPM: "R&U",
    alamat: "Jl. Gajah Tunggal km. 1.0 Tangerang - Banten 15135",
    noTelp: "0271-7891410; 0271-7089238",
  },
  {
    id: 5,
    noInduk: "PR00005",
    perusahaanInstansi: "PT DEFGH",
    totalPeserta: 1,
    akunENV: "SL",
    akunCSR: "NW",
    akunTSM: "FIX",
    akunEPM: "R&U",
    alamat:
      "Jl. Industri Raya No. 5 Kawasan Industri Pulogadung Jakarta Timur 13920",
    noTelp: "021-4602345; 021-4602346",
  },
  {
    id: 6,
    noInduk: "PR00006",
    perusahaanInstansi: "PT IJKLM",
    totalPeserta: 3,
    akunENV: "FIX",
    akunCSR: "SL",
    akunTSM: "SL",
    akunEPM: "-",
    alamat: "Kawasan Industri KIIC Lot DD-1 Karawang Barat - Jawa Barat 41361",
    noTelp: "0267-8610234",
  },
  {
    id: 7,
    noInduk: "PR00007",
    perusahaanInstansi: "PT NOPQR",
    totalPeserta: 0,
    akunENV: "SL",
    akunCSR: "Cancel",
    akunTSM: "FIX",
    akunEPM: "R&U",
    alamat: "Jl. Raya Bogor Km 31 Cimanggis Depok - Jawa Barat 16953",
    noTelp: "021-8710345",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const akunBadgeStyle: Record<string, string> = {
  SL: "bg-emerald-50 text-emerald-600",
  FIX: "bg-blue-50 text-blue-500",
  NW: "bg-zinc-100 text-zinc-500",
  Cancel: "bg-red-50 text-red-500",
  "R&U": "bg-purple-50 text-purple-500",
  "-": "bg-zinc-50 text-zinc-400",
};

function AkunBadge({ value }: { value: string }) {
  const cls = akunBadgeStyle[value] ?? "bg-zinc-100 text-zinc-500";
  return (
    <span
      className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${cls}`}
    >
      {value}
    </span>
  );
}

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
export default function PerusahaanTargetPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const router = useRouter();
  const perPage = 4;

  // Data sudah ditarik — tinggal ganti dengan hasil fetch API
  const rawData = perusahaanTargetData;

  const filtered = rawData.filter(
    (d) =>
      d.noInduk.toLowerCase().includes(search.toLowerCase()) ||
      d.perusahaanInstansi.toLowerCase().includes(search.toLowerCase()) ||
      d.alamat.toLowerCase().includes(search.toLowerCase()),
  );
  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const pageNumbers = () => {
    if (totalPages <= 5)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | string)[] = [1, 2, 3];
    if (page > 4) pages.push("...");
    if (page > 3 && page < totalPages - 1) pages.push(page);
    pages.push("...");
    pages.push(totalPages);
    return [...new Set(pages)];
  };

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
        <div className="p-6">
          {/* Back button */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-800 transition-colors font-medium mb-4"
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

          {/* Table Card */}
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
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
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <p className="font-bold text-zinc-800 text-sm">List Peserta</p>
              </div>
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
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="border-b border-zinc-100">
                    <th className="px-4 py-3 text-[11px] font-semibold text-zinc-400 text-left w-10">
                      <span className="flex items-center gap-1">
                        No <SortIcon />
                      </span>
                    </th>
                    <th className="px-4 py-3 text-[11px] font-semibold text-zinc-400 text-left whitespace-nowrap">
                      No Induk
                    </th>
                    <th className="px-4 py-3 text-[11px] font-semibold text-zinc-400 text-left whitespace-nowrap">
                      Perusahaan/
                      <br />
                      Instansi
                    </th>
                    <th className="px-4 py-3 text-[11px] font-semibold text-zinc-400 text-left whitespace-nowrap">
                      Total Peserta
                    </th>
                    {/* Akun group */}
                    <th className="px-0 py-0" colSpan={4}>
                      <div className="border-b border-zinc-100">
                        <div className="text-center text-[11px] font-semibold text-zinc-400 py-1.5 border-b border-zinc-100">
                          Akun
                        </div>
                        <div className="grid grid-cols-4">
                          {["ENV", "CSR", "TSM", "EPM"].map((h) => (
                            <div
                              key={h}
                              className="px-3 py-2 text-[11px] font-semibold text-zinc-400 text-center"
                            >
                              {h}
                            </div>
                          ))}
                        </div>
                      </div>
                    </th>
                    <th className="px-4 py-3 text-[11px] font-semibold text-zinc-400 text-left">
                      Alamat
                    </th>
                    <th className="px-4 py-3 text-[11px] font-semibold text-zinc-400 text-left whitespace-nowrap">
                      No. Telp
                    </th>
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
                          {row.noInduk}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-emerald-500 font-medium hover:text-emerald-600 cursor-pointer transition-colors whitespace-nowrap">
                          {row.perusahaanInstansi}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-700">
                        {row.totalPeserta}
                      </td>
                      <td className="px-3 py-3 text-center">
                        <AkunBadge value={row.akunENV} />
                      </td>
                      <td className="px-3 py-3 text-center">
                        <AkunBadge value={row.akunCSR} />
                      </td>
                      <td className="px-3 py-3 text-center">
                        <AkunBadge value={row.akunTSM} />
                      </td>
                      <td className="px-3 py-3 text-center">
                        <AkunBadge value={row.akunEPM} />
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-600 max-w-[200px]">
                        <span className="line-clamp-2">{row.alamat}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-600 max-w-[180px]">
                        <span className="line-clamp-2">{row.noTelp}</span>
                      </td>
                    </tr>
                  ))}
                  {paginated.length === 0 && (
                    <tr>
                      <td
                        colSpan={10}
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
                      key={`ellipsis-${idx}`}
                      className="w-7 h-7 flex items-center justify-center text-[11px] text-zinc-400"
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setPage(p as number)}
                      className={`w-7 h-7 rounded-lg text-[11px] font-semibold transition-colors ${
                        p === page
                          ? "bg-emerald-500 text-white"
                          : "border border-zinc-200 text-zinc-500 hover:bg-zinc-50"
                      }`}
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
