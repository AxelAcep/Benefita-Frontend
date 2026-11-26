"use client";

/**
 * Keadaan dan aksi halaman Pengajuan Judul: modal, baris terpilih, proses
 * simpan, dan notifikasi.
 */
import { useState } from "react";
import { usePengajuan, usePengajuanById } from "@/hooks/use-pengajuan-judul";
import type {
  PengajuanJudulTraining,
  PengajuanListItem,
} from "@/lib/types/pengajuan-judul";
import type { PengajuanFormValues } from "./form";

export const UKURAN_HALAMAN = 10;

interface Notif {
  message: string;
  type: "success" | "error";
  key: number;
}

const keTeks = (v: number | null | undefined) =>
  v === null || v === undefined ? "" : String(v);

function keForm(row: PengajuanJudulTraining): PengajuanFormValues {
  return {
    judulTraining: row.judulTraining,
    jumlahHari: keTeks(row.jumlahHari),
    perusahaanId: row.perusahaanId ?? "",
    namaKontak: row.namaKontak ?? "",
    kontak: row.kontak ?? "",
    jumlahPeserta: keTeks(row.jumlahPeserta),
    responMA: row.responMA ?? "",
  };
}

const keAngka = (v: string | undefined): number | undefined => {
  if (!v) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
};

export function usePengajuanManage() {
  const resource = usePengajuan(UKURAN_HALAMAN);

  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [notif, setNotif] = useState<Notif | null>(null);

  // Endpoint list hanya mengirim nama perusahaan, bukan perusahaanId, jadi
  // formulir edit harus menunggu detail sebelum bisa diisi dengan benar.
  const { data: detail, loading: detailLoading } = usePengajuanById(editId);

  const showNotif = (message: string, type: Notif["type"]) =>
    setNotif({ message, type, key: Date.now() });

  const openAdd = () => {
    setEditId(null);
    setModalOpen(true);
  };

  const openEdit = (row: PengajuanListItem) => {
    setEditId(row.id);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditId(null);
  };

  const save = async (data: PengajuanFormValues) => {
    setIsSaving(true);
    try {
      const payload = {
        judulTraining: data.judulTraining,
        jumlahHari: keAngka(data.jumlahHari) ?? 0,
        perusahaanId: data.perusahaanId || undefined,
        namaKontak: data.namaKontak || undefined,
        kontak: data.kontak || undefined,
        jumlahPeserta: keAngka(data.jumlahPeserta),
        responMA: data.responMA || undefined,
      };

      if (editId !== null) {
        await resource.update(editId, payload);
        showNotif("Pengajuan berhasil diperbarui", "success");
      } else {
        await resource.create(payload);
        showNotif("Pengajuan berhasil ditambahkan", "success");
      }

      closeModal();
    } catch (err) {
      showNotif(
        err instanceof Error ? err.message : "Gagal menyimpan pengajuan",
        "error",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return {
    ...resource,
    isEdit: editId !== null,
    modalOpen,
    // Null saat mode tambah, dan juga selama detail belum tiba — supaya
    // formulir tidak sempat menampilkan data baris sebelumnya.
    formValues: editId !== null && detail ? keForm(detail) : null,
    detailLoading,
    isSaving,
    notif,
    clearNotif: () => setNotif(null),
    openAdd,
    openEdit,
    closeModal,
    save,
  };
}
