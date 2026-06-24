"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/sidebar";
import { generatePastelBg, generatePastelText } from "@/lib/pastelColor";
import { DetailModal } from "@/components/karyawan/DetailModal";
import Notification from "@/components/base/notifications";
import { useGetRiwayatAll, useGetKaryawanCuti } from "@/hooks/use-cuti";
import type { RiwayatIzinItem } from "@/lib/services/cuti.service";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function initials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getPageNumbers(
  currentPage: number,
  totalPages: number,
  siblings = 2,
): (number | "...")[] {
  if (totalPages <= 1) return totalPages === 1 ? [1] : [];

  const pages: (number | "...")[] = [];
  const start = Math.max(2, currentPage - siblings);
  const end = Math.min(totalPages - 1, currentPage + siblings);

  pages.push(1);

  if (start > 2) pages.push("...");

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (end < totalPages - 1) pages.push("...");

  pages.push(totalPages);

  return pages;
}

type ActiveTab = "riwayat" | "karyawan";

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

// ─── Riwayat Tab ──────────────────────────────────────────────────────────────
function RiwayatTab() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState<RiwayatIzinItem | null>(
    null,
  );
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const perPage = 9;

  const { fetch, data, loading } = useGetRiwayatAll();

  useEffect(() => {
    fetch({ page, limit: perPage, search: search || undefined });
  }, [page, search]);

  const items = data?.data ?? [];
  const total = data?.meta.total ?? 0;
  const totalPages = data?.meta.totalPage ?? 1;

  const cols = [
    "No",
    "Tanggal Pengajuan",
    "Nama",
    "Jenis Izin",
    "Periode Pengajuan",
    "Alasan",
    "Status",
    "Detail",
  ];

  return (
    <>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-5 py-4 border-b border-zinc-100 gap-3">
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
            <p className="font-bold text-zinc-800 text-sm">Riwayat Pengajuan</p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
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
          <table className="w-full min-w-[750px]">
            <thead>
              <tr className="border-b border-zinc-100">
                {cols.map((h) => (
                  <th
                    key={h}
                    className={`px-4 py-3 text-[11px] font-semibold text-zinc-400 whitespace-nowrap ${h === "Detail" ? "text-right" : "text-left"}`}
                  >
                    <span
                      className={`flex items-center gap-1 ${h === "Detail" ? "justify-end" : ""}`}
                    >
                      {h}
                      {h !== "Detail" && <SortIcon />}
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
              ) : items.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-8 text-center text-xs text-zinc-400"
                  >
                    Tidak ada data
                  </td>
                </tr>
              ) : (
                items.map((row, i) => (
                  <tr
                    key={row.id}
                    className="border-b border-zinc-50 hover:bg-zinc-50 transition-colors"
                  >
                    <td className="px-4 py-3 text-xs text-zinc-500">
                      {(page - 1) * perPage + i + 1}
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-600 whitespace-nowrap">
                      {formatDate(row.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-700 font-medium whitespace-nowrap">
                      {row.pegawai?.nama ?? "–"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          row.jenisIzin === "SAKIT"
                            ? "bg-red-50 text-red-500"
                            : row.jenisIzin === "CUTI"
                              ? "bg-blue-50 text-blue-500"
                              : "bg-amber-50 text-amber-500"
                        }`}
                      >
                        {row.jenisIzin.charAt(0) +
                          row.jenisIzin.slice(1).toLowerCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-600 whitespace-nowrap">
                      {formatDate(row.tanggalMulai)} –{" "}
                      {formatDate(row.tanggalSelesai)}
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-500 max-w-[200px]">
                      <span className="line-clamp-1">{row.alasan}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                          row.status === "DISETUJUI"
                            ? "bg-emerald-50 text-emerald-600"
                            : row.status === "DITOLAK"
                              ? "bg-red-50 text-red-500"
                              : "bg-yellow-50 text-yellow-600"
                        }`}
                      >
                        {row.status === "DISETUJUI"
                          ? "Disetujui"
                          : row.status === "DITOLAK"
                            ? "Ditolak"
                            : "Menunggu"}
                      </span>
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
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-5 py-3 border-t border-zinc-100">
          <p className="text-[11px] text-zinc-400">
            Menampilkan{" "}
            <span className="font-semibold text-zinc-600">{items.length}</span>{" "}
            dari <span className="font-semibold text-zinc-600">{total}</span>{" "}
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
            {getPageNumbers(page, totalPages).map((p, idx) =>
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
                  onClick={() => setPage(p)}
                  className={`w-7 h-7 rounded-lg text-[11px] font-semibold transition-colors ${p === page ? "bg-emerald-500 text-white" : "border border-zinc-200 text-zinc-500 hover:bg-zinc-50"}`}
                >
                  {p}
                </button>
              ),
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

      <DetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        isView={true}
      />
    </>
  );
}

// ─── Karyawan Tab ─────────────────────────────────────────────────────────────
function KaryawanTab() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 9;
  const router = useRouter();

  const { fetch, data, loading } = useGetKaryawanCuti();

  useEffect(() => {
    fetch({ page, limit: perPage, search: search || undefined });
  }, [page, search]);

  const items = data?.data ?? [];
  const total = data?.meta.total ?? 0;
  const totalPages = data?.meta.totalPage ?? 1;

  const cols = [
    "No",
    "Nama",
    "Divisi / Jabatan",
    "Total Cuti & Izin (Hari)",
    "Total Sakit (Hari)",
    "Sisa Kuota (Hari)",
    "Detail",
  ];

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-5 py-4 border-b border-zinc-100 gap-3">
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-6 h-6 bg-emerald-50 rounded-lg flex items-center justify-center">
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
          <p className="font-bold text-zinc-800 text-sm">Karyawan</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
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
          <button className="flex items-center justify-center gap-1.5 border border-zinc-200 rounded-lg px-3 py-1.5 text-xs text-zinc-600 hover:bg-zinc-50 transition-colors shrink-0">
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
                  className={`px-4 py-3 text-[11px] font-semibold text-zinc-400 whitespace-nowrap ${h === "Detail" ? "text-right" : "text-left"}`}
                >
                  <span
                    className={`flex items-center gap-1 ${h === "Detail" ? "justify-end" : ""}`}
                  >
                    {h}
                    {h !== "Detail" && <SortIcon />}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-8 text-center text-xs text-zinc-400"
                >
                  Memuat data...
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-8 text-center text-xs text-zinc-400"
                >
                  Tidak ada data
                </td>
              </tr>
            ) : (
              items.map((row, i) => {
                const sisaKuota = 12 - row.totalCutiDanIzin - row.totalSakit;
                return (
                  <tr
                    key={row.id}
                    className="border-b border-zinc-50 hover:bg-zinc-50 transition-colors"
                  >
                    <td className="px-4 py-3 text-xs text-zinc-500">
                      {(page - 1) * perPage + i + 1}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0"
                          style={{
                            backgroundColor: generatePastelBg(row.nama),
                            color: generatePastelText(row.nama),
                          }}
                        >
                          {initials(row.nama)}
                        </div>
                        <span className="text-xs text-zinc-700 font-medium">
                          {row.nama}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs text-zinc-700">
                        {row.departemen ?? "–"}
                      </p>
                      <p className="text-[10px] text-zinc-400">
                        {row.jabatan ?? "–"}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-700">
                      {row.totalCutiDanIzin}
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-700">
                      {row.totalSakit}
                    </td>
                    <td className="px-4 py-3 text-xs font-semibold">
                      <span
                        className={
                          sisaKuota < 0 ? "text-red-500" : "text-zinc-700"
                        }
                      >
                        {sisaKuota}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() =>
                          router.push(`riwayat-cuti/karyawan/${row.id}`)
                        }
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
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-5 py-3 border-t border-zinc-100">
        <p className="text-[11px] text-zinc-400">
          Menampilkan{" "}
          <span className="font-semibold text-zinc-600">{items.length}</span>{" "}
          dari <span className="font-semibold text-zinc-600">{total}</span> data
        </p>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 text-[11px] border border-zinc-200 rounded-lg text-zinc-500 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium"
          >
            ‹ Sebelumnya
          </button>
          {getPageNumbers(page, totalPages).map((p, idx) =>
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
                onClick={() => setPage(p)}
                className={`w-7 h-7 rounded-lg text-[11px] font-semibold transition-colors ${p === page ? "bg-emerald-500 text-white" : "border border-zinc-200 text-zinc-500 hover:bg-zinc-50"}`}
              >
                {p}
              </button>
            ),
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
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function RiwayatCutiPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("riwayat");
  const router = useRouter();

  return (
    <div className="flex min-h-screen bg-zinc-100 overflow-hidden">
      <Sidebar />

      <div className="flex flex-col flex-1 md:ml-[250px] min-w-0 overflow-x-hidden">
        {/* Page Header */}
        <div className="px-6 py-4 bg-white border-b border-zinc-100 flex items-center justify-between">
          <div>
            <p className="text-xs text-zinc-400">
              Karyawan & Aktivitas &rsaquo;{" "}
              <span className="font-semibold text-zinc-700">
                Riwayat Cuti/Sakit
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
          <div>
            <button
              onClick={() => router.back()}
              className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-800 transition-colors mb-4 font-medium"
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

            <div className="flex items-center gap-0 border-b border-zinc-200">
              {(["riwayat", "karyawan"] as ActiveTab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 pb-2.5 text-xs font-semibold capitalize transition-colors border-b-2 -mb-px ${
                    activeTab === tab
                      ? "border-emerald-500 text-emerald-500"
                      : "border-transparent text-zinc-400 hover:text-zinc-600"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {activeTab === "riwayat" ? <RiwayatTab /> : <KaryawanTab />}
        </div>
      </div>
    </div>
  );
}
