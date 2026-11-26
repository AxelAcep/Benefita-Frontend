import { useEffect, useState } from "react";
import { usePerusahaanEnvMa } from "@/hooks/use-perusahaan-env-ma";
import { getLiniBisnis, type LiniBisnisItem } from "@/lib/services/perusahaan.service";

export function usePerusahaanEnvMaManage() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;
  const [liniBisnisId, setLiniBisnisId] = useState<number | "">("");
  const [liniBisnisOptions, setOptions] = useState<LiniBisnisItem[]>([]);
  const [optionsError, setOptionsError] = useState<string | null>(null);
  useEffect(() => {
    let batal = false;
    getLiniBisnis().then(({ data }) => { if (!batal) setOptions(data); })
      .catch((error: unknown) => {
        if (!batal) setOptionsError(error instanceof Error ? error.message : "Gagal mengambil lini bisnis.");
      });
    return () => { batal = true; };
  }, []);
  function changeLiniBisnis(value: string) {
    setLiniBisnisId(value ? Number(value) : "");
    setCurrentPage(1);
  }
  const result = usePerusahaanEnvMa(currentPage, search, liniBisnisId);
  function changeSearch(value: string) {
    setSearch(value);
    setCurrentPage(1);
  }
  return {
    ...result, search, changeSearch, currentPage, setCurrentPage, PAGE_SIZE,
    paginated: result.data, totalPages: result.pagination.totalPages, total: result.pagination.total,
    liniBisnisId, changeLiniBisnis, liniBisnisOptions, optionsError,
  };
}
