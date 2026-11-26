import { useEffect, useState } from "react";
import { usePesertaLaporan } from "@/hooks/use-peserta-laporan";
import { getPesertaOpsi } from "@/lib/services/peserta-laporan.service";
import type { PesertaMode, PesertaOpsi } from "@/lib/types/peserta-laporan";

export function usePesertaLaporanManage(mode: PesertaMode) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [kode, setKode] = useState("");
  const [tahun, setTahun] = useState(mode.startsWith("rekap-") ? String(new Date().getFullYear()) : "");
  const [bulan, setBulan] = useState("");
  const [opsi, setOpsi] = useState<PesertaOpsi>({ tahun: [], kode: [] });
  const [optionsError, setOptionsError] = useState<string | null>(null);
  const result = usePesertaLaporan({ mode, page, limit: 10, search, kode, tahun, bulan });
  useEffect(() => {
    let batal = false;
    getPesertaOpsi().then((data) => { if (!batal) setOpsi(data); })
      .catch((error: unknown) => { if (!batal) setOptionsError(error instanceof Error ? error.message : "Gagal mengambil filter peserta."); });
    return () => { batal = true; };
  }, []);
  return {
    ...result, page, setPage, search, kode, tahun, bulan, opsi, optionsError,
    changeSearch(value: string) { setSearch(value); setPage(1); },
    changeKode(value: string) { setKode(value); setPage(1); },
    changeTahun(value: string) { setTahun(value); setBulan(""); setPage(1); },
    changeBulan(value: string) { setBulan(value); setTahun(""); setPage(1); },
  };
}
