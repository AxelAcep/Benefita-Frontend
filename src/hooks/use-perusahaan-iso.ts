import { useCompanyList } from "@/hooks/use-company-list";
import { getPerusahaanIsoList } from "@/lib/services/perusahaan.service";

export function usePerusahaanIso(
  page: number,
  search: string,
  sort: "asc" | "desc",
  liniBisnisId: number | "",
) {
  return useCompanyList(getPerusahaanIsoList, { page, limit: 10, search, sort, liniBisnisId });
}
