/**
 * Service Peserta Uji.
 *
 * Perakitan URL, pengiriman token, dan penanganan error ada di
 * @/lib/api/client — di sini tinggal endpoint dan tipenya.
 */
import { apiGet, apiList, apiPatch } from "@/lib/api/client";
import {
  CHECKLIST_FIELDS,
  type AssignPelaksanaanPayload,
  type ChecklistField,
  type LaporanKlhkRow,
  type PesertaUji,
  type UpdateHasilPayload,
} from "@/lib/types/peserta-uji";
import type { ListParams, ListResult } from "@/lib/api/client";

// Tipe dan konstanta pindah ke @/lib/types/peserta-uji. Diekspor ulang
// supaya file lama yang mengimpor dari service tidak ikut rusak.
export { CHECKLIST_FIELDS };
export type {
  AssignPelaksanaanPayload,
  ChecklistField,
  LaporanKlhkRow,
  PesertaUji,
  UpdateHasilPayload,
};

const BASE = "/api/lsp/peserta-uji";

/** Tanpa filter status, backend hanya mengembalikan CALON dan SIAP_UJI. */
export const getPesertaUjiList = (
  params: ListParams = {},
): Promise<ListResult<PesertaUji>> =>
  apiList<PesertaUji>(BASE, params, "Gagal mengambil data peserta uji");

export const getPesertaUjiById = (id: number): Promise<PesertaUji> =>
  apiGet<PesertaUji>(
    `${BASE}/${id}`,
    undefined,
    "Gagal mengambil detail peserta uji",
  );

export const updatePesertaUjiChecklist = (
  id: number,
  payload: Partial<Record<ChecklistField, boolean>>,
): Promise<PesertaUji> =>
  apiPatch<PesertaUji>(
    `${BASE}/${id}/checklist`,
    payload,
    "Gagal memperbarui checklist",
  );

/** Tetapkan TUK, asesor, dan tanggal pelaksanaan uji. */
export const assignPesertaUjiPelaksanaan = (
  id: number,
  payload: AssignPelaksanaanPayload,
): Promise<PesertaUji> =>
  apiPatch<PesertaUji>(
    `${BASE}/${id}/assign`,
    payload,
    "Gagal meng-assign pelaksanaan uji",
  );

/** Simpan hasil uji K atau BK, berikut nomor sertifikat kalau K. */
export const updatePesertaUjiHasil = (
  id: number,
  payload: UpdateHasilPayload,
): Promise<PesertaUji> =>
  apiPatch<PesertaUji>(
    `${BASE}/${id}/hasil`,
    payload,
    "Gagal menyimpan hasil uji",
  );

/** Rekap jumlah K, BK, dan total per tanggal ujian dan skema. */
export const getLaporanKlhk = (params: ListParams = {}): Promise<LaporanKlhkRow[]> =>
  apiGet<LaporanKlhkRow[]>(
    "/api/lsp/laporan/klhk",
    params,
    "Gagal mengambil laporan KLHK",
  );
