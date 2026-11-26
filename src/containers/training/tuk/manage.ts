"use client";

/**
 * Keadaan dan aksi halaman TUK: buka/tutup modal, baris yang sedang diedit,
 * proses simpan, dan notifikasi.
 *
 * Dipisah dari index.tsx supaya halaman tinggal berisi tata letak dan kolom,
 * bukan juga mengurus useState satu per satu.
 */
import { useState } from "react";
import { useTUK } from "@/hooks/use-tuk";
import type { TUK } from "@/lib/types/tuk";
import type { TUKFormValues } from "./form";

export const UKURAN_HALAMAN = 10;

interface Notif {
  message: string;
  type: "success" | "error";
  key: number;
}

/** Ubah satu baris TUK jadi nilai yang siap dipasang ke formulir. */
function keForm(row: TUK): TUKFormValues {
  return {
    noSK: row.noSK,
    noPenetapan: row.noPenetapan ?? "",
    // Input type="date" hanya menerima YYYY-MM-DD, bukan ISO lengkap.
    tglSanggup: row.tglSanggup ? row.tglSanggup.split("T")[0] : "",
    nama: row.nama,
    alamat: row.alamat,
    telp: row.telp ?? "",
  };
}

export function useTUKManage() {
  const resource = useTUK(UKURAN_HALAMAN);

  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<TUKFormValues | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [notif, setNotif] = useState<Notif | null>(null);

  const showNotif = (message: string, type: Notif["type"]) =>
    setNotif({ message, type, key: Date.now() });

  const openAdd = () => {
    setEditId(null);
    setEditValues(null);
    setModalOpen(true);
  };

  const openEdit = (row: TUK) => {
    setEditId(row.id);
    setEditValues(keForm(row));
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditId(null);
    setEditValues(null);
  };

  const save = async (data: TUKFormValues) => {
    setIsSaving(true);
    try {
      // Field opsional yang kosong dikirim sebagai undefined, bukan "",
      // supaya backend menyimpan null dan bukan string kosong.
      const payload = {
        noSK: data.noSK,
        noPenetapan: data.noPenetapan || undefined,
        tglSanggup: data.tglSanggup || undefined,
        nama: data.nama,
        alamat: data.alamat,
        telp: data.telp || undefined,
      };

      if (editId !== null) {
        await resource.update(editId, payload);
        showNotif("Data TUK berhasil diperbarui", "success");
      } else {
        await resource.create(payload);
        showNotif("Data TUK berhasil ditambahkan", "success");
      }

      closeModal();
    } catch (err) {
      showNotif(
        err instanceof Error ? err.message : "Gagal menyimpan data TUK",
        "error",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return {
    ...resource,
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
