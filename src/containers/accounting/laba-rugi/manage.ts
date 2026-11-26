import { useState } from "react";
import { useBoolean } from "@/hooks/use-boolean";
import { useLaporanLabaRugi } from "@/hooks/use-laporan-keuangan";
import { exportLabaRugiExcel } from "@/lib/services/jurnal-keuangan.service";
import { usePeriodeAwal } from "@/components/laporan-shell";

export function useLabaRugiManage() {
  const { data, loading, error, fetchData } = useLaporanLabaRugi();
  const { startDate, setStartDate, endDate, setEndDate } = usePeriodeAwal(fetchData);
  // Kolom pembanding opsional (sheet IS menampilkan periode sebelumnya).
  const [bandingStart, setBandingStart] = useState("");
  const [bandingEnd, setBandingEnd] = useState("");

  function onTampilkan() {
    fetchData(
      startDate,
      endDate,
      bandingStart && bandingEnd ? { startDate: bandingStart, endDate: bandingEnd } : undefined,
    );
  }
  const { value: exporting, onTrue: onExportingTrue, onFalse: onExportingFalse } = useBoolean(false);
  const [notif, setNotif] = useState<{ message: string; type: "success" | "error"; key: number } | null>(null);

  async function onExportExcel() {
    onExportingTrue();
    try {
      await exportLabaRugiExcel(startDate, endDate);
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
    data,
    loading,
    error,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    bandingStart,
    setBandingStart,
    bandingEnd,
    setBandingEnd,
    onTampilkan,
    exporting,
    notif,
    onExportExcel,
    closeNotif: () => setNotif(null),
  };
}
