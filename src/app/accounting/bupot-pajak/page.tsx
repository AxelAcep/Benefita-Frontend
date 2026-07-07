"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/sidebar";
import { generatePastelBg, generatePastelText } from "@/lib/pastelColor";

// ─── Types ────────────────────────────────────────────────────────────────────
interface InvoiceItem {
  id: number;
  instansi: string;
  noInvoice: string;
  kodePelTgl: string;
  harga: string;
  bayar: string | number;
  pengirimanBerkas: string;
  pengirimanDitujukan: string;
  pengirimanPenerima: string;
  bupot: string;
}

// ─── Dummy Data (replace with API fetch) ──────────────────────────────────────
const invoiceData: InvoiceItem[] = [
  {
    id: 1,
    instansi: "PT Sucofindo Cabang Semarang",
    noInvoice: "0200/INV/REG-WM-01/VI/26",
    kodePelTgl: "WM-01 / 04-06 Mei 2026",
    harga: "Rp20.000.000",
    bayar: 0,
    pengirimanBerkas: "-",
    pengirimanDitujukan: "-",
    pengirimanPenerima: "-",
    bupot: "Belum",
  },
  {
    id: 2,
    instansi: "Institut Teknologi Kalimantan",
    noInvoice: "0199/INV/REG-EP-14/VI/26",
    kodePelTgl: "EP-14 / 22-25 Juni 2026",
    harga: "Rp15.650.000",
    bayar: 0,
    pengirimanBerkas: "-",
    pengirimanDitujukan: "-",
    pengirimanPenerima: "-",
    bupot: "Belum",
  },
  {
    id: 3,
    instansi: "PT PLN (Persero)",
    noInvoice: "0198/INV/REG-EM-05/VI/26",
    kodePelTgl: "EM-05 / 10-12 Juni 2026",
    harga: "Rp11.800.000",
    bayar: 0,
    pengirimanBerkas: "Terkirim",
    pengirimanDitujukan: "Pak Budi",
    pengirimanPenerima: "Ibu Sari",
    bupot: "Sudah",
  },
  {
    id: 4,
    instansi: "PT Pertamina EP",
    noInvoice: "0197/INV/REG-ENV-02/V/26",
    kodePelTgl: "ENV-02 / 05-07 Mei 2026",
    harga: "Rp23.500.000",
    bayar: "Rp23.500.000",
    pengirimanBerkas: "Terkirim",
    pengirimanDitujukan: "Bu Ani",
    pengirimanPenerima: "Pak Joko",
    bupot: "Sudah",
  },
  {
    id: 5,
    instansi: "CV Mitra Teknik",
    noInvoice: "0196/INV/REG-K3-01/V/26",
    kodePelTgl: "K3-01 / 20-22 Mei 2026",
    harga: "Rp7.800.000",
    bayar: 0,
    pengirimanBerkas: "-",
    pengirimanDitujukan: "-",
    pengirimanPenerima: "-",
    bupot: "Belum",
  },
  {
    id: 6,
    instansi: "PT Krakatau Steel",
    noInvoice: "0195/INV/REG-HSE-02/V/26",
    kodePelTgl: "HSE-02 / 15-17 Mei 2026",
    harga: "Rp16.400.000",
    bayar: "Rp16.400.000",
    pengirimanBerkas: "Terkirim",
    pengirimanDitujukan: "Pak Hendra",
    pengirimanPenerima: "Bu Dewi",
    bupot: "Sudah",
  },
  {
    id: 7,
    instansi: "PT Pupuk Kujang",
    noInvoice: "0194/INV/REG-ENG-03/IV/26",
    kodePelTgl: "ENG-03 / 28-30 Apr 2026",
    harga: "Rp14.400.000",
    bayar: 0,
    pengirimanBerkas: "-",
    pengirimanDitujukan: "-",
    pengirimanPenerima: "-",
    bupot: "Belum",
  },
  {
    id: 8,
    instansi: "PT Holcim Indonesia",
    noInvoice: "0193/INV/REG-PPPU-01/IV/26",
    kodePelTgl: "PPPU-01 / 21-23 Apr 2026",
    harga: "Rp11.800.000",
    bayar: "Rp5.900.000",
    pengirimanBerkas: "Terkirim",
    pengirimanDitujukan: "Pak Agus",
    pengirimanPenerima: "Ibu Rina",
    bupot: "Belum",
  },
  {
    id: 9,
    instansi: "PT Unilever Indonesia",
    noInvoice: "0192/INV/REG-WM-02/IV/26",
    kodePelTgl: "WM-02 / 14-16 Apr 2026",
    harga: "Rp20.000.000",
    bayar: "Rp20.000.000",
    pengirimanBerkas: "Terkirim",
    pengirimanDitujukan: "Bu Kartika",
    pengirimanPenerima: "Pak Rizki",
    bupot: "Sudah",
  },
  {
    id: 10,
    instansi: "PT Astra International",
    noInvoice: "0191/INV/REG-ENG-01/IV/26",
    kodePelTgl: "ENG-01 / 07-09 Apr 2026",
    harga: "Rp17.700.000",
    bayar: 0,
    pengirimanBerkas: "-",
    pengirimanDitujukan: "-",
    pengirimanPenerima: "-",
    bupot: "Belum",
  },
  // more entries for pagination demo
  {
    id: 11,
    instansi: "PT Semen Indonesia",
    noInvoice: "0190/INV/REG-ENV-01/III/26",
    kodePelTgl: "ENV-01 / 24-26 Mar 2026",
    harga: "Rp9.500.000",
    bayar: "Rp9.500.000",
    pengirimanBerkas: "Terkirim",
    pengirimanDitujukan: "Pak Lutfi",
    pengirimanPenerima: "Bu Maya",
    bupot: "Sudah",
  },
  {
    id: 12,
    instansi: "PT Indocement",
    noInvoice: "0189/INV/REG-HSE-01/III/26",
    kodePelTgl: "HSE-01 / 17-19 Mar 2026",
    harga: "Rp7.800.000",
    bayar: 0,
    pengirimanBerkas: "-",
    pengirimanDitujukan: "-",
    pengirimanPenerima: "-",
    bupot: "Belum",
  },
  {
    id: 13,
    instansi: "PT Timah Tbk",
    noInvoice: "0188/INV/REG-EM-06/III/26",
    kodePelTgl: "EM-06 / 10-12 Mar 2026",
    harga: "Rp16.000.000",
    bayar: "Rp16.000.000",
    pengirimanBerkas: "Terkirim",
    pengirimanDitujukan: "Bu Nanda",
    pengirimanPenerima: "Pak Oka",
    bupot: "Sudah",
  },
  {
    id: 14,
    instansi: "PT Antam Tbk",
    noInvoice: "0187/INV/REG-K3-02/III/26",
    kodePelTgl: "K3-02 / 03-05 Mar 2026",
    harga: "Rp7.600.000",
    bayar: 0,
    pengirimanBerkas: "-",
    pengirimanDitujukan: "-",
    pengirimanPenerima: "-",
    bupot: "Belum",
  },
  {
    id: 15,
    instansi: "PT Bukit Asam",
    noInvoice: "0186/INV/REG-ENG-02/II/26",
    kodePelTgl: "ENG-02 / 24-26 Feb 2026",
    harga: "Rp13.000.000",
    bayar: "Rp13.000.000",
    pengirimanBerkas: "Terkirim",
    pengirimanDitujukan: "Pak Tono",
    pengirimanPenerima: "Bu Vera",
    bupot: "Sudah",
  },
  {
    id: 16,
    instansi: "PT Medco Energi",
    noInvoice: "0185/INV/REG-PPPU-02/II/26",
    kodePelTgl: "PPPU-02 / 17-19 Feb 2026",
    harga: "Rp11.800.000",
    bayar: 0,
    pengirimanBerkas: "-",
    pengirimanDitujukan: "-",
    pengirimanPenerima: "-",
    bupot: "Belum",
  },
  {
    id: 17,
    instansi: "PT Badak NGL",
    noInvoice: "0184/INV/REG-ENV-03/II/26",
    kodePelTgl: "ENV-03 / 10-12 Feb 2026",
    harga: "Rp9.500.000",
    bayar: "Rp9.500.000",
    pengirimanBerkas: "Terkirim",
    pengirimanDitujukan: "Bu Putri",
    pengirimanPenerima: "Pak Wawan",
    bupot: "Sudah",
  },
  {
    id: 18,
    instansi: "PT Saka Energi",
    noInvoice: "0183/INV/REG-WM-03/II/26",
    kodePelTgl: "WM-03 / 03-05 Feb 2026",
    harga: "Rp20.000.000",
    bayar: 0,
    pengirimanBerkas: "-",
    pengirimanDitujukan: "-",
    pengirimanPenerima: "-",
    bupot: "Belum",
  },
  {
    id: 19,
    instansi: "PT Rekayasa Industri",
    noInvoice: "0182/INV/REG-HSE-03/I/26",
    kodePelTgl: "HSE-03 / 27-29 Jan 2026",
    harga: "Rp8.400.000",
    bayar: "Rp8.400.000",
    pengirimanBerkas: "Terkirim",
    pengirimanDitujukan: "Pak Xenia",
    pengirimanPenerima: "Bu Yudi",
    bupot: "Sudah",
  },
  {
    id: 20,
    instansi: "PT Wijaya Karya",
    noInvoice: "0181/INV/REG-EM-07/I/26",
    kodePelTgl: "EM-07 / 20-22 Jan 2026",
    harga: "Rp16.000.000",
    bayar: 0,
    pengirimanBerkas: "-",
    pengirimanDitujukan: "-",
    pengirimanPenerima: "-",
    bupot: "Belum",
  },
  {
    id: 21,
    instansi: "PT Adhi Karya",
    noInvoice: "0180/INV/REG-K3-03/I/26",
    kodePelTgl: "K3-03 / 13-15 Jan 2026",
    harga: "Rp8.200.000",
    bayar: "Rp8.200.000",
    pengirimanBerkas: "Terkirim",
    pengirimanDitujukan: "Bu Zahra",
    pengirimanPenerima: "Pak Ahmad",
    bupot: "Sudah",
  },
  {
    id: 22,
    instansi: "PT Waskita Karya",
    noInvoice: "0179/INV/REG-ENG-04/I/26",
    kodePelTgl: "ENG-04 / 06-08 Jan 2026",
    harga: "Rp13.000.000",
    bayar: 0,
    pengirimanBerkas: "-",
    pengirimanDitujukan: "-",
    pengirimanPenerima: "-",
    bupot: "Belum",
  },
  {
    id: 23,
    instansi: "PT PP Tbk",
    noInvoice: "0178/INV/REG-ENV-04/XII/25",
    kodePelTgl: "ENV-04 / 09-11 Des 2025",
    harga: "Rp9.500.000",
    bayar: "Rp9.500.000",
    pengirimanBerkas: "Terkirim",
    pengirimanDitujukan: "Pak Bela",
    pengirimanPenerima: "Bu Cahya",
    bupot: "Sudah",
  },
  {
    id: 24,
    instansi: "PT Hutama Karya",
    noInvoice: "0177/INV/REG-PPPU-03/XII/25",
    kodePelTgl: "PPPU-03 / 01-03 Des 2025",
    harga: "Rp11.800.000",
    bayar: 0,
    pengirimanBerkas: "-",
    pengirimanDitujukan: "-",
    pengirimanPenerima: "-",
    bupot: "Belum",
  },
  {
    id: 25,
    instansi: "PT Nindya Karya",
    noInvoice: "0176/INV/REG-WM-04/XI/25",
    kodePelTgl: "WM-04 / 24-26 Nov 2025",
    harga: "Rp20.000.000",
    bayar: "Rp20.000.000",
    pengirimanBerkas: "Terkirim",
    pengirimanDitujukan: "Pak Dani",
    pengirimanPenerima: "Bu Erni",
    bupot: "Sudah",
  },
  {
    id: 26,
    instansi: "PT Brantas Abipraya",
    noInvoice: "0175/INV/REG-HSE-04/XI/25",
    kodePelTgl: "HSE-04 / 17-19 Nov 2025",
    harga: "Rp8.400.000",
    bayar: 0,
    pengirimanBerkas: "-",
    pengirimanDitujukan: "-",
    pengirimanPenerima: "-",
    bupot: "Belum",
  },
  {
    id: 27,
    instansi: "PT Jasa Marga",
    noInvoice: "0174/INV/REG-EM-08/XI/25",
    kodePelTgl: "EM-08 / 10-12 Nov 2025",
    harga: "Rp16.000.000",
    bayar: "Rp16.000.000",
    pengirimanBerkas: "Terkirim",
    pengirimanDitujukan: "Bu Fitri",
    pengirimanPenerima: "Pak Ganda",
    bupot: "Sudah",
  },
  {
    id: 28,
    instansi: "PT Pelindo II",
    noInvoice: "0173/INV/REG-K3-04/XI/25",
    kodePelTgl: "K3-04 / 03-05 Nov 2025",
    harga: "Rp8.200.000",
    bayar: 0,
    pengirimanBerkas: "-",
    pengirimanDitujukan: "-",
    pengirimanPenerima: "-",
    bupot: "Belum",
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

const bupotStyle: Record<string, string> = {
  Sudah: "bg-emerald-50 text-emerald-600",
  Belum: "bg-red-50 text-red-500",
};

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function DaftarInvoicePage() {
  const [search, setSearch] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [page, setPage] = useState(1);
  const router = useRouter();
  const perPage = 4;

  // Data sudah ditarik — tinggal ganti dengan hasil fetch API
  const rawData = invoiceData;

  const filtered = rawData.filter(
    (d) =>
      d.instansi.toLowerCase().includes(search.toLowerCase()) ||
      d.noInvoice.toLowerCase().includes(search.toLowerCase()) ||
      d.kodePelTgl.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const pageNumbers = (): (number | string)[] => {
    if (totalPages <= 5)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    return [1, 2, 3, "...", totalPages];
  };

  return (
    <div className="flex min-h-screen bg-zinc-100 overflow-hidden">
      <Sidebar />

      <div className="flex flex-col flex-1 md:ml-[250px] min-w-0 overflow-x-hidden">
        {/* Page Header */}
        <div className="px-6 py-4 bg-white border-b border-zinc-100 flex items-center justify-between">
          <div>
            <p className="text-xs text-zinc-400">
              Keuangan &rsaquo;{" "}
              <span className="font-semibold text-zinc-700">Invoice</span>
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
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
            {/* Toolbar */}
            <div className="px-5 pt-5 pb-4 border-b border-zinc-100 space-y-3">
              {/* Title */}
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
                  Daftar Invoice/Kwitansi Pelatihan
                </p>
              </div>

              {/* Filters row */}
              <div className="flex flex-wrap items-center justify-between gap-3">
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
                  <button
                    onClick={() => setPage(1)}
                    className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg transition-colors"
                  >
                    Terapkan
                  </button>
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
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead>
                  {/* Row 1: main headers + Pengiriman group */}
                  <tr className="border-b border-zinc-100">
                    <th
                      className="px-4 py-2 text-[11px] font-semibold text-zinc-400 text-left"
                      rowSpan={2}
                    >
                      <span className="flex items-center gap-1">
                        No <SortIcon />
                      </span>
                    </th>
                    <th
                      className="px-4 py-2 text-[11px] font-semibold text-zinc-400 text-left"
                      rowSpan={2}
                    >
                      <span className="flex items-center gap-1">
                        Instansi <SortIcon />
                      </span>
                    </th>
                    <th
                      className="px-4 py-2 text-[11px] font-semibold text-zinc-400 text-left whitespace-nowrap"
                      rowSpan={2}
                    >
                      <span className="flex items-center gap-1">
                        No. Invoice <SortIcon />
                      </span>
                    </th>
                    <th
                      className="px-4 py-2 text-[11px] font-semibold text-zinc-400 text-left whitespace-nowrap"
                      rowSpan={2}
                    >
                      <span className="flex items-center gap-1">
                        Kode. Pel/Tgl <SortIcon />
                      </span>
                    </th>
                    <th
                      className="px-4 py-2 text-[11px] font-semibold text-zinc-400 text-left"
                      rowSpan={2}
                    >
                      <span className="flex items-center gap-1">
                        Harga <SortIcon />
                      </span>
                    </th>
                    <th
                      className="px-4 py-2 text-[11px] font-semibold text-zinc-400 text-left"
                      rowSpan={2}
                    >
                      <span className="flex items-center gap-1">
                        Bayar <SortIcon />
                      </span>
                    </th>
                    {/* Pengiriman group */}
                    <th
                      className="px-4 py-2 text-[11px] font-semibold text-zinc-400 text-center"
                      colSpan={3}
                    >
                      Pengiriman
                    </th>
                    <th
                      className="px-4 py-2 text-[11px] font-semibold text-zinc-400 text-left"
                      rowSpan={2}
                    >
                      <span className="flex items-center gap-1">
                        Bupot <SortIcon />
                      </span>
                    </th>
                    <th
                      className="px-4 py-2 text-[11px] font-semibold text-zinc-400 text-right"
                      rowSpan={2}
                    >
                      Aksi
                    </th>
                  </tr>
                  {/* Row 2: Pengiriman sub-headers */}
                  <tr className="border-b border-zinc-100">
                    <th className="px-4 py-2 text-[11px] font-semibold text-zinc-400 text-left whitespace-nowrap">
                      <span className="flex items-center gap-1">
                        Berkas <SortIcon />
                      </span>
                    </th>
                    <th className="px-4 py-2 text-[11px] font-semibold text-zinc-400 text-left whitespace-nowrap">
                      <span className="flex items-center gap-1">
                        Ditujukan <SortIcon />
                      </span>
                    </th>
                    <th className="px-4 py-2 text-[11px] font-semibold text-zinc-400 text-left whitespace-nowrap">
                      <span className="flex items-center gap-1">
                        Penerima <SortIcon />
                      </span>
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
                      <td className="px-4 py-3 text-xs text-zinc-700 font-medium">
                        {row.instansi}
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-600 whitespace-nowrap">
                        {row.noInvoice}
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-600 whitespace-nowrap">
                        {row.kodePelTgl}
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-700 whitespace-nowrap">
                        {row.harga}
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-700">
                        {row.bayar === 0 ? "0" : row.bayar}
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-500">
                        {row.pengirimanBerkas}
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-500">
                        {row.pengirimanDitujukan}
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-500">
                        {row.pengirimanPenerima}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${bupotStyle[row.bupot] ?? "bg-zinc-100 text-zinc-500"}`}
                        >
                          {row.bupot}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button className="text-[11px] text-emerald-500 hover:text-emerald-600 font-semibold transition-colors">
                          Lihat
                        </button>
                      </td>
                    </tr>
                  ))}
                  {paginated.length === 0 && (
                    <tr>
                      <td
                        colSpan={11}
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
