/**
 * Service Hotel.
 *
 * Perakitan URL, pengiriman token, dan penanganan error ada di
 * @/lib/api/client — di sini tinggal endpoint dan tipenya.
 *
 */
import { apiDelete, apiGet, apiList, apiPost, apiPut } from "@/lib/api/client";
import type {
  CreateHotelRequest,
  Hotel,
  UpdateHotelRequest,
} from "@/lib/types/hotel";
import type { ListParams, ListResult } from "@/lib/api/client";

// Tipe pindah ke @/lib/types/hotel. Diekspor ulang di sini supaya file lama
// yang mengimpor dari service tidak ikut rusak.
export type { CreateHotelRequest, Hotel, UpdateHotelRequest };

const BASE = "/api/training/hotel";

export const getHotels = (
  params: ListParams = {},
): Promise<ListResult<Hotel>> =>
  apiList<Hotel>(BASE, params, "Gagal mengambil data hotel");

export const getHotelById = (kodeHotel: string): Promise<Hotel> =>
  apiGet<Hotel>(`${BASE}/${kodeHotel}`, undefined, "Gagal mengambil detail hotel");

/** Daftar kota yang benar-benar ada di tabel hotel, untuk mengisi dropdown. */
export const getHotelKotaList = (): Promise<string[]> =>
  apiGet<string[]>(`${BASE}/kota`, undefined, "Gagal mengambil daftar kota");

export const createHotel = (payload: CreateHotelRequest): Promise<Hotel> =>
  apiPost<Hotel>(BASE, payload, "Gagal membuat data hotel");

/** `kodeHotel` di sini adalah kode ASLI baris yang diedit, bukan kode baru. */
export const updateHotel = (
  kodeHotel: string,
  payload: UpdateHotelRequest,
): Promise<Hotel> =>
  apiPut<Hotel>(`${BASE}/${kodeHotel}`, payload, "Gagal mengubah data hotel");

/** `kodeHotel` adalah kode baris yang dihapus, sama seperti updateHotel. */
export const deleteHotel = (kodeHotel: string): Promise<void> =>
  apiDelete(`${BASE}/${kodeHotel}`, "Gagal menghapus data hotel");

/** Dibentuk untuk useResource. */
export const hotelService = {
  list: getHotels,
  create: createHotel,
  update: updateHotel,
  remove: deleteHotel,
};
