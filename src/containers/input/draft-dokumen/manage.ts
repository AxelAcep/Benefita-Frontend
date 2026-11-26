"use client";

import { useEffect, useState } from "react";
import { getPesertaTrainingById, type PesertaTraining } from "@/lib/services/input.service";

export function useDraftDokumen(noJadwal: string, idPeserta?: string) {
  const [revision, setRevision] = useState(0);
  const [state, setState] = useState<{
    key: string;
    peserta: PesertaTraining | null;
    error: string | null;
  } | null>(null);
  const key = JSON.stringify([noJadwal, idPeserta, revision]);
  const valid = Boolean(idPeserta && /^\d+$/.test(idPeserta));

  useEffect(() => {
    if (!idPeserta || !valid) return;
    let current = true;
    getPesertaTrainingById(idPeserta).then(
      (peserta) => {
        if (!current) return;
        if (peserta.jadwalTraining?.noJadwal !== noJadwal) {
          setState({ key, peserta: null, error: "Peserta tidak terdaftar pada jadwal ini." });
          return;
        }
        setState({ key, peserta, error: null });
      },
      (error: unknown) => {
        if (current) setState({
          key,
          peserta: null,
          error: error instanceof Error ? error.message : "Gagal memuat peserta.",
        });
      },
    );
    return () => { current = false; };
  }, [idPeserta, key, noJadwal, valid]);

  const result = state?.key === key ? state : null;
  return {
    peserta: result?.peserta ?? null,
    error: valid ? result?.error ?? null : "Nomor peserta tidak valid.",
    loading: valid && !result,
    canRetry: valid,
    retry: () => setRevision((value) => value + 1),
  };
}
