import { useEffect, useState } from "react";
import { usePerusahaanProper } from "@/hooks/use-perusahaan-proper";
import { getLiniBisnis, type LiniBisnisItem } from "@/lib/services/perusahaan.service";
import type { PeringkatProper } from "@/lib/types/perusahaan-proper";

export function usePerusahaanProperManage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<"asc" | "desc">("desc");
  const [peringkat, setPeringkat] = useState<PeringkatProper | "">("");
  const [liniBisnisId, setLiniBisnisId] = useState<number | "">("");
  const [filter, setFilter] = useState({ peringkat, liniBisnisId });
  const [liniBisnisOptions, setLiniBisnisOptions] = useState<LiniBisnisItem[]>([]);
  const [liniBisnisError, setLiniBisnisError] = useState<string | null>(null);
  const result = usePerusahaanProper(page, search, sort, filter.peringkat, filter.liniBisnisId);

  useEffect(() => {
    let batal = false;
    getLiniBisnis()
      .then(({ data }) => {
        if (!batal) setLiniBisnisOptions(data);
      })
      .catch((err: unknown) => {
        if (!batal) {
          setLiniBisnisError(err instanceof Error ? err.message : "Gagal mengambil data lini bisnis.");
        }
      });
    return () => {
      batal = true;
    };
  }, []);

  function handleSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  function toggleSort() {
    setSort((value) => (value === "asc" ? "desc" : "asc"));
    setPage(1);
  }

  function handleTerapkan() {
    setFilter({ peringkat, liniBisnisId });
    setPage(1);
  }

  return {
    ...result, search, page, sort, peringkat, liniBisnisId, liniBisnisOptions,
    liniBisnisError, setPage, setPeringkat, setLiniBisnisId, handleSearch,
    toggleSort, handleTerapkan,
  };
}
