"use client";

/**
 * Keadaan halaman daftar Jadwal Training: pencarian dan tiga filter
 * (status, jenis training, metode) yang baru berlaku saat tombol Terapkan
 * ditekan.
 */
import { useState } from "react";
import {
  useJadwalTrainingList,
  useOpsiJadwal,
} from "@/hooks/use-jadwal-training";

export const UKURAN_HALAMAN = 10;

export function useJadwalManage() {
  const resource = useJadwalTrainingList(UKURAN_HALAMAN);
  const { opsi } = useOpsiJadwal();

  // Nilai yang sedang dipilih dipisah dari yang sudah berlaku.
  const [draftStatus, setDraftStatus] = useState("");
  const [draftJenis, setDraftJenis] = useState("");
  const [draftMetode, setDraftMetode] = useState("");

  const terapkanFilter = () => {
    resource.setFilter("status", draftStatus);
    resource.setFilter("jenisTraining", draftJenis);
    resource.setFilter("metode", draftMetode);
  };

  const resetFilter = () => {
    setDraftStatus("");
    setDraftJenis("");
    setDraftMetode("");
    resource.setFilter("status", "");
    resource.setFilter("jenisTraining", "");
    resource.setFilter("metode", "");
  };

  const adaFilter = !!(
    resource.filter.status ||
    resource.filter.jenisTraining ||
    resource.filter.metode
  );

  return {
    ...resource,
    opsi,
    draftStatus,
    setDraftStatus,
    draftJenis,
    setDraftJenis,
    draftMetode,
    setDraftMetode,
    terapkanFilter,
    resetFilter,
    adaFilter,
  };
}
