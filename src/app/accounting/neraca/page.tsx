"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/sidebar";
import ModalNeraca from "./ModalNeraca";
import { useNeraca } from "@/hooks/use-neraca";
import { useJenisBiaya } from "@/hooks/use-jenis-biaya";
import { generatePastelBg, generatePastelText } from "@/lib/pastelColor";

// ─── HELPERS ──────────────────────────────────────────────
function formatRp(val: number) {
  return val === 0 ? "0" : `Rp${val.toLocaleString("id-ID")}`;
}

// ─── MAIN PAGE ────────────────────────────────────────────
export default function NeracaKeuanganPage() {
  const router = useRouter();

  // ─── HOOKS ──────────────────────────────────────────────
  const { data, loading, error, params, setParams, create, update, remove } =
    useNeraca();
  const { data: jenisBiaya, loading: loadingJenis } = useJenisBiaya();

  // ─── LOCAL STATE ────────────────────────────────────────
  const [search, setSearch] = useState("");
  const [startMonth, setStartMonth] = useState<number>(
    new Date().getMonth() + 1,
  );
  const [startYear, setStartYear] = useState<number>(new Date().getFullYear());
  const [endMonth, setEndMonth] = useState<number>(new Date().getMonth() + 1);
  const [endYear, setEndYear] = useState<number>(new Date().getFullYear());
  const [isRange, setIsRange] = useState(false); // true = range, false = single month

  // ─── MODAL STATE ────────────────────────────────────────
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [modalInitialData, setModalInitialData] = useState<any>(null);

  // ─── APPLY FILTER ───────────────────────────────────────
  const applyFilter = () => {
    if (isRange) {
      setParams({
        startMonth,
        startYear,
        endMonth,
        endYear,
        search: search || undefined,
      });
    } else {
      setParams({
        month: startMonth,
        year: startYear,
        search: search || undefined,
        startMonth: undefined,
        startYear: undefined,
        endMonth: undefined,
        endYear: undefined,
      });
    }
  };

  // ─── MODAL HANDLERS ─────────────────────────────────────
  const handleModalSubmit = async (payload: any) => {
    if (modalMode === "create") {
      await create(payload);
    } else {
      await update(modalInitialData.id, payload);
    }
  };

  const openCreateModal = () => {
    setModalMode("create");
    setModalInitialData(null);
    setModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setModalMode("edit");
    setModalInitialData(item);
    setModalOpen(true);
  };

  // ─── TOTALS ─────────────────────────────────────────────
  const totalDebet = data.reduce((sum, d) => sum + (d.debit || 0), 0);
  const totalKredit = data.reduce((sum, d) => sum + (d.kredit || 0), 0);
  const totalSaldo = data.reduce((sum, d) => sum + (d.saldo || 0), 0);

  // ─── RENDER ─────────────────────────────────────────────
  if (loading && data.length === 0) {
    return (
      <div className="flex min-h-screen bg-zinc-100">
        <Sidebar />
        <div className="flex-1 md:ml-[250px] p-6">
          <div className="text-center py-20">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-zinc-100 overflow-hidden">
      <Sidebar />

      <div className="flex flex-col flex-1 md:ml-[250px] min-w-0 overflow-x-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-white border-b border-zinc-100 flex items-center justify-between">
          <div>
            <p className="text-xs text-zinc-400">
              Perusahaan &rsaquo;{" "}
              <span className="font-semibold text-zinc-700">Input Data</span>
            </p>
            <p className="text-xs text-zinc-400 mt-0.5">
              Hari ini:{" "}
              {new Date().toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
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
          {/* Back */}
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

          {/* Table Card */}
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
            {/* ─── Toolbar: Title + Tambah ─── */}
            <div className="flex items-center justify-between px-5 pt-4 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-emerald-50 rounded-lg flex items-center justify-center">
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2"
                  >
                    <rect x="2" y="7" width="20" height="14" rx="2" />
                    <path d="M16 3H8a2 2 0 0 0-2 2v2h12V5a2 2 0 0 0-2-2z" />
                    <line x1="8" y1="12" x2="16" y2="12" />
                    <line x1="8" y1="16" x2="12" y2="16" />
                  </svg>
                </div>
                <p className="font-bold text-zinc-800 text-sm">
                  Jurnal Keuangan
                </p>
              </div>
              <button
                onClick={openCreateModal}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Tambah Jurnal
              </button>
            </div>

            {/* ─── Filter Range Bulan ─── */}
            <div className="flex flex-wrap items-center gap-3 px-5 pb-4 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-1.5 text-xs text-zinc-600">
                  <input
                    type="checkbox"
                    checked={isRange}
                    onChange={() => setIsRange(!isRange)}
                    className="w-3.5 h-3.5 rounded border-zinc-300 text-emerald-500 focus:ring-emerald-400"
                  />
                  Range
                </label>
              </div>

              {/* Dari */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-zinc-500 font-medium">Dari</span>
                <select
                  value={startMonth}
                  onChange={(e) => setStartMonth(Number(e.target.value))}
                  className="border border-zinc-200 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-emerald-300 bg-white"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                    <option key={m} value={m}>
                      {new Date(2000, m - 1, 1).toLocaleString("id-ID", {
                        month: "long",
                      })}
                    </option>
                  ))}
                </select>
                <select
                  value={startYear}
                  onChange={(e) => setStartYear(Number(e.target.value))}
                  className="border border-zinc-200 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-emerald-300 bg-white"
                >
                  {Array.from(
                    { length: 5 },
                    (_, i) => new Date().getFullYear() - i,
                  ).map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sampai (hanya tampil jika range) */}
              {isRange && (
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-zinc-500 font-medium">
                    Sampai
                  </span>
                  <select
                    value={endMonth}
                    onChange={(e) => setEndMonth(Number(e.target.value))}
                    className="border border-zinc-200 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-emerald-300 bg-white"
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                      <option key={m} value={m}>
                        {new Date(2000, m - 1, 1).toLocaleString("id-ID", {
                          month: "long",
                        })}
                      </option>
                    ))}
                  </select>
                  <select
                    value={endYear}
                    onChange={(e) => setEndYear(Number(e.target.value))}
                    className="border border-zinc-200 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-emerald-300 bg-white"
                  >
                    {Array.from(
                      { length: 5 },
                      (_, i) => new Date().getFullYear() - i,
                    ).map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <button
                onClick={applyFilter}
                className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                Terapkan
              </button>
              <button className="px-3 py-1.5 border border-zinc-200 text-zinc-600 hover:bg-zinc-50 text-xs font-semibold rounded-lg transition-colors">
                Cetak
              </button>
            </div>

            {/* ─── Search ─── */}
            <div className="px-5 py-3 border-b border-zinc-100 flex justify-end">
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
                  placeholder="Cari uraian, bukti, periode..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && applyFilter()}
                  className="pl-7 pr-3 py-1.5 border border-zinc-200 rounded-lg text-xs text-zinc-700 outline-none focus:border-emerald-300 w-64"
                />
              </div>
            </div>

            {/* ─── Table ─── */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="border-b border-zinc-100">
                    {[
                      "No",
                      "Kode",
                      "Tanggal",
                      "Uraian",
                      "No. Bukti",
                      "Debet",
                      "Kredit",
                      "Saldo",
                      "Aksi",
                    ].map((h) => (
                      <th
                        key={h}
                        className={`px-4 py-3 text-[11px] font-semibold text-zinc-400 whitespace-nowrap ${
                          h === "Aksi" ? "text-right" : "text-left"
                        }`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.length === 0 ? (
                    <tr>
                      <td
                        colSpan={9}
                        className="px-4 py-8 text-center text-xs text-zinc-400"
                      >
                        Tidak ada data ditemukan
                      </td>
                    </tr>
                  ) : (
                    data.map((row, i) => (
                      <tr
                        key={row.id}
                        className="border-b border-zinc-50 hover:bg-zinc-50 transition-colors"
                      >
                        <td className="px-4 py-3 text-xs text-zinc-500">
                          {i + 1}
                        </td>
                        <td className="px-4 py-3 text-xs text-zinc-700 font-medium">
                          {row.jenisBiaya?.kode || "-"}
                        </td>
                        <td className="px-4 py-3 text-xs text-zinc-600">
                          {row.tanggal
                            ? new Date(row.tanggal).toLocaleDateString("id-ID")
                            : "-"}
                        </td>
                        <td className="px-4 py-3 text-xs text-zinc-700">
                          {row.uraian || "-"}
                        </td>
                        <td className="px-4 py-3 text-xs text-zinc-600">
                          {row.bukti || "-"}
                        </td>
                        <td className="px-4 py-3 text-xs text-zinc-700 font-medium text-emerald-600">
                          {row.debit ? formatRp(row.debit) : "0"}
                        </td>
                        <td className="px-4 py-3 text-xs text-zinc-700 font-medium text-red-500">
                          {row.kredit ? formatRp(row.kredit) : "0"}
                        </td>
                        <td className="px-4 py-3 text-xs text-zinc-700 font-semibold">
                          {formatRp(row.saldo || 0)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openEditModal(row)}
                              className="text-[11px] text-emerald-500 hover:text-emerald-600 font-semibold transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={async () => {
                                if (confirm("Yakin hapus?")) {
                                  await remove(row.id);
                                }
                              }}
                              className="text-[11px] text-red-400 hover:text-red-500 font-semibold transition-colors"
                            >
                              Hapus
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}

                  {/* Total Row */}
                  {data.length > 0 && (
                    <tr className="bg-zinc-50 border-t border-zinc-200">
                      <td
                        colSpan={5}
                        className="px-4 py-3 text-xs font-bold text-zinc-700 text-right"
                      >
                        Total
                      </td>
                      <td className="px-4 py-3 text-xs font-bold text-zinc-800">
                        {formatRp(totalDebet)}
                      </td>
                      <td className="px-4 py-3 text-xs font-bold text-zinc-800">
                        {formatRp(totalKredit)}
                      </td>
                      <td className="px-4 py-3 text-xs font-bold text-zinc-800">
                        {formatRp(totalSaldo)}
                      </td>
                      <td />
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Info jumlah data */}
            <div className="px-5 py-3 border-t border-zinc-100">
              <p className="text-[11px] text-zinc-400">
                Menampilkan{" "}
                <span className="font-semibold text-zinc-600">
                  {data.length}
                </span>{" "}
                data
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <ModalNeraca
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        mode={modalMode}
        initialData={modalInitialData}
        kodeOptions={
          jenisBiaya?.map((jb: any) => ({ kode: jb.kode, ket: jb.ket })) || []
        }
        onSubmit={handleModalSubmit}
      />
    </div>
  );
}
