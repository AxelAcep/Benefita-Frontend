"use client";

import React, { useState } from "react";
import { Users, Plus, UserCircle2 } from "lucide-react";
import AppLayout from "@/components/app-layout";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Pegawai {
  id: number;
  fotoUrl: string | null; // null = belum ada foto, string = URL dari API
  nip: string;
  nama: string;
  jabatan: string;
}

// ---------------------------------------------------------------------------
// Dummy data
// ---------------------------------------------------------------------------

const DUMMY_DATA: Pegawai[] = [
  {
    id: 1,
    fotoUrl: null,
    nip: "19901215 202001 1 001",
    nama: "Agus Kurniawan",
    jabatan: "Trainer Senior",
  },
  {
    id: 2,
    fotoUrl: null,
    nip: "19920308 202101 1 002",
    nama: "Firza Muldani",
    jabatan: "Business Development Officer",
  },
  {
    id: 3,
    fotoUrl: null,
    nip: "19951122 202201 1 003",
    nama: "Gihon Andre Asmitra Harahap",
    jabatan: "Trainer Junior",
  },
  {
    id: 4,
    fotoUrl: null,
    nip: "19880520 201901 2 004",
    nama: "Murra Candra Wicaksana",
    jabatan: "Koordinator Training",
  },
  {
    id: 5,
    fotoUrl: null,
    nip: "19930714 202001 2 005",
    nama: "Siti Rahmawati",
    jabatan: "Admin Keuangan",
  },
  {
    id: 6,
    fotoUrl: null,
    nip: "19870301 201801 1 006",
    nama: "Rudi Hartono",
    jabatan: "Manajer Operasional",
  },
  {
    id: 7,
    fotoUrl: null,
    nip: "19961010 202301 1 007",
    nama: "Anita Kusuma Dewi",
    jabatan: "Marketing Executive",
  },
  {
    id: 8,
    fotoUrl: null,
    nip: "19940217 202101 2 008",
    nama: "Budi Santoso",
    jabatan: "Trainer Senior",
  },
  {
    id: 9,
    fotoUrl: null,
    nip: "19911130 202001 2 009",
    nama: "Mega Lestari",
    jabatan: "Admin Umum",
  },
  {
    id: 10,
    fotoUrl: null,
    nip: "19890425 201901 1 010",
    nama: "Farhan Maulana",
    jabatan: "Koordinator Sertifikasi",
  },
  {
    id: 11,
    fotoUrl: null,
    nip: "19970612 202301 1 011",
    nama: "Taufik Hidayat",
    jabatan: "Business Development Officer",
  },
  {
    id: 12,
    fotoUrl: null,
    nip: "19920801 202101 2 012",
    nama: "Nurul Hidayah",
    jabatan: "Trainer Junior",
  },
];

const PAGE_SIZE = 10;

// ---------------------------------------------------------------------------
// Avatar component — shows photo from API or placeholder
// ---------------------------------------------------------------------------

function Avatar({ fotoUrl, nama }: { fotoUrl: string | null; nama: string }) {
  if (fotoUrl) {
    return (
      <img
        src={fotoUrl}
        alt={nama}
        className="w-14 h-16 object-cover rounded-md border border-zinc-200"
      />
    );
  }

  return (
    <div className="w-14 h-16 rounded-md border border-zinc-200 bg-zinc-50 flex items-center justify-center">
      <UserCircle2 className="w-8 h-8 text-zinc-300" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function DataPegawaiPage() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = DUMMY_DATA.filter(
    (d) =>
      d.nama.toLowerCase().includes(search.toLowerCase()) ||
      d.nip.toLowerCase().includes(search.toLowerCase()) ||
      d.jabatan.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  function pageNumbers() {
    const total = totalPages;
    if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
    const pages: (number | "...")[] = [1];
    if (currentPage > 3) pages.push("...");
    for (
      let p = Math.max(2, currentPage - 1);
      p <= Math.min(total - 1, currentPage + 1);
      p++
    )
      pages.push(p);
    if (currentPage < total - 2) pages.push("...");
    pages.push(total);
    return pages;
  }

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Karyawan & Aktivitas", href: "/karyawan" },
        { label: "Data Pegawai" },
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
                <Users className="w-3.5 h-3.5 text-emerald-500" />
              </div>
              <span className="font-bold text-zinc-800 text-sm">
                Data Pegawai
              </span>
            </div>

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

            {/* Tambah Data */}
            <button className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-semibold rounded-lg transition-colors">
              <Plus className="w-3.5 h-3.5" />
              Tambah Data
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/60">
                <th className="px-5 py-2.5 text-[10px] font-semibold text-zinc-400 text-left w-12">
                  No ↕
                </th>
                <th className="px-4 py-2.5 text-[10px] font-semibold text-zinc-400 text-left w-24">
                  Foto
                </th>
                <th className="px-4 py-2.5 text-[10px] font-semibold text-zinc-400 text-left w-52">
                  NIP
                </th>
                <th className="px-4 py-2.5 text-[10px] font-semibold text-zinc-400 text-left">
                  Nama
                </th>
                <th className="px-4 py-2.5 text-[10px] font-semibold text-zinc-400 text-left w-52">
                  Jabatan
                </th>
                <th className="px-4 py-2.5 text-[10px] font-semibold text-zinc-400 text-left w-64">
                  Aksi
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
                    className="border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors align-middle"
                  >
                    <td className="px-5 py-4 text-xs text-zinc-400">
                      {(currentPage - 1) * PAGE_SIZE + i + 1}
                    </td>
                    <td className="px-4 py-4">
                      <Avatar fotoUrl={row.fotoUrl} nama={row.nama} />
                    </td>
                    <td className="px-4 py-4 text-xs text-zinc-600 font-mono tracking-wide">
                      {row.nip}
                    </td>
                    <td className="px-4 py-4 text-xs text-zinc-700 font-medium">
                      {row.nama}
                    </td>
                    <td className="px-4 py-4 text-xs text-zinc-600">
                      {row.jabatan}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <button className="text-xs text-emerald-600 font-semibold hover:underline whitespace-nowrap">
                          Lihat Detail
                        </button>
                        <button className="text-xs text-emerald-600 font-semibold hover:underline whitespace-nowrap">
                          Reset Device
                        </button>
                        <button className="text-xs text-emerald-600 font-semibold hover:underline whitespace-nowrap">
                          Reset Password
                        </button>
                      </div>
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
                  onClick={() => setCurrentPage(p as number)}
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
