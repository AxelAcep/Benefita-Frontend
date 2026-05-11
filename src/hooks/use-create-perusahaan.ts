// hooks/use-create-perusahaan.ts
import { useState } from "react";
import {
  createPerusahaan,
  CreatePerusahaanPayload,
} from "@/lib/services/perusahaan.service";
import { PerusahaanFormData } from "@/app/database/perusahaan/(form)/card-perusahaan";
import { LokasiFormData } from "@/app/database/perusahaan/(form)/card-lokasi";
import { SertifikasiFormData } from "@/app/database/perusahaan/(form)/card-sertifikasi";
import { KlasifikasiFormData } from "@/app/database/perusahaan/(form)/card-klasifikasi";
import { PropertiFinansialFormData } from "@/app/database/perusahaan/(form)/card-properti";
import { InformasiLainnyaFormData } from "@/app/database/perusahaan/(form)/card-lainya";
import { KontakFormData } from "@/app/database/perusahaan/(form)/card-kontak";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export interface CreatePerusahaanForm {
  perusahaan: PerusahaanFormData | null;
  lokasi: LokasiFormData | null;
  sertifikasi: SertifikasiFormData | null;
  klasifikasi: KlasifikasiFormData | null;
  propertiFinansial: PropertiFinansialFormData | null;
  informasiLainnya: InformasiLainnyaFormData | null;
  kontak: KontakFormData | null;
}

// ─────────────────────────────────────────────
// HOOK
// ─────────────────────────────────────────────

export function useCreatePerusahaan() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState<CreatePerusahaanForm>({
    perusahaan: null,
    lokasi: null,
    sertifikasi: null,
    klasifikasi: null,
    propertiFinansial: null,
    informasiLainnya: null,
    kontak: null,
  });

  function setSection<K extends keyof CreatePerusahaanForm>(
    key: K,
    data: CreatePerusahaanForm[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: data }));
  }

  async function submit() {
    setError(null);
    setSuccess(false);

    // Validasi minimal
    if (!form.perusahaan?.kode || !form.perusahaan?.instansi) {
      setError("Kode dan nama instansi/perusahaan wajib diisi.");
      return false;
    }

    setLoading(true);
    try {
      // Mapping dari form ke payload API
      const payload: CreatePerusahaanPayload = {
        // Perusahaan
        noInduk: form.perusahaan.kode,
        company: form.perusahaan.instansi,
        idSimpel: form.perusahaan.idSimpel,

        // Lokasi
        alamat: form.lokasi?.alamatPusat,
        alamatWaktu: form.lokasi?.zonaWaktuPusat,
        alamatFactory: form.lokasi?.alamatFactory,
        alamatFactoryWaktu: form.lokasi?.zonaWaktuFactory,

        // Sertifikasi
        iso9000: form.sertifikasi?.iso9001,
        iso14000: form.sertifikasi?.iso14001,
        ohsas18001smk3: form.sertifikasi?.ohsas18001,

        // Klasifikasi
        kategoriCpn: form.klasifikasi?.kategoriCpn,
        lineOfBusiness: form.klasifikasi?.lineBisnis,
        lineBisnisSub: form.klasifikasi?.lineBisnisSub,
        permodalan: form.klasifikasi?.permodalan,

        // Properti & Finansial
        nilaiSubBidangProper: form.propertiFinansial?.subBidangNilai
          ? Number(form.propertiFinansial.subBidangNilai)
          : undefined,
        batasEmas: form.propertiFinansial?.subBidangBatasEmas
          ? Number(form.propertiFinansial.subBidangBatasEmas)
          : undefined,
        batasHijau: form.propertiFinansial?.subBidangBatasHijau
          ? Number(form.propertiFinansial.subBidangBatasHijau)
          : undefined,
        fasilitas: form.propertiFinansial?.fasilitas,
        infoKeu: form.propertiFinansial?.infoKeuangan,
        ket: form.propertiFinansial?.keterangan,
        group: form.propertiFinansial?.group,
        bdoAction: form.propertiFinansial?.bdoAction,
        prioritasMa: form.propertiFinansial?.prioritasMANN,
        prioritasAe: form.propertiFinansial?.prioritasAE,
        vendor: form.propertiFinansial?.vendor,

        // Informasi Lainnya
        cabangSite: form.informasiLainnya?.cabangSite,
        pesaing: form.informasiLainnya?.pesaing,
        butuhTraining: form.informasiLainnya?.kebutuhanTraining,
        prosedurPelatihan: form.informasiLainnya?.prosedurPelatihan,

        telp: form.kontak?.telpon,
        fax: form.kontak?.fax,
        email: form.kontak?.email,
      };

      await createPerusahaan(payload);
      setSuccess(true);
      return true;
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan.");
      return false;
    } finally {
      setLoading(false);
    }
  }

  return {
    form,
    setSection,
    submit,
    loading,
    error,
    success,
  };
}
