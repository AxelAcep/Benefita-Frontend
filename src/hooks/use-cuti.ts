import { useState, useCallback } from "react";
import {
  createPengajuan,
  getListPengajuan,
  getDetailPengajuan,
  konfirmasiPengajuan,
  getRiwayatByPegawai,
  getRiwayatAll,
  getKaryawanCuti,
  type CreatePengajuanRequest,
  type KonfirmasiRequest,
  type JenisIzin,
  type StatusIzin,
  type PengajuanIzin,
  type GetPengajuanListResponse,
  type GetRiwayatResponse,
  type GetKaryawanCutiResponse,
} from "@/lib/services/cuti.service";

// ─────────────────────────────────────────────
// 1. CREATE PENGAJUAN
// ─────────────────────────────────────────────

export function useCreatePengajuan() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<PengajuanIzin | null>(null);

  const mutate = useCallback(async (payload: CreatePengajuanRequest) => {
    setLoading(true);
    setError(null);
    try {
      const result = await createPengajuan(payload);
      setData(result);
      return result;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { mutate, loading, error, data };
}

// ─────────────────────────────────────────────
// 2. GET LIST PENGAJUAN
// ─────────────────────────────────────────────

export function useGetListPengajuan() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<GetPengajuanListResponse | null>(null);

  const fetch = useCallback(
    async (params?: {
      page?: number;
      limit?: number;
      search?: string;
      jenisIzin?: JenisIzin;
    }) => {
      setLoading(true);
      setError(null);
      try {
        const result = await getListPengajuan(params);
        setData(result);
        return result;
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Terjadi kesalahan";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { fetch, loading, error, data };
}

// ─────────────────────────────────────────────
// 3. GET DETAIL PENGAJUAN
// ─────────────────────────────────────────────

export function useGetDetailPengajuan() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<PengajuanIzin | null>(null);

  const fetch = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await getDetailPengajuan(id);
      setData(result);
      return result;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { fetch, loading, error, data };
}

// ─────────────────────────────────────────────
// 4. KONFIRMASI PENGAJUAN
// ─────────────────────────────────────────────

export function useKonfirmasiPengajuan() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<PengajuanIzin | null>(null);

  const mutate = useCallback(async (id: string, payload: KonfirmasiRequest) => {
    setLoading(true);
    setError(null);
    try {
      const result = await konfirmasiPengajuan(id, payload);
      setData(result);
      return result;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { mutate, loading, error, data };
}

// ─────────────────────────────────────────────
// 5. GET RIWAYAT BY PEGAWAI
// ─────────────────────────────────────────────

export function useGetRiwayatByPegawai() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<GetRiwayatResponse | null>(null);

  const fetch = useCallback(
    async (
      pegawaiId: string,
      params?: {
        page?: number;
        limit?: number;
        status?: StatusIzin;
        jenisIzin?: JenisIzin;
        tanggalPengajuan?: string;
        tanggalMulai?: string;
      },
    ) => {
      setLoading(true);
      setError(null);
      try {
        const result = await getRiwayatByPegawai(pegawaiId, params);
        setData(result);
        return result;
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Terjadi kesalahan";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { fetch, loading, error, data };
}

// ─────────────────────────────────────────────
// 6. GET RIWAYAT ALL
// ─────────────────────────────────────────────

export function useGetRiwayatAll() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<GetRiwayatResponse | null>(null);

  const fetch = useCallback(
    async (params?: {
      page?: number;
      limit?: number;
      search?: string;
      status?: StatusIzin;
      jenisIzin?: JenisIzin;
      tanggalPengajuan?: string;
      tanggalMulai?: string;
    }) => {
      setLoading(true);
      setError(null);
      try {
        const result = await getRiwayatAll(params);
        setData(result);
        return result;
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Terjadi kesalahan";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { fetch, loading, error, data };
}

// ─────────────────────────────────────────────
// 7. GET KARYAWAN CUTI
// ─────────────────────────────────────────────

export function useGetKaryawanCuti() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<GetKaryawanCutiResponse | null>(null);

  const fetch = useCallback(
    async (params?: { page?: number; limit?: number; search?: string }) => {
      setLoading(true);
      setError(null);
      try {
        const result = await getKaryawanCuti(params);
        setData(result);
        return result;
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Terjadi kesalahan";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { fetch, loading, error, data };
}
