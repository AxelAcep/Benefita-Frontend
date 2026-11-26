import { useParams } from "next/navigation";
import { useJadwalPesertaLinks } from "@/hooks/use-informas-link";

export function usePengumumanManage() {
  const { noJadwal } = useParams<{ noJadwal: string }>();

  const { data, isLoading, error } = useJadwalPesertaLinks({ noJadwal });

  const origin = typeof window !== "undefined" ? window.location.origin : "";

  return {
    data,
    isLoading,
    error,
    origin,
  };
}
