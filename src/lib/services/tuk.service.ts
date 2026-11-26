/**
 * Service TUK (Tempat Uji Kompetensi).
 *
 * Perakitan URL, pengiriman token, dan penanganan error ada di
 * @/lib/api/client — di sini tinggal endpoint dan tipenya.
 */
import { apiDelete, apiGet, apiList, apiPost, apiPut } from "@/lib/api/client";
import type { CreateTUKRequest, TUK, UpdateTUKRequest } from "@/lib/types/tuk";
import type { ListParams, ListResult } from "@/lib/api/client";

// Tipe pindah ke @/lib/types/tuk. Diekspor ulang di sini supaya file lama
// yang mengimpor dari service tidak ikut rusak.
export type { CreateTUKRequest, TUK, UpdateTUKRequest };

const BASE = "/api/lsp/tuk";

export const getTUKList = (params: ListParams = {}): Promise<ListResult<TUK>> =>
  apiList<TUK>(BASE, params, "Gagal mengambil data TUK");

export const getTUKById = (id: number): Promise<TUK> =>
  apiGet<TUK>(`${BASE}/${id}`, undefined, "Gagal mengambil detail TUK");

export const createTUK = (payload: CreateTUKRequest): Promise<TUK> =>
  apiPost<TUK>(BASE, payload, "Gagal membuat data TUK");

export const updateTUK = (id: number, payload: UpdateTUKRequest): Promise<TUK> =>
  apiPut<TUK>(`${BASE}/${id}`, payload, "Gagal mengubah data TUK");

export const deleteTUK = (id: number): Promise<void> =>
  apiDelete(`${BASE}/${id}`, "Gagal menghapus data TUK");

/** Dibentuk untuk useResource. */
export const tukService = {
  list: getTUKList,
  create: createTUK,
  update: updateTUK,
  remove: deleteTUK,
};
