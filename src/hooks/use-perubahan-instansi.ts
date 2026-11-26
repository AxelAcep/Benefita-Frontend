"use client";

import { useResource } from "@/hooks/use-resource";
import { logPerubahanService } from "@/lib/services/log-perubahan.service";
import type { LogPerubahanItem } from "@/lib/types/log-perubahan";

export function useLogPerubahan() {
  return useResource<LogPerubahanItem>(logPerubahanService);
}
