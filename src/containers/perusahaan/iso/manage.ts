import { useEffect, useState } from "react";
import { usePerusahaanIso } from "@/hooks/use-perusahaan-iso";
import { getLiniBisnis, type LiniBisnisItem } from "@/lib/services/perusahaan.service";

export function usePerusahaanIsoManage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<"asc" | "desc">("desc");
  const [liniBisnisId, setLiniBisnisId] = useState<number | "">("");
  const [appliedLiniBisnisId, setAppliedLiniBisnisId] = useState<number | "">("");
  const [liniBisnisOptions, setOptions] = useState<LiniBisnisItem[]>([]);
  const [optionsError, setOptionsError] = useState<string | null>(null);
  const result = usePerusahaanIso(page, search, sort, appliedLiniBisnisId);

  function handleSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  useEffect(() => {
    let batal = false;
    getLiniBisnis().then(({ data }) => data)
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
    setAppliedLiniBisnisId(liniBisnisId);
    setPage(1);
  }

  function toggleSort() {
    setSort((value) => (value === "asc" ? "desc" : "asc"));
    setPage(1);
  }

  return {
    ...result,
    search,
    page,
    setPage,
    handleSearch,
    sort,
    toggleSort,
    liniBisnisId,
    setLiniBisnisId,
    handleTerapkan,
    liniBisnisOptions,
    optionsError,
  };
}
