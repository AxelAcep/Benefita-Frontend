import { useCompanyList } from "@/hooks/use-company-list";
import { getKebutuhanTraining } from "@/lib/services/perusahaan-kebutuhan-training.service";

export function useKebutuhanTraining(page: number, search: string, kodeTraining: string) {
  return useCompanyList(getKebutuhanTraining, { page, limit: 10, search, kodeTraining }, Boolean(kodeTraining));
}
