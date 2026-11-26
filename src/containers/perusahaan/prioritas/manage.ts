import { useState } from "react";
import { usePerusahaanPrioritas } from "@/hooks/use-perusahaan-prioritas";

export function usePerusahaanPrioritasManage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [prioritasMa, setPrioritasMa] = useState("");
  const [prioritasAe, setPrioritasAe] = useState("");
  const [filter, setFilter] = useState({ ma: "", ae: "" });
  const hasApplied = Boolean(filter.ma || filter.ae);
  const result = usePerusahaanPrioritas(page, search, filter.ma, filter.ae);

  function handleSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handleTerapkan() {
    setFilter({ ma: prioritasMa, ae: prioritasAe });
    setPage(1);
  }

  return {
    ...result,
    search,
    page,
    setPage,
    handleSearch,
    prioritasMa,
    prioritasAe,
    hasApplied,
    setPrioritasMa,
    setPrioritasAe,
    handleTerapkan,
    handlePageChange: setPage,
  };
}
