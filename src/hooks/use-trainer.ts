"use client";

import { useEffect, useState } from "react";
import { useResource } from "@/hooks/use-resource";
import { getTrainerById, trainerService } from "@/lib/services/trainer.service";
import type {
  CreateTrainerRequest,
  Trainer,
  TrainerApi,
  UpdateTrainerRequest,
} from "@/lib/types/trainer";

/** List + paginasi + search + filter status + CRUD trainer. */
export function useTrainers(limit = 10) {
  return useResource<Trainer, number, CreateTrainerRequest, UpdateTrainerRequest>(
    trainerService,
    {
      limit,
      filter: { status: "" },
      pesanGagal: "Gagal mengambil data trainer",
    },
  );
}

/**
 * Detail satu trainer. Endpoint list tidak mengirim alamat, alamat kantor,
 * no telp kantor, dan keterangan — jadi modal detail harus menariknya sendiri.
 */
export function useTrainerById(id: number | null) {
  const [data, setData] = useState<Trainer | null>(null);
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

    getTrainerById(id)
      .then((res) => {
        if (!batal) setData(res);
      })
      .catch((err: unknown) => {
        if (batal) return;
        setError(
          err instanceof Error ? err.message : "Gagal mengambil detail trainer",
        );
      })
      .finally(() => {
        if (!batal) setLoading(false);
      });

    // Cegah hasil permintaan lama menimpa yang baru kalau user cepat
    // berpindah baris.
    return () => {
      batal = true;
    };
  }, [id]);

  return { data, loading, error };
}

export type { Trainer, TrainerApi };
