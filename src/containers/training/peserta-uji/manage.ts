"use client";

/**
 * Keadaan halaman Peserta Uji: filter tanggal dan pencarian, serta
 * pencentangan kelengkapan berkas.
 *
 * Tidak lewat useResource karena pencentangan diterapkan secara optimistik
 * — baris diubah lebih dulu lalu disimpan ke server, dan dikembalikan kalau
 * gagal. Itu butuh akses langsung ke state datanya, yang tidak dibuka
 * useResource.
 */
import { useState } from "react";
import { usePesertaUji } from "@/hooks/use-peserta-uji";
import type { ChecklistField, PesertaUji } from "@/lib/types/peserta-uji";

interface Notif {
  message: string;
  type: "success" | "error";
  key: number;
}

export function usePesertaUjiManage() {
  const resource = usePesertaUji();
  const [notif, setNotif] = useState<Notif | null>(null);

  const toggle = async (row: PesertaUji, field: ChecklistField) => {
    try {
      await resource.toggleChecklist(row.id, field, !row[field]);
    } catch (err) {
      // Hook sudah mengembalikan centangnya, tapi dulu kegagalan itu tidak
      // pernah sampai ke user: centang berkedip balik tanpa penjelasan.
      setNotif({
        message:
          err instanceof Error
            ? err.message
            : `Gagal menyimpan kelengkapan berkas ${row.nama}.`,
        type: "error",
        key: Date.now(),
      });
    }
  };

  return {
    ...resource,
    notif,
    clearNotif: () => setNotif(null),
    toggle,
  };
}
