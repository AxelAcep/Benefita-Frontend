import { useState, useEffect } from "react";
import {
  getBeritaAktif,
  getAllBerita,
  getBeritaById,
  createBerita,
  updateBerita,
  Berita,
  CreateBeritaRequest,
  UpdateBeritaRequest,
} from "@/lib/services/berita.service"; // Sesuaikan path service kamu

// ─────────────────────────────────────────────
// 1. HOOK UNTUK GET ALL (RIWAYAT)
// ─────────────────────────────────────────────
export function useRiwayatBerita() {
  const [data, setData] = useState<Berita[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRiwayat = () => {
    setLoading(true);
    setError(null);
    getAllBerita()
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        setError(err.message || "Gagal mengambil riwayat berita");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRiwayat();
  }, []);

  return { data, loading, error, refresh: fetchRiwayat };
}

// ─────────────────────────────────────────────
// 2. HOOK UNTUK GET ACTIVE BERITA
// ─────────────────────────────────────────────
export function useBeritaAktif() {
  const [data, setData] = useState<Berita[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActive = () => {
    setLoading(true);
    setError(null);
    getBeritaAktif()
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        setError(err.message || "Gagal mengambil berita aktif");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchActive();
  }, []);

  return { data, loading, error, refresh: fetchActive };
}

// ─────────────────────────────────────────────
// 3. HOOK UNTUK ACTION (CREATE, EDIT, GET ONE)
// ─────────────────────────────────────────────
export function useBeritaAction() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [detail, setDetail] = useState<Berita | null>(null);

  // GET ONE BY ID
  const fetchDetail = (id: string) => {
    setLoading(true);
    setError(null);
    getBeritaById(id)
      .then((res) => {
        setDetail(res.data);
      })
      .catch((err) => {
        setError(err.message || "Gagal mengambil detail berita");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // CREATE
  const handleCreate = (
    payload: CreateBeritaRequest,
    callback?: () => void,
  ) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    createBerita(payload)
      .then(() => {
        setSuccess(true);
        if (callback) callback();
      })
      .catch((err) => {
        setError(err.message || "Gagal membuat berita");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // EDIT / UPDATE
  const handleUpdate = (
    id: string,
    payload: UpdateBeritaRequest,
    callback?: () => void,
  ) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    updateBerita(id, payload)
      .then(() => {
        setSuccess(true);
        if (callback) callback();
      })
      .catch((err) => {
        setError(err.message || "Gagal memperbarui berita");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const resetState = () => {
    setError(null);
    setSuccess(false);
    setDetail(null);
  };

  return {
    detail,
    loading,
    error,
    success,
    fetchDetail,
    createBerita: handleCreate,
    updateBerita: handleUpdate,
    resetState,
  };
}
