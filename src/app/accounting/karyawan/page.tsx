"use client";

import React, { useState } from "react";
import { Users, Plus, UserCircle2 } from "lucide-react";
import AppLayout from "@/components/app-layout";
import Notification from "@/components/base/notifications";
import ModalPegawai from "./modal-pegawai";
import {
  Pegawai,
  CreatePegawaiRequest,
  UpdatePegawaiRequest,
} from "@/lib/services/pegawai.service";
import { usePegawaiList, usePegawaiActions } from "@/hooks/use-pegawai";

// ─────────────────────────────────────────────
// AVATAR
// ─────────────────────────────────────────────

// ─────────────────────────────────────────────
// NOTIF STATE
// ─────────────────────────────────────────────

interface NotifState {
  message: string;
  type: "success" | "error";
}

// ─────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────

export default function DataPegawaiPage() {
  const {
    data,
    isLoading,
    currentPage,
    totalPages,
    totalData,
    pageSize,
    onPageChange,
    search,
    onSearchChange,
    refetch,
  } = usePegawaiList();

  const {
    isSaving,
    onGetDetail,
    onCreatePegawai,
    onUpdatePegawai,
    onResetPassword,
    onResetDevice,
    onDeleteDokumen,
  } = usePegawaiActions(refetch);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPegawai, setSelectedPegawai] = useState<Pegawai | null>(null);
  const [notif, setNotif] = useState<NotifState | null>(null);

  function showNotif(message: string, type: "success" | "error" = "success") {
    setNotif({ message, type });
  }

  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  function toFullUrl(path: string) {
    return `${API_URL}/${path.replace(/^\/+/, "")}`;
  }

  function Avatar({ fotoUrl, nama }: { fotoUrl: string | null; nama: string }) {
    if (fotoUrl) {
      return (
        <img
          src={toFullUrl(fotoUrl)}
          alt={nama}
          className="w-14 h-16 object-cover rounded-md border border-zinc-200"
        />
      );
    }
  }

  // ── Handlers ──
  function handleTambah() {
    setSelectedPegawai(null);
    setModalOpen(true);
  }

  async function handleLihatDetail(id: string) {
    try {
      const detail = await onGetDetail(id);
      setSelectedPegawai(detail);
      setModalOpen(true);
    } catch {
      showNotif("Gagal memuat detail pegawai", "error");
    }
  }

  async function handleSubmitModal(
    payload: CreatePegawaiRequest | UpdatePegawaiRequest,
  ) {
    try {
      if (selectedPegawai) {
        await onUpdatePegawai(
          selectedPegawai.id,
          payload as UpdatePegawaiRequest,
        );
        showNotif("Data pegawai berhasil diperbarui");
      } else {
        await onCreatePegawai(payload as CreatePegawaiRequest);
        showNotif("Pegawai berhasil ditambahkan");
      }
      setModalOpen(false);
    } catch (e: any) {
      showNotif(e.message ?? "Terjadi kesalahan", "error");
    }
  }

  async function handleResetPassword(id: string, newPassword: string) {
    try {
      await onResetPassword(id, newPassword);
      showNotif("Password berhasil direset");
    } catch (e: any) {
      showNotif(e.message ?? "Gagal mereset password", "error");
    }
  }

  async function handleResetDevice(id: string) {
    try {
      await onResetDevice(id);
      showNotif("Device berhasil direset");
    } catch (e: any) {
      showNotif(e.message ?? "Gagal mereset device", "error");
    }
  }

  async function handleDeleteDokumen(dokumenId: string) {
    try {
      await onDeleteDokumen(dokumenId);
      showNotif("Dokumen berhasil dihapus");
    } catch (e: any) {
      showNotif(e.message ?? "Gagal menghapus dokumen", "error");
    }
  }

  // ── Pagination ──
  function pageNumbers(): (number | "...")[] {
    if (totalPages <= 5)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | "...")[] = [1];
    if (currentPage > 3) pages.push("...");
    for (
      let p = Math.max(2, currentPage - 1);
      p <= Math.min(totalPages - 1, currentPage + 1);
      p++
    )
      pages.push(p);
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
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
      {/* Notifikasi */}
      {notif && (
        <Notification
          message={notif.message}
          type={notif.type}
          onClose={() => setNotif(null)}
        />
      )}

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="px-5 py-3 border-b border-zinc-100">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 mr-2">
              <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center">
                <Users className="w-3.5 h-3.5 text-emerald-500" />
              </div>
              <span className="font-bold text-zinc-800 text-sm">
                Data Pegawai
              </span>
            </div>
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
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full sm:w-52 pl-7 pr-3 py-1.5 border border-zinc-200 rounded-lg text-xs text-zinc-700 outline-none focus:border-emerald-300 transition-all"
              />
            </div>
            <button
              onClick={handleTambah}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-semibold rounded-lg transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Tambah Data
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/60">
                <th className="px-5 py-2.5 text-[10px] font-semibold text-zinc-400 text-left w-12">
                  No
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
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-zinc-50">
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-4 py-4">
                        <div className="h-3.5 w-full animate-pulse rounded bg-zinc-100" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : data.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-12 text-center text-xs text-zinc-400"
                  >
                    Tidak ada data tersedia.
                  </td>
                </tr>
              ) : (
                data.map((row, i) => (
                  <tr
                    key={row.id}
                    className="border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors align-middle"
                  >
                    <td className="px-5 py-4 text-xs text-zinc-400">
                      {(currentPage - 1) * pageSize + i + 1}
                    </td>
                    <td className="px-4 py-4">
                      <Avatar fotoUrl={row.fotoUrl} nama={row.nama} />
                    </td>
                    <td className="px-4 py-4 text-xs text-zinc-600 font-mono tracking-wide">
                      {row.nip ?? "-"}
                    </td>
                    <td className="px-4 py-4 text-xs text-zinc-700 font-medium">
                      {row.nama}
                    </td>
                    <td className="px-4 py-4 text-xs text-zinc-600">
                      {row.jabatan ?? "-"}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleLihatDetail(row.id)}
                          className="text-xs text-emerald-600 font-semibold hover:underline whitespace-nowrap"
                        >
                          Lihat Detail
                        </button>
                        <button
                          onClick={() => handleResetDevice(row.id)}
                          className="text-xs text-zinc-500 font-semibold hover:underline whitespace-nowrap"
                        >
                          Reset Device
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
              {totalData === 0 ? 0 : (currentPage - 1) * pageSize + 1}–
              {Math.min(currentPage * pageSize, totalData)}
            </span>{" "}
            dari{" "}
            <span className="font-semibold text-zinc-600">{totalData}</span>{" "}
            data
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-[11px] border border-zinc-200 rounded-lg text-zinc-500 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium"
            >
              ‹ Sebelumnya
            </button>
            {pageNumbers().map((p, idx) =>
              p === "..." ? (
                <span
                  key={`e-${idx}`}
                  className="w-7 h-7 flex items-center justify-center text-[11px] text-zinc-400"
                >
                  ...
                </span>
              ) : (
                <button
                  key={p}
                  onClick={() => onPageChange(p as number)}
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
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 text-[11px] border border-zinc-200 rounded-lg text-zinc-500 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Selanjutnya ›
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <ModalPegawai
        isOpen={modalOpen}
        isSaving={isSaving}
        initialData={selectedPegawai}
        onClose={() => !isSaving && setModalOpen(false)}
        onSubmit={handleSubmitModal}
        onResetPassword={handleResetPassword}
        onDeleteDokumen={handleDeleteDokumen}
      />
    </AppLayout>
  );
}
