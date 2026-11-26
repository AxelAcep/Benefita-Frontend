/**
 * Service ASAP dan Tugas (menu BDO & Aktivitas).
 *
 * Backend sudah menyaring baris menurut pegawai yang login: selain
 * SUPER_ADMIN, seseorang hanya menerima baris yang menyangkut dirinya.
 * Jadi di sini tidak ada penyaringan tambahan.
 */
import { apiDelete, apiGet, apiList, apiPost, apiPut } from "@/lib/api/client";
import type { ListParams, ListResult } from "@/lib/api/client";
import type {
  Asap,
  CreateAsapRequest,
  CreateTugasRequest,
  Pengingat,
  Tugas,
  UpdateAsapRequest,
  UpdateTugasRequest,
} from "@/lib/types/bdo";

export type {
  Asap,
  Tugas,
  Pengingat,
  CreateAsapRequest,
  UpdateAsapRequest,
  CreateTugasRequest,
  UpdateTugasRequest,
};

const ASAP = "/api/bdo/asap";
const TUGAS = "/api/bdo/tugas";

export const getAsapList = (params: ListParams = {}): Promise<ListResult<Asap>> =>
  apiList<Asap>(ASAP, params, "Gagal mengambil data ASAP");

export const createAsap = (payload: CreateAsapRequest): Promise<Asap> =>
  apiPost<Asap>(ASAP, payload, "Gagal membuat ASAP");

export const updateAsap = (id: string, payload: UpdateAsapRequest): Promise<Asap> =>
  apiPut<Asap>(`${ASAP}/${id}`, payload, "Gagal mengubah ASAP");

export const deleteAsap = (id: string): Promise<void> =>
  apiDelete(`${ASAP}/${id}`, "Gagal menghapus ASAP");

export const getTugasList = (params: ListParams = {}): Promise<ListResult<Tugas>> =>
  apiList<Tugas>(TUGAS, params, "Gagal mengambil data tugas");

export const createTugas = (payload: CreateTugasRequest): Promise<Tugas> =>
  apiPost<Tugas>(TUGAS, payload, "Gagal membuat tugas");

export const updateTugas = (
  id: string,
  payload: UpdateTugasRequest,
): Promise<Tugas> =>
  apiPut<Tugas>(`${TUGAS}/${id}`, payload, "Gagal mengubah tugas");

export const deleteTugas = (id: string): Promise<void> =>
  apiDelete(`${TUGAS}/${id}`, "Gagal menghapus tugas");

/** Isi pop-up pengingat di dashboard. */
export const getPengingat = (): Promise<Pengingat> =>
  apiGet<Pengingat>("/api/bdo/pengingat", undefined, "Gagal mengambil pengingat");

/** Dibentuk untuk useResource. */
export const asapService = {
  list: getAsapList,
  create: createAsap,
  update: updateAsap,
  remove: deleteAsap,
};

export const tugasService = {
  list: getTugasList,
  create: createTugas,
  update: updateTugas,
  remove: deleteTugas,
};
