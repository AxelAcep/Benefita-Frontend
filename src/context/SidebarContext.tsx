"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const SidebarContext = createContext<{
  desktopOpen: boolean;
  mobileOpen: boolean;
  toggle: () => void;
  close: () => void;
} | null>(null);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const previousPath = useRef(pathname);
  const [desktopOpen, setDesktopOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const close = useCallback(() => {
    setDesktopOpen(false);
    setMobileOpen(false);
  }, []);

  useEffect(() => {
    if (previousPath.current !== pathname) close();
    previousPath.current = pathname;
  }, [pathname, close]);

  function toggle() {
    if (window.matchMedia("(min-width: 768px)").matches) {
      setDesktopOpen((open) => !open);
    } else {
      setMobileOpen((open) => !open);
    }
  }

  return (
    <SidebarContext.Provider value={{ desktopOpen, mobileOpen, toggle, close }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) throw new Error("useSidebar harus dipakai di dalam SidebarProvider.");
  return context;
}
