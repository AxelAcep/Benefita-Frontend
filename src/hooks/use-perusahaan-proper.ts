import { useCompanyList } from "@/hooks/use-company-list";
import { getPerusahaanProperList } from "@/lib/services/perusahaan.service";
import type { PeringkatProper } from "@/lib/types/perusahaan-proper";

export function usePerusahaanProper(
  page: number,
  search: string,
  sort: "asc" | "desc",
  peringkat: PeringkatProper | "",
  liniBisnisId: number | "",
) {
  return useCompanyList(getPerusahaanProperList, { page, limit: 10, search, sort, peringkat, liniBisnisId });
}
