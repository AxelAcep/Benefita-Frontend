// app/peserta/data-peserta-uji/page.tsx
"use client";

import React, { useState } from "react";
import AppLayout from "@/components/app-layout";
import ModalResi from "@/components/peserta/Modal-Resi";

interface PesertaUji {
  id: number;
  nama: string;
  perusahaan: string;
  kode: string;
  tglPel: string;
  invPeserta: "Belum Bayar" | "Lunas";
  tglUji: string;
  metode: "Offline" | "Online";
  lsp: string;
  invLSP: "Belum Bayar" | "Lunas";
  sertifikat: string | null;
  tglKirim: string | null;
  noResi: string | null;
  kiriman?: {
    penerima: string;
    hp: string;
    instansi: string;
    alamat: string;
    isiDokumen: string;
    noResi: string;
    kirimVia: string;
    tanggalKirim: string;
    diterimOleh: string;
    tanggalDiterima: string;
  };
}

const DUMMY_PESERTA: PesertaUji[] = [
  {
    id: 1,
    nama: "Abdul Fadhil",
    perusahaan: "PT. ABC",
    kode: "CSR-01",
    tglPel: "2026-04-13",
    invPeserta: "Belum Bayar",
    tglUji: "2026-04-13",
    metode: "Offline",
    lsp: "LSP Benefita",
    invLSP: "Belum Bayar",
    sertifikat: null,
    tglKirim: "2025-10-30",
    noResi: "660095010966",
    kiriman: {
      penerima: "Titus Halomoan(EHSS)",
      hp: "083522341231",
      instansi: "BASF Indonesia, PT",
      alamat: "Jl. abc 123",
      isiDokumen: "sertBNSP an. Laksono Cahyo Widodo2",
      noResi: "630520020100019",
      kirimVia: "TIKI",
      tanggalKirim: "2025-10-30",
      diterimOleh: "Ahmad",
      tanggalDiterima: "",
    },
  },
  {
    id: 2,
    nama: "Diana Fungki",
    perusahaan: "PT. BCA",
    kode: "CSR-02",
    tglPel: "2026-04-13",
    invPeserta: "Belum Bayar",
    tglUji: "2026-04-13",
    metode: "Offline",
    lsp: "LSP Benefita",
    invLSP: "Belum Bayar",
    sertifikat: "Terbit",
    tglKirim: null,
    noResi: null,
  },
  {
    id: 3,
    nama: "Mawardi",
    perusahaan: "PT. XYZ",
    kode: "CSR-03",
    tglPel: "2026-04-13",
    invPeserta: "Belum Bayar",
    tglUji: "2026-04-13",
    metode: "Offline",
    lsp: "LSP Benefita",
    invLSP: "Belum Bayar",
    sertifikat: null,
    tglKirim: null,
    noResi: null,
  },
  {
    id: 4,
    nama: "Ismadi",
    perusahaan: "PT. ACC",
    kode: "CSR-04",
    tglPel: "2026-04-13",
    invPeserta: "Lunas",
    tglUji: "2026-04-13",
    metode: "Online",
    lsp: "LSP Daimaru",
    invLSP: "Belum Bayar",
    sertifikat: null,
    tglKirim: null,
    noResi: null,
  },
  ...Array.from({ length: 24 }, (_, i) => ({
    id: i + 5,
    nama: `Peserta ${i + 5}`,
    perusahaan: "PT. Example",
    kode: `CSR-${String(i + 5).padStart(2, "0")}`,
    tglPel: "2026-04-13",
    invPeserta: "Belum Bayar" as const,
    tglUji: "2026-04-13",
    metode: "Offline" as const,
    lsp: "LSP Benefita",
    invLSP: "Belum Bayar" as const,
    sertifikat: null,
    tglKirim: null,
    noResi: null,
  })),
];

interface PengirimanDokumen {
  id: number;
  namaPenerima: string;
  perusahaan: string;
  alamat: string;
  noTelp: string;
  keteranganDokumen: string;
  noResi: string | null;
  tglKirim: string | null;
  kirimVia: string | null;
  diterimaOleh: string | null;
  tglDiterima: string | null;
  kiriman?: {
    penerima: string;
    hp: string;
    instansi: string;
    alamat: string;
    isiDokumen: string;
    noResi: string;
    kirimVia: string;
    tanggalKirim: string;
    diterimOleh: string;
    tanggalDiterima: string;
  };
}

const DUMMY_PENGIRIMAN: PengirimanDokumen[] = [
  {
    id: 1,
    namaPenerima: "Abdul Fadhil",
    perusahaan: "PT. ABC",
    alamat:
      "Titus Halomoan(EHSS) PT BASF Indonesia, Merak Site, Jl Raya Salira - Merak, Ds. Mangunreja, Kec. Pulo Ampel, Kab.Serang - Banten 42438 Phone: 0254-5750011/15 ext: 203",
    noTelp: "0254-5750011/15 ext: 203",
    keteranganDokumen: "sertBNSP an. Laksono Cahyo Widodo2",
    noResi: "630440039196219",
    tglKirim: "06 April 2026",
    kirimVia: "JNE",
    diterimaOleh: null,
    tglDiterima: "2025-10-30",
    kiriman: {
      penerima: "Titus Halomoan(EHSS)",
      hp: "083522341231",
      instansi: "BASF Indonesia, PT",
      alamat: "Jl. abc 123",
      isiDokumen: "sertBNSP an. Laksono Cahyo Widodo2",
      noResi: "630440039196219",
      kirimVia: "JNE",
      tanggalKirim: "2026-04-06",
      diterimOleh: "",
      tanggalDiterima: "2025-10-30",
    },
  },
  {
    id: 2,
    namaPenerima: "Diana Fungki",
    perusahaan: "PT. BCA",
    alamat:
      "Gd. B Pelita Air Services, Jl. Abdul Muis No 52-56A, Petojo Selatan, Gambir, Jakarta Pusat 10160",
    noTelp: "0812-9596-6774",
    keteranganDokumen: "Sertifikat BNSP",
    noResi: "630520020100019",
    tglKirim: "06 April 2026",
    kirimVia: "JNE",
    diterimaOleh: "Zaelani",
    tglDiterima: null,
    kiriman: {
      penerima: "Diana Fungki",
      hp: "0812-9596-6774",
      instansi: "PT. BCA",
      alamat: "Gd. B Pelita Air Services, Jl. Abdul Muis No 52-56A",
      isiDokumen: "Sertifikat BNSP",
      noResi: "630520020100019",
      kirimVia: "JNE",
      tanggalKirim: "2026-04-06",
      diterimOleh: "Zaelani",
      tanggalDiterima: "",
    },
  },
  {
    id: 3,
    namaPenerima: "Mawardi",
    perusahaan: "PT. XYZ",
    alamat:
      "Rita Nur Anggraeni Bumi Parahyangan Kencana Blok L-16 No. 206 Kel. Pananjung Kec. Cangkuang Kab. Bandung (085795669455/081224352765).",
    noTelp: "-",
    keteranganDokumen: "Sertifikat BNSP",
    noResi: "630440039196219",
    tglKirim: "06 April 2026",
    kirimVia: "JNE",
    diterimaOleh: null,
    tglDiterima: null,
    kiriman: {
      penerima: "Mawardi",
      hp: "",
      instansi: "PT. XYZ",
      alamat: "Rita Nur Anggraeni Bumi Parahyangan Kencana Blok L-16",
      isiDokumen: "Sertifikat BNSP",
      noResi: "630440039196219",
      kirimVia: "JNE",
      tanggalKirim: "2026-04-06",
      diterimOleh: "",
      tanggalDiterima: "",
    },
  },
  {
    id: 4,
    namaPenerima: "Ismadi",
    perusahaan: "PT. ACC",
    alamat:
      "Gd. B Pelita Air Services, Jl. Abdul Muis No 52-56A, Petojo Selatan, Gambir, Jakarta Pusat 10160",
    noTelp: "-",
    keteranganDokumen: "Sertifikat BNSP",
    noResi: null,
    tglKirim: "04 April 2026",
    kirimVia: "JNE",
    diterimaOleh: null,
    tglDiterima: null,
    kiriman: {
      penerima: "Ismadi",
      hp: "",
      instansi: "PT. ACC",
      alamat: "Gd. B Pelita Air Services, Jl. Abdul Muis No 52-56A",
      isiDokumen: "Sertifikat BNSP",
      noResi: "",
      kirimVia: "JNE",
      tanggalKirim: "2026-04-04",
      diterimOleh: "",
      tanggalDiterima: "",
    },
  },
  ...Array.from({ length: 24 }, (_, i) => ({
    id: i + 5,
    namaPenerima: `Peserta ${i + 5}`,
    perusahaan: "PT. Example",
    alamat: "Jl. Contoh No. 1, Jakarta",
    noTelp: "021-0000000",
    keteranganDokumen: "Sertifikat BNSP",
    noResi: null,
    tglKirim: null,
    kirimVia: null,
    diterimaOleh: null,
    tglDiterima: null,
  })),
];

const PAGE_SIZE = 4;

function InvBadge({ status }: { status: string }) {
  if (status === "Lunas")
    return (
      <span className="text-xs font-semibold text-emerald-600">{status}</span>
    );
  return <span className="text-xs text-zinc-500">{status}</span>;
}

function getPageNumbers(currentPage: number, totalPages: number) {
  const pages: (number | string)[] = [];
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1, 2, 3, "...ellipsis", totalPages);
  }
  return pages;
}

export default function DataPesertaUjiPage() {
  const [activeTab, setActiveTab] = useState<"peserta" | "pengiriman">(
    "peserta",
  );

  // Peserta state
  const [searchPeserta, setSearchPeserta] = useState("");
  const [namaCari, setNamaCari] = useState("");
  const [instansiCari, setInstansiCari] = useState("");
  const [tglUjiCari, setTglUjiCari] = useState("2026");
  const [appliedNama, setAppliedNama] = useState("");
  const [appliedInstansi, setAppliedInstansi] = useState("");
  const [currentPagePeserta, setCurrentPagePeserta] = useState(1);

  // Pengiriman state
  const [searchPengiriman, setSearchPengiriman] = useState("");
  const [currentPagePengiriman, setCurrentPagePengiriman] = useState(1);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"upload" | "lihat" | "edit">(
    "upload",
  );
  const [modalData, setModalData] = useState<PesertaUji["kiriman"]>(undefined);

  const openModal = (
    mode: "upload" | "lihat" | "edit",
    data?: PesertaUji["kiriman"],
  ) => {
    setModalMode(mode);
    setModalData(data);
    setModalOpen(true);
  };

  // Filter peserta
  const filteredPeserta = DUMMY_PESERTA.filter((d) => {
    const matchNama = d.nama.toLowerCase().includes(appliedNama.toLowerCase());
    const matchInstansi = d.perusahaan
      .toLowerCase()
      .includes(appliedInstansi.toLowerCase());
    const matchSearch =
      d.nama.toLowerCase().includes(searchPeserta.toLowerCase()) ||
      d.kode.toLowerCase().includes(searchPeserta.toLowerCase());
    return matchNama && matchInstansi && matchSearch;
  });

  const totalPagesPeserta = Math.max(
    1,
    Math.ceil(filteredPeserta.length / PAGE_SIZE),
  );
  const paginatedPeserta = filteredPeserta.slice(
    (currentPagePeserta - 1) * PAGE_SIZE,
    currentPagePeserta * PAGE_SIZE,
  );

  // Filter pengiriman
  const filteredPengiriman = DUMMY_PENGIRIMAN.filter(
    (d) =>
      d.namaPenerima.toLowerCase().includes(searchPengiriman.toLowerCase()) ||
      d.perusahaan.toLowerCase().includes(searchPengiriman.toLowerCase()),
  );

  const totalPagesPengiriman = Math.max(
    1,
    Math.ceil(filteredPengiriman.length / PAGE_SIZE),
  );
  const paginatedPengiriman = filteredPengiriman.slice(
    (currentPagePengiriman - 1) * PAGE_SIZE,
    currentPagePengiriman * PAGE_SIZE,
  );

  const Pagination = ({
    current,
    total,
    onChange,
  }: {
    current: number;
    total: number;
    onChange: (p: number) => void;
  }) => (
    <div className="flex items-center gap-1">
      <button
        onClick={() => onChange(current - 1)}
        disabled={current === 1}
        className="px-3 py-1.5 text-[11px] border border-zinc-200 rounded-lg text-zinc-500 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium"
      >
        ‹ Sebelumnya
      </button>
      {getPageNumbers(current, total).map((p) =>
        typeof p === "string" ? (
          <span
            key={p}
            className="w-7 h-7 flex items-center justify-center text-[11px] text-zinc-400"
          >
            ...
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`w-7 h-7 rounded-lg text-[11px] font-semibold transition-colors ${
              p === current
                ? "bg-emerald-500 text-white"
                : "border border-zinc-200 text-zinc-500 hover:bg-zinc-50"
            }`}
          >
            {p}
          </button>
        ),
      )}
      <button
        onClick={() => onChange(current + 1)}
        disabled={current === total}
        className="px-3 py-1.5 text-[11px] border border-zinc-200 rounded-lg text-zinc-500 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium"
      >
        Selanjutnya ›
      </button>
    </div>
  );

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Perusahaan", href: "/perusahaan" },
        { label: "Data Peserta Uji (LSP)" },
      ]}
      subtitle="Hari ini: Selasa, 3 Februari 2026"
      userName="Nanang"
      userRole="Super Admin"
    >
      <ModalResi
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        mode={modalMode}
        data={modalData}
      />

      {/* Tabs */}
      <div className="flex border-b border-zinc-200 mb-5">
        <button
          onClick={() => setActiveTab("peserta")}
          className={`px-4 py-2.5 text-xs font-semibold transition-colors border-b-2 -mb-px ${
            activeTab === "peserta"
              ? "border-emerald-500 text-emerald-600"
              : "border-transparent text-zinc-500 hover:text-zinc-700"
          }`}
        >
          Data Peserta Uji (LSP)
        </button>
        <button
          onClick={() => setActiveTab("pengiriman")}
          className={`px-4 py-2.5 text-xs font-semibold transition-colors border-b-2 -mb-px ${
            activeTab === "pengiriman"
              ? "border-emerald-500 text-emerald-600"
              : "border-transparent text-zinc-500 hover:text-zinc-700"
          }`}
        >
          Data Pengiriman Dokumen
        </button>
      </div>

      {/* Tab: Data Peserta Uji */}
      {activeTab === "peserta" && (
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
          {/* Toolbar */}
          <div className="px-5 py-4 border-b border-zinc-100 flex flex-wrap items-center gap-3 justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-zinc-500">Nama</span>
              <input
                type="text"
                placeholder="Cari nama..."
                value={namaCari}
                onChange={(e) => setNamaCari(e.target.value)}
                className="border border-zinc-200 rounded-lg px-2.5 py-1.5 text-xs text-zinc-700 outline-none focus:border-emerald-300 w-32"
              />
              <span className="text-xs text-zinc-500">Instansi</span>
              <input
                type="text"
                placeholder="Cari instansi..."
                value={instansiCari}
                onChange={(e) => setInstansiCari(e.target.value)}
                className="border border-zinc-200 rounded-lg px-2.5 py-1.5 text-xs text-zinc-700 outline-none focus:border-emerald-300 w-32"
              />
              <span className="text-xs text-zinc-500">Tgl Uji</span>
              <div className="relative">
                <input
                  type="text"
                  value={tglUjiCari}
                  onChange={(e) => setTglUjiCari(e.target.value)}
                  className="border border-zinc-200 rounded-lg px-2.5 py-1.5 pr-7 text-xs text-zinc-700 outline-none focus:border-emerald-300 w-24"
                />
                <svg
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400"
                  width="12"
                  height="12"
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
                onClick={() => {
                  setAppliedNama(namaCari);
                  setAppliedInstansi(instansiCari);
                  setCurrentPagePeserta(1);
                }}
                className="px-3 py-1.5 text-xs bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors"
              >
                Terapkan
              </button>
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
                value={searchPeserta}
                onChange={(e) => {
                  setSearchPeserta(e.target.value);
                  setCurrentPagePeserta(1);
                }}
                className="w-52 pl-7 pr-3 py-1.5 border border-zinc-200 rounded-lg text-xs text-zinc-700 outline-none focus:border-emerald-300 transition-all"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full" style={{ minWidth: "1200px" }}>
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50/60">
                  <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-10">
                    No ↕
                  </th>
                  <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-28">
                    Nama
                  </th>
                  <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-32">
                    Perusahaan/Instansi
                  </th>
                  <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-20">
                    Kode
                  </th>
                  <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-24">
                    Tgl. Pel
                  </th>
                  <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-center w-24">
                    INV
                  </th>
                  <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-24">
                    Tgl. Uji
                  </th>
                  <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-20">
                    Metode
                  </th>
                  <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-28">
                    LSP
                  </th>
                  <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-center w-24">
                    INV
                  </th>
                  <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-center w-20">
                    Sertifikat
                  </th>
                  <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-24">
                    Tgl. Kirim
                  </th>
                  <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-36">
                    No. Resi
                  </th>
                  <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-24">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedPeserta.length === 0 ? (
                  <tr>
                    <td
                      colSpan={14}
                      className="px-4 py-12 text-center text-xs text-zinc-400"
                    >
                      Tidak ada data tersedia.
                    </td>
                  </tr>
                ) : (
                  paginatedPeserta.map((row, i) => (
                    <tr
                      key={row.id}
                      className="border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors"
                    >
                      <td className="px-4 py-3 text-xs text-zinc-400">
                        {(currentPagePeserta - 1) * PAGE_SIZE + i + 1}
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-700">
                        {row.nama}
                      </td>
                      <td className="px-4 py-3 text-xs text-emerald-600 font-semibold cursor-pointer hover:underline">
                        {row.perusahaan}
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-600">
                        {row.kode}
                      </td>
                      <td className="px-4 py-3 text-xs text-emerald-600 cursor-pointer hover:underline">
                        {row.tglPel}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <InvBadge status={row.invPeserta} />
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-600">
                        {row.tglUji}
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-600">
                        {row.metode}
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-600">
                        {row.lsp}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <InvBadge status={row.invLSP} />
                      </td>
                      <td className="px-4 py-3 text-xs text-center text-zinc-500">
                        {row.sertifikat ?? "-"}
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-500">
                        {row.tglKirim ?? "-"}
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-500">
                        {row.noResi ? (
                          <span>
                            {row.noResi.includes("/") ? row.noResi : row.noResi}
                          </span>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {row.noResi ? (
                          <button
                            onClick={() => openModal("lihat", row.kiriman)}
                            className="text-xs text-emerald-600 font-semibold hover:underline"
                          >
                            Lihat Resi
                          </button>
                        ) : (
                          <button
                            onClick={() => openModal("upload", undefined)}
                            className="text-xs text-emerald-600 font-semibold hover:underline"
                          >
                            Upload Resi
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-5 py-3 border-t border-zinc-100">
            <p className="text-[11px] text-zinc-400">
              Menampilkan{" "}
              <span className="font-semibold text-zinc-600">
                {filteredPeserta.length === 0
                  ? 0
                  : (currentPagePeserta - 1) * PAGE_SIZE + 1}
                –
                {Math.min(
                  currentPagePeserta * PAGE_SIZE,
                  filteredPeserta.length,
                )}
              </span>{" "}
              dari{" "}
              <span className="font-semibold text-zinc-600">
                {filteredPeserta.length}
              </span>{" "}
              data
            </p>
            <Pagination
              current={currentPagePeserta}
              total={totalPagesPeserta}
              onChange={setCurrentPagePeserta}
            />
          </div>
        </div>
      )}

      {/* Tab: Data Pengiriman Dokumen */}
      {activeTab === "pengiriman" && (
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
          {/* Toolbar */}
          <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between gap-3">
            <span className="font-bold text-zinc-800 text-sm flex items-center gap-2">
              🗓️ Data Pengiriman Dokumen
            </span>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 text-xs border border-zinc-200 rounded-lg text-zinc-500 hover:bg-zinc-50 transition-colors flex items-center gap-1.5">
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="4" y1="6" x2="20" y2="6" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                  <line x1="11" y1="18" x2="13" y2="18" />
                </svg>
                Filter
              </button>
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
                  value={searchPengiriman}
                  onChange={(e) => {
                    setSearchPengiriman(e.target.value);
                    setCurrentPagePengiriman(1);
                  }}
                  className="w-52 pl-7 pr-3 py-1.5 border border-zinc-200 rounded-lg text-xs text-zinc-700 outline-none focus:border-emerald-300 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full" style={{ minWidth: "1100px" }}>
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50/60">
                  <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-10">
                    No ↕
                  </th>
                  <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-28">
                    Nama Penerima
                  </th>
                  <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-28">
                    Perusahaan/Instansi
                  </th>
                  <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left">
                    Alamat
                  </th>
                  <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-28">
                    No. Telp
                  </th>
                  <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-32">
                    Keterangan Dokumen
                  </th>
                  <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-32">
                    No. Resi
                  </th>
                  <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-24">
                    Tgl. Kirim
                  </th>
                  <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-20">
                    Kirim Via
                  </th>
                  <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-24">
                    Diterima Oleh
                  </th>
                  <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-24">
                    Tgl. Diterima
                  </th>
                  <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-16">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedPengiriman.length === 0 ? (
                  <tr>
                    <td
                      colSpan={12}
                      className="px-4 py-12 text-center text-xs text-zinc-400"
                    >
                      Tidak ada data tersedia.
                    </td>
                  </tr>
                ) : (
                  paginatedPengiriman.map((row, i) => (
                    <tr
                      key={row.id}
                      className="border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors"
                    >
                      <td className="px-4 py-3 text-xs text-zinc-400">
                        {(currentPagePengiriman - 1) * PAGE_SIZE + i + 1}
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-700">
                        {row.namaPenerima}
                      </td>
                      <td className="px-4 py-3 text-xs text-emerald-600 font-semibold cursor-pointer hover:underline">
                        {row.perusahaan}
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-600 leading-relaxed max-w-[200px]">
                        {row.alamat}
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-600">
                        {row.noTelp}
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-600">
                        {row.keteranganDokumen}
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-600">
                        {row.noResi ?? "-"}
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-600">
                        {row.tglKirim ?? "-"}
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-600">
                        {row.kirimVia ?? "-"}
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-600">
                        {row.diterimaOleh ?? "-"}
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-600">
                        {row.tglDiterima ?? "-"}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => openModal("edit", row.kiriman)}
                          className="text-xs text-emerald-600 font-semibold hover:underline"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-5 py-3 border-t border-zinc-100">
            <p className="text-[11px] text-zinc-400">
              Menampilkan{" "}
              <span className="font-semibold text-zinc-600">
                {filteredPengiriman.length === 0
                  ? 0
                  : (currentPagePengiriman - 1) * PAGE_SIZE + 1}
                –
                {Math.min(
                  currentPagePengiriman * PAGE_SIZE,
                  filteredPengiriman.length,
                )}
              </span>{" "}
              dari{" "}
              <span className="font-semibold text-zinc-600">
                {filteredPengiriman.length}
              </span>{" "}
              data
            </p>
            <Pagination
              current={currentPagePengiriman}
              total={totalPagesPengiriman}
              onChange={setCurrentPagePengiriman}
            />
          </div>
        </div>
      )}
    </AppLayout>
  );
}
