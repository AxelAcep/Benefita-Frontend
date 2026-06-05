"use client";

import { useCallback, useEffect, useState } from "react";
import { getOnePerusahaan } from "@/lib/services/perusahaan.service";

export type PerusahaanFormState = {
  perusahaan: {
    kode: string;
    company: string;
    idSimpel?: string;
    jenisInstansi: string;
    inputter?: string;
  };

  lokasi: {
    alamat?: string;
    alamatWaktu?: string;
    alamatFactory?: string;
    alamatFactoryWaktu?: string;
  };

  kontak: {
    telp?: string;
    fax?: string;
    email?: string;
  };

  sertifikasi: {
    iso9000?: string;
    iso14000?: string;
    ohsas18001smk3?: string;
  };

  klasifikasi: {
    kategoriCpn?: string;
    lineOfBusiness?: string;
    lineBisnisSub?: string;
    permodalan?: string;
  };

  propertiFinansial: {
    nilaiSubBidangProper?: number;
    batasEmas?: number;
    batasHijau?: number;
    infoKeu?: string;
    bdoAction?: string;
    vendor?: string;
  };

  informasiLainnya: {
    cabangSite?: string;
    pesaing?: string;
    butuhTraining?: string;
    prosedurPelatihan?: string;
  };
};

export function useGetOnePerusahaan(noInduk: string) {
  const [data, setData] = useState<PerusahaanFormState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!noInduk) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await getOnePerusahaan(noInduk);

      const mapped: PerusahaanFormState = {
        perusahaan: {
          kode: res.noInduk,
          company: res.company,
          idSimpel: res.idSimpel,
          jenisInstansi: res.jenisInstansi,
          inputter: res.inputter,
        },

        lokasi: {
          alamat: res.alamat,
          alamatWaktu: res.alamatWaktu,
          alamatFactory: res.alamatFactory,
          alamatFactoryWaktu: res.alamatFactoryWaktu,
        },

        kontak: {
          telp: res.telp,
          fax: res.fax,
          email: res.email,
        },

        sertifikasi: {
          iso9000: res.iso9000,
          iso14000: res.iso14000,
          ohsas18001smk3: res.ohsas18001smk3,
        },

        klasifikasi: {
          kategoriCpn: res.kategoriCpn,
          lineOfBusiness: res.lineOfBusiness,
          lineBisnisSub: res.lineBisnisSub,
          permodalan: res.permodalan,
        },

        propertiFinansial: {
          nilaiSubBidangProper: res.nilaiSubBidangProper,
          batasEmas: res.batasEmas,
          batasHijau: res.batasHijau,
          infoKeu: res.infoKeu,
          bdoAction: res.bdoAction,
          vendor: res.vendor,
        },

        informasiLainnya: {
          cabangSite: res.cabangSite,
          pesaing: res.pesaing,
          butuhTraining: res.butuhTraining,
          prosedurPelatihan: res.prosedurPelatihan,
        },
      };

      setData(mapped);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setIsLoading(false);
    }
  }, [noInduk]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
  };
}
