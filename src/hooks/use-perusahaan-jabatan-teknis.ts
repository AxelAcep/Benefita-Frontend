import { useCompanyList } from "@/hooks/use-company-list";
import { getPerusahaanJabatanTeknisList } from "@/lib/services/perusahaan-daftar.service";

export function usePerusahaanJabatanTeknis(page: number, search: string) {
  return useCompanyList(getPerusahaanJabatanTeknisList, { page, limit: 10, search });
}
