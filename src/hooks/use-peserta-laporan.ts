import { useCompanyList } from "@/hooks/use-company-list";
import { getPesertaLaporan } from "@/lib/services/peserta-laporan.service";
import type { ListParams } from "@/lib/api/client";

export const usePesertaLaporan = (params: ListParams) => useCompanyList(getPesertaLaporan, params);
