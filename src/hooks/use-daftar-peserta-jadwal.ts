"use client";

import { useEffect, useState } from "react";
import { getPesertaTraining, type GetPesertaTrainingResponse } from "@/lib/services/input.service";

const LIMIT = 10;

export function useDaftarPesertaJadwal(noJadwal: string) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [revision, setRevision] = useState(0);
  const [result, setResult] = useState<{
    key: string;
    noJadwal: string;
    data: GetPesertaTrainingResponse | null;
    error: string | null;
  } | null>(null);

  const query = search.trim();
  const key = JSON.stringify([noJadwal, page, query, revision]);

  useEffect(() => {
    let active = true;
    getPesertaTraining(noJadwal, { page, limit: LIMIT, search: query }).then(
      (data) => {
        if (active) setResult({ key, noJadwal, data, error: null });
      },
      (err: unknown) => {
        if (active) setResult({
          key,
          noJadwal,
          data: null,
          error: err instanceof Error ? err.message : "Gagal mengambil data peserta.",
        });
      },
    );
    return () => { active = false; };
  }, [key, noJadwal, page, query]);

  const current = result?.key === key ? result : null;
  return {
    rows: current?.data?.data ?? [],
    meta: result?.noJadwal === noJadwal ? result.data?.meta ?? null : null,
    jadwal: result?.noJadwal === noJadwal ? result.data?.jadwal ?? null : null,
    error: current?.error ?? null,
    loading: !current,
    refetch: () => setRevision((value) => value + 1),
    page,
    setPage,
    limit: LIMIT,
    search,
    changeSearch(value: string) {
      setSearch(value);
      setPage(1);
    },
  };
}
