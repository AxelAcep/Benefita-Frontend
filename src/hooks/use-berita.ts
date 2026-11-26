"use client";

import { useCallback, useEffect, useState } from "react";
import {
  createBerita,
  getAllBerita,
  getBeritaById,
  updateBerita,
} from "@/lib/services/berita.service";
import type {
  Berita,
  CreateBeritaRequest,
  UpdateBeritaRequest,
} from "@/lib/types/berita";

/**
 * Seluruh riwayat berita. Endpointnya tidak berhalaman, jadi pencarian dan
 * paginasi dikerjakan di halaman.
 */
export function useRiwayatBerita() {
  const [data, setData] = useState<Berita[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await getAllBerita());
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal mengambil data berita",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

/** Detail satu berita, untuk mengisi formulir saat mode edit. */
export function useBeritaById(id: string | null) {
  const [data, setData] = useState<Berita | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setData(null);
      setError(null);
      return;
    }

    let batal = false;
    setLoading(true);
    setError(null);

    getBeritaById(id)
      .then((res) => {
        if (!batal) setData(res);
      })
      .catch((err: unknown) => {
        if (batal) return;
        setError(
          err instanceof Error ? err.message : "Gagal mengambil detail berita",
        );
      })
      .finally(() => {
        if (!batal) setLoading(false);
      });

    return () => {
      batal = true;
    };
  }, [id]);

  return { data, loading, error };
}

/** Simpan berita, baru maupun perubahan. */
export function useBeritaAction() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const simpan = async (
    id: string | null,
    payload: CreateBeritaRequest | UpdateBeritaRequest,
  ) => {
    setLoading(true);
    setError(null);
    try {
      if (id) {
        await updateBerita(id, payload);
      } else {
        await createBerita(payload as CreateBeritaRequest);
      }
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan berita");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { simpan, loading, error };
}
