"use client";

import { Menu, PanelLeftClose } from "lucide-react";
import { useSidebar } from "@/context/SidebarContext";

export function SidebarToggle() {
  const { desktopOpen, mobileOpen, toggle } = useSidebar();
  return (
    <>
      {[
        { open: desktopOpen, className: "hidden md:inline-flex", controls: "desktop-sidebar" },
        { open: mobileOpen, className: "inline-flex md:hidden", controls: "mobile-sidebar" },
      ].map(({ open, className, controls }) => (
        <button
          key={className}
          type="button"
          onClick={toggle}
          aria-label={open ? "Tutup sidebar" : "Buka sidebar"}
          aria-expanded={open}
          aria-controls={controls}
          className={`${className} shrink-0 items-center justify-center rounded-lg p-2 text-zinc-600 transition-colors hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-emerald-600`}
        >
          {open ? <PanelLeftClose aria-hidden="true" className="size-5" /> : <Menu aria-hidden="true" className="size-5" />}
        </button>
      ))}
    </>
  );
}
