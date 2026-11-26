import { useCompanyList } from "@/hooks/use-company-list";
import { getAkunPerusahaan, getPengirimanBrosur, getRekapHarian, getRekapBulanan } from "@/lib/services/bdo-laporan.service";

export const useAkunPerusahaan = (page: number, search: string, kategori: string, kode: string) =>
  useCompanyList(getAkunPerusahaan, { page, limit: 10, search, kategori, kode });
export const usePengirimanBrosur = (page: number, search: string) =>
  useCompanyList(getPengirimanBrosur, { page, limit: 10, search });
export const useRekapHarian = (page: number, search: string, tanggal: string) =>
  useCompanyList(getRekapHarian, { page, limit: 10, search, tanggal });
export const useRekapBulanan = (page: number, search: string, bulan: string) =>
  useCompanyList(getRekapBulanan, { page, limit: 10, search, bulan });
