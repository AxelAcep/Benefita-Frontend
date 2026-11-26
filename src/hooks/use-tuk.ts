"use client";

import { useResource } from "@/hooks/use-resource";
import { tukService } from "@/lib/services/tuk.service";
import type { CreateTUKRequest, TUK, UpdateTUKRequest } from "@/lib/types/tuk";

/** List + paginasi + search + CRUD TUK. Logikanya ada di useResource. */
export function useTUK(limit = 10) {
  return useResource<TUK, number, CreateTUKRequest, UpdateTUKRequest>(
    tukService,
    { limit, pesanGagal: "Gagal mengambil data TUK" },
  );
}
