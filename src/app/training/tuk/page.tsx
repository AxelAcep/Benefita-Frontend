"use client";

import React, { useState } from "react";
import AppLayout from "@/components/app-layout";
import { DataTable, ColumnDef } from "@/components/training/Table";
import { TUKModal, TUKFormValues, TUKData } from "@/components/training/TUKModal";
import { Pencil, Plus } from "lucide-react";
import { useTUK } from "@/hooks/use-tuk";
import type { TUK } from "@/lib/services/tuk.service";
import Notification from "@/components/base/notifications";

const PAGE_SIZE = 10;

interface NotifState {
  message: string;
  type: "success" | "error";
  key: number;
}

function formatTanggal(iso: string | null) {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function ManajemenTUKPage() {
  const {
    data: tukList,
    loading,
    page,
    setPage,
    total,
    totalPages,
    search,
    setSearch,
    create,
    update,
  } = useTUK({ initialLimit: PAGE_SIZE });

  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<(TUKData & { id: number }) | null>(
    null,
  );
  const [isSaving, setIsSaving] = useState(false);
  const [notif, setNotif] = useState<NotifState | null>(null);

  const showNotif = (message: string, type: "success" | "error") => {
    setNotif({ message, type, key: Date.now() });
  };

  const handleSearch = (v: string) => {
    setSearch(v);
    setPage(1);
  };

  const openAdd = () => {
    setEditTarget(null);
    setModalOpen(true);
  };

  const openEdit = (row: TUK) => {
    setEditTarget({
      id: row.id,
      noSK: row.noSK,
      noPenetapan: row.noPenetapan ?? "",
      tglSanggup: row.tglSanggup ? row.tglSanggup.split("T")[0] : "",
      nama: row.nama,
      alamat: row.alamat,
      telp: row.telp ?? "",
    });
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setEditTarget(null);
  };

  const handleSave = async (data: TUKFormValues) => {
    setIsSaving(true);
    try {
      const payload = {
        noSK: data.noSK,
        noPenetapan: data.noPenetapan || undefined,
        tglSanggup: data.tglSanggup || undefined,
        nama: data.nama,
        alamat: data.alamat,
        telp: data.telp || undefined,
      };

      if (editTarget) {
        await update(editTarget.id, payload);
        showNotif("Data TUK berhasil diperbarui", "success");
      } else {
        await create(payload);
        showNotif("Data TUK berhasil ditambahkan", "success");
      }

      handleClose();
    } catch (err: any) {
      showNotif(err?.message || "Gagal menyimpan data TUK", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const columns: ColumnDef<TUK>[] = [
    {
      key: "no",
      label: "No",
      render: (_v, _row, index) => (
        <span>{(page - 1) * PAGE_SIZE + index + 1}</span>
      ),
    },
    { key: "noSK", label: "No SK", render: (v) => <span>{String(v)}</span> },
    {
      key: "noPenetapan",
      label: "No Penetapan",
      render: (v) => (v ? <span>{String(v)}</span> : "-"),
    },
    { key: "nama", label: "Nama TUK", render: (v) => <span>{String(v)}</span> },
    {
      key: "alamat",
      label: "Alamat",
      render: (v) => <span>{String(v)}</span>,
    },
    {
      key: "telp",
      label: "Telp",
      render: (v) => (v ? <span>{String(v)}</span> : "-"),
    },
    {
      key: "tglSanggup",
      label: "Tgl Kesanggupan",
      render: (v) => <span>{formatTanggal(v as string | null)}</span>,
    },
    {
      key: "pegawai",
      label: "Updater",
      render: (_v, row) => <span>{row.pegawai?.nama ?? "-"}</span>,
    },
    {
      key: "edit",
      label: "Edit",
      render: (_v, row) => (
        <button onClick={() => openEdit(row)}>
          <Pencil className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <AppLayout
      breadcrumbs={[{ label: "Training", href: "/training" }, { label: "Input TUK" }]}
    >
      {notif && (
        <Notification
          key={notif.key}
          message={notif.message}
          type={notif.type}
          onClose={() => setNotif(null)}
        />
      )}

      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold">Input TUK</h1>
      </div>

      <DataTable
        columns={columns}
        data={tukList}
        totalData={total}
        currentPage={page}
        totalPages={totalPages}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
        searchValue={search}
        onSearchChange={handleSearch}
        searchPlaceholder="Cari nama, No SK, atau alamat..."
        isLoading={loading}
        actionSlot={
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition-colors whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            Tambah Data TUK
          </button>
        }
      />

      <TUKModal
        open={modalOpen}
        onClose={handleClose}
        onSubmit={handleSave}
        initialData={editTarget}
        isLoading={isSaving}
      />
    </AppLayout>
  );
}
