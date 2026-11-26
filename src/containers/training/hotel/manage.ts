"use client";

/**
 * Keadaan dan aksi halaman Hotel: buka/tutup modal, baris yang sedang diedit,
 * proses simpan, filter kota, dan notifikasi.
 */
import { useState } from "react";
import { useKonfirmasiHapus } from "@/hooks/use-konfirmasi-hapus";
import { useHotels, useKotaHotel } from "@/hooks/use-hotel";
import type { Hotel } from "@/lib/types/hotel";
import type { HotelFormValues } from "./form";

export const UKURAN_HALAMAN = 10;

interface Notif {
  message: string;
  type: "success" | "error";
  key: number;
}

/** Angka dari backend jadi string untuk input; null jadi string kosong. */
const keTeks = (v: number | null | undefined) =>
  v === null || v === undefined ? "" : String(v);

function keForm(row: Hotel): HotelFormValues {
  return {
    kodeHotel: row.kodeHotel,
    namaHotel: row.namaHotel,
    alamat: row.alamat,
    kota: row.kota,
    telepon: row.telepon,
    fax: row.fax ?? "",
    pubRate: keTeks(row.pubRate),
    corRate: keTeks(row.corRate),
  };
}

/** String kosong jadi undefined; sisanya jadi angka. */
function keAngka(v: string | undefined): number | undefined {
  if (!v) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

export function useHotelManage() {
  const resource = useHotels(UKURAN_HALAMAN);
  const { kotaList } = useKotaHotel();

  const [modalOpen, setModalOpen] = useState(false);
  // Kode ASLI baris yang diedit. Backend mencari barisnya dengan kode ini,
  // jadi tidak boleh diambil dari isian formulir yang bisa saja sudah diubah.
  const [editKode, setEditKode] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<HotelFormValues | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [notif, setNotif] = useState<Notif | null>(null);

  const showNotif = (message: string, type: Notif["type"]) =>
    setNotif({ message, type, key: Date.now() });

  const openAdd = () => {
    setEditKode(null);
    setEditValues(null);
    setModalOpen(true);
  };

  const openEdit = (row: Hotel) => {
    setEditKode(row.kodeHotel);
    setEditValues(keForm(row));
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditKode(null);
    setEditValues(null);
  };

  const save = async (data: HotelFormValues) => {
    setIsSaving(true);
    try {
      const isi = {
        namaHotel: data.namaHotel,
        alamat: data.alamat,
        kota: data.kota,
        telepon: data.telepon,
        fax: data.fax || undefined,
        pubRate: keAngka(data.pubRate),
        corRate: keAngka(data.corRate),
      };

      if (editKode !== null) {
        // Pakai editKode, bukan data.kodeHotel. Kalau memakai isian formulir,
        // permintaan update nyasar ke kode yang belum ada di database.
        await resource.update(editKode, isi);
        showNotif("Data hotel berhasil diperbarui", "success");
      } else {
        await resource.create({ kodeHotel: data.kodeHotel, ...isi });
        showNotif("Data hotel berhasil ditambahkan", "success");
      }

      closeModal();
    } catch (err) {
      showNotif(
        err instanceof Error ? err.message : "Gagal menyimpan data hotel",
        "error",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const hapus = useKonfirmasiHapus({
    remove: resource.remove,
    idDari: (row: Hotel) => row.kodeHotel,
    namaDari: (row: Hotel) => row.namaHotel,
    onSukses: (nama) => showNotif(`Data hotel "${nama}" berhasil dihapus`, "success"),
    onGagal: (pesan) => showNotif(pesan, "error"),
  });

  return {
    ...resource,
    ...hapus,
    kotaList,
    kota: resource.filter.kota ?? "",
    setKota: (v: string) => resource.setFilter("kota", v),
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
