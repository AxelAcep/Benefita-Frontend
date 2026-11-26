"use client";

import { useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useDaftarSurat } from "@/hooks/use-daftar-surat";
import { useKonfirmasiHapus } from "@/hooks/use-konfirmasi-hapus";
import { getUserDetail } from "@/lib/services/login.service";
import type { PermintaanNomorSurat, TipeSurat } from "@/lib/types/surat";
import type { SuratFormValues } from "./form";

interface Notif {
  message: string;
  type: "success" | "error";
  key: number;
}

export function useSuratManage(tipe: TipeSurat) {
  const surat = useDaftarSurat(tipe);
  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [editRow, setEditRow] = useState<PermintaanNomorSurat | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [notif, setNotif] = useState<Notif | null>(null);

  const showNotif = (message: string, type: Notif["type"]) =>
    setNotif({ message, type, key: Date.now() });

  const formValues = useMemo(() => editRow && ({
    keterangan: editRow.keterangan ?? "",
    tujuanNoInduk: editRow.tujuanNoInduk ?? "",
  }), [editRow]);

  const openForm = (row: PermintaanNomorSurat | null) => {
    setEditRow(row);
    setSaveError(null);
    setModalOpen(true);
  };

  const closeForm = () => {
    setModalOpen(false);
    setEditRow(null);
  };

  const save = async (data: SuratFormValues) => {
    setSaveError(null);
    setIsSaving(true);
    try {
      if (editRow) {
        await surat.update(editRow.id, data);
        showNotif("Permintaan surat berhasil diperbarui.", "success");
      } else {
        if (!user) throw new Error("Sesi pengguna tidak tersedia.");
        const { pegawaiId } = await getUserDetail(user.id);
        if (!pegawaiId) throw new Error("Data pengirim tidak ditemukan.");
        await surat.create({ ...data, tipe, pengirimId: pegawaiId });
        showNotif("Permintaan surat berhasil dibuat.", "success");
      }
      closeForm();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Gagal menyimpan permintaan surat.");
    } finally {
      setIsSaving(false);
    }
  };

  const hapus = useKonfirmasiHapus({
    remove: surat.remove,
    idDari: (row: PermintaanNomorSurat) => row.id,
    namaDari: (row: PermintaanNomorSurat) => row.noSurat,
    onSukses: (noSurat) => showNotif(`Permintaan surat ${noSurat} berhasil dihapus.`, "success"),
    onGagal: (pesan) => showNotif(pesan, "error"),
  });

  return {
    ...surat,
    ...hapus,
    modalOpen,
    formValues,
    isSaving,
    saveError,
    notif,
    clearNotif: () => setNotif(null),
    openForm,
    closeForm,
    save,
  };
}
