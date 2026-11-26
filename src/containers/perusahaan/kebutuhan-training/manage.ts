import { useEffect, useState } from "react";
import { useKebutuhanTraining } from "@/hooks/use-kebutuhan-training";
import { getKodeKebutuhanTraining, type KodePelatihanOption } from "@/lib/services/perusahaan-kebutuhan-training.service";

export function useKebutuhanTrainingManage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [kodeTraining, setKodeTraining] = useState("");
  const [options, setOptions] = useState<KodePelatihanOption[]>([]);
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [optionsError, setOptionsError] = useState<string | null>(null);
  const result = useKebutuhanTraining(page, search, kodeTraining);
  useEffect(() => {
    let batal = false;
    getKodeKebutuhanTraining()
      .then((data) => { if (!batal) setOptions(data); })
      .catch((err: unknown) => {
        if (!batal) setOptionsError(err instanceof Error ? err.message : "Gagal mengambil kode pelatihan.");
      })
      .finally(() => { if (!batal) setOptionsLoading(false); });
    return () => { batal = true; };
  }, []);
  function changeKode(value: string) { setKodeTraining(value); setPage(1); }
  function changeSearch(value: string) { setSearch(value); setPage(1); }
  return { ...result, page, setPage, search, changeSearch, kodeTraining, changeKode, options, optionsLoading, optionsError };
}
