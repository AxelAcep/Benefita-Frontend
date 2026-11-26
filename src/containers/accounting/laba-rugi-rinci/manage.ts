import { useLaporanLabaRugiRinci } from "@/hooks/use-laporan-keuangan";
import { usePeriodeAwal } from "@/components/laporan-shell";

export function useLabaRugiRinciManage() {
  const { data, loading, error, fetchData } = useLaporanLabaRugiRinci();
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
