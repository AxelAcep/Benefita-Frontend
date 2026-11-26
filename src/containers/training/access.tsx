"use client";

import type { ReactNode } from "react";
import AppLayout from "@/components/app-layout";
import { usePermission } from "@/context/PermissionContext";
import { useCan } from "@/hooks/use-can";
import type { PermissionAction } from "@/lib/types/permission";

export function TrainingAccess({
  aksi,
  children,
}: {
  aksi: PermissionAction;
  children: ReactNode;
}) {
  const { isLoading, error, reload } = usePermission();
  const allowed = useCan("training", aksi);

  if (allowed) return children;

  return (
    <AppLayout breadcrumbs={[{ label: "Training" }]}>
      <div
        role={isLoading ? "status" : "alert"}
        className="rounded-xl border border-zinc-200 bg-white p-6 text-sm text-zinc-700"
      >
        <p>
          {isLoading
            ? "Memuat hak akses Training..."
            : error || "Anda tidak memiliki izin untuk mengakses bagian Training ini."}
        </p>
        {error && (
          <button
            type="button"
            className="mt-3 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white"
            onClick={() => void reload()}
          >
            Coba lagi
          </button>
        )}
      </div>
    </AppLayout>
  );
}
