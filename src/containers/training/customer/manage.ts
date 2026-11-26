"use client";

/**
 * Keadaan halaman Kebutuhan Training per Customer: pencarian dan filter
 * kode training yang baru berlaku setelah tombol Terapkan ditekan.
 */
import { useState } from "react";
import { useResource } from "@/hooks/use-resource";
import { customerTrainingService } from "@/lib/services/customer-training.service";
import { getJudulTrainingOptions } from "@/lib/services/dropdown.service";
import { useEffect } from "react";
import type { CustomerTraining } from "@/lib/types/customer-training";

export const UKURAN_HALAMAN = 10;

export function useCustomerManage() {
  const resource = useResource<CustomerTraining, string>(
    customerTrainingService,
    {
      limit: UKURAN_HALAMAN,
      filter: { kodeTraining: "" },
      pesanGagal: "Gagal mengambil data kebutuhan training",
    },
  );

  // Nilai yang sedang dipilih dipisah dari yang sudah berlaku.
  const [draftKode, setDraftKode] = useState("");
  const [kodeOptions, setKodeOptions] = useState<string[]>([]);

  useEffect(() => {
    let batal = false;

    getJudulTrainingOptions()
      .then((opsi) => {
        if (batal) return;
        // Kode training diambil dari master judul training, bukan dipaku.
        setKodeOptions([...new Set(opsi.map((o) => o.kode).filter(Boolean))]);
      })
      // Dropdown kosong lebih baik daripada halaman gagal dimuat.
      .catch(() => {})

    return () => {
      batal = true;
    };
  }, []);

  return {
    ...resource,
    draftKode,
    setDraftKode,
    kodeOptions,
    kodeAktif: resource.filter.kodeTraining ?? "",
    terapkanFilter: () => resource.setFilter("kodeTraining", draftKode),
    resetFilter: () => {
      setDraftKode("");
      resource.setFilter("kodeTraining", "");
    },
  };
}
