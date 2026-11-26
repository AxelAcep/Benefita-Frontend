"use client";

import { useResource } from "@/hooks/use-resource";
import { pegawaiLoginService } from "@/lib/services/pegawai-login.service";
import type { PegawaiLoginItem } from "@/lib/types/pegawai-login";

export function usePegawaiLogin() {
  return useResource<PegawaiLoginItem>(pegawaiLoginService);
}
