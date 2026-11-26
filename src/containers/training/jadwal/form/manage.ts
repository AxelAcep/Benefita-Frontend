"use client";

/**
 * Keadaan formulir Jadwal Training, dipakai dua rute:
 *   /training/jadwal/tambah       tanpa noJadwal -> mode tambah
 *   /training/jadwal/edit/[id]    ada noJadwal   -> mode ubah
 *
 * Parameter rute bernama [id], tapi isinya noJadwal — daftar menautkannya
 * dengan row.noJadwal, dan backend memang mencari dengan
 * where: { noJadwal }.
 */
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createJadwalTraining,
  deleteJadwalTraining,
  updateJadwalTraining,
} from "@/lib/services/jadwal-training.service";
import {
  useJadwalTrainingDetail,
  useNextNoJadwal,
  useOpsiJadwal,
} from "@/hooks/use-jadwal-training";
import { kodeTrainer } from "@/lib/types/jadwal-training";
import type { JadwalFormValues } from "./form-schema";

interface Notif {
  message: string;
  type: "success" | "error";
  key: number;
}

const keTanggalInput = (iso: string | null) => (iso ? iso.split("T")[0] : "");

/** Ambil angka dari teks biaya yang mungkin berisi titik atau spasi. */
const keAngka = (v: string | undefined) => {
  if (!v) return 0;
  const n = Number(v.replace(/\D/g, ""));
  return Number.isFinite(n) ? n : 0;
};

export function useJadwalFormManage(noJadwalAsli: string | null) {
  const router = useRouter();
  const isEdit = Boolean(noJadwalAsli);

  const { data: detail, loading: detailLoading } =
    useJadwalTrainingDetail(noJadwalAsli);
  // Nomor jadwal baru hanya diambil saat menambah; saat mengubah nomornya
  // sudah ada dan merupakan identitas barisnya.
  const { noJadwal: noJadwalBaru, loading: noJadwalLoading } =
    useNextNoJadwal(!isEdit);
  const { opsi } = useOpsiJadwal();

  const [fileAgenda, setFileAgenda] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [konfirmasiHapus, setKonfirmasiHapus] = useState(false);
  const [notif, setNotif] = useState<Notif | null>(null);

  const showNotif = (message: string, type: Notif["type"]) =>
    setNotif({ message, type, key: Date.now() });

  const [nilaiAwal, setNilaiAwal] = useState<JadwalFormValues | null>(null);

  useEffect(() => {
    if (!detail) return;
    setNilaiAwal({
      noJadwal: detail.noJadwal,
      kodePelatihan: detail.kodePelatihan,
      tglMulai: keTanggalInput(detail.tglMulai),
      tglSelesai: keTanggalInput(detail.tglSelesai),
      judulLengkap: detail.judulLengkap ?? "",
      judulPendek: detail.judulPendek ?? "",
      metode: detail.metode ?? "",
      jenisTraining: detail.jenisTraining ?? "",
      kota: detail.kota ?? "",
      lokasiDetail: detail.lokasiDetail ?? "",
      biaya: detail.biaya ? String(detail.biaya) : "",
      trainerKodes: kodeTrainer(detail.trainers),
      status: detail.status ?? "",
      catatan: detail.catatan ?? "",
    });
  }, [detail]);

  const simpan = async (values: JadwalFormValues) => {
    setSaving(true);
    try {
      const payload = {
        noJadwal: values.noJadwal,
        kodePelatihan: values.kodePelatihan,
        tglMulai: values.tglMulai || null,
        tglSelesai: values.tglSelesai || null,
        judulLengkap: values.judulLengkap || "",
        judulPendek: values.judulPendek || "",
        metode: values.metode || "",
        jenisTraining: values.jenisTraining || "",
        kota: values.kota || "",
        lokasiDetail: values.lokasiDetail || null,
        biaya: keAngka(values.biaya),
        trainerKodes: values.trainerKodes ?? [],
        status: values.status || "",
        catatan: values.catatan || null,
        // Hanya dikirim kalau user memilih berkas baru; kalau tidak,
        // backend mempertahankan agenda yang sudah ada.
        fileAgenda: fileAgenda ?? undefined,
        // updateOleh sengaja tidak dikirim: backend menurunkannya sendiri
        // dari token (req.user.userId -> pegawaiId) dan mengabaikan body.
      };

      if (isEdit && noJadwalAsli) {
        // Pakai nomor ASLI, bukan isian formulir, karena nomor itu
        // sekaligus identitas baris di backend.
        await updateJadwalTraining(noJadwalAsli, payload);
        showNotif("Jadwal Training berhasil diperbarui.", "success");
      } else {
        await createJadwalTraining(payload);
        showNotif("Jadwal Training berhasil ditambahkan.", "success");
      }

      router.push("/training/jadwal");
    } catch (err) {
      showNotif(
        err instanceof Error ? err.message : "Gagal menyimpan jadwal training",
        "error",
      );
    } finally {
      setSaving(false);
    }
  };

  const hapus = async () => {
    if (!noJadwalAsli) return;
    setDeleting(true);
    try {
      await deleteJadwalTraining(noJadwalAsli);
      router.push("/training/jadwal");
    } catch (err) {
      showNotif(
        err instanceof Error ? err.message : "Gagal menghapus jadwal training",
        "error",
      );
      setKonfirmasiHapus(false);
    } finally {
      setDeleting(false);
    }
  };

  return {
    isEdit,
    noJadwalAsli,
    nilaiAwal,
    noJadwalBaru,
    noJadwalLoading,
    detail,
    detailLoading,
    opsi,
    fileAgenda,
    setFileAgenda,
    saving,
    deleting,
    konfirmasiHapus,
    bukaKonfirmasiHapus: () => setKonfirmasiHapus(true),
    tutupKonfirmasiHapus: () => {
      if (!deleting) setKonfirmasiHapus(false);
    },
    hapus,
    notif,
    clearNotif: () => setNotif(null),
    simpan,
    batal: () => router.push("/training/jadwal"),
  };
}
