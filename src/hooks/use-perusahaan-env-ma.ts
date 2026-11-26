import { useCompanyList } from "@/hooks/use-company-list";
import { getPerusahaanEnvMaList } from "@/lib/services/perusahaan-daftar.service";

export function usePerusahaanEnvMa(page: number, search: string, liniBisnisId: number | "") {
  return useCompanyList(getPerusahaanEnvMaList, { page, limit: 10, search, liniBisnisId });
}
