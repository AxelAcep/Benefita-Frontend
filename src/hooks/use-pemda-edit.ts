"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getOneTabPerusahaan,
  updateTabPerusahaan,
} from "@/lib/services/new.perusahaan.service";
import type { PerusahaanFormData } from "../app/database/pemda/(form)/card-perusahaan";
import type { LokasiPemdaFormData } from "../app/database/pemda/(form)/card-lokasi-pemda";
import type { KontakFormData } from "../app/database/pemda/(form)/card-kontak";
import type { InformasiDaerahFormData } from "../app/database/pemda/(form)/card-informasi-daerah";
import type { BidangKedinasanFormData } from "../app/database/pemda/(form)/card-bidang-kedinasan";
import type { StatistikProperFormData } from "../app/database/pemda/(form)/card-proper";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export interface PemdaFormState {
  perusahaan: PerusahaanFormData;
  lokasi: LokasiPemdaFormData;
  kontak: KontakFormData;
  informasiDaerah: InformasiDaerahFormData;
  bidangKedinasan: BidangKedinasanFormData;
  statistikProper: StatistikProperFormData;
}

// ─────────────────────────────────────────────
// EMPTY FORM
// ─────────────────────────────────────────────

const EMPTY_FORM: PemdaFormState = {
  perusahaan: { instansi: "", kode: "", idSimpel: "" },
  lokasi: { kotaKabupaten: "", provinsi: "", alamat: "" },
  kontak: { telpon: "", fax: "", email: "" },
  informasiDaerah: { instansi: "", keterangan: "", sekilasLh: "", rsud: "" },
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
  statistikProper: { rows: [] },
};

// ─────────────────────────────────────────────
// MAPPER: API response → PemdaFormState
// ─────────────────────────────────────────────

function mapApiToForm(data: any): PemdaFormState {
  return {
    perusahaan: {
      instansi: data.instansi ?? "",
      kode: data.kode ?? data.noInduk ?? "",
      idSimpel: "",
    },
    lokasi: {
      kotaKabupaten: data.kotaKabupaten ?? "",
      provinsi: data.provinsi ?? "",
      alamat: data.alamat ?? "",
    },
    kontak: {
      telpon: data.telp ?? "",
      fax: data.fax ?? "",
      email: data.email ?? "",
    },
    informasiDaerah: {
      instansi: data.instansi ?? "",
      keterangan: data.ket ?? "",
      sekilasLh: data.sekilasLh ?? "",
      rsud: data.rsud != null ? String(data.rsud) : "",
    },
    bidangKedinasan: {
      indPengolahan:
        data.indPengolahan != null ? String(data.indPengolahan) : "",
      pertambangan: data.pertambangan != null ? String(data.pertambangan) : "",
      listrikGasAirBersih:
        data.listrikGasAirBersih != null
          ? String(data.listrikGasAirBersih)
          : "",
      hotelResto: data.hotelResto != null ? String(data.hotelResto) : "",
      angkutTrans: data.angkutTrans != null ? String(data.angkutTrans) : "",
      bangunan: data.bangunan != null ? String(data.bangunan) : "",
      pertanian: data.pertanian != null ? String(data.pertanian) : "",
      keuangan: data.keuangan != null ? String(data.keuangan) : "",
      laut: data.laut != null ? String(data.laut) : "",
      jasa: data.jasa != null ? String(data.jasa) : "",
    },
    statistikProper: {
      rows: (data.proper ?? []).map((p: any) => ({
        tahun: p.tahun,
        emas: p.emas != null ? String(p.emas) : "0",
        hijau: p.hijau != null ? String(p.hijau) : "0",
        biru: p.biru != null ? String(p.biru) : "0",
        merah: p.merah != null ? String(p.merah) : "0",
        hitam: p.hitam != null ? String(p.hitam) : "0",
      })),
    },
  };
}

// ─────────────────────────────────────────────
// HOOK: GET ONE
// ─────────────────────────────────────────────

export function useGetOnePemda(noInduk: string) {
  const [data, setData] = useState<PemdaFormState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getOneTabPerusahaan(noInduk);
      setData(mapApiToForm(res));
    } catch (err: any) {
      setError(err.message ?? "Gagal memuat data.");
    } finally {
      setIsLoading(false);
    }
  }, [noInduk]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, isLoading, error, refetch: fetch };
}

// ─────────────────────────────────────────────
// HOOK: UPDATE
// ─────────────────────────────────────────────

export function useUpdatePemda() {
  const [isLoading, setIsLoading] = useState(false);

  const toNum = (v: string) => {
    const n = parseFloat(v);
    return isNaN(n) ? 0 : n;
  };

  async function mutate(
    noInduk: string,
    form: PemdaFormState,
    callbacks: {
      onSuccess: () => void;
      onError: (msg: string) => void;
    },
  ) {
    setIsLoading(true);
    try {
      await updateTabPerusahaan(noInduk, {
        // CORE
        company: form.informasiDaerah.instansi,
        instansi: form.informasiDaerah.instansi,
        kode: form.perusahaan.kode,

        // LOKASI
        alamat: form.lokasi.alamat || undefined,
        kotaKabupaten: form.lokasi.kotaKabupaten || undefined,
        provinsi: form.lokasi.provinsi || undefined,

        // KONTAK
        telp: form.kontak.telpon || undefined,
        fax: form.kontak.fax || undefined,
        email: form.kontak.email || undefined,

        // INFORMASI DAERAH
        ket: form.informasiDaerah.keterangan || undefined,
        sekilasLh: form.informasiDaerah.sekilasLh || undefined,
        rsud: toNum(form.informasiDaerah.rsud),

        // BIDANG KEDINASAN
        indPengolahan: toNum(form.bidangKedinasan.indPengolahan),
        pertambangan: toNum(form.bidangKedinasan.pertambangan),
        listrikGasAirBersih: toNum(form.bidangKedinasan.listrikGasAirBersih),
        hotelResto: toNum(form.bidangKedinasan.hotelResto),
        angkutTrans: toNum(form.bidangKedinasan.angkutTrans),
        bangunan: toNum(form.bidangKedinasan.bangunan),
        pertanian: toNum(form.bidangKedinasan.pertanian),
        keuangan: toNum(form.bidangKedinasan.keuangan),
        laut: toNum(form.bidangKedinasan.laut),
        jasa: toNum(form.bidangKedinasan.jasa),
      });

      callbacks.onSuccess();
    } catch (err: any) {
      callbacks.onError(err.message ?? "Terjadi kesalahan.");
    } finally {
      setIsLoading(false);
    }
  }

  return { mutate, isLoading };
}
