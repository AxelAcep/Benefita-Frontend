import { apiGet, apiGetResponse, type ListParams } from "@/lib/api/client";
import type { AkunPerusahaan, PengirimanBrosur, RekapAktivitas, RekapDailyAE } from "@/lib/types/bdo-laporan";
import type { PerusahaanTbkPagination } from "@/lib/types/perusahaan-tbk";

type Response<T> = { data: T[]; pagination: PerusahaanTbkPagination };
const list = <T>(path: string, params: ListParams, signal?: AbortSignal) =>
  apiGetResponse<Response<T>>(`/api/bdo/${path}`, params, "Gagal mengambil data BDO.", signal);

export const getAkunPerusahaan = (params: ListParams, signal?: AbortSignal) => list<AkunPerusahaan>("akun-perusahaan", params, signal);
export const getPengirimanBrosur = (params: ListParams, signal?: AbortSignal) => list<PengirimanBrosur>("pengiriman-brosur", params, signal);
export const getRekapHarian = (params: ListParams, signal?: AbortSignal) => list<RekapAktivitas>("rekap-harian", params, signal);
export const getRekapBulanan = (params: ListParams, signal?: AbortSignal) => list<RekapDailyAE>("rekap-bulanan", params, signal);
export const getAkunOpsi = (kategori: string) => apiGet<string[]>("/api/bdo/akun-perusahaan/opsi", { kategori });
