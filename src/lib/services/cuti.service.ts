import { apiGet, apiGetResponse, apiList, apiPatch, apiPostForm, keFormData } from "@/lib/api/client";
import type {
  CreatePengajuanRequest,
  GetKaryawanCutiResponse,
  GetPengajuanListResponse,
  GetRiwayatResponse,
  JenisIzin,
  KaryawanCutiItem,
  KonfirmasiRequest,
  PengajuanIzin,
  PengajuanIzinListItem,
  RiwayatIzinItem,
  StatusIzin,
} from "@/lib/types/cuti";

export type * from "@/lib/types/cuti";

const BASE = "/api/cuti";

interface ListIzinParams {
  page?: number;
  limit?: number;
  search?: string;
}

interface RiwayatFilters {
  status?: StatusIzin;
  jenisIzin?: JenisIzin;
  tanggalPengajuan?: string;
  tanggalMulai?: string;
}

export const createPengajuan = (payload: CreatePengajuanRequest) =>
  apiPostForm<PengajuanIzin>(BASE, keFormData({ ...payload }), "Gagal membuat pengajuan izin.");

export const getListPengajuan = (params?: ListIzinParams & { jenisIzin?: JenisIzin }) =>
  apiGetResponse<GetPengajuanListResponse>(BASE, params && { ...params }, "Gagal mengambil daftar pengajuan.");

export const getDetailPengajuan = (id: string) =>
  apiGet<PengajuanIzin>(`${BASE}/${encodeURIComponent(id)}`, undefined, "Gagal mengambil detail pengajuan.");

export const konfirmasiPengajuan = (id: string, payload: KonfirmasiRequest) =>
  apiPatch<PengajuanIzin>(`${BASE}/${encodeURIComponent(id)}/konfirmasi`, payload, "Gagal mengonfirmasi pengajuan.");

export const getRiwayatByPegawai = (pegawaiId: string, params?: Omit<ListIzinParams, "search"> & RiwayatFilters) =>
  apiGetResponse<GetRiwayatResponse>(
    `${BASE}/riwayat/${encodeURIComponent(pegawaiId)}`,
    params && { ...params },
    "Gagal mengambil riwayat izin.",
  );

export const getRiwayatAll = (params?: ListIzinParams & RiwayatFilters) =>
  apiGetResponse<GetRiwayatResponse>(`${BASE}/riwayat`, params && { ...params }, "Gagal mengambil riwayat semua izin.");

export const getKaryawanCuti = (params?: ListIzinParams) =>
  apiGetResponse<GetKaryawanCutiResponse>(
    `${BASE}/karyawan-cuti`,
    params && { ...params },
    "Gagal mengambil data karyawan cuti.",
  );

export const daftarPengajuanService = {
  list: (params: ListIzinParams) =>
    apiList<PengajuanIzinListItem>(BASE, { ...params }, "Gagal mengambil daftar pengajuan."),
};

export const riwayatIzinService = {
  list: (params: ListIzinParams) =>
    apiList<RiwayatIzinItem>(`${BASE}/riwayat`, { ...params }, "Gagal mengambil riwayat izin."),
};

export const karyawanCutiService = {
  list: (params: ListIzinParams) =>
    apiList<KaryawanCutiItem>(`${BASE}/karyawan-cuti`, { ...params }, "Gagal mengambil daftar pegawai."),
};
