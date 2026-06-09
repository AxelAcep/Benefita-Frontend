// app/perusahaan/permintaan-nomor-surat-marketing/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import AppLayout from "@/components/app-layout";
import ModalPengajuanSurat from "@/components/dokumen/modal-pengajuan-surat";
import { usePermintaanSurat } from "@/hooks/use-surat";
import { PermintaanNomorSurat } from "@/lib/services/surat.service";
import { getSession } from "@/lib/services/login.service";
import { getUserDetail } from "@/lib/services/login.service";
import NotificationComponent from "@/components/base/notifications";
import ConfirmModal from "@/components/base/confirm-modal";

const PAGE_SIZE = 10;

function getPageNumbers(currentPage: number, totalPages: number) {
  const pages: (number | string)[] = [];
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    if (currentPage <= 3) {
      pages.push(1, 2, 3, 4, "...ellipsis", totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(
        1,
        "...ellipsis",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      );
    } else {
      pages.push(
        1,
        "...ellipsis",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "...ellipsis",
        totalPages,
      );
    }
  }
  return pages;
}

export default function PermintaanNomorSuratMarketingPage() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<PermintaanNomorSurat | null>(
    null,
  );
  const [pengirimId, setPengirimId] = useState<string>("");
  const [notif, setNotif] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const session = getSession();
      if (session?.user?.id) {
        try {
          const userDetail = await getUserDetail(session.user.id);
          setPengirimId(userDetail.pegawaiId);
        } catch (error) {
          console.error("Gagal load user detail:", error);
        }
      }
    };
    loadUser();
  }, []);

  const {
    data,
    loading,
    pagination,
    create,
    update,
    remove,
    refetch,
    setPage,
  } = usePermintaanSurat({
    page: currentPage,
    limit: PAGE_SIZE,
    tipe: "marketing",
    search: search || undefined,
  });

  useEffect(() => {
    setPage(currentPage);
  }, [currentPage]);

  useEffect(() => {
    setCurrentPage(1);
    setPage(1);
  }, [search]);

  const openBuat = () => {
    setSelectedData(null);
    setModalOpen(true);
  };

  const openEdit = (row: PermintaanNomorSurat) => {
    setSelectedData(row);
    setModalOpen(true);
  };

  const handleSubmit = async (form: {
    keterangan: string;
    tujuanNoInduk: string;
  }) => {
    if (!pengirimId) {
      setNotif({ message: "Data pengirim tidak ditemukan", type: "error" });
      setTimeout(() => setNotif(null), 3000);
      return;
    }

    try {
      if (selectedData) {
        await update(selectedData.id, {
          keterangan: form.keterangan,
          tujuanNoInduk: form.tujuanNoInduk,
        });
        setNotif({
          message: "Berhasil mengupdate permintaan surat",
          type: "success",
        });
      } else {
        await create({
          keterangan: form.keterangan,
          tujuanNoInduk: form.tujuanNoInduk,
          pengirimId: pengirimId,
          tipe: "marketing",
        });
        setNotif({
          message: "Berhasil membuat permintaan surat",
          type: "success",
        });
      }
      setTimeout(() => setNotif(null), 3000);
      refetch();
      setModalOpen(false);
    } catch (error: any) {
      setNotif({
        message: error.message || "Terjadi kesalahan",
        type: "error",
      });
      setTimeout(() => setNotif(null), 3000);
    }
  };

  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await remove(deleteId);
      setNotif({
        message: "Berhasil menghapus permintaan surat",
        type: "success",
      });
      setTimeout(() => setNotif(null), 3000);
      refetch();
    } catch (error: any) {
      setNotif({
        message: error.message || "Gagal menghapus data",
        type: "error",
      });
      setTimeout(() => setNotif(null), 3000);
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
      setDeleteId(null);
    }
  };

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Perusahaan", href: "/perusahaan" },
        { label: "Permintaan Nomor Surat (Marketing)" },
      ]}
      subtitle={`Hari ini: ${new Date().toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}`}
      userName="Nanang"
      userRole="Super Admin"
    >
      {notif && (
        <NotificationComponent
          message={notif.message}
          type={notif.type}
          onClose={() => setNotif(null)}
        />
      )}
      <ConfirmModal
        isOpen={confirmOpen}
        message="Apakah Anda yakin ingin menghapus data ini?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmOpen(false)}
        loading={deleting}
      />
      <ModalPengajuanSurat
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        mode={selectedData ? "edit" : "buat"}
        data={
          selectedData
            ? {
                keterangan: selectedData.keterangan || "",
                tujuanNoInduk: selectedData.tujuanNoInduk,
                tujuanNama: selectedData.tujuan?.company || "",
              }
            : undefined
        }
        onSubmit={handleSubmit}
      />

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-100 flex flex-wrap items-center justify-between gap-3">
          <span className="font-bold text-zinc-800 text-sm flex items-center gap-2">
            📋 Permintaan Nomor Surat (Marketing)
          </span>
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
                placeholder="Cari no surat, pengirim, perusahaan..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-64 pl-7 pr-3 py-1.5 border border-zinc-200 rounded-lg text-xs text-zinc-700 outline-none focus:border-emerald-300 transition-all"
              />
            </div>
            <button
              onClick={openBuat}
              className="px-3 py-1.5 text-xs bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors flex items-center gap-1.5 whitespace-nowrap"
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
              Buat Permintaan
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/60">
                <th className="px-4 py-3 text-[11px] font-semibold text-zinc-400 text-left w-12">
                  No
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold text-zinc-400 text-left w-44">
                  No. Surat
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold text-zinc-400 text-left">
                  Keterangan
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold text-zinc-400 text-left">
                  Tujuan
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold text-zinc-400 text-left w-28">
                  Tgl. Kirim
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold text-zinc-400 text-left w-28">
                  Pengirim
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold text-zinc-400 text-left w-24">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-12 text-center text-xs text-zinc-400"
                  >
                    Loading...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-12 text-center text-xs text-zinc-400"
                  >
                    Tidak ada data tersedia.
                  </td>
                </tr>
              ) : (
                data.map((row, i) => (
                  <tr
                    key={row.id}
                    className="border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-xs text-zinc-400">
                      {(pagination.page - 1) * PAGE_SIZE + i + 1}
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-700 font-medium">
                      {row.noSurat}
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-600">
                      {row.keterangan}
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-600">
                      {row.tujuan?.company || row.tujuanNoInduk}
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-600">
                      {new Date(row.tanggalKirim).toLocaleDateString("id-ID")}
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-600">
                      {row.pengirim?.nama}
                    </td>
                    <td className="px-4 py-3 flex gap-2">
                      <button
                        onClick={() => openEdit(row)}
                        className="text-xs text-emerald-600 font-semibold hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(row.id)}
                        className="text-xs text-red-500 font-semibold hover:underline"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && data.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-5 py-3 border-t border-zinc-100">
            <p className="text-[11px] text-zinc-400">
              Menampilkan{" "}
              <span className="font-semibold text-zinc-600">
                {(pagination.page - 1) * PAGE_SIZE + 1}–
                {Math.min(pagination.page * PAGE_SIZE, pagination.total)}
              </span>{" "}
              dari{" "}
              <span className="font-semibold text-zinc-600">
                {pagination.total}
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
              {getPageNumbers(currentPage, pagination.totalPages).map(
                (p, idx) =>
                  typeof p === "string" ? (
                    <span
                      key={idx}
                      className="w-7 h-7 flex items-center justify-center text-[11px] text-zinc-400"
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setCurrentPage(p)}
                      className={`w-7 h-7 rounded-lg text-[11px] font-semibold transition-colors ${p === currentPage ? "bg-emerald-500 text-white" : "border border-zinc-200 text-zinc-500 hover:bg-zinc-50"}`}
                    >
                      {p}
                    </button>
                  ),
              )}
              <button
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={currentPage === pagination.totalPages}
                className="px-3 py-1.5 text-[11px] border border-zinc-200 rounded-lg text-zinc-500 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Selanjutnya ›
              </button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
