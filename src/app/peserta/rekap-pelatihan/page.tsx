"use client";

import React, { useState } from "react";
import AppLayout from "@/components/app-layout";

interface RekapPelatihan {
  id: number;
  kode: string;
  judul: string;
  data: {
    [year: number]: {
      rencana: number | null;
      running: number | null;
      cancel: number | null;
      peserta: number | null;
      rataRataPeserta: number | null;
    };
  };
}

const YEARS = [2026, 2025, 2024];

const DUMMY_DATA: RekapPelatihan[] = [
  {
    id: 1,
    kode: "CSR-01",
    judul: "Workshop Social Mapping untuk PROPER dan Program CSR Perusahaan",
    data: {
      2026: {
        rencana: 1,
        running: 1,
        cancel: null,
        peserta: null,
        rataRataPeserta: null,
      },
      2025: {
        rencana: null,
        running: null,
        cancel: null,
        peserta: 2,
        rataRataPeserta: null,
      },
      2024: {
        rencana: null,
        running: null,
        cancel: null,
        peserta: 2,
        rataRataPeserta: null,
      },
    },
  },
  {
    id: 2,
    kode: "CSR-02",
    judul:
      "Workshop PDCA CSR Perusahaan: Pemberdayaan Masyarakat, Peningkatan Kapasitas, Insfrastruktur dan Karikatif untuk PROPER",
    data: {
      2026: {
        rencana: 1,
        running: 1,
        cancel: null,
        peserta: null,
        rataRataPeserta: null,
      },
      2025: {
        rencana: null,
        running: null,
        cancel: null,
        peserta: 2,
        rataRataPeserta: null,
      },
      2024: {
        rencana: null,
        running: null,
        cancel: null,
        peserta: 2,
        rataRataPeserta: null,
      },
    },
  },
  {
    id: 3,
    kode: "CSR-03",
    judul: "CSR/CD Officer Development Program",
    data: {
      2026: {
        rencana: 2,
        running: 2,
        cancel: null,
        peserta: null,
        rataRataPeserta: null,
      },
      2025: {
        rencana: null,
        running: null,
        cancel: null,
        peserta: 4,
        rataRataPeserta: null,
      },
      2024: {
        rencana: null,
        running: null,
        cancel: null,
        peserta: 4,
        rataRataPeserta: null,
      },
    },
  },
  {
    id: 4,
    kode: "CSR-04",
    judul: "Monitoring dan Evaluasi (Monev) Program CSR/Comdev",
    data: {
      2026: {
        rencana: 3,
        running: 3,
        cancel: null,
        peserta: null,
        rataRataPeserta: null,
      },
      2025: {
        rencana: null,
        running: null,
        cancel: null,
        peserta: 6,
        rataRataPeserta: null,
      },
      2024: {
        rencana: null,
        running: null,
        cancel: null,
        peserta: 6,
        rataRataPeserta: null,
      },
    },
  },
  {
    id: 5,
    kode: "CSR-05",
    judul: "Implementasi ISO 26000 untuk CSR dan Keberlanjutan",
    data: {
      2026: {
        rencana: 2,
        running: 1,
        cancel: 1,
        peserta: null,
        rataRataPeserta: null,
      },
      2025: {
        rencana: 1,
        running: 1,
        cancel: null,
        peserta: 3,
        rataRataPeserta: null,
      },
      2024: {
        rencana: 2,
        running: 2,
        cancel: null,
        peserta: 5,
        rataRataPeserta: null,
      },
    },
  },
  {
    id: 6,
    kode: "CSR-06",
    judul: "Penyusunan Laporan Keberlanjutan (Sustainability Report)",
    data: {
      2026: {
        rencana: 1,
        running: 1,
        cancel: null,
        peserta: null,
        rataRataPeserta: null,
      },
      2025: {
        rencana: 2,
        running: 1,
        cancel: 1,
        peserta: 4,
        rataRataPeserta: null,
      },
      2024: {
        rencana: 1,
        running: 1,
        cancel: null,
        peserta: 3,
        rataRataPeserta: null,
      },
    },
  },
  {
    id: 7,
    kode: "CSR-07",
    judul: "Stakeholder Engagement dan Community Relations",
    data: {
      2026: {
        rencana: 2,
        running: 2,
        cancel: null,
        peserta: null,
        rataRataPeserta: null,
      },
      2025: {
        rencana: null,
        running: null,
        cancel: null,
        peserta: 5,
        rataRataPeserta: null,
      },
      2024: {
        rencana: null,
        running: null,
        cancel: null,
        peserta: 5,
        rataRataPeserta: null,
      },
    },
  },
  {
    id: 8,
    kode: "CSR-08",
    judul: "Program CSR Berbasis Lingkungan dan PROPER",
    data: {
      2026: {
        rencana: 1,
        running: null,
        cancel: 1,
        peserta: null,
        rataRataPeserta: null,
      },
      2025: {
        rencana: 3,
        running: 2,
        cancel: 1,
        peserta: 7,
        rataRataPeserta: null,
      },
      2024: {
        rencana: 2,
        running: 2,
        cancel: null,
        peserta: 4,
        rataRataPeserta: null,
      },
    },
  },
  {
    id: 9,
    kode: "CSR-09",
    judul: "Pengelolaan Dana CSR dan Tata Kelola Program",
    data: {
      2026: {
        rencana: 2,
        running: 2,
        cancel: null,
        peserta: null,
        rataRataPeserta: null,
      },
      2025: {
        rencana: 1,
        running: 1,
        cancel: null,
        peserta: 3,
        rataRataPeserta: null,
      },
      2024: {
        rencana: 1,
        running: 1,
        cancel: null,
        peserta: 3,
        rataRataPeserta: null,
      },
    },
  },
  {
    id: 10,
    kode: "CSR-10",
    judul: "Pengukuran Dampak Sosial Program CSR",
    data: {
      2026: {
        rencana: 1,
        running: 1,
        cancel: null,
        peserta: null,
        rataRataPeserta: null,
      },
      2025: {
        rencana: 2,
        running: 2,
        cancel: null,
        peserta: 6,
        rataRataPeserta: null,
      },
      2024: {
        rencana: 2,
        running: 1,
        cancel: 1,
        peserta: 4,
        rataRataPeserta: null,
      },
    },
  },
  {
    id: 11,
    kode: "CSR-11",
    judul: "Komunikasi dan Publikasi Program CSR",
    data: {
      2026: {
        rencana: 1,
        running: 1,
        cancel: null,
        peserta: null,
        rataRataPeserta: null,
      },
      2025: {
        rencana: 1,
        running: 1,
        cancel: null,
        peserta: 2,
        rataRataPeserta: null,
      },
      2024: {
        rencana: 1,
        running: 1,
        cancel: null,
        peserta: 2,
        rataRataPeserta: null,
      },
    },
  },
  {
    id: 12,
    kode: "CSR-12",
    judul: "Pelatihan CSR untuk UMKM dan Koperasi",
    data: {
      2026: {
        rencana: 2,
        running: 2,
        cancel: null,
        peserta: null,
        rataRataPeserta: null,
      },
      2025: {
        rencana: 2,
        running: 2,
        cancel: null,
        peserta: 8,
        rataRataPeserta: null,
      },
      2024: {
        rencana: 2,
        running: 2,
        cancel: null,
        peserta: 8,
        rataRataPeserta: null,
      },
    },
  },
  {
    id: 13,
    kode: "CSR-13",
    judul: "Strategi CSR di Era Digital dan Media Sosial",
    data: {
      2026: {
        rencana: 1,
        running: 1,
        cancel: null,
        peserta: null,
        rataRataPeserta: null,
      },
      2025: {
        rencana: 1,
        running: null,
        cancel: 1,
        peserta: null,
        rataRataPeserta: null,
      },
      2024: {
        rencana: 1,
        running: 1,
        cancel: null,
        peserta: 3,
        rataRataPeserta: null,
      },
    },
  },
  {
    id: 14,
    kode: "CSR-14",
    judul: "Pemberdayaan Perempuan dalam Program CSR",
    data: {
      2026: {
        rencana: 1,
        running: 1,
        cancel: null,
        peserta: null,
        rataRataPeserta: null,
      },
      2025: {
        rencana: 1,
        running: 1,
        cancel: null,
        peserta: 3,
        rataRataPeserta: null,
      },
      2024: {
        rencana: 1,
        running: 1,
        cancel: null,
        peserta: 3,
        rataRataPeserta: null,
      },
    },
  },
  {
    id: 15,
    kode: "CSR-15",
    judul: "Keterlibatan Komunitas Lokal dalam Program CSR",
    data: {
      2026: {
        rencana: 2,
        running: 2,
        cancel: null,
        peserta: null,
        rataRataPeserta: null,
      },
      2025: {
        rencana: 2,
        running: 2,
        cancel: null,
        peserta: 5,
        rataRataPeserta: null,
      },
      2024: {
        rencana: 2,
        running: 2,
        cancel: null,
        peserta: 5,
        rataRataPeserta: null,
      },
    },
  },
  {
    id: 16,
    kode: "CSR-16",
    judul: "Penerapan SDGs dalam Program CSR Perusahaan",
    data: {
      2026: {
        rencana: 1,
        running: 1,
        cancel: null,
        peserta: null,
        rataRataPeserta: null,
      },
      2025: {
        rencana: 1,
        running: 1,
        cancel: null,
        peserta: 4,
        rataRataPeserta: null,
      },
      2024: {
        rencana: 1,
        running: 1,
        cancel: null,
        peserta: 4,
        rataRataPeserta: null,
      },
    },
  },
  {
    id: 17,
    kode: "CSR-17",
    judul: "Audit Sosial dan Evaluasi Program CSR",
    data: {
      2026: {
        rencana: 1,
        running: null,
        cancel: 1,
        peserta: null,
        rataRataPeserta: null,
      },
      2025: {
        rencana: 2,
        running: 1,
        cancel: 1,
        peserta: 3,
        rataRataPeserta: null,
      },
      2024: {
        rencana: 2,
        running: 2,
        cancel: null,
        peserta: 6,
        rataRataPeserta: null,
      },
    },
  },
  {
    id: 18,
    kode: "CSR-18",
    judul: "CSR dan Hubungan Industrial yang Harmonis",
    data: {
      2026: {
        rencana: 1,
        running: 1,
        cancel: null,
        peserta: null,
        rataRataPeserta: null,
      },
      2025: {
        rencana: 1,
        running: 1,
        cancel: null,
        peserta: 2,
        rataRataPeserta: null,
      },
      2024: {
        rencana: 1,
        running: 1,
        cancel: null,
        peserta: 2,
        rataRataPeserta: null,
      },
    },
  },
  {
    id: 19,
    kode: "CSR-19",
    judul: "Program Beasiswa dan Pendidikan dalam CSR",
    data: {
      2026: {
        rencana: 2,
        running: 2,
        cancel: null,
        peserta: null,
        rataRataPeserta: null,
      },
      2025: {
        rencana: 2,
        running: 2,
        cancel: null,
        peserta: 7,
        rataRataPeserta: null,
      },
      2024: {
        rencana: 2,
        running: 2,
        cancel: null,
        peserta: 7,
        rataRataPeserta: null,
      },
    },
  },
  {
    id: 20,
    kode: "CSR-20",
    judul: "Pengelolaan Lingkungan Hidup dalam CSR",
    data: {
      2026: {
        rencana: 1,
        running: 1,
        cancel: null,
        peserta: null,
        rataRataPeserta: null,
      },
      2025: {
        rencana: 1,
        running: 1,
        cancel: null,
        peserta: 3,
        rataRataPeserta: null,
      },
      2024: {
        rencana: 1,
        running: 1,
        cancel: null,
        peserta: 3,
        rataRataPeserta: null,
      },
    },
  },
  {
    id: 21,
    kode: "CSR-21",
    judul: "Inovasi Sosial dan Technopreneurship dalam CSR",
    data: {
      2026: {
        rencana: 1,
        running: 1,
        cancel: null,
        peserta: null,
        rataRataPeserta: null,
      },
      2025: {
        rencana: 1,
        running: 1,
        cancel: null,
        peserta: 2,
        rataRataPeserta: null,
      },
      2024: {
        rencana: 1,
        running: 1,
        cancel: null,
        peserta: 2,
        rataRataPeserta: null,
      },
    },
  },
  {
    id: 22,
    kode: "CSR-22",
    judul: "Peran CSR dalam Mitigasi Bencana dan Kemanusiaan",
    data: {
      2026: {
        rencana: 1,
        running: 1,
        cancel: null,
        peserta: null,
        rataRataPeserta: null,
      },
      2025: {
        rencana: 1,
        running: 1,
        cancel: null,
        peserta: 3,
        rataRataPeserta: null,
      },
      2024: {
        rencana: 1,
        running: 1,
        cancel: null,
        peserta: 3,
        rataRataPeserta: null,
      },
    },
  },
  {
    id: 23,
    kode: "CSR-23",
    judul: "Regulasi dan Kepatuhan Hukum Program CSR",
    data: {
      2026: {
        rencana: 2,
        running: 2,
        cancel: null,
        peserta: null,
        rataRataPeserta: null,
      },
      2025: {
        rencana: 2,
        running: 2,
        cancel: null,
        peserta: 5,
        rataRataPeserta: null,
      },
      2024: {
        rencana: 2,
        running: 2,
        cancel: null,
        peserta: 5,
        rataRataPeserta: null,
      },
    },
  },
  {
    id: 24,
    kode: "CSR-24",
    judul: "Kemitraan Strategis dalam Program CSR",
    data: {
      2026: {
        rencana: 1,
        running: 1,
        cancel: null,
        peserta: null,
        rataRataPeserta: null,
      },
      2025: {
        rencana: 1,
        running: 1,
        cancel: null,
        peserta: 2,
        rataRataPeserta: null,
      },
      2024: {
        rencana: 1,
        running: 1,
        cancel: null,
        peserta: 2,
        rataRataPeserta: null,
      },
    },
  },
  {
    id: 25,
    kode: "CSR-25",
    judul: "Pelatihan Fasilitator CSR dan Community Development",
    data: {
      2026: {
        rencana: 2,
        running: 2,
        cancel: null,
        peserta: null,
        rataRataPeserta: null,
      },
      2025: {
        rencana: 2,
        running: 2,
        cancel: null,
        peserta: 6,
        rataRataPeserta: null,
      },
      2024: {
        rencana: 2,
        running: 2,
        cancel: null,
        peserta: 6,
        rataRataPeserta: null,
      },
    },
  },
  {
    id: 26,
    kode: "CSR-26",
    judul: "Manajemen Risiko Sosial dalam Program CSR",
    data: {
      2026: {
        rencana: 1,
        running: 1,
        cancel: null,
        peserta: null,
        rataRataPeserta: null,
      },
      2025: {
        rencana: 1,
        running: 1,
        cancel: null,
        peserta: 3,
        rataRataPeserta: null,
      },
      2024: {
        rencana: 1,
        running: 1,
        cancel: null,
        peserta: 3,
        rataRataPeserta: null,
      },
    },
  },
  {
    id: 27,
    kode: "CSR-27",
    judul: "Pemetaan Sosial dan Analisis Kebutuhan Komunitas",
    data: {
      2026: {
        rencana: 2,
        running: 2,
        cancel: null,
        peserta: null,
        rataRataPeserta: null,
      },
      2025: {
        rencana: 2,
        running: 2,
        cancel: null,
        peserta: 4,
        rataRataPeserta: null,
      },
      2024: {
        rencana: 2,
        running: 2,
        cancel: null,
        peserta: 4,
        rataRataPeserta: null,
      },
    },
  },
  {
    id: 28,
    kode: "CSR-28",
    judul: "Pelaporan CSR Berdasarkan GRI Standards",
    data: {
      2026: {
        rencana: 1,
        running: 1,
        cancel: null,
        peserta: null,
        rataRataPeserta: null,
      },
      2025: {
        rencana: 1,
        running: 1,
        cancel: null,
        peserta: 3,
        rataRataPeserta: null,
      },
      2024: {
        rencana: 1,
        running: 1,
        cancel: null,
        peserta: 3,
        rataRataPeserta: null,
      },
    },
  },
];

const PAGE_SIZE = 4;

function Val({ v }: { v: number | null }) {
  return (
    <td className="px-3 py-3 text-center text-xs text-zinc-500">
      {v === null ? "-" : v}
    </td>
  );
}

export default function RekapPelatihanRunningPage() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = DUMMY_DATA.filter(
    (d) =>
      d.judul.toLowerCase().includes(search.toLowerCase()) ||
      d.kode.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1, 2, 3, "...ellipsis", totalPages);
    }
    return pages;
  };

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Training", href: "/training" },
        { label: "Rekap Pelatihan Running (Tahunan)" },
      ]}
      subtitle="Hari ini: Selasa, 3 Februari 2026"
      userName="Nanang"
      userRole="Super Admin"
    >
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between gap-3">
          <span className="font-bold text-zinc-800 text-sm flex items-center gap-2">
            🗓️ Rekap Pelatihan Running (Tahunan)
          </span>
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
                setCurrentPage(1);
              }}
              className="w-52 pl-7 pr-3 py-1.5 border border-zinc-200 rounded-lg text-xs text-zinc-700 outline-none focus:border-emerald-300 transition-all"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full" style={{ minWidth: "1400px" }}>
            <thead>
              {/* Year group row */}
              <tr className="border-b border-zinc-100 bg-zinc-50/60">
                <th
                  className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-10"
                  rowSpan={2}
                >
                  No ↕
                </th>
                <th
                  className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-20"
                  rowSpan={2}
                >
                  Kode
                </th>
                <th
                  className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-56"
                  rowSpan={2}
                >
                  Judul
                </th>
                {YEARS.map((year) => (
                  <th
                    key={year}
                    colSpan={5}
                    className="px-3 py-2 text-[10px] font-bold text-zinc-500 text-center border-l border-zinc-100"
                  >
                    {year}
                  </th>
                ))}
              </tr>

              {/* Sub-header row */}
              <tr className="border-b border-zinc-100 bg-zinc-50/60">
                {YEARS.map((year) => (
                  <React.Fragment key={year}>
                    <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-center border-l border-zinc-100 w-16">
                      Rencana
                    </th>
                    <th
                      className="px-3 py-2 text-[10px] font-bold text-center w-16"
                      style={{ color: "#059669", backgroundColor: "#d1fae5" }}
                    >
                      Running
                    </th>
                    <th
                      className="px-3 py-2 text-[10px] font-bold text-center w-16"
                      style={{ color: "#dc2626", backgroundColor: "#fee2e2" }}
                    >
                      Cancel
                    </th>
                    <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-center w-16">
                      Peserta
                    </th>
                    <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-center w-24">
                      Rata-rata Peserta
                    </th>
                  </React.Fragment>
                ))}
              </tr>
            </thead>

            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={3 + YEARS.length * 5}
                    className="px-4 py-12 text-center text-xs text-zinc-400"
                  >
                    Tidak ada data tersedia.
                  </td>
                </tr>
              ) : (
                paginated.map((row, i) => (
                  <tr
                    key={row.id}
                    className="border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-xs text-zinc-400">
                      {(currentPage - 1) * PAGE_SIZE + i + 1}
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-600 font-medium">
                      {row.kode}
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-700 leading-relaxed">
                      {row.judul}
                    </td>
                    {YEARS.map((year) => {
                      const d = row.data[year] ?? {
                        rencana: null,
                        running: null,
                        cancel: null,
                        peserta: null,
                        rataRataPeserta: null,
                      };
                      return (
                        <React.Fragment key={year}>
                          <Val v={d.rencana} />
                          <td
                            className="px-3 py-3 text-center text-xs font-semibold"
                            style={{
                              color: d.running !== null ? "#059669" : "#d1d5db",
                            }}
                          >
                            {d.running === null ? "-" : d.running}
                          </td>
                          <td
                            className="px-3 py-3 text-center text-xs font-semibold"
                            style={{
                              color: d.cancel !== null ? "#dc2626" : "#d1d5db",
                            }}
                          >
                            {d.cancel === null ? "-" : d.cancel}
                          </td>
                          <Val v={d.peserta} />
                          <Val v={d.rataRataPeserta} />
                        </React.Fragment>
                      );
                    })}
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
              {filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}–
              {Math.min(currentPage * PAGE_SIZE, filtered.length)}
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
            {getPageNumbers().map((p) =>
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
                  onClick={() => setCurrentPage(p)}
                  className={`w-7 h-7 rounded-lg text-[11px] font-semibold transition-colors ${
                    p === currentPage
                      ? "bg-emerald-500 text-white"
                      : "border border-zinc-200 text-zinc-500 hover:bg-zinc-50"
                  }`}
                >
                  {p}
                </button>
              ),
            )}
            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage === totalPages}
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
