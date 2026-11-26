"use client";

import { useEffect } from "react";
import { useResource } from "@/hooks/use-resource";
import { suratService } from "@/lib/services/surat.service";
import type {
  CreatePermintaanSuratRequest,
  PermintaanNomorSurat,
  TipeSurat,
  UpdatePermintaanSuratRequest,
} from "@/lib/types/surat";

export function useDaftarSurat(tipe: TipeSurat) {
  const surat = useResource<
    PermintaanNomorSurat,
    number,
    CreatePermintaanSuratRequest,
    UpdatePermintaanSuratRequest
  >(suratService, { filter: { tipe }, pesanGagal: "Gagal mengambil data permintaan surat." });

  const { page, loading, error, setPage } = surat;
  const totalPages = Math.max(1, surat.totalPages);

  useEffect(() => {
    if (!loading && !error && page > totalPages) setPage(totalPages);
  }, [error, loading, page, setPage, totalPages]);

  return { ...surat, totalPages };
}
