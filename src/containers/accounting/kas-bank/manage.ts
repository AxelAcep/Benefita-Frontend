import { useEffect, useState } from "react";
import { useBoolean } from "@/hooks/use-boolean";
import { useKasBank } from "@/hooks/use-laporan-keuangan";
import { exportKasBankExcel } from "@/lib/services/jurnal-keuangan.service";

function awalBulanIni() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10);
}

function hariIni() {
  return new Date().toISOString().slice(0, 10);
}

export function useKasBankManage() {
  const [startDate, setStartDate] = useState(awalBulanIni());
  const [endDate, setEndDate] = useState(hariIni());
  const [search, setSearch] = useState("");
  const { data, loading, error, fetchData } = useKasBank();
  const { value: exporting, onTrue: onExportingTrue, onFalse: onExportingFalse } = useBoolean(false);
  const [notif, setNotif] = useState<{ message: string; type: "success" | "error"; key: number } | null>(null);

  useEffect(() => {
    fetchData({ startDate: awalBulanIni(), endDate: hariIni() });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onFilter() {
    fetchData({ startDate: startDate || undefined, endDate: endDate || undefined, search: search || undefined });
  }

  function onSearch(value: string) {
    setSearch(value);
    fetchData({ startDate: startDate || undefined, endDate: endDate || undefined, search: value || undefined });
  }

  async function onExportExcel() {
    onExportingTrue();
    try {
      await exportKasBankExcel({ startDate: startDate || undefined, endDate: endDate || undefined });
    } catch (err) {
      setNotif({
        message: err instanceof Error ? err.message : "Gagal mengunduh Excel",
        type: "error",
        key: Date.now(),
      });
    } finally {
      onExportingFalse();
    }
  }

  return {
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    search,
    data,
    loading,
    error,
    exporting,
    notif,
    onFilter,
    onSearch,
    onExportExcel,
    closeNotif: () => setNotif(null),
  };
}
