"use client";

import React, { useState } from "react";
import AppLayout from "@/components/app-layout";
import { DataTable, ColumnDef } from "@/components/training/Table";
import {
  AsesorModal,
  AsesorFormValues,
  AsesorData,
} from "@/components/training/AsesorModal";
import { Pencil, Plus } from "lucide-react";
import { useAsesor } from "@/hooks/use-asesor";
import type { Asesor } from "@/lib/services/asesor.service";
import Notification from "@/components/base/notifications";

const PAGE_SIZE = 10;

interface NotifState {
  message: string;
  type: "success" | "error";
  key: number;
}

export default function ManajemenAsesorPage() {
  const {
    data: asesorList,
    loading,
    page,
    setPage,
    total,
    totalPages,
    search,
    setSearch,
    create,
    update,
  } = useAsesor({ initialLimit: PAGE_SIZE });

  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<
    (AsesorData & { id: number }) | null
  >(null);
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

  const openEdit = (row: Asesor) => {
    setEditTarget({
      id: row.id,
      nama: row.nama,
      noRegAsesor: row.noRegAsesor ?? "",
    });
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setEditTarget(null);
  };

  const handleSave = async (data: AsesorFormValues) => {
    setIsSaving(true);
    try {
      const payload = {
        nama: data.nama,
        noRegAsesor: data.noRegAsesor || undefined,
      };

      if (editTarget) {
        await update(editTarget.id, payload);
        showNotif("Data asesor berhasil diperbarui", "success");
      } else {
        await create(payload);
        showNotif("Data asesor berhasil ditambahkan", "success");
      }

      handleClose();
    } catch (err: any) {
      showNotif(err?.message || "Gagal menyimpan data asesor", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const columns: ColumnDef<Asesor>[] = [
    {
      key: "no",
      label: "No",
      render: (_v, _row, index) => (
        <span>{(page - 1) * PAGE_SIZE + index + 1}</span>
      ),
    },
    { key: "nama", label: "Nama Asesor", render: (v) => <span>{String(v)}</span> },
    {
      key: "noRegAsesor",
      label: "No Reg Asesor",
      render: (v) => (v ? <span>{String(v)}</span> : "-"),
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
      breadcrumbs={[
        { label: "Training", href: "/training" },
        { label: "Input Asesor" },
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

      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold">Input Asesor</h1>
      </div>

      <DataTable
        columns={columns}
        data={asesorList}
        totalData={total}
        currentPage={page}
        totalPages={totalPages}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
        searchValue={search}
        onSearchChange={handleSearch}
        searchPlaceholder="Cari nama atau No Reg Asesor..."
        isLoading={loading}
        actionSlot={
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition-colors whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            Tambah Data Asesor
          </button>
        }
      />

      <AsesorModal
        open={modalOpen}
        onClose={handleClose}
        onSubmit={handleSave}
        initialData={editTarget}
        isLoading={isSaving}
      />
    </AppLayout>
  );
}
