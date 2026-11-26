"use client";

import React from "react";
import { Users, Plus, UserCircle2 } from "lucide-react";
import AppLayout from "@/components/app-layout";
import Notification from "@/components/base/notifications";
import TablePagination from "@/components/base/table-pagination";
import ModalPegawai from "./components/modal-pegawai";
import { useAccountingKaryawanManage } from "./manage";

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
  return <UserCircle2 aria-hidden="true" className="h-8 w-8 text-zinc-300" />;
}

export default function AccountingKaryawanContainer() {
  const {
    data,
    isLoading,
    error,
    currentPage,
    totalPages,
    totalData,
    pageSize,
    onPageChange,
    search,
    onSearchChange,
    isSaving,
    modalOpen,
    selectedPegawai,
    notif,
    handleTambah,
    handleLihatDetail,
    handleSubmitModal,
    handleResetPassword,
    handleResetDevice,
    handleDeleteDokumen,
    closeModal,
    closeNotif,
  } = useAccountingKaryawanManage();

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Accounting", href: "/accounting/beranda" },
        { label: "Data Pegawai" },
      ]}
    >
      {/* Notifikasi */}
      {notif && (
        <Notification
          key={notif.key}
          message={notif.message}
          type={notif.type}
          onClose={closeNotif}
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
              ) : error || data.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-12 text-center text-xs text-zinc-400"
                  >
                    {error ?? "Tidak ada data tersedia."}
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

        {!error && (
          <TablePagination
            page={currentPage}
            limit={pageSize}
            total={totalData}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        )}
      </div>

      {/* Modal */}
      <ModalPegawai
        isOpen={modalOpen}
        isSaving={isSaving}
        initialData={selectedPegawai}
        onClose={closeModal}
        onSubmit={handleSubmitModal}
        onResetPassword={handleResetPassword}
        onDeleteDokumen={handleDeleteDokumen}
      />
    </AppLayout>
  );
}
