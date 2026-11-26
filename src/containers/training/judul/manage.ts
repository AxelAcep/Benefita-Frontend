"use client";

/**
 * Keadaan dan aksi halaman Judul Training: modal, baris terpilih, filter
 * tipe dan kode (diterapkan lewat tombol, bukan langsung), proses simpan,
 * dan notifikasi.
 */
import { useState } from "react";
import {
  useJudulTrainingList,
  useTipeJudulTraining,
} from "@/hooks/use-judul-training";
import type { JudulTrainingListItem } from "@/lib/types/judul-training";
import type { JudulFormValues } from "./form";

export const UKURAN_HALAMAN = 10;

interface Notif {
  message: string;
  type: "success" | "error";
  key: number;
}

const keTeks = (v: number | null | undefined) =>
  v === null || v === undefined ? "" : String(v);

function keForm(row: JudulTrainingListItem): JudulFormValues {
  return {
    kode: row.kode,
    judulTraining: row.judulTraining,
    tipe: row.tipe,
    hari: keTeks(row.hari),
    biayaOnline: keTeks(row.biayaOnline),
    biayaOffline: keTeks(row.biayaOffline),
    batch: keTeks(row.batch),
    // Berkas baru selalu mulai kosong; brosur lama ditangani terpisah.
    brosur: null,
  };
}

export function useJudulManage() {
  const resource = useJudulTrainingList(UKURAN_HALAMAN);
  const { tipeList } = useTipeJudulTraining();

  // Filter tipe dan kode baru dikirim saat tombol Terapkan ditekan, jadi
  // nilai yang sedang diketik disimpan terpisah dari yang sudah berlaku.
  const [draftTipe, setDraftTipe] = useState("");
  const [draftKode, setDraftKode] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editRow, setEditRow] = useState<JudulTrainingListItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [notif, setNotif] = useState<Notif | null>(null);

  const showNotif = (message: string, type: Notif["type"]) =>
    setNotif({ message, type, key: Date.now() });

  const terapkanFilter = () => {
    resource.setFilter("tipe", draftTipe);
    resource.setFilter("kode", draftKode);
  };

  const resetFilter = () => {
    setDraftTipe("");
    setDraftKode("");
    resource.setFilter("tipe", "");
    resource.setFilter("kode", "");
  };

  const openAdd = () => {
    setEditRow(null);
    setModalOpen(true);
  };

  const openEdit = (row: JudulTrainingListItem) => {
    setEditRow(row);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditRow(null);
  };

  const save = async (data: JudulFormValues) => {
    setIsSaving(true);
    try {
      const payload = {
        kode: data.kode,
        judulTraining: data.judulTraining,
        tipe: data.tipe,
        hari: Number(data.hari),
        biayaOnline: Number(data.biayaOnline),
        biayaOffline: Number(data.biayaOffline),
        batch: Number(data.batch),
        // Hanya dikirim kalau user memilih berkas baru; kalau tidak,
        // backend mempertahankan brosur yang sudah ada.
        brosur: data.brosur ?? undefined,
      };

      if (editRow) {
        await resource.update(editRow.id, payload);
        showNotif("Judul Training berhasil diperbarui.", "success");
      } else {
        await resource.create(payload);
        showNotif("Judul Training berhasil ditambahkan.", "success");
      }

      closeModal();
    } catch (err) {
      showNotif(
        err instanceof Error ? err.message : "Gagal menyimpan judul training",
        "error",
      );
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Tombol "Download Jadwal Tahun 2026".
   *
   * Belum ada endpointnya di backend. Versi lama memanggil
   * console.log("download jadwal"), jadi tombolnya terlihat berfungsi
   * padahal tidak melakukan apa pun. Sampai endpointnya ada, tombol ini
   * mengatakan terus terang bahwa fiturnya belum tersedia.
   */
  const downloadJadwal = () =>
    showNotif("Download jadwal belum tersedia.", "error");

  return {
    ...resource,
    downloadJadwal,
    tipeList,
    draftTipe,
    setDraftTipe,
    draftKode,
    setDraftKode,
    terapkanFilter,
    resetFilter,
    adaFilter: !!(resource.filter.tipe || resource.filter.kode),
    modalOpen,
    formValues: editRow ? keForm(editRow) : null,
    brosurLama: editRow?.brosur ?? null,
    isSaving,
    notif,
    clearNotif: () => setNotif(null),
    openAdd,
    openEdit,
    closeModal,
    save,
  };
}
