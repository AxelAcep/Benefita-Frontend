import { apiGet } from "@/lib/api/client";
import type { MyPermissions } from "@/lib/types/permission";

export const getMyPermissions = (): Promise<MyPermissions> =>
  apiGet<MyPermissions>(
    "/api/permission/me",
    undefined,
    "Gagal mengambil hak akses.",
  );
