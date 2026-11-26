/**
 * Service Berita.
 *
 * Perakitan URL, pengiriman token, dan penanganan error ada di
 * @/lib/api/client — di sini tinggal endpoint dan tipenya.
 *
 * Endpoint riwayat tidak berhalaman: backend mengembalikan seluruh berita
 * sekaligus, jadi pencarian dan paginasi dilakukan di sisi halaman.
 */
import { apiGet, apiPost, apiPatch } from "@/lib/api/client";
import type {
  Berita,
  CreateBeritaRequest,
  UpdateBeritaRequest,
} from "@/lib/types/berita";

// Tipe pindah ke @/lib/types/berita. Diekspor ulang supaya file lama yang
// mengimpor dari service tidak ikut rusak.
export type { Berita, CreateBeritaRequest, UpdateBeritaRequest };

const BASE = "/api/berita";

/** Seluruh berita, termasuk yang sudah lewat periodenya. */
export const getAllBerita = (): Promise<Berita[]> =>
  apiGet<Berita[]>(`${BASE}/riwayat`, undefined, "Gagal mengambil data berita");

export const getBeritaById = (id: string): Promise<Berita> =>
  apiGet<Berita>(
    `${BASE}/riwayat/${id}`,
    undefined,
    "Gagal mengambil detail berita",
  );

export const createBerita = (payload: CreateBeritaRequest): Promise<Berita> =>
  apiPost<Berita>(BASE, payload, "Gagal membuat berita");

export const updateBerita = (
  id: string,
  payload: UpdateBeritaRequest,
): Promise<Berita> =>
  apiPatch<Berita>(`${BASE}/${id}`, payload, "Gagal mengubah berita");
