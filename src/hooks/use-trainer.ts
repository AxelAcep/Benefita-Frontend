// hooks/useTrainer.ts — update referensi jadi string[]

import { useState, useEffect, useCallback } from "react";
import {
  getTrainers,
  getTrainerById,
  createTrainer,
  updateTrainer,
  type Trainer as TrainerAPI,
  type TrainerListItem,
  type TrainerPagination,
  type CreateTrainerRequest,
  type UpdateTrainerRequest,
} from "@/lib/services/trainer.service";
import type { Trainer } from "@/lib/types/trainer-types";

// ── mapping API response → local Trainer type ──
function mapListItem(item: TrainerListItem): Trainer {
  return {
    id: item.id,
    kode: item.kode,
    nama: item.nama,
    hp: item.telp ?? "",
    email: item.email ?? "",
    kantor: item.kantor ?? "",
    alamat: "", // tidak ada di list, diisi pas getOne
    alamatKantor: "",
    noTelpKantor: "",
    referensi: item.referensi
      ? item.referensi.split(",").map((s) => s.trim())
      : [],
    subyekKhusus: item.subjekKhusus ?? null,
    keterangan: null,
    tugas: item.tugas ?? null,
    jumlahHari: item.jumlahHari ?? 0,
    statusAktif: item.statusAktif,
  };
}

function mapDetail(item: TrainerAPI): Trainer {
  return {
    id: item.id,
    kode: item.kode,
    nama: item.nama,
    hp: item.telp ?? "",
    email: item.email ?? "",
    kantor: item.kantor ?? "",
    alamat: item.alamat ?? "",
    alamatKantor: item.alamatKantor ?? "",
    noTelpKantor: item.noTelpKantor ?? "",
    referensi: item.referensi
      ? item.referensi.split(",").map((s) => s.trim())
      : [],
    subyekKhusus: item.subjekKhusus ?? null,
    keterangan: item.keterangan ?? null,
    tugas: item.tugas ?? null,
    jumlahHari: 0, // tidak ada di detail response
    statusAktif: item.statusAktif,
  };
}

// ─────────────────────────────────────────────
// GET LIST
// ─────────────────────────────────────────────

export function useTrainers() {
  const [data, setData] = useState<Trainer[]>([]);
  const [pagination, setPagination] = useState<TrainerPagination>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"aktif" | "nonaktif" | "">("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getTrainers({
        page,
        limit,
        search,
        status: status || undefined,
      });
      setData(res.data.map(mapListItem));
      setPagination(res.pagination);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, status]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusChange = (value: "aktif" | "nonaktif" | "") => {
    setStatus(value);
    setPage(1);
  };

  return {
    data,
    pagination,
    loading,
    error,
    search,
    status,
    page,
    limit,
    setPage,
    setLimit,
    handleSearch,
    handleStatusChange,
    refresh: fetch,
  };
}

// ─────────────────────────────────────────────
// GET ONE
// ─────────────────────────────────────────────

export function useTrainerById(id: number | null) {
  const [data, setData] = useState<Trainer | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setData(null);
      return;
    }
    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getTrainerById(id);
        setData(mapDetail(res));
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  return { data, loading, error };
}

// ─────────────────────────────────────────────
// CREATE
// ─────────────────────────────────────────────

export function useCreateTrainer() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async (
    payload: CreateTrainerRequest,
    onSuccess?: () => void,
  ) => {
    setLoading(true);
    setError(null);
    try {
      await createTrainer(payload);
      onSuccess?.();
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
}

// ─────────────────────────────────────────────
// UPDATE
// ─────────────────────────────────────────────

export function useUpdateTrainer() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async (
    id: number,
    payload: UpdateTrainerRequest,
    onSuccess?: () => void,
  ) => {
    setLoading(true);
    setError(null);
    try {
      await updateTrainer(id, payload);
      onSuccess?.();
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
}
