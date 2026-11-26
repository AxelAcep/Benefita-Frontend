import { useCompanyList } from "@/hooks/use-company-list";
import { getPerusahaanCustomerList } from "@/lib/services/perusahaan.service";

export function usePerusahaanCustomer(
  page: number,
  search: string,
  tahun: number | "",
) {
  return useCompanyList(getPerusahaanCustomerList, { page, limit: 10, search, tahun });
}
