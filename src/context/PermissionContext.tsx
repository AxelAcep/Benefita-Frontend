"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";
import { useMyPermissions } from "@/hooks/use-my-permissions";
import type { MyPermissions } from "@/lib/types/permission";

interface PermissionContextValue {
  permissions: MyPermissions;
  isLoading: boolean;
  error: string | null;
  reload: () => Promise<void>;
}

const denied: PermissionContextValue = {
  permissions: {},
  isLoading: false,
  error: null,
  reload: async () => {},
};

const PermissionContext = createContext<PermissionContextValue>(denied);

export function usePermission() {
  return useContext(PermissionContext);
}

function AuthenticatedPermissions({ children }: { children: ReactNode }) {
  const value = useMyPermissions();
  return <PermissionContext.Provider value={value}>{children}</PermissionContext.Provider>;
}

export function PermissionProvider({ children }: { children: ReactNode }) {
  const { user, status } = useAuth();

  if (status !== "authenticated" || !user) {
    return (
      <PermissionContext.Provider value={{ ...denied, isLoading: status === "loading" }}>
        {children}
      </PermissionContext.Provider>
    );
  }

  // Remount saat sesi/role berganti: render pertama pun tidak memakai izin lama.
  return (
    <AuthenticatedPermissions key={JSON.stringify([user.id, user.role])}>
      {children}
    </AuthenticatedPermissions>
  );
}
