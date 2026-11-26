/**
 * Service Asesor.
 *
 * Perakitan URL, pengiriman token, dan penanganan error ada di
 * @/lib/api/client — di sini tinggal endpoint dan tipenya.
 */
import { apiDelete, apiGet, apiList, apiPost, apiPut } from "@/lib/api/client";
import type {
  Asesor,
  CreateAsesorRequest,
  UpdateAsesorRequest,
} from "@/lib/types/asesor";
import type { ListParams, ListResult } from "@/lib/api/client";

// Tipe pindah ke @/lib/types/asesor. Diekspor ulang di sini supaya file lama
// yang mengimpor dari service tidak ikut rusak.
export type { Asesor, CreateAsesorRequest, UpdateAsesorRequest };

const BASE = "/api/lsp/asesor";

export const getAsesorList = (
  params: ListParams = {},
): Promise<ListResult<Asesor>> =>
  apiList<Asesor>(BASE, params, "Gagal mengambil data asesor");

export const getAsesorById = (id: number): Promise<Asesor> =>
  apiGet<Asesor>(`${BASE}/${id}`, undefined, "Gagal mengambil detail asesor");

export const createAsesor = (payload: CreateAsesorRequest): Promise<Asesor> =>
  apiPost<Asesor>(BASE, payload, "Gagal membuat data asesor");

export const updateAsesor = (
  id: number,
  payload: UpdateAsesorRequest,
): Promise<Asesor> =>
  apiPut<Asesor>(`${BASE}/${id}`, payload, "Gagal mengubah data asesor");

export const deleteAsesor = (id: number): Promise<void> =>
  apiDelete(`${BASE}/${id}`, "Gagal menghapus data asesor");

/** Dibentuk untuk useResource. */
export const asesorService = {
  list: getAsesorList,
  create: createAsesor,
  update: updateAsesor,
  remove: deleteAsesor,
};
