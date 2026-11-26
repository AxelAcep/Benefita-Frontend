"use client";

import { useEffect, useState } from "react";
import { useResource } from "@/hooks/use-resource";
import {
  getJudulTrainingTipeList,
  judulTrainingService,
} from "@/lib/services/judul-training.service";
import type {
  CreateJudulTrainingRequest,
  JudulTrainingListItem,
  UpdateJudulTrainingRequest,
} from "@/lib/types/judul-training";

/** List + paginasi + search + filter tipe dan kode + CRUD judul training. */
export function useJudulTrainingList(limit = 10) {
  return useResource<
    JudulTrainingListItem,
    number,
    CreateJudulTrainingRequest,
    UpdateJudulTrainingRequest
  >(judulTrainingService, {
    limit,
    filter: { tipe: "", kode: "" },
    pesanGagal: "Gagal mengambil data judul training",
  });
}

/**
 * Daftar tipe untuk dropdown filter dan formulir, diambil dari database.
 * Sebelumnya dua dropdown di halaman yang sama memakai daftar dipaku yang
 * berbeda, dan keduanya tidak cocok dengan isi database.
 */
export function useTipeJudulTraining() {
  const [tipeList, setTipeList] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let batal = false;
    setLoading(true);

    getJudulTrainingTipeList()
      .then((list) => {
        if (!batal) setTipeList(list);
      })
      // Dropdown kosong lebih baik daripada halaman gagal dimuat.
      .catch(() => {
        if (!batal) setTipeList([]);
      })
      .finally(() => {
        if (!batal) setLoading(false);
      });

    return () => {
      batal = true;
    };
  }, []);

  return { tipeList, loading };
}
