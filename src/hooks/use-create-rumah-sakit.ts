// hooks/use-create-perusahaan.ts
import { useState } from "react";
import { createPerusahaan } from "@/lib/services/perusahaan.service";

import { PerusahaanFormData } from "@/app/database/perusahaan/(form)/card-perusahaan";
import { LokasiFormData } from "@/app/database/perusahaan/(form)/card-lokasi";
import { SertifikasiFormData } from "@/app/database/rumah-sakit/(form)/card-sertifikasi";
import { KlasifikasiFormData } from "@/app/database/perusahaan/(form)/card-klasifikasi";
import { PropertiFinansialFormData } from "@/app/database/perusahaan/(form)/card-properti";
import { InformasiLainnyaFormData } from "@/app/database/perusahaan/(form)/card-lainya";
import { KontakFormData } from "@/app/database/perusahaan/(form)/card-kontak";

// ─────────────────────────────────────────────
// FORM TYPE
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

  // ─────────────────────────────────────────────
  // SUBMIT
  // ─────────────────────────────────────────────

  async function submit(jenisInstansi: string = "RUMAH_SAKIT") {
    setError(null);
    setSuccess(false);

    if (!form.perusahaan?.kode || !form.perusahaan?.instansi) {
      setError("Kode dan nama wajib diisi");
      return false;
    }

    setLoading(true);

    try {
      const payload = {
        // CORE
        noInduk: form.perusahaan.kode,
        company: form.perusahaan.instansi,
        idSimpel: form.perusahaan.idSimpel,
        jenisInstansi,

        // LOKASI
        alamat: form.lokasi?.alamatPusat,
        alamatWaktu: form.lokasi?.zonaWaktuPusat,
        alamatFactory: form.lokasi?.alamatFactory,
        alamatFactoryWaktu: form.lokasi?.zonaWaktuFactory,

        // SERTIFIKASI
        iso9000: form.sertifikasi?.iso9001,
        iso14000: form.sertifikasi?.iso14001,
        ohsas18001smk3: form.sertifikasi?.ohsas18001,

        // KLASIFIKASI
        kategoriCpn: form.klasifikasi?.kategoriCpn,
        lineOfBusiness: form.klasifikasi?.lineBisnis,
        lineBisnisSub: form.klasifikasi?.lineBisnisSub,
        permodalan: form.klasifikasi?.permodalan,

        // FINANSIAL
        nilaiSubBidangProper: Number(
          form.propertiFinansial?.subBidangNilai ?? 0,
        ),
        batasEmas: Number(form.propertiFinansial?.subBidangBatasEmas ?? 0),
        batasHijau: Number(form.propertiFinansial?.subBidangBatasHijau ?? 0),

        fasilitas: form.propertiFinansial?.fasilitas,
        infoKeu: form.propertiFinansial?.infoKeuangan,
        ket: form.propertiFinansial?.keterangan,
        group: form.propertiFinansial?.group,
        bdoAction: form.propertiFinansial?.bdoAction,
        prioritasMa: form.propertiFinansial?.prioritasMANN,
        prioritasAe: form.propertiFinansial?.prioritasAE,
        vendor: form.propertiFinansial?.vendor,

        // INFO LAIN
        cabangSite: form.informasiLainnya?.cabangSite,
        pesaing: form.informasiLainnya?.pesaing,
        butuhTraining: form.informasiLainnya?.kebutuhanTraining,
        prosedurPelatihan: form.informasiLainnya?.prosedurPelatihan,

        // KONTAK
        telp: form.kontak?.telpon,
        fax: form.kontak?.fax,
        email: form.kontak?.email,
      };

      await createPerusahaan(payload);

      setSuccess(true);
      return true;
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
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
