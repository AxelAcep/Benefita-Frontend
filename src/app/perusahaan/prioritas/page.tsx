"use client";

import React, { useState } from "react";
import { LayoutList } from "lucide-react";
import AppLayout from "@/components/app-layout";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PerusahaanPrioritas {
  id: number;
  noInduk: string;
  perusahaan: string;
  prioMA: string;
  prioAE: string;
  env: string;
  csr: string;
  alamat: string;
  noTeleponEmail: string;
  updBy: string;
  tanggal: string;
  kategori: string;
  akun: string;
}

// ---------------------------------------------------------------------------
// Dummy data
// ---------------------------------------------------------------------------

const DUMMY_DATA: PerusahaanPrioritas[] = [
  {
    id: 1,
    noInduk: "PR00621",
    perusahaan: "PT. ABC",
    prioMA: "p120 - Inhouse Training",
    prioAE: "A201114",
    env: "EE240528; MA240",
    csr: "SL260112;MA2601",
    alamat: "Wisma KIE, Jl. Ammonia Kav. 79 Bontang - Kaltim 75314",
    noTeleponEmail:
      "0548-21133, 552 909 |Training: 021-365 646 |Training: 330 243, 336 317 551 354 |laboratorium@21168, 551 107, 23220, 21202; 0541-43100; 021-330 243, 336 317 |infocenter@badaking.com; sudaryan@badaking.co.id; bambang.sukindar@badaking.co.id",
    updBy: "MULYADI",
    tanggal: "03 Jul 25",
    kategori: "BTE",
    akun: "ENI",
  },
  {
    id: 2,
    noInduk: "PR07304",
    perusahaan: "PT. BCA",
    prioMA: "p120 - Inhouse Training",
    prioAE: "A201114",
    env: "EE251212;MA2512",
    csr: "NW251229;MA2512",
    alamat:
      "Kawasan Industri Delta Silikon, Jl. MH Thamrin Blok A3-1 Lippo Cikarang Kab. Bekasi - Jabar 17550",
    noTeleponEmail:
      "024-866 4117, 866 4123; 021-89907333-37; 021-42873888-89 | Ade.Hermanto@Kalbefarma.com; Corp.Comm@kalbe.co.id",
    updBy: "MULYADI",
    tanggal: "03 Jul 25",
    kategori: "BTE",
    akun: "ENI",
  },
  {
    id: 3,
    noInduk: "PR02434",
    perusahaan: "PT. XYZ",
    prioMA: "p120 - Inhouse Training",
    prioAE: "A201114",
    env: "EE250627;MA2506",
    csr: "AM231030; -;ND2",
    alamat: "Jl. Raya Balongan Km. 09 Balongan, Indramayu - Jabar 45217",
    noTeleponEmail: "0234-428 232, 428 629, 428 183, 0234 525 5200/5233/5230",
    updBy: "MULYADI",
    tanggal: "03 Jul 25",
    kategori: "BTE",
    akun: "ENI",
  },
  {
    id: 4,
    noInduk: "PR08091",
    perusahaan: "PT. ACC",
    prioMA: "p120 - Inhouse Training",
    prioAE: "A201114",
    env: "EE251231;MA2512",
    csr: "SL251230;MA2512",
    alamat:
      "Jl. Raya Jaya Negara Kp. Kabandungan, Kec.Kalapa­runggal Kab. Sukabumi - Jabar",
    noTeleponEmail:
      "0286-225540 ext 56616; +62-215731020 | afpo@chevron.com; Ade.Daniia@chevron.com; bediona@chevron.com; rsuratino@chevron.com; resl@chevron.com; carolina.gita@chevron.com; luciagb@chevron.com",
    updBy: "MULYADI",
    tanggal: "03 Jul 25",
    kategori: "BTE",
    akun: "ENI",
  },
  {
    id: 5,
    noInduk: "PR03312",
    perusahaan: "PT. DEF",
    prioMA: "p110 - Reguler",
    prioAE: "A201115",
    env: "EE250101;MA2501",
    csr: "SL250102;MA2501",
    alamat: "Jl. Gatot Subroto Kav. 51 Jakarta Selatan 12950",
    noTeleponEmail:
      "021-5252-1111; 021-5252-1122 | info@def.co.id; marketing@def.co.id",
    updBy: "SISKA",
    tanggal: "10 Agt 25",
    kategori: "MAN",
    akun: "BRI",
  },
  {
    id: 6,
    noInduk: "PR04455",
    perusahaan: "PT. GHI",
    prioMA: "p110 - Reguler",
    prioAE: "A201115",
    env: "EE250201;MA2502",
    csr: "AM250203;MA2502",
    alamat: "Jl. HR Rasuna Said Blok X-5 Kav. 2-3 Kuningan Jakarta Selatan",
    noTeleponEmail:
      "021-527-7222; 021-527-8333 | hrd@ghi.co.id; contact@ghi.co.id",
    updBy: "SISKA",
    tanggal: "10 Agt 25",
    kategori: "MAN",
    akun: "BRI",
  },
  {
    id: 7,
    noInduk: "PR05678",
    perusahaan: "PT. JKL",
    prioMA: "p130 - VIP",
    prioAE: "A201116",
    env: "EE250301;MA2503",
    csr: "NW250302;MA2503",
    alamat: "Jl. Jend. Sudirman Kav. 52-53 Jakarta Pusat 10220",
    noTeleponEmail:
      "021-515-5000; 021-515-6000 | info@jkl.co.id; vip@jkl.co.id",
    updBy: "REZA",
    tanggal: "15 Sep 25",
    kategori: "BTE",
    akun: "MND",
  },
  {
    id: 8,
    noInduk: "PR06789",
    perusahaan: "PT. MNO",
    prioMA: "p130 - VIP",
    prioAE: "A201116",
    env: "EE250401;MA2504",
    csr: "SL250402;MA2504",
    alamat: "Jl. TB Simatupang No. 88 Jakarta Selatan 12560",
    noTeleponEmail: "021-789-1111; 021-789-2222 | cs@mno.co.id; info@mno.co.id",
    updBy: "REZA",
    tanggal: "15 Sep 25",
    kategori: "BTE",
    akun: "MND",
  },
];

const MA_OPTIONS = ["P1", "P2", "P3"];
const AE_OPTIONS = ["A", "B", "C"];
const KATEGORI_OPTIONS = ["BTE", "MAN", "PRO"];
const AKUN_OPTIONS = ["ENI", "BRI", "MND"];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function DaftarPerusahaanPrioritasPage() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedMA, setSelectedMA] = useState("");
  const [selectedAE, setSelectedAE] = useState("");
  const [selectedKategori, setSelectedKategori] = useState("");
  const [selectedAkun, setSelectedAkun] = useState("");

  const [appliedMA, setAppliedMA] = useState("");
  const [appliedAE, setAppliedAE] = useState("");
  const [appliedKategori, setAppliedKategori] = useState("");
  const [appliedAkun, setAppliedAkun] = useState("");

  const PAGE_SIZE = 10;

  const handleTerapkan = () => {
    setAppliedMA(selectedMA);
    setAppliedAE(selectedAE);
    setAppliedKategori(selectedKategori);
    setAppliedAkun(selectedAkun);
    setCurrentPage(1);
  };

  const hasApplied =
    appliedMA !== "" ||
    appliedAE !== "" ||
    appliedKategori !== "" ||
    appliedAkun !== "";

  const filtered = hasApplied
    ? DUMMY_DATA.filter((d) => {
        const matchSearch =
          d.perusahaan.toLowerCase().includes(search.toLowerCase()) ||
          d.noInduk.toLowerCase().includes(search.toLowerCase());
        // If a filter is set, match it; if not set, allow all
        const matchMA = appliedMA
          ? d.prioAE.startsWith(
              appliedMA === "P1"
                ? "A201114"
                : appliedMA === "P2"
                  ? "A201115"
                  : "A201116",
            )
          : true;
        const matchAE = appliedAE ? true : true; // demo: always pass
        const matchKategori = appliedKategori
          ? d.kategori === appliedKategori
          : true;
        const matchAkun = appliedAkun ? d.akun === appliedAkun : true;
        return matchSearch && matchMA && matchAE && matchKategori && matchAkun;
      })
    : [];

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  // Build label for applied filters
  const appliedLabels = [appliedMA, appliedAE, appliedKategori, appliedAkun]
    .filter(Boolean)
    .join(", ");

  const selectClass =
    "pl-2.5 pr-6 py-1.5 border border-zinc-200 rounded-lg text-[11px] text-zinc-600 outline-none focus:border-emerald-300 transition-all bg-white appearance-none cursor-pointer";
  const chevronStyle = {
    backgroundImage:
      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%23a1a1aa' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")",
    backgroundRepeat: "no-repeat" as const,
    backgroundPosition: "right 6px center",
  };

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Training", href: "/training" },
        { label: "Daftar Perusahaan Prioritas" },
      ]}
      subtitle="Hari ini: Selasa, 3 Februari 2026"
      userName="Nanang"
      userRole="Super Admin"
    >
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="px-5 py-3 border-b border-zinc-100">
          {/* Row 1 */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Title */}
            <div className="flex items-center gap-2 mr-2">
              <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center">
                <LayoutList className="w-3.5 h-3.5 text-emerald-500" />
              </div>
              <span className="font-bold text-zinc-800 text-sm">
                Daftar Perusahaan Prioritas
              </span>
            </div>

            {/* Filter Prioritas MA */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-zinc-500 font-medium">
                Prioritas MA
              </span>
              <select
                value={selectedMA}
                onChange={(e) => setSelectedMA(e.target.value)}
                className={selectClass}
                style={chevronStyle}
              >
                <option value="">P1</option>
                {MA_OPTIONS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter Prioritas AE */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-zinc-500 font-medium">
                Prioritas AE
              </span>
              <select
                value={selectedAE}
                onChange={(e) => setSelectedAE(e.target.value)}
                className={selectClass}
                style={chevronStyle}
              >
                <option value="">A</option>
                {AE_OPTIONS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter Kategori */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-zinc-500 font-medium">
                Kategori
              </span>
              <select
                value={selectedKategori}
                onChange={(e) => setSelectedKategori(e.target.value)}
                className={selectClass}
                style={chevronStyle}
              >
                <option value="">BTE</option>
                {KATEGORI_OPTIONS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter Akun */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-zinc-500 font-medium">
                Akun
              </span>
              <select
                value={selectedAkun}
                onChange={(e) => setSelectedAkun(e.target.value)}
                className={selectClass}
                style={chevronStyle}
              >
                <option value="">ENI</option>
                {AKUN_OPTIONS.map((o) => (
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

          {/* Row 2: label filter aktif */}
          {hasApplied && appliedLabels && (
            <p className="mt-2 text-[11px] text-zinc-500">
              Menampilkan data dari{" "}
              <span className="font-semibold text-zinc-700">
                &quot;{appliedLabels}&quot;
              </span>
            </p>
          )}
        </div>

        {/* Body */}
        {!hasApplied ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-24 gap-2">
            <p className="text-sm font-bold text-zinc-700">
              Silahkan Pilih MA, AE, Kategori, Akun
            </p>
            <p className="text-xs text-zinc-400">
              Pilih input yang ingin ditampilkan
            </p>
          </div>
        ) : (
          /* Table */
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1400px]">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50/60">
                  <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-10">
                    No ↕
                  </th>
                  <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-36">
                    Prio MA
                  </th>
                  <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-24">
                    Prio AE
                  </th>
                  <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-24">
                    No Induk
                  </th>
                  <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-32">
                    Perusahaan/Instansi
                  </th>
                  <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-32">
                    <div>AE</div>
                    <div>ENV</div>
                  </th>
                  <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-32">
                    CSR
                  </th>
                  <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-44">
                    Alamat
                  </th>
                  <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-52">
                    No. Telepon & Email
                  </th>
                  <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-20">
                    Upd. By
                  </th>
                  <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-20">
                    Tanggal
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
                      className="border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors align-top"
                    >
                      <td className="px-3 py-3 text-xs text-zinc-400">
                        {(currentPage - 1) * PAGE_SIZE + i + 1}
                      </td>
                      <td className="px-3 py-3 text-xs text-zinc-600">
                        {row.prioMA}
                      </td>
                      <td className="px-3 py-3 text-xs text-zinc-600">
                        {row.prioAE}
                      </td>
                      <td className="px-3 py-3 text-xs text-emerald-600 font-semibold cursor-pointer hover:underline whitespace-nowrap">
                        {row.noInduk}
                      </td>
                      <td className="px-3 py-3 text-xs text-emerald-600 font-semibold cursor-pointer hover:underline whitespace-nowrap">
                        {row.perusahaan}
                      </td>
                      <td className="px-3 py-3 text-xs text-zinc-600 leading-relaxed">
                        {row.env}
                      </td>
                      <td className="px-3 py-3 text-xs text-zinc-600 leading-relaxed">
                        {row.csr}
                      </td>
                      <td className="px-3 py-3 text-xs text-zinc-600 leading-relaxed">
                        {row.alamat}
                      </td>
                      <td className="px-3 py-3 text-xs text-zinc-600 leading-relaxed whitespace-pre-line">
                        {row.noTeleponEmail}
                      </td>
                      <td className="px-3 py-3 text-xs text-zinc-600 whitespace-nowrap">
                        {row.updBy}
                      </td>
                      <td className="px-3 py-3 text-xs text-zinc-600 whitespace-nowrap">
                        {row.tanggal}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-5 py-3 border-t border-zinc-100">
          <p className="text-[11px] text-zinc-400">
            Menampilkan{" "}
            <span className="font-semibold text-zinc-600">
              {!hasApplied || filtered.length === 0
                ? 0
                : (currentPage - 1) * PAGE_SIZE + 1}
              –{Math.min(currentPage * PAGE_SIZE, filtered.length)}
            </span>{" "}
            dari{" "}
            <span className="font-semibold text-zinc-600">
              {filtered.length}
            </span>{" "}
            data
          </p>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-[11px] border border-zinc-200 rounded-lg text-zinc-500 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium"
            >
              ‹ Sebelumnya
            </button>
            {Array.from(
              { length: hasApplied ? totalPages : 1 },
              (_, i) => i + 1,
            ).map((p) => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`w-7 h-7 rounded-lg text-[11px] font-semibold transition-colors ${
                  p === currentPage
                    ? "bg-emerald-500 text-white"
                    : "border border-zinc-200 text-zinc-500 hover:bg-zinc-50"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={!hasApplied || currentPage === totalPages}
              className="px-3 py-1.5 text-[11px] border border-zinc-200 rounded-lg text-zinc-500 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Selanjutnya ›
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
