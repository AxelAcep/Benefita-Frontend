import { useState } from "react";

export function useLabaRugi2023Manage() {
  const [tanggal, setTanggal] = useState("");

  return {
    tanggal,
    setTanggal,
  };
}
