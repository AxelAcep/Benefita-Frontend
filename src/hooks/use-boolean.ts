// hooks/use-boolean.ts
// Dipakai buat semua boolean flag di modul Jurnal Keuangan/Buku Besar/dst
// sesuai instruksi konvensi task Finance Module.
import { useState, useCallback } from "react";

export function useBoolean(initialValue: boolean = false) {
  const [value, setValue] = useState(initialValue);

  const onTrue = useCallback(() => setValue(true), []);
  const onFalse = useCallback(() => setValue(false), []);
  const onToggle = useCallback(() => setValue((prev) => !prev), []);

  return { value, onTrue, onFalse, onToggle, setValue };
}
