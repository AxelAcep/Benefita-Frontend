"use client";

import React, { useState } from "react";
import { ImagePlay } from "lucide-react";
import AppLayout from "@/components/app-layout";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface WhatsappStoryItem {
  id: number;
  tanggalPelatihan: string;
  tanggalUji: string;
  judulTraining: string;
  lokasiOffline: string;
  online: string;
}

// ---------------------------------------------------------------------------
// Dummy data
// ---------------------------------------------------------------------------

const DUMMY_DATA: WhatsappStoryItem[] = [
  {
    id: 1,
    tanggalPelatihan: "20 – 22 April 2026",
    tanggalUji: "23 April 2026",
    judulTraining:
      "Manajer Penyimpanan Limbah Bahan Berbahaya dan Beracun (Limbah B3) SKKNI No.:191/2019 (Level Penanggung Jawab)",
    lokasiOffline: "06 April 2026",
    online: "-",
  },
  {
    id: 2,
    tanggalPelatihan: "20 – 22 April 2026",
    tanggalUji: "23 April 2026",
    judulTraining:
      "Operator Penyimpanan Limbah Bahan Berbahaya dan Beracun (Limbah B3) SKKNI No.:191/2019 (Level Operator)",
    lokasiOffline: "06 April 2026",
    online: "Axel",
  },
  {
    id: 3,
    tanggalPelatihan: "20 – 22 April 2026",
    tanggalUji: "23 April 2026",
    judulTraining:
      "Manajer Pemanfaatan Limbah Bahan Berbahaya dan Beracun (Limbah B3) SKKNI No.:191/2019 (Level Penanggung Jawab)",
    lokasiOffline: "06 April 2026",
    online: "Axel",
  },
  {
    id: 4,
    tanggalPelatihan: "20 – 22 April 2026",
    tanggalUji: "23 April 2026",
    judulTraining:
      "Operator Pemanfaatan Limbah Bahan Berbahaya dan Beracun (Limbah B3) (SKKNI No.:191/2019) (Level Operator)",
    lokasiOffline: "06 April 2026",
    online: "-",
  },
  {
    id: 5,
    tanggalPelatihan: "27 – 29 April 2026",
    tanggalUji: "30 April 2026",
    judulTraining:
      "Ahli K3 Lingkungan Hidup SKKNI No.:399/2014 (Level Ahli Muda)",
    lokasiOffline: "13 April 2026",
    online: "Budi",
  },
  {
    id: 6,
    tanggalPelatihan: "27 – 29 April 2026",
    tanggalUji: "30 April 2026",
    judulTraining:
      "Teknisi Pengelolaan Air Limbah SKKNI No.:112/2016 (Level Teknisi Madya)",
    lokasiOffline: "13 April 2026",
    online: "-",
  },
  {
    id: 7,
    tanggalPelatihan: "04 – 06 Mei 2026",
    tanggalUji: "07 Mei 2026",
    judulTraining:
      "Manajer Penyimpanan Limbah B3 SKKNI No.:191/2019 (Level Penanggung Jawab)",
    lokasiOffline: "20 April 2026",
    online: "Axel",
  },
  {
    id: 8,
    tanggalPelatihan: "04 – 06 Mei 2026",
    tanggalUji: "07 Mei 2026",
    judulTraining:
      "Operator Penyimpanan Limbah B3 SKKNI No.:191/2019 (Level Operator)",
    lokasiOffline: "20 April 2026",
    online: "-",
  },
  // Minggu-2
  {
    id: 9,
    tanggalPelatihan: "11 – 13 Mei 2026",
    tanggalUji: "14 Mei 2026",
    judulTraining:
      "Pengawas Lingkungan Hidup SKKNI No.:217/2016 (Level Pengawas Madya)",
    lokasiOffline: "27 April 2026",
    online: "Citra",
  },
  {
    id: 10,
    tanggalPelatihan: "11 – 13 Mei 2026",
    tanggalUji: "14 Mei 2026",
    judulTraining:
      "Analis Kualitas Udara SKKNI No.:305/2015 (Level Analis Madya)",
    lokasiOffline: "27 April 2026",
    online: "-",
  },
  {
    id: 11,
    tanggalPelatihan: "18 – 20 Mei 2026",
    tanggalUji: "21 Mei 2026",
    judulTraining:
      "Teknisi Pemantauan Kualitas Air SKKNI No.:411/2014 (Level Teknisi Muda)",
    lokasiOffline: "04 Mei 2026",
    online: "Dedi",
  },
  {
    id: 12,
    tanggalPelatihan: "18 – 20 Mei 2026",
    tanggalUji: "21 Mei 2026",
    judulTraining:
      "Manajer Pemanfaatan Limbah B3 SKKNI No.:191/2019 (Level Penanggung Jawab)",
    lokasiOffline: "04 Mei 2026",
    online: "-",
  },
  // Minggu-3
  {
    id: 13,
    tanggalPelatihan: "25 – 27 Mei 2026",
    tanggalUji: "28 Mei 2026",
    judulTraining:
      "Operator Pemanfaatan Limbah B3 SKKNI No.:191/2019 (Level Operator)",
    lokasiOffline: "11 Mei 2026",
    online: "Axel",
  },
  {
    id: 14,
    tanggalPelatihan: "25 – 27 Mei 2026",
    tanggalUji: "28 Mei 2026",
    judulTraining: "Ahli K3 Konstruksi SKKNI No.:483/2014 (Level Ahli Muda)",
    lokasiOffline: "11 Mei 2026",
    online: "-",
  },
  {
    id: 15,
    tanggalPelatihan: "01 – 03 Juni 2026",
    tanggalUji: "04 Juni 2026",
    judulTraining:
      "Pengawas Lingkungan Hidup SKKNI No.:217/2016 (Level Pengawas Utama)",
    lokasiOffline: "18 Mei 2026",
    online: "Budi",
  },
  {
    id: 16,
    tanggalPelatihan: "01 – 03 Juni 2026",
    tanggalUji: "04 Juni 2026",
    judulTraining:
      "Teknisi Pengelolaan Air Limbah SKKNI No.:112/2016 (Level Teknisi Utama)",
    lokasiOffline: "18 Mei 2026",
    online: "-",
  },
  // Minggu-4
  {
    id: 17,
    tanggalPelatihan: "08 – 10 Juni 2026",
    tanggalUji: "11 Juni 2026",
    judulTraining:
      "Manajer Penyimpanan Limbah B3 SKKNI No.:191/2019 (Level Penanggung Jawab)",
    lokasiOffline: "25 Mei 2026",
    online: "Citra",
  },
  {
    id: 18,
    tanggalPelatihan: "08 – 10 Juni 2026",
    tanggalUji: "11 Juni 2026",
    judulTraining:
      "Analis Kualitas Udara SKKNI No.:305/2015 (Level Analis Utama)",
    lokasiOffline: "25 Mei 2026",
    online: "-",
  },
  {
    id: 19,
    tanggalPelatihan: "15 – 17 Juni 2026",
    tanggalUji: "18 Juni 2026",
    judulTraining:
      "Operator Penyimpanan Limbah B3 SKKNI No.:191/2019 (Level Operator)",
    lokasiOffline: "01 Juni 2026",
    online: "Dedi",
  },
  {
    id: 20,
    tanggalPelatihan: "15 – 17 Juni 2026",
    tanggalUji: "18 Juni 2026",
    judulTraining:
      "Teknisi Pemantauan Kualitas Air SKKNI No.:411/2014 (Level Teknisi Utama)",
    lokasiOffline: "01 Juni 2026",
    online: "-",
  },
  {
    id: 21,
    tanggalPelatihan: "22 – 24 Juni 2026",
    tanggalUji: "25 Juni 2026",
    judulTraining:
      "Ahli K3 Lingkungan Hidup SKKNI No.:399/2014 (Level Ahli Utama)",
    lokasiOffline: "08 Juni 2026",
    online: "Axel",
  },
  {
    id: 22,
    tanggalPelatihan: "22 – 24 Juni 2026",
    tanggalUji: "25 Juni 2026",
    judulTraining:
      "Manajer Pemanfaatan Limbah B3 SKKNI No.:191/2019 (Level Penanggung Jawab)",
    lokasiOffline: "08 Juni 2026",
    online: "-",
  },
  {
    id: 23,
    tanggalPelatihan: "29 Juni – 01 Juli 2026",
    tanggalUji: "02 Juli 2026",
    judulTraining:
      "Pengawas Lingkungan Hidup SKKNI No.:217/2016 (Level Pengawas Muda)",
    lokasiOffline: "15 Juni 2026",
    online: "Budi",
  },
  {
    id: 24,
    tanggalPelatihan: "29 Juni – 01 Juli 2026",
    tanggalUji: "02 Juli 2026",
    judulTraining:
      "Operator Pemanfaatan Limbah B3 SKKNI No.:191/2019 (Level Operator)",
    lokasiOffline: "15 Juni 2026",
    online: "-",
  },
  {
    id: 25,
    tanggalPelatihan: "06 – 08 Juli 2026",
    tanggalUji: "09 Juli 2026",
    judulTraining:
      "Teknisi Pengelolaan Air Limbah SKKNI No.:112/2016 (Level Teknisi Muda)",
    lokasiOffline: "22 Juni 2026",
    online: "Citra",
  },
  {
    id: 26,
    tanggalPelatihan: "06 – 08 Juli 2026",
    tanggalUji: "09 Juli 2026",
    judulTraining:
      "Analis Kualitas Udara SKKNI No.:305/2015 (Level Analis Muda)",
    lokasiOffline: "22 Juni 2026",
    online: "-",
  },
  {
    id: 27,
    tanggalPelatihan: "13 – 15 Juli 2026",
    tanggalUji: "16 Juli 2026",
    judulTraining:
      "Manajer Penyimpanan Limbah B3 SKKNI No.:191/2019 (Level Supervisor)",
    lokasiOffline: "29 Juni 2026",
    online: "Dedi",
  },
  {
    id: 28,
    tanggalPelatihan: "13 – 15 Juli 2026",
    tanggalUji: "16 Juli 2026",
    judulTraining: "Ahli K3 Konstruksi SKKNI No.:483/2014 (Level Ahli Utama)",
    lokasiOffline: "29 Juni 2026",
    online: "-",
  },
];

// Pagination: per minggu, 7 item per halaman
const WEEKS = ["Minggu-1", "Minggu-2", "Minggu-3", "Minggu-4"];
const PAGE_SIZE = 7;

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function WhatsappStoryPage() {
  const [search, setSearch] = useState("");
  const [currentWeek, setCurrentWeek] = useState(0); // index 0–3

  const filtered = DUMMY_DATA.filter(
    (d) =>
      d.judulTraining.toLowerCase().includes(search.toLowerCase()) ||
      d.tanggalPelatihan.toLowerCase().includes(search.toLowerCase()),
  );

  // Slice per minggu
  const paginated = filtered.slice(
    currentWeek * PAGE_SIZE,
    (currentWeek + 1) * PAGE_SIZE,
  );

  const totalWeeks = Math.ceil(filtered.length / PAGE_SIZE);

  return (
    <AppLayout
      breadcrumbs={[
        { label: "BDO & Aktivitas", href: "/bdo" },
        { label: "Aset Marketing", href: "/bdo/aset-marketing" },
        { label: "Whatsapp Story" },
      ]}
      subtitle="Hari ini: Selasa, 3 Februari 2026"
      userName="Nanang"
      userRole="Super Admin"
    >
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="px-5 py-3 border-b border-zinc-100">
          <div className="flex flex-wrap items-center gap-2">
            {/* Title */}
            <div className="flex items-center gap-2 mr-2">
              <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center">
                <ImagePlay className="w-3.5 h-3.5 text-emerald-500" />
              </div>
              <span className="font-bold text-zinc-800 text-sm">
                Whatsapp Story
              </span>
            </div>

            {/* Search — pushed to the right */}
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
                  setCurrentWeek(0);
                }}
                className="w-full sm:w-52 pl-7 pr-3 py-1.5 border border-zinc-200 rounded-lg text-xs text-zinc-700 outline-none focus:border-emerald-300 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/60">
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-10">
                  No ↕
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-36">
                  Tanggal Pelatihan
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-32">
                  Tanggal Uji
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left">
                  Judul Training
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-32">
                  Lokasi Offline
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-24">
                  Online
                </th>
              </tr>
            </thead>

            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
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
                    <td className="px-4 py-3 text-xs text-zinc-400">
                      {currentWeek * PAGE_SIZE + i + 1}
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-600 whitespace-nowrap">
                      {row.tanggalPelatihan}
                    </td>
                    <td className="px-3 py-3 text-xs text-zinc-600 whitespace-nowrap">
                      {row.tanggalUji}
                    </td>
                    <td className="px-3 py-3 text-xs text-emerald-600 font-medium cursor-pointer hover:underline leading-relaxed">
                      {row.judulTraining}
                    </td>
                    <td className="px-3 py-3 text-xs text-zinc-600 whitespace-nowrap">
                      {row.lokasiOffline}
                    </td>
                    <td className="px-3 py-3 text-xs text-zinc-600">
                      {row.online === "-" ? (
                        <span className="text-zinc-300 select-none">–</span>
                      ) : (
                        row.online
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination — Minggu style */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-5 py-3 border-t border-zinc-100">
          <p className="text-[11px] text-zinc-400">
            Menampilkan{" "}
            <span className="font-semibold text-zinc-600">
              {filtered.length === 0 ? 0 : currentWeek * PAGE_SIZE + 1}–
              {Math.min((currentWeek + 1) * PAGE_SIZE, filtered.length)}
            </span>{" "}
            dari{" "}
            <span className="font-semibold text-zinc-600">
              {filtered.length}
            </span>{" "}
            data
          </p>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentWeek((w) => w - 1)}
              disabled={currentWeek === 0}
              className="px-3 py-1.5 text-[11px] border border-zinc-200 rounded-lg text-zinc-500 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium"
            >
              ‹ Sebelumnya
            </button>

            {Array.from({ length: totalWeeks }, (_, i) => i).map((w) => (
              <button
                key={w}
                onClick={() => setCurrentWeek(w)}
                className={`px-3 h-7 rounded-lg text-[11px] font-semibold transition-colors ${
                  w === currentWeek
                    ? "bg-emerald-500 text-white"
                    : "border border-zinc-200 text-zinc-500 hover:bg-zinc-50"
                }`}
              >
                {WEEKS[w]}
              </button>
            ))}

            <button
              onClick={() => setCurrentWeek((w) => w + 1)}
              disabled={currentWeek >= totalWeeks - 1}
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
