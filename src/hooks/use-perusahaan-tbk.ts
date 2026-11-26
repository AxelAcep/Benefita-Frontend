import { useCompanyList } from "@/hooks/use-company-list";
import { getPerusahaanTbkList } from "@/lib/services/perusahaan.service";

export function usePerusahaanTbk(
  page: number,
  search: string,
  sort: "asc" | "desc",
) {
  return useCompanyList(getPerusahaanTbkList, { page, limit: 10, search, sort });
}
