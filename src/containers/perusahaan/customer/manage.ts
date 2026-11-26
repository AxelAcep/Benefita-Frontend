import { useEffect, useState } from "react";
import { usePerusahaanCustomer } from "@/hooks/use-perusahaan-customer";
import { getPelatihanTahunOptions } from "@/lib/services/perusahaan.service";

export function usePerusahaanCustomerManage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [tahun, setTahun] = useState<number | "">("");
  const [appliedTahun, setAppliedTahun] = useState<number | "">("");
  const [tahunOptions, setOptions] = useState<number[]>([]);
  const [optionsError, setOptionsError] = useState<string | null>(null);
  const result = usePerusahaanCustomer(page, search, appliedTahun);

  function handleSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  useEffect(() => {
    let batal = false;
    getPelatihanTahunOptions()
      .then((data) => {
        if (!batal) setOptions(data);
      })
      .catch((err: unknown) => {
        if (!batal) {
          setOptionsError(err instanceof Error ? err.message : "Gagal memuat opsi filter.");
        }
      });
    return () => {
      batal = true;
    };
  }, []);

  function handleTerapkan() {
    setAppliedTahun(tahun);
    setPage(1);
  }

  return {
    ...result,
    search,
    page,
    setPage,
    handleSearch,
    appliedTahun,
    tahun,
    setTahun,
    handleTerapkan,
    tahunOptions,
    optionsError,
  };
}
