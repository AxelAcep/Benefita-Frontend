"use client";

import React, { useState } from "react";
import { ClipboardCheck, Plus } from "lucide-react";
import AppLayout from "@/components/app-layout";
import TugasPelaporanModal, {
  TugasPelaporanFormData,
} from "@/components/bdo/tugas-pelaporan-modal";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface TugasPelaporan {
  id: number;
  tanggal: string;
  kegiatan: string;
  pic: string;
  dueDate: string;
  penerimaLaporan: string | null;
  status: string;
}

// ---------------------------------------------------------------------------
// Dummy data
// ---------------------------------------------------------------------------

const DUMMY_DATA: TugasPelaporan[] = [
  {
    id: 1,
    tanggal: "02 April 2026",
    kegiatan: "Follow up perusahaan PT. ABC",
    pic: "Muamal Rasyid",
    dueDate: "06 April 2026",
    penerimaLaporan: null,
    status: "Tugas",
  },
  {
    id: 2,
    tanggal: "01 April 2026",
    kegiatan: "Menghubungi PT. ABC",
    pic: "Yayat Hidayat",
    dueDate: "06 April 2026",
    penerimaLaporan: "Axel",
    status: "Tugas dan Pelaporan",
  },
  {
    id: 3,
    tanggal: "01 April 2026",
    kegiatan: "Kunjungan",
    pic: "Toni Purba",
    dueDate: "06 April 2026",
    penerimaLaporan: "Axel",
    status: "Tugas dan Pelaporan",
  },
  {
    id: 4,
    tanggal: "01 April 2026",
    kegiatan: "Kunjungan",
    pic: "Imamsyah Roesli",
    dueDate: "06 April 2026",
    penerimaLaporan: null,
    status: "Tugas",
  },
  {
    id: 5,
    tanggal: "31 Maret 2026",
    kegiatan: "Follow up kontrak baru",
    pic: "Aldy",
    dueDate: "07 April 2026",
    penerimaLaporan: "Nanang",
    status: "Pelaporan",
  },
  {
    id: 6,
    tanggal: "30 Maret 2026",
    kegiatan: "Presentasi proposal training",
    pic: "Andi",
    dueDate: "05 April 2026",
    penerimaLaporan: null,
    status: "Tugas",
  },
  {
    id: 7,
    tanggal: "29 Maret 2026",
    kegiatan: "Koordinasi internal tim ENV",
    pic: "Ihsan",
    dueDate: "04 April 2026",
    penerimaLaporan: "Axel",
    status: "Tugas dan Pelaporan",
  },
  {
    id: 8,
    tanggal: "28 Maret 2026",
    kegiatan: "Kirim dokumen ke PT. Tambang Raya",
    pic: "Gempi",
    dueDate: "03 April 2026",
    penerimaLaporan: "Nanang",
    status: "Tugas dan Pelaporan",
  },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function TugasDanPelaporanPage() {
  const [data, setData] = useState<TugasPelaporan[]>(DUMMY_DATA);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"tambah" | "edit">("tambah");
  const [editTarget, setEditTarget] = useState<TugasPelaporan | null>(null);

  const openTambah = () => {
    setModalMode("tambah");
    setEditTarget(null);
    setModalOpen(true);
  };

  const openEdit = (row: TugasPelaporan) => {
    setModalMode("edit");
    setEditTarget(row);
    setModalOpen(true);
  };

  const handleSave = (formData: TugasPelaporanFormData) => {
    if (modalMode === "edit" && editTarget) {
      setData((prev) =>
        prev.map((d) =>
          d.id === editTarget.id
            ? {
                ...d,
                status: formData.status,
                pic: formData.pic,
                dueDate: formData.dueDate
                  ? new Date(formData.dueDate).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })
                  : d.dueDate,
                penerimaLaporan:
                  formData.penerimaLaporan === "-"
                    ? null
                    : formData.penerimaLaporan,
                kegiatan: formData.kegiatan || d.kegiatan,
              }
            : d,
        ),
      );
    } else {
      const newItem: TugasPelaporan = {
        id: data.length + 1,
        tanggal: new Date().toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }),
        kegiatan: formData.kegiatan,
        pic: formData.pic,
        dueDate: formData.dueDate
          ? new Date(formData.dueDate).toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })
          : "-",
        penerimaLaporan:
          formData.penerimaLaporan === "-" ? null : formData.penerimaLaporan,
        status: formData.status,
      };
      setData((prev) => [newItem, ...prev]);
    }
  };

  const filtered = data.filter(
    (d) =>
      d.kegiatan.toLowerCase().includes(search.toLowerCase()) ||
      d.pic.toLowerCase().includes(search.toLowerCase()) ||
      d.status.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Aktivitas", href: "/aktivitas" },
        { label: "Tugas dan Pelaporan" },
      ]}
      subtitle="Hari ini: Selasa, 3 Februari 2026"
      userName="Nanang"
      userRole="Super Admin"
    >
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center">
              <ClipboardCheck className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <span className="font-bold text-zinc-800 text-sm">
              Tugas dan Pelaporan
            </span>
          </div>

          <div className="flex items-center gap-2">
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
                className="w-full sm:w-52 pl-7 pr-3 py-1.5 border border-zinc-200 rounded-lg text-xs text-zinc-700 outline-none focus:border-emerald-300 transition-all"
              />
            </div>
            <button
              onClick={openTambah}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition-colors whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              Tambah
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/60">
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-10">
                  No ↕
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-32">
                  Tanggal
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left">
                  Kegiatan
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-36">
                  PIC
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-32">
                  Due Date
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-36">
                  Penerima Laporan
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-36">
                  Status
                </th>
                <th className="px-5 py-2 text-[10px] font-semibold text-zinc-400 text-right w-16">
                  Aksi
                </th>
              </tr>
            </thead>

            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
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
                    <td className="px-4 py-3 text-xs text-zinc-600 whitespace-nowrap">
                      {row.tanggal}
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-600">
                      {row.kegiatan}
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-600">
                      {row.pic}
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-600 whitespace-nowrap">
                      {row.dueDate}
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-500">
                      {row.penerimaLaporan ?? (
                        <span className="text-zinc-300">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-600">
                      {row.status}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => openEdit(row)}
                        className="text-xs text-emerald-600 font-semibold hover:text-emerald-700 transition-colors"
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
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
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
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 text-[11px] border border-zinc-200 rounded-lg text-zinc-500 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Selanjutnya ›
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <TugasPelaporanModal
        open={modalOpen}
        mode={modalMode}
        initialData={
          editTarget
            ? {
                status: editTarget.status,
                pic: editTarget.pic,
                penerimaLaporan: editTarget.penerimaLaporan ?? "-",
                kegiatan: editTarget.kegiatan,
              }
            : undefined
        }
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </AppLayout>
  );
}
