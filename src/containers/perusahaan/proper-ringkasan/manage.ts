import { useState } from "react";
import { useProperList } from "@/hooks/use-proper";

export function useProperRingkasanManage() {
  const [search, setSearch] = useState("");
  const [tahun, setTahun] = useState("2025");
  const [appliedTahun, setAppliedTahun] = useState("2025");

  const tahunNumber = parseInt(appliedTahun, 10);
  const { data, loading, error } = useProperList(
    isNaN(tahunNumber) ? 2026 : tahunNumber,
  );

  // Map data API ke format tabel (hanya 5 peringkat utama)
  const mappedData =
    data?.data.map((item) => ({
      id: item.id,
      provinsi: item.provinsi,
      emas: item.peringkat.EMAS ?? null,
      hijau: item.peringkat.HIJAU ?? null,
      biru: item.peringkat.BIRU ?? null,
      merah: item.peringkat.MERAH ?? null,
      hitam: item.peringkat.HITAM ?? null,
    })) ?? [];

  // Filter lokal
  const filtered = mappedData.filter((d) =>
    d.provinsi.toLowerCase().includes(search.toLowerCase()),
  );

  const totalKeseluruhan = data?.total ?? 0;

  function applyTahun() {
    setAppliedTahun(tahun);
  }

  return {
    search,
    setSearch,
    tahun,
    setTahun,
    loading,
    error,
    filtered,
    totalKeseluruhan,
    hasData: data !== null,
    applyTahun,
  };
}
