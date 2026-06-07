"use client";

import { useState } from "react";
import { createTabPerusahaan } from "@/lib/services/new.perusahaan.service";
import type { PerusahaanFormData } from "../app/database/pemda/(form)/card-perusahaan";
import type { LokasiPemdaFormData } from "../app/database/pemda/(form)/card-lokasi-pemda";
import type { KontakFormData } from "../app/database/pemda/(form)/card-kontak";
import type { InformasiDaerahFormData } from "../app/database/pemda/(form)/card-informasi-daerah";
import type { BidangKedinasanFormData } from "../app/database/pemda/(form)/card-bidang-kedinasan";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export interface CreatePemdaForm {
  perusahaan: PerusahaanFormData;
  lokasi: LokasiPemdaFormData;
  kontak: KontakFormData;
  informasiDaerah: InformasiDaerahFormData;
  bidangKedinasan: BidangKedinasanFormData;
}

// ─────────────────────────────────────────────
// INITIAL STATE
// ─────────────────────────────────────────────

const initialForm: CreatePemdaForm = {
  perusahaan: {
    instansi: "",
    kode: "",
    idSimpel: "",
  },
  lokasi: {
    kotaKabupaten: "",
    provinsi: "",
    alamat: "",
  },
  kontak: {
    telpon: "",
    fax: "",
    email: "",
  },
  informasiDaerah: {
    instansi: "",
    keterangan: "",
    sekilasLh: "",
    rsud: "",
  },
  bidangKedinasan: {
    indPengolahan: "",
    pertambangan: "",
    listrikGasAirBersih: "",
    hotelResto: "",
    angkutTrans: "",
    bangunan: "",
    pertanian: "",
    keuangan: "",
    laut: "",
    jasa: "",
  },
};

// ─────────────────────────────────────────────
// HOOK
// ─────────────────────────────────────────────

export function useCreatePemda() {
  const [form, setForm] = useState<CreatePemdaForm>(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function setSection<K extends keyof CreatePemdaForm>(
    section: K,
    data: CreatePemdaForm[K],
  ) {
    setForm((prev) => ({ ...prev, [section]: data }));
  }

  async function submit(): Promise<boolean> {
    setLoading(true);
    setError(null);

    try {
      const { perusahaan, lokasi, kontak, informasiDaerah, bidangKedinasan } =
        form;

      const toNum = (v: string) => {
        const n = parseFloat(v);
        return isNaN(n) ? 0 : n;
      };

      await createTabPerusahaan({
        // CORE
        noInduk: perusahaan.kode,
        jenisInstansi: "PEMDA",
        company: informasiDaerah.instansi,
        instansi: informasiDaerah.instansi,
        kode: perusahaan.kode,
        idSimpel: undefined,

        // LOKASI
        alamat: lokasi.alamat || undefined,
        kotaKabupaten: lokasi.kotaKabupaten || undefined,
        provinsi: lokasi.provinsi || undefined,

        // KONTAK
        telp: kontak.telpon || undefined,
        fax: kontak.fax || undefined,
        email: kontak.email || undefined,

        // INFORMASI DAERAH
        ket: informasiDaerah.keterangan || undefined,
        sekilasLh: informasiDaerah.sekilasLh || undefined,
        rsud: toNum(informasiDaerah.rsud),

        // BIDANG KEDINASAN
        indPengolahan: toNum(bidangKedinasan.indPengolahan),
        pertambangan: toNum(bidangKedinasan.pertambangan),
        listrikGasAirBersih: toNum(bidangKedinasan.listrikGasAirBersih),
        hotelResto: toNum(bidangKedinasan.hotelResto),
        angkutTrans: toNum(bidangKedinasan.angkutTrans),
        bangunan: toNum(bidangKedinasan.bangunan),
        pertanian: toNum(bidangKedinasan.pertanian),
        keuangan: toNum(bidangKedinasan.keuangan),
        laut: toNum(bidangKedinasan.laut),
        jasa: toNum(bidangKedinasan.jasa),
      });

      return true;
    } catch (err: any) {
      setError(err.message ?? "Terjadi kesalahan.");
      return false;
    } finally {
      setLoading(false);
    }
  }

  return { form, setSection, submit, loading, error };
}
