"use client";

/**
 * Keadaan dan aksi halaman Asesor: buka/tutup modal, baris yang sedang
 * diedit, proses simpan, dan notifikasi.
 */
import { useState } from "react";
import { useKonfirmasiHapus } from "@/hooks/use-konfirmasi-hapus";
import { useAsesor } from "@/hooks/use-asesor";
import type { Asesor } from "@/lib/types/asesor";
import type { AsesorFormValues } from "./form";

export const UKURAN_HALAMAN = 10;

interface Notif {
  message: string;
  type: "success" | "error";
  key: number;
}

function keForm(row: Asesor): AsesorFormValues {
  return { nama: row.nama, noRegAsesor: row.noRegAsesor ?? "" };
}

export function useAsesorManage() {
  const resource = useAsesor(UKURAN_HALAMAN);

  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<AsesorFormValues | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [notif, setNotif] = useState<Notif | null>(null);

  const showNotif = (message: string, type: Notif["type"]) =>
    setNotif({ message, type, key: Date.now() });

  const openAdd = () => {
    setEditId(null);
    setEditValues(null);
    setModalOpen(true);
  };

  const openEdit = (row: Asesor) => {
    setEditId(row.id);
    setEditValues(keForm(row));
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditId(null);
    setEditValues(null);
  };

  const save = async (data: AsesorFormValues) => {
    setIsSaving(true);
    try {
      // Field opsional kosong dikirim undefined, bukan "", supaya backend
      // menyimpan null dan bukan string kosong.
      const payload = {
        nama: data.nama,
        noRegAsesor: data.noRegAsesor || undefined,
      };

      if (editId !== null) {
        await resource.update(editId, payload);
        showNotif("Data asesor berhasil diperbarui", "success");
      } else {
        await resource.create(payload);
        showNotif("Data asesor berhasil ditambahkan", "success");
      }

      closeModal();
    } catch (err) {
      showNotif(
        err instanceof Error ? err.message : "Gagal menyimpan data asesor",
        "error",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const hapus = useKonfirmasiHapus({
    remove: resource.remove,
    idDari: (row: Asesor) => row.id,
    namaDari: (row: Asesor) => row.nama,
    onSukses: (nama) => showNotif(`Data asesor "${nama}" berhasil dihapus`, "success"),
    onGagal: (pesan) => showNotif(pesan, "error"),
  });

  return {
    ...resource,
    ...hapus,
    modalOpen,
    editValues,
    isSaving,
    notif,
    clearNotif: () => setNotif(null),
    openAdd,
    openEdit,
    closeModal,
    save,
  };
}
