// hooks/use-sekolah-edit.ts
"use client";

import { useState, useEffect } from "react";
import {
  getOneTabPerusahaan,
  updateTabPerusahaan,
} from "@/lib/services/new.perusahaan.service";

import type { InstansiSekolahFormData } from "@/app/database/sekolah/(form)/card-instansi-sekolah";
import type { KontakFormData } from "@/app/database/sekolah/(form)/card-kontak";
import type { LokasiSekolahFormData } from "@/app/database/sekolah/(form)/card-lokasi-sekolah";
import type { KlasifikasiFormData } from "@/app/database/sekolah/(form)/card-klasifikasi";
import type { InformasiSekolahDetailFormData } from "@/app/database/sekolah/(form)/card-infromasi-sekolah-detail";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export interface SekolahFormState {
  instansiSekolah: InstansiSekolahFormData;
  kontak: KontakFormData;
  lokasi: LokasiSekolahFormData;
  klasifikasi: KlasifikasiFormData;
  informasiSekolahDetail: InformasiSekolahDetailFormData;
}

// ─────────────────────────────────────────────
// MAPPER: Backend → Frontend
// ─────────────────────────────────────────────

function mapToFormState(raw: any): SekolahFormState {
  return {
    instansiSekolah: {
      instansi: raw.instansi ?? "",
      kode: raw.kode ?? "",
    },
    kontak: {
      telpon: raw.telp ?? "",
      fax: raw.fax ?? "",
      email: raw.email ?? "",
    },
    lokasi: {
      alamat: raw.alamat ?? "",
    },
    klasifikasi: {
      kategoriCpn: raw.kategoriCpn ?? "",
      lineBisnis: raw.lineOfBusiness ?? "",
      lineBisnisSub: raw.lineBisnisSub ?? "",
      permodalan: raw.permodalan ?? "",
    },
    informasiSekolahDetail: {
      pemilik: raw.pemilik ?? "",
      fasilitas: raw.fasilitas ?? "",
      yayasan: raw.yayasan ?? "",
      akreditasi: raw.akreditasi ?? "",
      group: raw.group ?? "",
      cp: raw.cpSekolah ?? "",
      keterangan: raw.ket ?? "",
    },
  };
}

// ─────────────────────────────────────────────
// MAPPER: Frontend → Backend
// ─────────────────────────────────────────────

function mapToPayload(form: SekolahFormState) {
  return {
    // INSTANSI SEKOLAH
    noInduk: form.instansiSekolah.kode,
    company: form.instansiSekolah.instansi,
    instansi: form.instansiSekolah.instansi,
    kode: form.instansiSekolah.kode,

    // KONTAK
    telp: form.kontak.telpon,
    fax: form.kontak.fax,
    email: form.kontak.email,

    // LOKASI
    alamat: form.lokasi.alamat,

    // KLASIFIKASI
    kategoriCpn: form.klasifikasi.kategoriCpn,
    lineOfBusiness: form.klasifikasi.lineBisnis,
    lineBisnisSub: form.klasifikasi.lineBisnisSub,
    permodalan: form.klasifikasi.permodalan,

    // INFORMASI SEKOLAH DETAIL
    pemilik: form.informasiSekolahDetail.pemilik,
    fasilitas: form.informasiSekolahDetail.fasilitas,
    yayasan: form.informasiSekolahDetail.yayasan,
    akreditasi: form.informasiSekolahDetail.akreditasi,
    group: form.informasiSekolahDetail.group,
    cpSekolah: form.informasiSekolahDetail.cp,
    ket: form.informasiSekolahDetail.keterangan,
  };
}

// ─────────────────────────────────────────────
// HOOK: GET ONE
// ─────────────────────────────────────────────

export function useGetOneSekolah(noInduk: string) {
  const [data, setData] = useState<SekolahFormState | null>(null);
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

export function useUpdateSekolah() {
  const [isLoading, setIsLoading] = useState(false);

  async function mutate(
    noInduk: string,
    form: SekolahFormState,
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
