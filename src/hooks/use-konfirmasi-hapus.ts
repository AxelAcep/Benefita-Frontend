"use client";

/**
 * Alur hapus dengan konfirmasi: klik tombol, muncul dialog, baru dihapus.
 *
 * Dipisah supaya tiap halaman tidak menulis ulang useState untuk baris yang
 * mau dihapus, keadaan sedang menghapus, dan penanganan errornya.
 */
import { useState } from "react";

export interface UseKonfirmasiHapusOptions<T, Id> {
  /** Fungsi hapus dari useResource. */
  remove: (id: Id) => Promise<void>;
  /** Ambil identitas baris, yang dikirim ke backend. */
  idDari: (row: T) => Id;
  /** Nama baris untuk ditampilkan di dialog, misal nama hotel. */
  namaDari: (row: T) => string;
  onSukses: (nama: string) => void;
  onGagal: (pesan: string) => void;
}

export function useKonfirmasiHapus<T, Id>({
  remove,
  idDari,
  namaDari,
  onSukses,
  onGagal,
}: UseKonfirmasiHapusOptions<T, Id>) {
  const [target, setTarget] = useState<T | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const askDelete = (row: T) => setTarget(row);

  const cancelDelete = () => {
    // Jangan biarkan dialog ditutup di tengah proses hapus.
    if (isDeleting) return;
    setTarget(null);
  };

  const confirmDelete = async () => {
    if (!target) return;

    const nama = namaDari(target);
    setIsDeleting(true);
    try {
      await remove(idDari(target));
      setTarget(null);
      onSukses(nama);
    } catch (err) {
      onGagal(err instanceof Error ? err.message : "Gagal menghapus data.");
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    hapusTarget: target,
    isDeleting,
    namaHapus: target ? namaDari(target) : "",
    askDelete,
    cancelDelete,
    confirmDelete,
  };
}
