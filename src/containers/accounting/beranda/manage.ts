import { useState } from "react";

export function useBerandaManage() {
  const [bulan, setBulan] = useState("");
  const [pickKode, setPickKode] = useState<string | null>(null);


  return {
    bulan,
    setBulan,
    pickKode,
    setPickKode,
  };
}
