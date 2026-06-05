import { useState } from "react";
import {
  createTabPerusahaan,
  getOneTabPerusahaan,
  updateTabPerusahaan,
  CreatePerusahaanPayload,
  UpdatePerusahaanPayload,
} from "@/lib/services/new.perusahaan.service";

// =========================
// TYPES
// =========================

type ZonaWaktu = string;

interface FormState {
  perusahaan: {
    instansi: string;
    kode: string;
    idSimpel: string;
  };
  lokasi: {
    alamatPusat: string;
    zonaWaktuPusat: ZonaWaktu;
    alamatFactory: string;
    zonaWaktuFactory: ZonaWaktu;
  };
  kontak: {
    telpon: string;
    fax: string;
    email: string;
  };
  sertifikasi: {
    iso9001: string;
    iso14001: string;
    ohsas18001: string;
  };
  klasifikasi: {
    kategoriCpn: string;
    lineBisnis: string;
    lineBisnisSub: string;
    permodalan: string;
  };
  propertiFinansial: {
    subBidangNilai: string;
    subBidangBatasEmas: string;
    subBidangBatasHijau: string;
    fasilitas: string;
    infoKeuangan: string;
    keterangan: string;
    group: string;
    bdoAction: string;
    prioritasMANN: string;
    prioritasAE: string;
    vendor: string;
  };
  informasiLainnya: {
    cabangSite: string;
    pesaing: string;
    kebutuhanTraining: string;
    prosedurPelatihan: string;
  };
}

const defaultForm: FormState = {
  perusahaan: { instansi: "", kode: "", idSimpel: "" },
  lokasi: {
    alamatPusat: "",
    zonaWaktuPusat: "",
    alamatFactory: "",
    zonaWaktuFactory: "",
  },
  kontak: { telpon: "", fax: "", email: "" },
  sertifikasi: { iso9001: "", iso14001: "", ohsas18001: "" },
  klasifikasi: {
    kategoriCpn: "",
    lineBisnis: "",
    lineBisnisSub: "",
    permodalan: "",
  },
  propertiFinansial: {
    subBidangNilai: "",
    subBidangBatasEmas: "",
    subBidangBatasHijau: "",
    fasilitas: "",
    infoKeuangan: "",
    keterangan: "",
    group: "",
    bdoAction: "",
    prioritasMANN: "",
    prioritasAE: "",
    vendor: "",
  },
  informasiLainnya: {
    cabangSite: "",
    pesaing: "",
    kebutuhanTraining: "",
    prosedurPelatihan: "",
  },
};

// =========================
// MAPPING: FormState → Payload
// =========================

function mapToPayload(form: FormState): CreatePerusahaanPayload {
  return {
    noInduk: form.perusahaan.kode,
    jenisInstansi: "PERUSAHAAN",
    company: form.perusahaan.instansi,
    idSimpel: form.perusahaan.idSimpel,

    alamat: form.lokasi.alamatPusat,
    alamatWaktu: form.lokasi.zonaWaktuPusat,
    alamatFactory: form.lokasi.alamatFactory,
    alamatFactoryWaktu: form.lokasi.zonaWaktuFactory,

    telp: form.kontak.telpon,
    fax: form.kontak.fax,
    email: form.kontak.email,

    iso9000: form.sertifikasi.iso9001,
    iso14000: form.sertifikasi.iso14001,
    ohsas18001smk3: form.sertifikasi.ohsas18001,

    kategoriCpn: form.klasifikasi.kategoriCpn,
    lineOfBusiness: form.klasifikasi.lineBisnis,
    lineBisnisSub: form.klasifikasi.lineBisnisSub,
    permodalan: form.klasifikasi.permodalan,

    nilaiSubBidangProper: form.propertiFinansial.subBidangNilai
      ? Number(form.propertiFinansial.subBidangNilai)
      : undefined,
    batasEmas: form.propertiFinansial.subBidangBatasEmas
      ? Number(form.propertiFinansial.subBidangBatasEmas)
      : undefined,
    batasHijau: form.propertiFinansial.subBidangBatasHijau
      ? Number(form.propertiFinansial.subBidangBatasHijau)
      : undefined,
    fasilitas: form.propertiFinansial.fasilitas,
    infoKeu: form.propertiFinansial.infoKeuangan,
    ket: form.propertiFinansial.keterangan,
    group: form.propertiFinansial.group,
    bdoAction: form.propertiFinansial.bdoAction,
    prioritasMa: form.propertiFinansial.prioritasMANN,
    prioritasAe: form.propertiFinansial.prioritasAE,
    vendor: form.propertiFinansial.vendor,

    cabangSite: form.informasiLainnya.cabangSite,
    pesaing: form.informasiLainnya.pesaing,
    butuhTraining: form.informasiLainnya.kebutuhanTraining,
    prosedurPelatihan: form.informasiLainnya.prosedurPelatihan,
  };
}

function mapFromResponse(
  data: Awaited<ReturnType<typeof getOneTabPerusahaan>>,
): FormState {
  return {
    perusahaan: {
      instansi: data.company ?? "",
      kode: "",
      idSimpel: data.idSimpel ?? "",
    },
    lokasi: {
      alamatPusat: data.alamat ?? "",
      zonaWaktuPusat: data.alamatWaktu ?? "",
      alamatFactory: data.alamatFactory ?? "",
      zonaWaktuFactory: data.alamatFactoryWaktu ?? "",
    },
    kontak: {
      telpon: data.telp ?? "",
      fax: data.fax ?? "",
      email: data.email ?? "",
    },
    sertifikasi: {
      iso9001: data.iso9000 ?? "",
      iso14001: data.iso14000 ?? "",
      ohsas18001: data.ohsas18001smk3 ?? "",
    },
    klasifikasi: {
      kategoriCpn: data.kategoriCpn ?? "",
      lineBisnis: data.lineOfBusiness ?? "",
      lineBisnisSub: data.lineBisnisSub ?? "",
      permodalan: data.permodalan ?? "",
    },
    propertiFinansial: {
      subBidangNilai: data.nilaiSubBidangProper?.toString() ?? "",
      subBidangBatasEmas: data.batasEmas?.toString() ?? "",
      subBidangBatasHijau: data.batasHijau?.toString() ?? "",
      fasilitas: data.fasilitas ?? "",
      infoKeuangan: data.infoKeu ?? "",
      keterangan: data.ket ?? "",
      group: data.group ?? "",
      bdoAction: data.bdoAction ?? "",
      prioritasMANN: data.prioritasMa ?? "",
      prioritasAE: data.prioritasAe ?? "",
      vendor: data.vendor ?? "",
    },
    informasiLainnya: {
      cabangSite: data.cabangSite ?? "",
      pesaing: data.pesaing ?? "",
      kebutuhanTraining: data.butuhTraining ?? "",
      prosedurPelatihan: data.prosedurPelatihan ?? "",
    },
  };
}

// =========================
// HOOK: CREATE
// =========================

export function useCreatePerusahaan() {
  const [form, setForm] = useState<FormState>(defaultForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function setSection<K extends keyof FormState>(
    section: K,
    data: Partial<FormState[K]>,
  ) {
    setForm((prev) => ({
      ...prev,
      [section]: { ...prev[section], ...data },
    }));
  }

  async function submit(): Promise<boolean> {
    setLoading(true);
    setError(null);
    try {
      const payload = mapToPayload(form);
      await createTabPerusahaan(payload);
      return true;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
      return false;
    } finally {
      setLoading(false);
    }
  }

  return { form, setSection, submit, loading, error };
}

// =========================
// HOOK: GET ONE
// =========================

export function useGetOnePerusahaan() {
  const [data, setData] = useState<FormState | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetch(noInduk: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await getOneTabPerusahaan(noInduk);
      setData(mapFromResponse(res));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  }

  return { data, fetch, loading, error };
}

// =========================
// HOOK: EDIT
// =========================

export function useEditPerusahaan() {
  const [form, setForm] = useState<FormState>(defaultForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function setSection<K extends keyof FormState>(
    section: K,
    data: Partial<FormState[K]>,
  ) {
    setForm((prev) => ({
      ...prev,
      [section]: { ...prev[section], ...data },
    }));
  }

  function populate(data: Awaited<ReturnType<typeof getOneTabPerusahaan>>) {
    setForm(mapFromResponse(data));
  }

  async function submit(noInduk: string): Promise<boolean> {
    setLoading(true);
    setError(null);
    try {
      const payload: UpdatePerusahaanPayload = mapToPayload(form);
      await updateTabPerusahaan(noInduk, payload);
      return true;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
      return false;
    } finally {
      setLoading(false);
    }
  }

  return { form, setSection, populate, submit, loading, error };
}
