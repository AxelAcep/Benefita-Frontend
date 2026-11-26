import type { ReactNode } from "react";
import { ModuleAccess } from "@/components/base/module-access";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <ModuleAccess modul="pengaturan" label="Pengaturan">
      {children}
    </ModuleAccess>
  );
}
