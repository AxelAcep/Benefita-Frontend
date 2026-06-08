"use client";
import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
} from "lucide-react";
import { generatePastelBg, generatePastelText } from "@/lib/pastelColor";
import { Icons } from "@/assets";
import Sidebar from "@/components/sidebar";
import { DetailModal } from "@/components/karyawan/DetailModal";
import { getSession } from "@/lib/services/login.service";
import { getUserDetail } from "@/lib/services/login.service";
import { useGetRiwayatByPegawai } from "@/hooks/use-cuti";
import type { RiwayatIzinItem } from "@/lib/services/cuti.service";

const statusStyle: Record<string, string> = {
  DISETUJUI: "bg-emerald-100 text-emerald-600",
  PENDING: "bg-yellow-100 text-yellow-600",
  DITOLAK: "bg-red-100 text-red-500",
};

const statusLabel: Record<string, string> = {
  DISETUJUI: "Disetujui",
  PENDING: "Menunggu",
  DITOLAK: "Ditolak",
};

const jenisLabel: Record<string, string> = {
  CUTI: "Cuti",
  SAKIT: "Sakit",
  IZIN: "Izin",
};

function formatDate(dateStr: string) {
  return (
    new Date(dateStr).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }) + " WIB"
  );
}

function formatPeriode(mulai: string, selesai: string) {
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  return `${fmt(mulai)} – ${fmt(selesai)}`;
}

export default function RiwayatCuti() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pegawaiId, setPegawaiId] = useState<string | null>(null);
  const [pegawaiNama, setPegawaiNama] = useState<string>("");
  const [selectedItem, setSelectedItem] = useState<RiwayatIzinItem | null>(
    null,
  );

  const { fetch, data, loading } = useGetRiwayatByPegawai();

  // Get pegawaiId from session
  useEffect(() => {
    const session = getSession();
    if (!session) return;
    getUserDetail(session.user.id)
      .then((detail) => {
        setPegawaiId(detail.pegawaiId);
        setPegawaiNama(detail.pegawai.nama);
      })
      .catch(console.error);
  }, []);

  // Fetch riwayat when pegawaiId or page changes
  useEffect(() => {
    if (!pegawaiId) return;
    fetch(pegawaiId, { page: currentPage, limit: 10 });
  }, [pegawaiId, currentPage]);

  const rows = data?.data ?? [];
  const meta = data?.meta;
  const totalPages = meta?.totalPage ?? 1;

  const filtered = rows.filter(
    (r) =>
      r.alasan.toLowerCase().includes(search.toLowerCase()) ||
      jenisLabel[r.jenisIzin]?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex min-h-screen bg-zinc-100 overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 md:ml-[250px] min-w-0 overflow-x-hidden">
        {/* Page Header */}
        <div className="px-4 sm:px-6 py-3 bg-white border-b border-zinc-100 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs text-zinc-400 truncate">
              Karyawan & Aktivitas &rsaquo;{" "}
              <span className="font-semibold text-zinc-700">
                Form Cuti/Sakit
              </span>
            </p>
            <p className="text-xs text-zinc-400 mt-0.5">
              Hari ini: Selasa, 3 Februari 2026
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-zinc-800">
                {pegawaiNama || "–"}
              </p>
              <p className="text-[10px] text-zinc-400">Karyawan</p>
            </div>
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
              style={{
                backgroundColor: generatePastelBg(pegawaiNama),
                color: generatePastelText(pegawaiNama),
              }}
            >
              {pegawaiNama?.[0]?.toUpperCase() ?? "?"}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-3 sm:p-6">
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
            {/* Table Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-4 py-3 border-b border-zinc-100">
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-emerald-500">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0" />
                    <path d="M12 8v4l3 3" />
                  </svg>
                </span>
                <span className="font-semibold text-zinc-800 text-xs">
                  Riwayat Pengajuan Cuti/Sakit
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 bg-zinc-50 border border-zinc-200 rounded-lg px-2.5 py-1.5 flex-1 sm:flex-none">
                  <Search size={11} className="text-zinc-400 shrink-0" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari Informasi..."
                    className="text-xs bg-transparent outline-none text-zinc-600 w-full sm:w-36 placeholder:text-zinc-300"
                  />
                </div>
                <button className="flex items-center gap-1 border border-zinc-200 rounded-lg px-2.5 py-1.5 text-xs text-zinc-600 hover:bg-zinc-50 transition-colors shrink-0">
                  <Filter size={11} />
                  Filter
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs" style={{ minWidth: "780px" }}>
                <thead>
                  <tr className="border-b border-zinc-100 text-zinc-400 text-[10px]">
                    {[
                      { label: "No", sortable: false },
                      { label: "Tanggal Pengajuan", sortable: true },
                      { label: "Tanggal Diproses", sortable: true },
                      { label: "Jenis Izin", sortable: true },
                      { label: "Periode Pengajuan", sortable: true },
                      { label: "Alasan", sortable: false },
                      { label: "Status", sortable: true },
                      { label: "Detail", sortable: false },
                    ].map(({ label, sortable }) => (
                      <th
                        key={label}
                        className="text-left px-4 py-2.5 font-medium whitespace-nowrap"
                      >
                        <span className="flex items-center gap-1">
                          {label}
                          {sortable && (
                            <ArrowUpDown size={10} className="text-zinc-300" />
                          )}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-4 py-8 text-center text-xs text-zinc-400"
                      >
                        Memuat data...
                      </td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-4 py-8 text-center text-xs text-zinc-400"
                      >
                        Tidak ada data
                      </td>
                    </tr>
                  ) : (
                    filtered.map((row, index) => (
                      <tr
                        key={row.id}
                        className={`border-b border-zinc-50 hover:bg-zinc-50 transition-colors ${
                          index % 2 !== 0 ? "bg-zinc-50/50" : "bg-white"
                        }`}
                      >
                        <td className="px-4 py-3 text-zinc-400 w-10">
                          {(currentPage - 1) * 10 + index + 1}
                        </td>
                        <td className="px-4 py-3 text-zinc-600 whitespace-nowrap">
                          {formatDate(row.createdAt)}
                        </td>
                        <td className="px-4 py-3 text-zinc-500 whitespace-nowrap">
                          {row.tanggalKonfirmasi ? (
                            formatDate(row.tanggalKonfirmasi)
                          ) : (
                            <span className="text-zinc-300">–</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-zinc-600 whitespace-nowrap">
                          {jenisLabel[row.jenisIzin] ?? row.jenisIzin}
                        </td>
                        <td className="px-4 py-3 text-zinc-500 whitespace-nowrap">
                          {formatPeriode(row.tanggalMulai, row.tanggalSelesai)}
                        </td>
                        <td className="px-4 py-3 text-zinc-500 max-w-[200px]">
                          <span className="line-clamp-2 leading-relaxed">
                            {row.alasan}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-medium ${statusStyle[row.status]}`}
                          >
                            {statusLabel[row.status] ?? row.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <button
                            onClick={() => setSelectedItem(row)}
                            className="text-emerald-500 hover:text-emerald-600 cursor-pointer flex items-center gap-0.5 text-xs"
                          >
                            Lihat Detail
                            <svg
                              width="11"
                              height="11"
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
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-4 py-3 border-t border-zinc-100">
              <span className="text-[11px] text-zinc-400">
                Menampilkan{" "}
                <span className="font-semibold text-zinc-600">
                  {filtered.length}
                </span>{" "}
                dari{" "}
                <span className="font-semibold text-zinc-600">
                  {meta?.total ?? 0}
                </span>{" "}
                data
              </span>
              <div className="overflow-x-auto">
                <div className="flex items-center gap-1 w-max">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-2 py-1 rounded-md text-xs text-zinc-400 hover:bg-zinc-100 transition-colors flex items-center gap-0.5 disabled:opacity-40"
                  >
                    <ChevronLeft size={12} /> Prev
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (p) => (
                      <button
                        key={p}
                        onClick={() => setCurrentPage(p)}
                        className={`w-7 h-7 rounded-md text-xs font-medium transition-colors ${
                          currentPage === p
                            ? "bg-emerald-500 text-white"
                            : "text-zinc-400 hover:bg-zinc-100"
                        }`}
                      >
                        {p}
                      </button>
                    ),
                  )}
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-2 py-1 rounded-md text-xs text-zinc-400 hover:bg-zinc-100 transition-colors flex items-center gap-0.5 disabled:opacity-40"
                  >
                    Next <ChevronRight size={12} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        isView={true}
      />
    </div>
  );
}
