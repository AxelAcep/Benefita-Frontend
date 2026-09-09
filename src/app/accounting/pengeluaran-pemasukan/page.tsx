"use client";

import React, { useEffect, useState } from "react";
import {
  Wallet,
  Paperclip,
  Send,
  Loader2,
  Check,
  Ban,
  ArrowDownCircle,
  ArrowUpCircle,
} from "lucide-react";
import AppLayout from "@/components/app-layout";
import Notification from "@/components/base/notifications";
import { useRole } from "@/hooks/use-role";
import {
  useRequestKeuangan,
  useRequestKeuanganMutation,
} from "@/hooks/use-request-keuangan";
import {
  getAkunList,
  JENIS_REQUEST_OPTIONS,
  JENIS_REQUEST_TO_AKUN,
  STATUS_REQUEST_OPTIONS,
  type JenisRequestKeuangan,
  type StatusRequestKeuangan,
  type AkunItem,
  type RequestKeuanganItem,
} from "@/lib/services/accounting.service";
import { RejectRequestModal } from "@/components/training/RejectRequestModal";

const PAGE_SIZE = 10;

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const JENIS_LABEL: Record<JenisRequestKeuangan, string> = {
  PENGELUARAN: "Pengeluaran",
  PEMASUKAN: "Pemasukan",
};

const STATUS_LABEL: Record<StatusRequestKeuangan, string> = {
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};

const STATUS_BADGE: Record<StatusRequestKeuangan, string> = {
  PENDING: "bg-yellow-50 text-yellow-600",
  APPROVED: "bg-emerald-50 text-emerald-600",
  REJECTED: "bg-red-50 text-red-600",
};

function formatRupiah(val: string) {
  const num = Number(val);
  if (isNaN(num)) return "-";
  return `Rp${num.toLocaleString("id-ID")}`;
}

function formatTanggal(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

interface NotifState {
  message: string;
  type: "success" | "error";
  key: number;
}

export default function PengeluaranPemasukanPage() {
  const { isFinance } = useRole();

  const [notif, setNotif] = useState<NotifState | null>(null);
  const showNotif = (message: string, type: "success" | "error") =>
    setNotif({ message, type, key: Date.now() });

  // ─── Form pengajuan ──────────────────────────────────────────
  const [jenis, setJenis] = useState<JenisRequestKeuangan>("PENGELUARAN");
  const [akunId, setAkunId] = useState<number | "">("");
  const [akunOptions, setAkunOptions] = useState<AkunItem[]>([]);
  const [deskripsi, setDeskripsi] = useState("");
  const [nominal, setNominal] = useState("");
  const [tanggal, setTanggal] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [buktiFile, setBuktiFile] = useState<File | null>(null);

  const { create, approve, reject, loading: isMutating } =
    useRequestKeuanganMutation();

  useEffect(() => {
    setAkunId("");
    getAkunList({ jenis: JENIS_REQUEST_TO_AKUN[jenis], isActive: true, limit: 100 })
      .then((res) => setAkunOptions(res.data))
      .catch(() => setAkunOptions([]));
  }, [jenis]);

  async function handleSubmitRequest(e: React.FormEvent) {
    e.preventDefault();
    if (!deskripsi.trim()) {
      showNotif("Deskripsi wajib diisi", "error");
      return;
    }
    if (!nominal || Number(nominal) <= 0) {
      showNotif("Nominal wajib diisi dan lebih dari 0", "error");
      return;
    }

    try {
      await create({
        jenis,
        akunId: akunId ? Number(akunId) : undefined,
        deskripsi: deskripsi.trim(),
        nominal: Number(nominal),
        tanggal,
        buktiFile: buktiFile ?? undefined,
      });
      setDeskripsi("");
      setNominal("");
      setBuktiFile(null);
      showNotif("Request berhasil diajukan", "success");
      refetch();
    } catch (err) {
      showNotif(
        err instanceof Error ? err.message : "Gagal mengajukan request",
        "error",
      );
    }
  }

  // ─── Tabel riwayat ───────────────────────────────────────────
  const [statusFilter, setStatusFilter] = useState<StatusRequestKeuangan | "">("");
  const [jenisFilter, setJenisFilter] = useState<JenisRequestKeuangan | "">("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, pagination, loading, refetch } = useRequestKeuangan({
    page,
    limit: PAGE_SIZE,
  });

  function applyFilters(overrides?: {
    page?: number;
    status?: StatusRequestKeuangan | "";
    jenis?: JenisRequestKeuangan | "";
    search?: string;
  }) {
    const p = overrides?.page ?? page;
    refetch({
      page: p,
      status: (overrides?.status ?? statusFilter) || undefined,
      jenis: (overrides?.jenis ?? jenisFilter) || undefined,
      search: (overrides?.search ?? search) || undefined,
    });
  }

  function handleStatusFilter(v: StatusRequestKeuangan | "") {
    setStatusFilter(v);
    setPage(1);
    applyFilters({ page: 1, status: v });
  }
  function handleJenisFilter(v: JenisRequestKeuangan | "") {
    setJenisFilter(v);
    setPage(1);
    applyFilters({ page: 1, jenis: v });
  }
  function handleSearch(v: string) {
    setSearch(v);
    setPage(1);
    applyFilters({ page: 1, search: v });
  }
  function handlePageChange(p: number) {
    setPage(p);
    applyFilters({ page: p });
  }

  // ─── Approve / Reject ───────────────────────────────────────
  const [rejectTarget, setRejectTarget] = useState<RequestKeuanganItem | null>(
    null,
  );

  async function handleApprove(row: RequestKeuanganItem) {
    try {
      await approve(row.id);
      showNotif(`Request "${row.deskripsi}" berhasil disetujui`, "success");
      applyFilters();
    } catch (err) {
      showNotif(
        err instanceof Error ? err.message : "Gagal menyetujui request",
        "error",
      );
    }
  }

  async function handleReject(catatan: string) {
    if (!rejectTarget) return;
    try {
      await reject(rejectTarget.id, catatan);
      showNotif(`Request "${rejectTarget.deskripsi}" berhasil ditolak`, "success");
      setRejectTarget(null);
      applyFilters();
    } catch (err) {
      showNotif(
        err instanceof Error ? err.message : "Gagal menolak request",
        "error",
      );
    }
  }

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Accounting", href: "/accounting" },
        { label: "Pengeluaran & Pemasukan" },
      ]}
    >
      {notif && (
        <Notification
          key={notif.key}
          message={notif.message}
          type={notif.type}
          onClose={() => setNotif(null)}
        />
      )}

      <div className="flex flex-col gap-4">
        {/* Form pengajuan */}
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-100 flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center">
              <Wallet className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <span className="font-bold text-zinc-800 text-sm">
              Ajukan Pengeluaran / Pemasukan
            </span>
          </div>

          <form onSubmit={handleSubmitRequest} className="px-6 py-5 space-y-4">
            {/* Toggle jenis */}
            <div className="flex gap-2">
              {JENIS_REQUEST_OPTIONS.map((j) => (
                <button
                  key={j}
                  type="button"
                  onClick={() => setJenis(j)}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-colors ${
                    jenis === j
                      ? j === "PENGELUARAN"
                        ? "bg-red-50 border-red-200 text-red-600"
                        : "bg-emerald-50 border-emerald-200 text-emerald-600"
                      : "border-zinc-200 text-zinc-500 hover:bg-zinc-50"
                  }`}
                >
                  {j === "PENGELUARAN" ? (
                    <ArrowDownCircle className="w-3.5 h-3.5" />
                  ) : (
                    <ArrowUpCircle className="w-3.5 h-3.5" />
                  )}
                  {JENIS_LABEL[j]}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-500 mb-1.5">
                  Akun{" "}
                  <span className="font-normal text-zinc-400">
                    (jenis {JENIS_REQUEST_TO_AKUN[jenis]}, opsional)
                  </span>
                </label>
                <select
                  value={akunId}
                  onChange={(e) =>
                    setAkunId(e.target.value ? Number(e.target.value) : "")
                  }
                  className="w-full px-3 py-2 border border-zinc-200 rounded-xl text-xs text-zinc-700 outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 transition-all bg-white"
                >
                  <option value="">
                    {akunOptions.length === 0
                      ? `Belum ada akun jenis ${JENIS_REQUEST_TO_AKUN[jenis]}`
                      : "Pilih akun..."}
                  </option>
                  {akunOptions.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.kode ? `${a.kode} — ${a.nama}` : a.nama}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-500 mb-1.5">
                  Nominal (Rp)
                </label>
                <input
                  type="number"
                  min={1}
                  value={nominal}
                  onChange={(e) => setNominal(e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-zinc-200 rounded-xl text-xs text-zinc-700 outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 transition-all placeholder:text-zinc-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-500 mb-1.5">
                Deskripsi
              </label>
              <textarea
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                rows={2}
                placeholder="Jelaskan keperluan pengeluaran/pemasukan ini..."
                className="w-full px-3 py-2 border border-zinc-200 rounded-xl text-xs text-zinc-700 outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 transition-all resize-none placeholder:text-zinc-300"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-500 mb-1.5">
                  Tanggal
                </label>
                <input
                  type="date"
                  value={tanggal}
                  onChange={(e) => setTanggal(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-200 rounded-xl text-xs text-zinc-700 outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 transition-all"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-zinc-500 mb-1.5">
                  Bukti{" "}
                  <span className="font-normal text-zinc-400">(opsional)</span>
                </label>
                <label className="flex items-center gap-1.5 px-3 py-2 border border-zinc-200 rounded-xl text-xs text-zinc-600 cursor-pointer hover:bg-zinc-50 transition-colors">
                  <Paperclip className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">
                    {buktiFile ? buktiFile.name : "Pilih file bukti..."}
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => setBuktiFile(e.target.files?.[0] ?? null)}
                  />
                </label>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isMutating}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                {isMutating ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                Ajukan Request
              </button>
            </div>
          </form>
        </div>

        {/* Tabel riwayat */}
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-zinc-100 flex flex-wrap items-center gap-3">
            <span className="font-bold text-zinc-800 text-sm">
              Riwayat Request
            </span>

            <select
              value={statusFilter}
              onChange={(e) =>
                handleStatusFilter(e.target.value as StatusRequestKeuangan | "")
              }
              className="px-2.5 py-1.5 border border-zinc-200 rounded-lg text-[11px] text-zinc-600 outline-none focus:border-emerald-300 transition-all bg-white"
            >
              <option value="">Semua Status</option>
              {STATUS_REQUEST_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABEL[s]}
                </option>
              ))}
            </select>

            <select
              value={jenisFilter}
              onChange={(e) =>
                handleJenisFilter(e.target.value as JenisRequestKeuangan | "")
              }
              className="px-2.5 py-1.5 border border-zinc-200 rounded-lg text-[11px] text-zinc-600 outline-none focus:border-emerald-300 transition-all bg-white"
            >
              <option value="">Semua Jenis</option>
              {JENIS_REQUEST_OPTIONS.map((j) => (
                <option key={j} value={j}>
                  {JENIS_LABEL[j]}
                </option>
              ))}
            </select>

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
                placeholder="Cari deskripsi atau pengaju..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-56 pl-7 pr-3 py-1.5 border border-zinc-200 rounded-lg text-xs text-zinc-700 outline-none focus:border-emerald-300 transition-all"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50/60">
                  <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-10">No</th>
                  <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-24">Jenis</th>
                  <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left">Deskripsi</th>
                  <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-32">Akun</th>
                  <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-right w-32">Nominal</th>
                  <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-24">Tanggal</th>
                  <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-28">Pengaju</th>
                  <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-center w-20">Status</th>
                  <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-32">Aksi / Catatan</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-12 text-center text-xs text-zinc-400">
                      Memuat data...
                    </td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-12 text-center text-xs text-zinc-400">
                      Tidak ada data tersedia.
                    </td>
                  </tr>
                ) : (
                  data.map((row, i) => (
                    <tr key={row.id} className="border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors">
                      <td className="px-4 py-3 text-xs text-zinc-400 align-top">
                        {(page - 1) * PAGE_SIZE + i + 1}
                      </td>
                      <td className="px-4 py-3 align-top">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold whitespace-nowrap ${
                            row.jenis === "PENGELUARAN"
                              ? "bg-red-50 text-red-600"
                              : "bg-emerald-50 text-emerald-600"
                          }`}
                        >
                          {row.jenis === "PENGELUARAN" ? (
                            <ArrowDownCircle className="w-3 h-3" />
                          ) : (
                            <ArrowUpCircle className="w-3 h-3" />
                          )}
                          {JENIS_LABEL[row.jenis]}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-700 align-top max-w-[220px]">
                        {row.deskripsi}
                        {row.buktiFile && (
                          <a
                            href={`${API_URL}/${row.buktiFile.replace(/\\/g, "/")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-1.5 text-[10px] text-blue-500 hover:underline inline-flex items-center gap-0.5"
                          >
                            <Paperclip className="w-2.5 h-2.5" />
                            bukti
                          </a>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-600 align-top">
                        {row.akun?.nama ?? <span className="text-zinc-300">-</span>}
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-700 font-semibold text-right align-top whitespace-nowrap">
                        {formatRupiah(row.nominal)}
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-600 align-top whitespace-nowrap">
                        {formatTanggal(row.tanggal)}
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-600 align-top">
                        {row.requestedOleh.nama}
                      </td>
                      <td className="px-4 py-3 text-center align-top">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold whitespace-nowrap ${STATUS_BADGE[row.status]}`}
                        >
                          {STATUS_LABEL[row.status]}
                        </span>
                      </td>
                      <td className="px-4 py-3 align-top">
                        {row.status === "PENDING" && isFinance ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleApprove(row)}
                              title="Approve"
                              className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 hover:underline"
                            >
                              <Check className="w-3 h-3" />
                              Approve
                            </button>
                            <button
                              onClick={() => setRejectTarget(row)}
                              title="Reject"
                              className="flex items-center gap-1 text-[11px] font-semibold text-red-500 hover:underline"
                            >
                              <Ban className="w-3 h-3" />
                              Reject
                            </button>
                          </div>
                        ) : row.status === "REJECTED" && row.catatan ? (
                          <p className="text-[11px] text-zinc-500 max-w-[180px]">
                            {row.catatan}
                          </p>
                        ) : row.status === "APPROVED" ? (
                          <p className="text-[10px] text-zinc-400">
                            oleh {row.approvedOleh?.nama ?? "-"}
                          </p>
                        ) : (
                          <span className="text-zinc-300 text-[11px]">-</span>
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
                {pagination.total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–
                {Math.min(page * PAGE_SIZE, pagination.total)}
              </span>{" "}
              dari{" "}
              <span className="font-semibold text-zinc-600">{pagination.total}</span>{" "}
              data
            </p>

            <div className="flex items-center gap-1">
              <button
                onClick={() => handlePageChange(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 text-[11px] border border-zinc-200 rounded-lg text-zinc-500 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium"
              >
                ‹ Sebelumnya
              </button>
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
                (p) => (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p)}
                    className={`w-7 h-7 rounded-lg text-[11px] font-semibold transition-colors ${
                      p === page
                        ? "bg-emerald-500 text-white"
                        : "border border-zinc-200 text-zinc-500 hover:bg-zinc-50"
                    }`}
                  >
                    {p}
                  </button>
                ),
              )}
              <button
                onClick={() => handlePageChange(Math.min(pagination.totalPages, page + 1))}
                disabled={page === pagination.totalPages}
                className="px-3 py-1.5 text-[11px] border border-zinc-200 rounded-lg text-zinc-500 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Selanjutnya ›
              </button>
            </div>
          </div>
        </div>
      </div>

      <RejectRequestModal
        open={!!rejectTarget}
        onClose={() => setRejectTarget(null)}
        onSubmit={handleReject}
        deskripsi={rejectTarget?.deskripsi}
        isLoading={isMutating}
      />
    </AppLayout>
  );
}
