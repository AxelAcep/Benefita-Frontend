"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/sidebar";
import { generatePastelBg, generatePastelText } from "@/lib/pastelColor";

// ─── Types ────────────────────────────────────────────────────────────────────
interface InfoKegiatan {
  judulPelatihan: string;
  tempatTanggalKegiatan: string;
}

interface FormPendaftaranItem {
  id: number;
  nama: string;
}

// ─── Dummy Data (replace with API fetch) ──────────────────────────────────────
const infoKegiatan: InfoKegiatan = {
  judulPelatihan: "Manajer Energi",
  tempatTanggalKegiatan: "Cikarang / 02-04 Maret 2026",
};

const formPendaftaranData: FormPendaftaranItem[] = [
  { id: 1, nama: "Muhammad Habibie Musy" },
  { id: 2, nama: "Arief Khairul Djaelani" },
  { id: 3, nama: "Setiyo Rishandoko" },
  { id: 4, nama: "Ahmad Sarminto" },
];

// ─── Sort Icon ────────────────────────────────────────────────────────────────
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

// ─── Card Icon ────────────────────────────────────────────────────────────────
function CardIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#10b981"
      strokeWidth="2"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M3 15h18M9 3v18" />
    </svg>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CetakFormulirPendaftaranPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const router = useRouter();
  const perPage = 10;

  // Data sudah ditarik — tinggal ganti dengan hasil fetch API
  const kegiatan = infoKegiatan;
  const rawData = formPendaftaranData;

  const filtered = rawData.filter((d) =>
    d.nama.toLowerCase().includes(search.toLowerCase()),
  );
  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

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
          {/* Back button */}
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

          {/* Two-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-4 items-start">
            {/* Left: Informasi Kegiatan */}
            <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-zinc-100 flex items-center gap-2">
                <div className="w-5 h-5 bg-emerald-50 rounded-md flex items-center justify-center">
                  <CardIcon />
                </div>
                <p className="text-sm font-bold text-zinc-800">
                  Informasi Kegiatan
                </p>
              </div>
              <div className="px-5 py-4 space-y-3">
                <div className="flex items-start gap-3">
                  <p className="text-xs text-zinc-500 w-40 shrink-0 pt-2">
                    Judul Pelatihan
                  </p>
                  <div className="flex-1 border border-zinc-200 rounded-lg px-3 py-2">
                    <p className="text-xs text-zinc-700">
                      {kegiatan.judulPelatihan}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <p className="text-xs text-zinc-500 w-40 shrink-0 pt-2">
                    Tempat/Tanggal Kegiatan
                  </p>
                  <div className="flex-1 border border-zinc-200 rounded-lg px-3 py-2">
                    <p className="text-xs text-zinc-700">
                      {kegiatan.tempatTanggalKegiatan}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Informasi Form Pendaftaran */}
            <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
              {/* Toolbar */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-emerald-50 rounded-md flex items-center justify-center">
                    <CardIcon />
                  </div>
                  <p className="text-sm font-bold text-zinc-800">
                    Informasi Form Pendaftaran
                  </p>
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
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-zinc-100">
                      <th className="px-4 py-3 text-[11px] font-semibold text-zinc-400 text-left w-12">
                        <span className="flex items-center gap-1">
                          No <SortIcon />
                        </span>
                      </th>
                      <th className="px-4 py-3 text-[11px] font-semibold text-zinc-400 text-left">
                        Nama
                      </th>
                      <th className="px-4 py-3 text-[11px] font-semibold text-zinc-400 text-right">
                        Aksi
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
                          {row.nama}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button className="text-[11px] text-emerald-500 hover:text-emerald-600 font-semibold transition-colors">
                            Download
                          </button>
                        </td>
                      </tr>
                    ))}
                    {paginated.length === 0 && (
                      <tr>
                        <td
                          colSpan={3}
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
                    {(page - 1) * perPage + 1}
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
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (p) => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
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
    </div>
  );
}
