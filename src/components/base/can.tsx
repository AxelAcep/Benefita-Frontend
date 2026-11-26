"use client";

import type { ReactNode } from "react";
import { useCan } from "@/hooks/use-can";
import type { PermissionAction } from "@/lib/types/permission";

interface CanProps {
  modul: string;
  aksi: PermissionAction;
  children: ReactNode;
  fallback?: ReactNode;
}

export function Can({ modul, aksi, children, fallback = null }: CanProps) {
  return useCan(modul, aksi) ? children : fallback;
}
