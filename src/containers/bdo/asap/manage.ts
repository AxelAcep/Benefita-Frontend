"use client";

import { useResource } from "@/hooks/use-resource";
import { asapService } from "@/lib/services/bdo.service";
import type { Asap, CreateAsapRequest, UpdateAsapRequest } from "@/lib/types/bdo";

/**
 * Daftar ASAP. Penyaringan menurut pegawai yang login dikerjakan backend,
 * jadi di sini tidak ada logika hak akses.
 */
export function useAsapManage() {
  return useResource<Asap, string, CreateAsapRequest, UpdateAsapRequest>(
    asapService,
    { limit: 10, filter: { kategori: "", status: "" }, pesanGagal: "Gagal mengambil data ASAP." },
  );
}
