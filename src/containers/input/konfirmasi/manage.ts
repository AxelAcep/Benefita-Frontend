"use client";

import { useEffect, useState } from "react";
import { createKonfirmasi, getListKonfirmasi, updateKonfirmasi } from "@/lib/services/konfirmasi.service";
import { getPesertaTrainingById, type PesertaTraining } from "@/lib/services/input.service";
import type { Konfirmasi, UpdateKonfirmasiRequest } from "@/lib/types/konfirmasi";

export function useKonfirmasiManage(noJadwal: string, id: string) {
  const [revision, setRevision] = useState(0);
  const [result, setResult] = useState<{
    revision: number;
    peserta: PesertaTraining | null;
    konfirmasi: Konfirmasi | null;
    error: string | null;
  } | null>(null);
  const pesertaTrainingId = Number(id);
  const valid = /^\d+$/.test(id) && Number.isSafeInteger(pesertaTrainingId) && pesertaTrainingId > 0;

  useEffect(() => {
    if (!valid) return;
    let current = true;
    Promise.all([
      getPesertaTrainingById(id),
      getListKonfirmasi({ pesertaTrainingId, noJadwal, limit: 1 }),
    ]).then(([peserta, list]) => {
      if (!current) return;
      if (peserta.jadwalTraining?.noJadwal !== noJadwal) {
        setResult({ revision, peserta: null, konfirmasi: null, error: "Peserta tidak terdaftar pada jadwal ini." });
        return;
      }
      setResult({ revision, peserta, konfirmasi: list.data[0] ?? null, error: null });
    }, (err: unknown) => {
      if (current) setResult({
        revision,
        peserta: null,
        konfirmasi: null,
        error: err instanceof Error ? err.message : "Gagal memuat data konfirmasi.",
      });
    });
    return () => { current = false; };
  }, [id, noJadwal, pesertaTrainingId, revision, valid]);

  const data = result?.revision === revision ? result : null;

  function simpan(values: UpdateKonfirmasiRequest) {
    const peserta = data?.peserta;
    if (!peserta) throw new Error("Data peserta belum tersedia.");
    const payload = {
      ...values,
      noIndukInstansi: peserta.perusahaan?.noInduk || undefined,
      namaPeserta: peserta.nama,
    };
    return data.konfirmasi
      ? updateKonfirmasi(data.konfirmasi.id, payload)
      : createKonfirmasi({ ...payload, pesertaTrainingId });
  }

  return {
    peserta: data?.peserta ?? null,
    konfirmasi: data?.konfirmasi ?? null,
    error: valid ? data?.error ?? null : "Nomor peserta tidak valid.",
    loading: valid && !data,
    retry: () => setRevision((value) => value + 1),
    simpan,
  };
}
