"use client";

import { useResource } from "@/hooks/use-resource";
import { asesorService } from "@/lib/services/asesor.service";
import type {
  Asesor,
  CreateAsesorRequest,
  UpdateAsesorRequest,
} from "@/lib/types/asesor";

/** List + paginasi + search + CRUD asesor. Logikanya ada di useResource. */
export function useAsesor(limit = 10) {
  return useResource<Asesor, number, CreateAsesorRequest, UpdateAsesorRequest>(
    asesorService,
    { limit, pesanGagal: "Gagal mengambil data asesor" },
  );
}
