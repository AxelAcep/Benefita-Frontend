"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/sidebar";
import { generatePastelBg, generatePastelText } from "@/lib/pastelColor";
import { DetailModal } from "@/components/karyawan/DetailModal";

// ─── Types ────────────────────────────────────────────────────────────────────
interface RiwayatItem {
  id: number;
  tanggalPengajuan: string;
  nama: string;
  jabatan: string;
  divisi: string;
  jenisIzin: string;
  periodeAwal: string;
  periodeAkhir: string;
  alasan: string;
  status: "Disetujui" | "Ditolak" | "Pending";
  lampiran: string | null;
}

interface KaryawanDetail {
  nama: string;
  jabatan: string;
  divisi: string;
  totalCuti: number;
  totalSakit: number;
  sisaKuota: number;
}

// ─── Dummy Data ───────────────────────────────────────────────────────────────
const karyawanDetail: KaryawanDetail = {
  nama: "Nanang",
  jabatan: "Manager",
  divisi: "Marketing & Sales",
  totalCuti: 2,
  totalSakit: 14,
  sisaKuota: -4,
};

const riwayatData: RiwayatItem[] = [
  {
    id: 1,
    tanggalPengajuan: "03 Feb 2026, 14:30 WIB",
    nama: "Nanang",
    jabatan: "Manager",
    divisi: "Marketing & Sales",
    jenisIzin: "Sakit",
    periodeAwal: "03 Feb 2026",
    periodeAkhir: "04 Feb 2026",
    alasan:
      "Sakit tenggorokan bisa disebabkan oleh infeksi virus atau bakteri, alergi, atau iritasi akibat asap rokok.",
    status: "Disetujui",
    lampiran: "Bukti surat dokter.png",
  },
  {
    id: 2,
    tanggalPengajuan: "03 Feb 2026, 11:15 WIB",
    nama: "Nanang",
    jabatan: "Manager",
    divisi: "Marketing & Sales",
    jenisIzin: "Cuti",
    periodeAwal: "03 Feb 2026",
    periodeAkhir: "04 Feb 2026",
    alasan:
      "Saya merasa tidak enak badan karena flu yang membuat tubuh lemas dan kepala pusing.",
    status: "Ditolak",
    lampiran: null,
  },
  {
    id: 3,
    tanggalPengajuan: "02 Feb 2026, 09:45 WIB",
    nama: "Nanang",
    jabatan: "Manager",
    divisi: "Marketing & Sales",
    jenisIzin: "Sakit",
    periodeAwal: "03 Feb 2026",
    periodeAkhir: "04 Feb 2026",
    alasan: "Sakit Tenggorokan",
    status: "Disetujui",
    lampiran: "Bukti surat dokter.png",
  },
  {
    id: 4,
    tanggalPengajuan: "01 Feb 2026, 16:20 WIB",
    nama: "Nanang",
    jabatan: "Manager",
    divisi: "Marketing & Sales",
    jenisIzin: "Cuti",
    periodeAwal: "03 Feb 2026",
    periodeAkhir: "04 Feb 2026",
    alasan: "Acara Keluarga",
    status: "Ditolak",
    lampiran: null,
  },
  {
    id: 5,
    tanggalPengajuan: "31 Jan 2026, 10:05 WIB",
    nama: "Nanang",
    jabatan: "Manager",
    divisi: "Marketing & Sales",
    jenisIzin: "Sakit",
    periodeAwal: "03 Feb 2026",
    periodeAkhir: "04 Feb 2026",
    alasan: "Sakit Tenggorokan",
    status: "Disetujui",
    lampiran: "Bukti surat dokter.png",
  },
  {
    id: 6,
    tanggalPengajuan: "30 Jan 2026, 15:45 WIB",
    nama: "Nanang",
    jabatan: "Manager",
    divisi: "Marketing & Sales",
    jenisIzin: "Cuti",
    periodeAwal: "03 Feb 2026",
    periodeAkhir: "04 Feb 2026",
    alasan: "Acara Keluarga",
    status: "Ditolak",
    lampiran: null,
  },
  {
    id: 7,
    tanggalPengajuan: "28 Jan 2026, 08:30 WIB",
    nama: "Nanang",
    jabatan: "Manager",
    divisi: "Marketing & Sales",
    jenisIzin: "Sakit",
    periodeAwal: "03 Feb 2026",
    periodeAkhir: "04 Feb 2026",
    alasan: "Sakit Tenggorokan",
    status: "Disetujui",
    lampiran: "Bukti surat dokter.png",
  },
  {
    id: 8,
    tanggalPengajuan: "25 Jan 2026, 13:20 WIB",
    nama: "Nanang",
    jabatan: "Manager",
    divisi: "Marketing & Sales",
    jenisIzin: "Cuti",
    periodeAwal: "03 Feb 2026",
    periodeAkhir: "04 Feb 2026",
    alasan: "Acara Keluarga",
    status: "Disetujui",
    lampiran: null,
  },
  {
    id: 9,
    tanggalPengajuan: "28 Jan 2026, 08:30 WIB",
    nama: "Nanang",
    jabatan: "Manager",
    divisi: "Marketing & Sales",
    jenisIzin: "Sakit",
    periodeAwal: "03 Feb 2026",
    periodeAkhir: "04 Feb 2026",
    alasan: "Sakit Tenggorokan",
    status: "Ditolak",
    lampiran: "Bukti surat dokter.png",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function initials(name: string): string {
  return name
    .split(" ")
    .map((w: string) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

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

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function KaryawanDetailPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState<RiwayatItem | null>(null);
  const router = useRouter();
  const perPage = 9;

  const karyawan = karyawanDetail;

  const filtered = riwayatData.filter(
    (d) =>
      d.jenisIzin.toLowerCase().includes(search.toLowerCase()) ||
      d.alasan.toLowerCase().includes(search.toLowerCase()) ||
      d.periodeAwal.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const cols = [
    "No",
    "Tanggal Pengajuan",
    "Jenis Izin",
    "Periode Pengajuan",
    "Alasan",
    "Detail",
  ];

  return (
    <div className="flex min-h-screen bg-zinc-100 overflow-hidden">
      <Sidebar />

      <div className="flex flex-col flex-1 md:ml-[250px] min-w-0 overflow-x-hidden">
        {/* Page Header */}
        <div className="px-6 py-4 bg-white border-b border-zinc-100 flex items-center justify-between">
          <div>
            <p className="text-xs text-zinc-400">
              Karyawan &amp; Aktivitas &rsaquo;{" "}
              <span
                className="text-zinc-400 cursor-pointer hover:text-zinc-600"
                onClick={() => router.back()}
              >
                Konfirmasi Cuti/Sakit
              </span>{" "}
              &rsaquo;{" "}
              <span className="font-semibold text-zinc-700">
                {karyawan.nama}
              </span>
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

          {/* Employee Card */}
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-5">
            {/* Header row */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                  style={{
                    backgroundColor: generatePastelBg(karyawan.nama),
                    color: generatePastelText(karyawan.nama),
                  }}
                >
                  {initials(karyawan.nama)}
                </div>
                <p className="text-base font-bold text-zinc-800">
                  {karyawan.nama}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex px-3 py-1 rounded-full text-[11px] font-semibold bg-zinc-100 text-zinc-600">
                  {karyawan.jabatan}
                </span>
                <span className="inline-flex px-3 py-1 rounded-full text-[11px] font-semibold bg-zinc-100 text-zinc-600">
                  {karyawan.divisi}
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6">
              <div>
                <p className="text-[11px] text-zinc-400 mb-0.5">
                  Total Cuti (Hari)
                </p>
                <p className="text-xl font-bold text-zinc-800">
                  {karyawan.totalCuti}
                </p>
              </div>
              <div className="w-px h-8 bg-zinc-100" />
              <div>
                <p className="text-[11px] text-zinc-400 mb-0.5">
                  Total Sakit (Hari)
                </p>
                <p className="text-xl font-bold text-zinc-800">
                  {karyawan.totalSakit}
                </p>
              </div>
              <div className="w-px h-8 bg-zinc-100" />
              <div className="bg-red-50 rounded-xl px-4 py-2">
                <p className="text-[11px] text-zinc-400 mb-0.5">
                  Sisa Kuota (Hari)
                </p>
                <p
                  className={`text-xl font-bold ${
                    karyawan.sisaKuota < 0 ? "text-red-500" : "text-zinc-800"
                  }`}
                >
                  {karyawan.sisaKuota}
                </p>
              </div>
            </div>
          </div>

          {/* Riwayat Table */}
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between px-5 py-4 border-b border-zinc-100 gap-3">
            {/* SISI KIRI: Icon & Judul */}
            <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-emerald-50 rounded-lg flex items-center justify-center shrink-0">
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
                <p className="font-bold text-zinc-800 text-sm whitespace-nowrap">
                Riwayat Pengajuan Cuti/Sakit
                </p>
            </div>

            {/* SISI KANAN: Search & Filter */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
                {/* Input Search - flex-1 biar lebar di mobile */}
                <div className="relative flex-1 sm:flex-none">
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
                    placeholder="Cari Informasi..."
                    value={search}
                    onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                    }}
                    className="w-full sm:w-44 pl-7 pr-3 py-1.5 border border-zinc-200 rounded-lg text-xs text-zinc-700 outline-none focus:border-emerald-300 transition-all"
                />
                </div>

                {/* Button Filter */}
                <button className="flex items-center gap-1.5 border border-zinc-200 rounded-lg px-3 py-1.5 text-xs text-zinc-600 hover:bg-zinc-50 transition-colors shrink-0">
                <svg
                    width="11"
                    height="11"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                </svg>
                Filter
                </button>
            </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px]">
                <thead>
                  <tr className="border-b border-zinc-100">
                    {cols.map((h) => (
                      <th
                        key={h}
                        className={`px-4 py-3 text-[11px] font-semibold text-zinc-400 whitespace-nowrap ${
                          h === "Detail" ? "text-right" : "text-left"
                        }`}
                      >
                        <span
                          className={`flex items-center gap-1 ${
                            h === "Detail" ? "justify-end" : ""
                          }`}
                        >
                          {h}
                          {h !== "Detail" && <SortIcon />}
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
                      <td className="px-4 py-3 text-xs text-zinc-600 whitespace-nowrap">
                        {row.tanggalPengajuan}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            row.jenisIzin === "Sakit"
                              ? "bg-red-50 text-red-500"
                              : "bg-blue-50 text-blue-500"
                          }`}
                        >
                          {row.jenisIzin}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-600 whitespace-nowrap">
                        {row.periodeAwal} – {row.periodeAkhir}
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-500 max-w-[300px]">
                        <span className="line-clamp-1">{row.alasan}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => setSelectedItem(row)}
                          className="text-[11px] text-emerald-500 hover:text-emerald-600 font-medium whitespace-nowrap transition-colors inline-flex items-center gap-1"
                        >
                          Lihat Detail
                          <svg
                            width="10"
                            height="10"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
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
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-7 h-7 rounded-lg text-[11px] font-semibold transition-colors ${
                        p === page
                          ? "bg-emerald-500 text-white"
                          : "border border-zinc-200 text-zinc-500 hover:bg-zinc-50"
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 text-[11px] border border-zinc-200 rounded-lg text-zinc-500 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Selanjutnya ›
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </div>
  );
}