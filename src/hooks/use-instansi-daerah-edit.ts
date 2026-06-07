// hooks/use-instansi-daerah-edit.ts
"use client";

import { useState, useEffect } from "react";
import {
  getOneTabPerusahaan,
  updateTabPerusahaan,
} from "@/lib/services/new.perusahaan.service";

import type { InstansiDaerahFormData } from "@/app/database/instansi-daerah/(form)/card-instansi-daerah";
import type { LokasiPemdaFormData } from "@/app/database/instansi-daerah/(form)/card-lokasi-pemda";
import type { KontakFormData } from "@/app/database/instansi-daerah/(form)/card-kontak";
import type { InformasiInstansiFormData } from "@/app/database/instansi-daerah/(form)/card-informasi-instansi";
import type { TrainingFormData } from "@/app/database/instansi-daerah/(form)/card-training";
import type { PrioritasFormData } from "@/app/database/instansi-daerah/(form)/card-prioritas";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export interface InstansiDaerahFormState {
  instansiDaerah: InstansiDaerahFormData;
  lokasi: LokasiPemdaFormData;
  kontak: KontakFormData;
  informasiInstansi: InformasiInstansiFormData;
  training: TrainingFormData;
  prioritas: PrioritasFormData;
}

// ─────────────────────────────────────────────
// MAPPER: Backend → Frontend
// ─────────────────────────────────────────────

function mapToFormState(raw: any): InstansiDaerahFormState {
  return {
    instansiDaerah: {
      instansi: raw.instansi ?? "",
      kode: raw.kode ?? "",
    },
    lokasi: {
      kotaKabupaten: raw.kotaKabupaten ?? "",
      provinsi: raw.provinsi ?? "",
      alamat: raw.alamat ?? "",
    },
    kontak: {
      telpon: raw.telp ?? "",
      fax: raw.fax ?? "",
      email: raw.email ?? "",
    },
    informasiInstansi: {
      tender1: raw.tender1 ?? "",
      tender2: raw.tender2 ?? "",
      tender3: raw.tender3 ?? "",
      keterangan: raw.ket ?? "",
    },
    training: {
      kebutuhanTraining: raw.butuhTraining ?? "",
      yangPernahDiikuti: raw.pelatihanDiikuti ?? "",
      fasilitas: raw.fasilitas ?? "",
    },
    prioritas: {
      prioritasMANN: raw.prioritasMa ?? "",
      prioritasAE: raw.prioritasAe ?? "",
    },
  };
}

// ─────────────────────────────────────────────
// MAPPER: Frontend → Backend
// ─────────────────────────────────────────────

function mapToPayload(form: InstansiDaerahFormState) {
  return {
    // INSTANSI DAERAH
    instansi: form.instansiDaerah.instansi,
    company: form.instansiDaerah.instansi,
    kode: form.instansiDaerah.kode,

    // LOKASI
    kotaKabupaten: form.lokasi.kotaKabupaten,
    provinsi: form.lokasi.provinsi,
    alamat: form.lokasi.alamat,

    // KONTAK
    telp: form.kontak.telpon,
    fax: form.kontak.fax,
    email: form.kontak.email,

    // INFORMASI INSTANSI
    tender1: form.informasiInstansi.tender1,
    tender2: form.informasiInstansi.tender2,
    tender3: form.informasiInstansi.tender3,
    ket: form.informasiInstansi.keterangan,

    // TRAINING
    butuhTraining: form.training.kebutuhanTraining,
    pelatihanDiikuti: form.training.yangPernahDiikuti,
    fasilitas: form.training.fasilitas,

    // PRIORITAS
    prioritasMa: form.prioritas.prioritasMANN,
    prioritasAe: form.prioritas.prioritasAE,
  };
}

// ─────────────────────────────────────────────
// HOOK: GET ONE
// ─────────────────────────────────────────────

export function useGetOneInstansiDaerah(noInduk: string) {
  const [data, setData] = useState<InstansiDaerahFormState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetch() {
    setIsLoading(true);
    setError(null);
    try {
      const raw = await getOneTabPerusahaan(noInduk);
      setData(mapToFormState(raw));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengambil data.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (noInduk) fetch();
  }, [noInduk]);

  return { data, isLoading, error, refetch: fetch };
}

// ─────────────────────────────────────────────
// HOOK: UPDATE
// ─────────────────────────────────────────────

export function useUpdateInstansiDaerah() {
  const [isLoading, setIsLoading] = useState(false);

  async function mutate(
    noInduk: string,
    form: InstansiDaerahFormState,
    callbacks: {
      onSuccess: () => void;
      onError: (msg: string) => void;
    },
  ) {
    setIsLoading(true);
    try {
      await updateTabPerusahaan(noInduk, mapToPayload(form));
      callbacks.onSuccess();
    } catch (err) {
      callbacks.onError(
        err instanceof Error ? err.message : "Gagal mengupdate data.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return { mutate, isLoading };
}
