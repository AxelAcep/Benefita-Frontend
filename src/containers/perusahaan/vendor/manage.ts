import { useState } from "react";
import { usePerusahaanVendor } from "@/hooks/use-perusahaan-vendor";

export function usePerusahaanVendorManage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const result = usePerusahaanVendor(page, search);

  function handleSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  return {
    ...result,
    search,
    page,
    setPage,
    handleSearch,
  };
}
