"use client";

/**
 * Keadaan dan aksi halaman Trainer: modal detail, modal formulir, baris
 * terpilih, filter status, proses simpan, dan notifikasi.
 */
import { useState } from "react";
import { useTrainerById, useTrainers } from "@/hooks/use-trainer";
import type { Trainer } from "@/lib/types/trainer";
import type { TrainerFormValues } from "./form";

export const UKURAN_HALAMAN = 10;

interface Notif {
  message: string;
  type: "success" | "error";
  key: number;
}

function keForm(row: Trainer): TrainerFormValues {
  return {
    kode: row.kode,
    nama: row.nama,
    hp: row.hp,
    email: row.email,
    alamat: row.alamat,
    kantor: row.kantor,
    alamatKantor: row.alamatKantor,
    noTelpKantor: row.noTelpKantor,
    // Backend menyimpan referensi sebagai satu string dipisah koma.
    referensi: row.referensi.join(", "),
    subyekKhusus: row.subyekKhusus ?? "",
    keterangan: row.keterangan ?? "",
    tugas: row.tugas ?? "",
    statusAktif: row.statusAktif,
  };
}

export function useTrainerManage() {
  const resource = useTrainers(UKURAN_HALAMAN);

  const [detailOpen, setDetailOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  // Baris yang sedang dilihat atau diedit. Dipakai juga untuk menarik detail,
  // karena endpoint list tidak mengirim alamat dan keterangan.
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [notif, setNotif] = useState<Notif | null>(null);

  const { data: detail, loading: detailLoading } = useTrainerById(selectedId);

  const showNotif = (message: string, type: Notif["type"]) =>
    setNotif({ message, type, key: Date.now() });

  const openDetail = (row: Trainer) => {
    setSelectedId(row.id);
    setDetailOpen(true);
  };

  const closeDetail = () => {
    setDetailOpen(false);
    setSelectedId(null);
  };

  const openAdd = () => {
    setSelectedId(null);
    setFormOpen(true);
  };

  const openEdit = (row: Trainer) => {
    setSelectedId(row.id);
    setFormOpen(true);
  };

  /** Dari modal detail langsung ke formulir, tanpa kehilangan baris terpilih. */
  const detailKeEdit = () => {
    setDetailOpen(false);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setSelectedId(null);
  };

  const save = async (data: TrainerFormValues) => {
    setIsSaving(true);
    try {
      const payload = {
        kode: data.kode,
        nama: data.nama,
        telp: data.hp || undefined,
        email: data.email || undefined,
        alamat: data.alamat || undefined,
        kantor: data.kantor || undefined,
        alamatKantor: data.alamatKantor || undefined,
        noTelpKantor: data.noTelpKantor || undefined,
        // Rapikan spasi dan buang entri kosong sebelum dikirim.
        referensi:
          data.referensi
            ?.split(",")
            .map((s) => s.trim())
            .filter(Boolean)
            .join(",") || undefined,
        subjekKhusus: data.subyekKhusus || undefined,
        keterangan: data.keterangan || undefined,
        tugas: data.tugas || undefined,
        statusAktif: data.statusAktif ?? true,
      };

      if (selectedId !== null) {
        await resource.update(selectedId, payload);
        showNotif("Data trainer berhasil diperbarui", "success");
      } else {
        await resource.create(payload);
        showNotif("Data trainer berhasil ditambahkan", "success");
      }

      closeForm();
    } catch (err) {
      showNotif(
        err instanceof Error ? err.message : "Gagal menyimpan data trainer",
        "error",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return {
    ...resource,
    isEdit: selectedId !== null,
    status: resource.filter.status ?? "",
    setStatus: (v: string) => resource.setFilter("status", v),
    detailOpen,
    detail,
    detailLoading,
    formOpen,
    // Formulir diisi dari detail kalau sudah tiba; kalau belum, biarkan
    // kosong supaya tidak sempat menampilkan data baris sebelumnya.
    formValues: selectedId !== null && detail ? keForm(detail) : null,
    isSaving,
    notif,
    clearNotif: () => setNotif(null),
    openDetail,
    closeDetail,
    detailKeEdit,
    openAdd,
    openEdit,
    closeForm,
    save,
  };
}
