"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/sidebar";
import { generatePastelBg, generatePastelText } from "@/lib/pastelColor";

// ─── Types ────────────────────────────────────────────────────────────────────
interface NeracaItem {
  id: number;
  kode: string;
  tanggal: string;
  uraian: string;
  noBukti: string;
  debet: string;
  kredit: string;
  saldo: string;
}

// ─── Dummy Data (replace with API fetch) ──────────────────────────────────────
const neracaData: NeracaItem[] = [
  {
    id: 1,
    kode: "A02",
    tanggal: "Rp5.900.000",
    uraian: "Agus Kurniawan",
    noBukti: "Rp95.900.000",
    debet: "Rp95.900.000",
    kredit: "Rp900.000",
    saldo: "0",
  },
  {
    id: 2,
    kode: "B0201",
    tanggal: "Rp5.900.000",
    uraian: "Firza Muldani",
    noBukti: "0",
    debet: "0",
    kredit: "0",
    saldo: "0",
  },
  {
    id: 3,
    kode: "B0302",
    tanggal: "Rp5.900.000",
    uraian: "Gihon Andre Asmitra Harahap",
    noBukti: "0",
    debet: "0",
    kredit: "0",
    saldo: "0",
  },
  {
    id: 4,
    kode: "C0204",
    tanggal: "Rp5.900.000",
    uraian: "Murra Candra Wicaksana",
    noBukti: "0",
    debet: "0",
    kredit: "0",
    saldo: "0",
  },
  {
    id: 5,
    kode: "A03",
    tanggal: "Rp6.500.000",
    uraian: "Budi Santoso",
    noBukti: "Rp13.000.000",
    debet: "Rp13.000.000",
    kredit: "Rp650.000",
    saldo: "Rp12.350.000",
  },
  {
    id: 6,
    kode: "B0401",
    tanggal: "Rp6.500.000",
    uraian: "Dewi Rahayu",
    noBukti: "0",
    debet: "0",
    kredit: "0",
    saldo: "0",
  },
  {
    id: 7,
    kode: "C0101",
    tanggal: "Rp7.200.000",
    uraian: "Hendra Wijaya",
    noBukti: "Rp21.600.000",
    debet: "Rp21.600.000",
    kredit: "Rp2.160.000",
    saldo: "Rp19.440.000",
  },
  {
    id: 8,
    kode: "C0102",
    tanggal: "Rp7.200.000",
    uraian: "Indah Permata Sari",
    noBukti: "0",
    debet: "0",
    kredit: "0",
    saldo: "0",
  },
  {
    id: 9,
    kode: "D0501",
    tanggal: "Rp5.900.000",
    uraian: "Joko Priyono",
    noBukti: "Rp5.900.000",
    debet: "Rp5.900.000",
    kredit: "Rp590.000",
    saldo: "Rp5.310.000",
  },
  {
    id: 10,
    kode: "D0502",
    tanggal: "Rp5.900.000",
    uraian: "Kartika Dewi",
    noBukti: "0",
    debet: "0",
    kredit: "0",
    saldo: "0",
  },
  {
    id: 11,
    kode: "E0601",
    tanggal: "Rp8.000.000",
    uraian: "Lutfi Hakim",
    noBukti: "Rp8.000.000",
    debet: "Rp8.000.000",
    kredit: "Rp800.000",
    saldo: "Rp7.200.000",
  },
  {
    id: 12,
    kode: "E0602",
    tanggal: "Rp8.000.000",
    uraian: "Maya Sari",
    noBukti: "0",
    debet: "0",
    kredit: "0",
    saldo: "0",
  },
  {
    id: 13,
    kode: "F0101",
    tanggal: "Rp4.750.000",
    uraian: "Nanda Pratama",
    noBukti: "Rp9.500.000",
    debet: "Rp9.500.000",
    kredit: "Rp950.000",
    saldo: "Rp8.550.000",
  },
  {
    id: 14,
    kode: "F0102",
    tanggal: "Rp4.750.000",
    uraian: "Oka Setiawan",
    noBukti: "0",
    debet: "0",
    kredit: "0",
    saldo: "0",
  },
  {
    id: 15,
    kode: "G0201",
    tanggal: "Rp5.200.000",
    uraian: "Putri Handayani",
    noBukti: "Rp5.200.000",
    debet: "Rp5.200.000",
    kredit: "Rp520.000",
    saldo: "Rp4.680.000",
  },
  {
    id: 16,
    kode: "G0202",
    tanggal: "Rp5.200.000",
    uraian: "Qori Amalia",
    noBukti: "0",
    debet: "0",
    kredit: "0",
    saldo: "0",
  },
  {
    id: 17,
    kode: "H0101",
    tanggal: "Rp3.900.000",
    uraian: "Rizki Ramadhan",
    noBukti: "Rp7.800.000",
    debet: "Rp7.800.000",
    kredit: "Rp780.000",
    saldo: "Rp7.020.000",
  },
  {
    id: 18,
    kode: "H0102",
    tanggal: "Rp3.900.000",
    uraian: "Sari Mulyani",
    noBukti: "0",
    debet: "0",
    kredit: "0",
    saldo: "0",
  },
  {
    id: 19,
    kode: "I0201",
    tanggal: "Rp4.200.000",
    uraian: "Tono Subekti",
    noBukti: "Rp4.200.000",
    debet: "Rp4.200.000",
    kredit: "Rp420.000",
    saldo: "Rp3.780.000",
  },
  {
    id: 20,
    kode: "I0202",
    tanggal: "Rp4.200.000",
    uraian: "Umar Faruq",
    noBukti: "0",
    debet: "0",
    kredit: "0",
    saldo: "0",
  },
  {
    id: 21,
    kode: "J0101",
    tanggal: "Rp3.500.000",
    uraian: "Vera Susanti",
    noBukti: "Rp3.500.000",
    debet: "Rp3.500.000",
    kredit: "Rp350.000",
    saldo: "Rp3.150.000",
  },
  {
    id: 22,
    kode: "J0102",
    tanggal: "Rp3.500.000",
    uraian: "Wawan Hermawan",
    noBukti: "0",
    debet: "0",
    kredit: "0",
    saldo: "0",
  },
  {
    id: 23,
    kode: "K0201",
    tanggal: "Rp3.800.000",
    uraian: "Xenia Claudia",
    noBukti: "Rp3.800.000",
    debet: "Rp3.800.000",
    kredit: "Rp380.000",
    saldo: "Rp3.420.000",
  },
  {
    id: 24,
    kode: "K0202",
    tanggal: "Rp3.800.000",
    uraian: "Yudi Prasetyo",
    noBukti: "0",
    debet: "0",
    kredit: "0",
    saldo: "0",
  },
  {
    id: 25,
    kode: "L0301",
    tanggal: "Rp4.100.000",
    uraian: "Zahra Nabila",
    noBukti: "Rp4.100.000",
    debet: "Rp4.100.000",
    kredit: "Rp410.000",
    saldo: "Rp3.690.000",
  },
  {
    id: 26,
    kode: "L0302",
    tanggal: "Rp4.100.000",
    uraian: "Ahmad Fauzi",
    noBukti: "0",
    debet: "0",
    kredit: "0",
    saldo: "0",
  },
  {
    id: 27,
    kode: "M0101",
    tanggal: "Rp5.900.000",
    uraian: "Bela Cantika",
    noBukti: "Rp5.900.000",
    debet: "Rp5.900.000",
    kredit: "Rp590.000",
    saldo: "Rp5.310.000",
  },
  {
    id: 28,
    kode: "M0102",
    tanggal: "Rp5.900.000",
    uraian: "Cahya Nugraha",
    noBukti: "0",
    debet: "0",
    kredit: "0",
    saldo: "0",
  },
];

const kodeOptions = [...new Set(neracaData.map((d) => d.kode))];

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
export default function NeracaKeuanganPage() {
  const [search, setSearch] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [kode, setKode] = useState("");
  const [page, setPage] = useState(1);
  const router = useRouter();
  const perPage = 4;

  // Data sudah ditarik — tinggal ganti dengan hasil fetch API
  const rawData = neracaData;

  const filtered = rawData.filter((d) => {
    const matchSearch =
      d.kode.toLowerCase().includes(search.toLowerCase()) ||
      d.uraian.toLowerCase().includes(search.toLowerCase());
    const matchKode = kode ? d.kode === kode : true;
    return matchSearch && matchKode;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  // Totals
  const totalDebet = filtered.reduce((sum, d) => {
    const val = parseFloat(d.debet.replace(/[^0-9]/g, "")) || 0;
    return sum + val;
  }, 0);
  const totalKredit = filtered.reduce((sum, d) => {
    const val = parseFloat(d.kredit.replace(/[^0-9]/g, "")) || 0;
    return sum + val;
  }, 0);
  const totalSaldo = filtered.reduce((sum, d) => {
    const val = parseFloat(d.saldo.replace(/[^0-9]/g, "")) || 0;
    return sum + val;
  }, 0);

  const formatRp = (val: number) =>
    val === 0 ? "0" : `Rp${val.toLocaleString("id-ID")}`;

  const pageNumbers = (): (number | string)[] => {
    if (totalPages <= 5)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | string)[] = [1, 2, 3, "...", totalPages];
    return pages;
  };

  const cols = [
    "No",
    "Kode",
    "Tanggal",
    "Uraian",
    "No. Bukti",
    "Debet",
    "Kredit",
    "Saldo",
    "Aksi",
  ];

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

          {/* Table Card */}
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
            {/* ── Toolbar row 1: Title + Tambah ── */}
            <div className="flex items-center justify-between px-5 pt-4 pb-3">
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
                  Neraca Keuangan
                </p>
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg transition-colors">
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Tambah Peserta
              </button>
            </div>

            {/* ── Toolbar row 2: Filters + Search ── */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-5 pb-4 border-b border-zinc-100">
              {/* Left: filters */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Tanggal */}
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-zinc-500 font-medium">
                    Tanggal
                  </span>
                  <div className="relative">
                    <input
                      type="date"
                      value={tanggal}
                      onChange={(e) => setTanggal(e.target.value)}
                      className="border border-zinc-200 rounded-lg pl-3 pr-8 py-1.5 text-xs text-zinc-700 outline-none focus:border-emerald-300 w-36 appearance-none"
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
                </div>

                {/* Kode */}
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-zinc-500 font-medium">
                    Kode
                  </span>
                  <div className="relative">
                    <select
                      value={kode}
                      onChange={(e) => {
                        setKode(e.target.value);
                        setPage(1);
                      }}
                      className="border border-zinc-200 rounded-lg pl-3 pr-8 py-1.5 text-xs text-zinc-700 outline-none focus:border-emerald-300 w-36 appearance-none bg-white"
                    >
                      <option value="">Pilih Kode</option>
                      {kodeOptions.map((k) => (
                        <option key={k} value={k}>
                          {k}
                        </option>
                      ))}
                    </select>
                    <svg
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-300 pointer-events-none"
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </div>

                {/* Terapkan + Cetak */}
                <button
                  onClick={() => setPage(1)}
                  className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  Terapkan
                </button>
                <button className="px-3 py-1.5 border border-zinc-200 text-zinc-600 hover:bg-zinc-50 text-xs font-semibold rounded-lg transition-colors">
                  Cetak
                </button>
              </div>

              {/* Right: search */}
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
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="border-b border-zinc-100">
                    {cols.map((h) => (
                      <th
                        key={h}
                        className={`px-4 py-3 text-[11px] font-semibold text-zinc-400 whitespace-nowrap ${h === "Aksi" ? "text-right" : "text-left"}`}
                      >
                        <span
                          className={`flex items-center gap-1 ${h === "Aksi" ? "justify-end" : ""}`}
                        >
                          {h}
                          {h !== "Aksi" && <SortIcon />}
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
                      <td className="px-4 py-3 text-xs text-zinc-700 font-medium">
                        {row.kode}
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-600">
                        {row.tanggal}
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-700">
                        {row.uraian}
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-600">
                        {row.noBukti}
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-700">
                        {row.debet}
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-700">
                        {row.kredit}
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-700">
                        {row.saldo}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="text-[11px] text-emerald-500 hover:text-emerald-600 font-semibold transition-colors">
                            Edit
                          </button>
                          <button className="text-[11px] text-red-400 hover:text-red-500 font-semibold transition-colors">
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {paginated.length === 0 && (
                    <tr>
                      <td
                        colSpan={9}
                        className="px-4 py-8 text-center text-xs text-zinc-400"
                      >
                        Tidak ada data ditemukan
                      </td>
                    </tr>
                  )}

                  {/* Total row */}
                  {paginated.length > 0 && (
                    <tr className="bg-zinc-50 border-t border-zinc-200">
                      <td
                        colSpan={5}
                        className="px-4 py-3 text-xs font-bold text-zinc-700 text-right"
                      >
                        Total
                      </td>
                      <td className="px-4 py-3 text-xs font-bold text-zinc-800">
                        {formatRp(totalDebet)}
                      </td>
                      <td className="px-4 py-3 text-xs font-bold text-zinc-800">
                        {formatRp(totalKredit)}
                      </td>
                      <td className="px-4 py-3 text-xs font-bold text-zinc-800">
                        {formatRp(totalSaldo)}
                      </td>
                      <td />
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
