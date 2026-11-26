import { useEffect, useState } from "react";
import { useBoolean } from "@/hooks/use-boolean";
import { useLaporanNeraca } from "@/hooks/use-laporan-keuangan";
import { exportNeracaExcel } from "@/lib/services/jurnal-keuangan.service";

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}
export function useNeracaBaruManage() {
  const [tanggal, setTanggal] = useState(todayIso());
  const [tanggalPembanding, setTanggalPembanding] = useState("");
  const { data, loading, error, fetchData } = useLaporanNeraca();
  const { value: exporting, onTrue: onExportingTrue, onFalse: onExportingFalse } = useBoolean(false);
  const [notif, setNotif] = useState<{ message: string; type: "success" | "error"; key: number } | null>(null);

  useEffect(() => {
    fetchData(todayIso());
  }, [fetchData]);

  async function onExportExcel() {
    onExportingTrue();
    try {
      await exportNeracaExcel(tanggal);
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
    tanggal,
    setTanggal,
    tanggalPembanding,
    setTanggalPembanding,
    data,
    loading,
    error,
    exporting,
    notif,
    onExportExcel,
    closeNotif: () => setNotif(null),
    onFilter: () => fetchData(tanggal, tanggalPembanding || undefined),
  };
}
