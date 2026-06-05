import { useState, useEffect } from "react";
import {
  getOneTabPerusahaan,
  updateTabPerusahaan,
  UpdatePerusahaanPayload,
} from "@/lib/services/new.perusahaan.service";
import { ZonaWaktu } from "../../src//app/database/perusahaan/(form)/card-lokasi";

// =========================
// TYPES
// =========================

interface PerusahaanSection {
  instansi: string;
  kode: string;
  idSimpel: string;
}

interface LokasiSection {
  alamatPusat: string;
  zonaWaktuPusat: ZonaWaktu;
  alamatFactory: string;
  zonaWaktuFactory: ZonaWaktu;
}

interface SertifikasiSection {
  iso9001: string;
  iso14001: string;
  ohsas18001: string;
}

interface KlasifikasiSection {
  kategoriCpn: string;
  lineBisnis: string;
  lineBisnisSub: string;
  permodalan: string;
}

interface PropertiFinansialSection {
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
}

interface InformasiLainnyaSection {
  cabangSite: string;
  pesaing: string;
  kebutuhanTraining: string;
  prosedurPelatihan: string;
}

interface KontakSection {
  telpon: string;
  fax: string;
  email: string;
}

export interface SertifikasiBnsp {
  id: number;
  perusahaanId: string;
  pppa?: string;
  popal?: string;
  pppu?: string;
  poippu?: string;
  limbahB3?: string;
  tpsLb3?: string;
  sampah3R?: string;
  pSampah?: string;
  aEnergi?: string;
  mEnergi?: string;
  pcua?: string;
  lca?: string;
}

export interface Proper {
  id: number;
  perusahaanId: string;
  tahun: number;
  emas: number;
  hijau: number;
  biru: number;
  merah: number;
  hitam: number;
}

export interface FormStateEdit {
  perusahaan: PerusahaanSection;
  lokasi: LokasiSection;
  sertifikasi: SertifikasiSection;
  klasifikasi: KlasifikasiSection;
  propertiFinansial: PropertiFinansialSection;
  informasiLainnya: InformasiLainnyaSection;
  kontak: KontakSection;
  sertifikasiBnsp: {
    pppa: string;
    popal: string;
    pppu: string;
    poippu: string;
    limbahB3: string;
    tpsLb3: string;
    sampah3R: string;
    pSampah: string;
    aEnergi: string;
    mEnergi: string;
    pcua: string;
    lca: string;
  };
  proper: Proper[];
}

// =========================
// HELPERS
// =========================

function toZonaWaktu(value: unknown): ZonaWaktu {
  const valid: ZonaWaktu[] = ["WIB", "WITA", "WIT", "-"];
  return valid.includes(value as ZonaWaktu) ? (value as ZonaWaktu) : "-";
}

function mapResponseToForm(
  data: Awaited<ReturnType<typeof getOneTabPerusahaan>>,
): FormStateEdit {
  return {
    perusahaan: {
      instansi: data.company ?? "",
      kode: data.noInduk ?? "",
      idSimpel: data.idSimpel ?? "",
    },
    lokasi: {
      alamatPusat: data.alamat ?? "",
      zonaWaktuPusat: toZonaWaktu(data.alamatWaktu),
      alamatFactory: data.alamatFactory ?? "",
      zonaWaktuFactory: toZonaWaktu(data.alamatFactoryWaktu),
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
    kontak: {
      telpon: data.telp ?? "",
      fax: data.fax ?? "",
      email: data.email ?? "",
    },
    sertifikasiBnsp: {
      pppa: data.sertifikasiBnsp?.[0]?.pppa ?? "",
      popal: data.sertifikasiBnsp?.[0]?.popal ?? "",
      pppu: data.sertifikasiBnsp?.[0]?.pppu ?? "",
      poippu: data.sertifikasiBnsp?.[0]?.poippu ?? "",
      limbahB3: data.sertifikasiBnsp?.[0]?.limbahB3 ?? "",
      tpsLb3: data.sertifikasiBnsp?.[0]?.tpsLb3 ?? "",
      sampah3R: data.sertifikasiBnsp?.[0]?.sampah3R ?? "",
      pSampah: data.sertifikasiBnsp?.[0]?.pSampah ?? "",
      aEnergi: data.sertifikasiBnsp?.[0]?.aEnergi ?? "",
      mEnergi: data.sertifikasiBnsp?.[0]?.mEnergi ?? "",
      pcua: data.sertifikasiBnsp?.[0]?.pcua ?? "",
      lca: data.sertifikasiBnsp?.[0]?.lca ?? "",
    },
    proper: data.proper ?? [],
  };
}

function mapFormToPayload(form: FormStateEdit): UpdatePerusahaanPayload {
  return {
    company: form.perusahaan.instansi,
    idSimpel: form.perusahaan.idSimpel,

    alamat: form.lokasi.alamatPusat,
    alamatWaktu:
      form.lokasi.zonaWaktuPusat === "-"
        ? undefined
        : form.lokasi.zonaWaktuPusat,
    alamatFactory: form.lokasi.alamatFactory,
    alamatFactoryWaktu:
      form.lokasi.zonaWaktuFactory === "-"
        ? undefined
        : form.lokasi.zonaWaktuFactory,

    iso9000: form.sertifikasi.iso9001,
    iso14000: form.sertifikasi.iso14001,
    ohsas18001smk3: form.sertifikasi.ohsas18001,

    kategoriCpn: form.klasifikasi.kategoriCpn,
    lineOfBusiness: form.klasifikasi.lineBisnis,
    lineBisnisSub: form.klasifikasi.lineBisnisSub,
    permodalan: form.klasifikasi.permodalan,

    nilaiSubBidangProper:
      Number(form.propertiFinansial.subBidangNilai) || undefined,
    batasEmas: Number(form.propertiFinansial.subBidangBatasEmas) || undefined,
    batasHijau: Number(form.propertiFinansial.subBidangBatasHijau) || undefined,
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

    telp: form.kontak.telpon,
    fax: form.kontak.fax,
    email: form.kontak.email,
  };
}

// =========================
// HOOK: GET ONE
// =========================

export function useGetOnePerusahaan(id: string) {
  const [data, setData] = useState<FormStateEdit | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetch() {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getOneTabPerusahaan(id);
      setData(mapResponseToForm(res));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetch();
  }, [id]);

  return { data, isLoading, error, refetch: fetch };
}

// =========================
// HOOK: UPDATE
// =========================

type MutateOptions = {
  onSuccess?: () => void;
  onError?: (msg: string) => void;
};

export function useUpdatePerusahaan() {
  const [isLoading, setIsLoading] = useState(false);

  async function mutate(
    id: string,
    payload: UpdatePerusahaanPayload,
    options?: MutateOptions,
  ) {
    setIsLoading(true);
    try {
      await updateTabPerusahaan(id, payload);
      options?.onSuccess?.();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan.";
      options?.onError?.(msg);
    } finally {
      setIsLoading(false);
    }
  }

  return { mutate, isLoading };
}
