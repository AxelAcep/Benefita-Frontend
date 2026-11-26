import type { ReactNode } from "react";
import { TrainingAccess } from "@/containers/training/access";

export default function Layout({ children }: { children: ReactNode }) {
  return <TrainingAccess aksi="read">{children}</TrainingAccess>;
}
