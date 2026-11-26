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
import { approvePengajuan } from "@/lib/services/pengajuan-judul-training.service";
import type { ApprovalValues } from "./approval-form";

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
    jumlahPeserta: row.jumlahPesertaTeks ?? keTeks(row.jumlahPeserta),
  };
}

const keAngka = (v: string | undefined): number | undefined => {
  if (!v) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
};

export function usePengajuanManage() {
  const [reviewing, setReviewing] = useState<PengajuanListItem | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);
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
        perusahaanId: data.perusahaanId || "",
        namaKontak: data.namaKontak || "",
        kontak: data.kontak || "",
        jumlahPeserta: data.jumlahPeserta || null,
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

  const submitApproval = async (data: ApprovalValues) => {
    if (!reviewing) return;
    setIsReviewing(true);
    try {
      await approvePengajuan(reviewing.id, data);
      await resource.refetch();
      setReviewing(null);
      showNotif("Keputusan pengajuan berhasil disimpan", "success");
    } catch (error) {
      showNotif(error instanceof Error ? error.message : "Gagal menyimpan keputusan", "error");
    } finally { setIsReviewing(false); }
  };

  return {
    ...resource,
    reviewing, isReviewing, submitApproval,
    openApproval: (row: PengajuanListItem) => { if (row.canApprove) setReviewing(row); },
    closeApproval: () => { if (!isReviewing) setReviewing(null); },
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
