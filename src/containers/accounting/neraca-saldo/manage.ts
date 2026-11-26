import { useNeracaSaldo } from "@/hooks/use-laporan-keuangan";
import { usePeriodeAwal } from "@/components/laporan-shell";

export function useNeracaSaldoManage() {
  const { data, loading, error, fetchData } = useNeracaSaldo();
  const { startDate, setStartDate, endDate, setEndDate } = usePeriodeAwal(fetchData);

  const onFilter = () => fetchData(startDate, endDate);

  return {
    data,
    loading,
    error,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    onFilter,
  };
}
