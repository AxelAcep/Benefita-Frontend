import { apiDelete, apiGet, apiList, apiPost, apiPut } from "@/lib/api/client";
import type { ListParams } from "@/lib/api/client";
import type {
  CreatePermintaanSuratRequest,
  GetPermintaanSuratResponse,
  PermintaanNomorSurat,
  TipeSurat,
  UpdatePermintaanSuratRequest,
} from "@/lib/types/surat";

export type * from "@/lib/types/surat";

const BASE = "/api/permintaan-surat";

const list = (params: ListParams = {}) =>
  apiList<PermintaanNomorSurat>(BASE, params, "Gagal mengambil data permintaan surat.");

// Marketing dan LSP masih memakai hook lama dengan properti pagination.
export async function getListPermintaanSurat(params?: {
  page?: number;
  limit?: number;
  tipe?: TipeSurat;
  search?: string;
}): Promise<GetPermintaanSuratResponse> {
  const { data, ...pagination } = await list(params);
  return { success: true, data, pagination };
}

export const getPermintaanSuratById = (id: number) =>
  apiGet<PermintaanNomorSurat>(`${BASE}/${id}`, undefined, "Gagal mengambil detail permintaan surat.");

export const createPermintaanSurat = (payload: CreatePermintaanSuratRequest) =>
  apiPost<PermintaanNomorSurat>(BASE, payload, "Gagal membuat permintaan surat.");

export const updatePermintaanSurat = (id: number, payload: UpdatePermintaanSuratRequest) =>
  apiPut<PermintaanNomorSurat>(`${BASE}/${id}`, payload, "Gagal memperbarui permintaan surat.");

export const deletePermintaanSurat = (id: number) =>
  apiDelete(`${BASE}/${id}`, "Gagal menghapus permintaan surat.");

export const suratService = {
  list,
  create: createPermintaanSurat,
  update: updatePermintaanSurat,
  remove: deletePermintaanSurat,
};
