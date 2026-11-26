"use client";

import React from "react";
import { SidebarToggle } from "@/components/sidebar-toggle";
import { generatePastelBg, generatePastelText } from "@/lib/pastelColor";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface HeaderProps {
  onMenuClick?: () => void;
  breadcrumbs?: BreadcrumbItem[];
  subtitle?: string;
  /** Null atau kosong selama sesi belum terbaca. */
  userName?: string | null;
  userRole?: string | null;
}

/**
 * Inisial dari nama, maksimal dua huruf. Nama kosong menghasilkan string
 * kosong, bukan error.
 */
function inisial(nama: string): string {
  return nama
    .split(/\s+/)
    .filter(Boolean)
    .map((bagian) => bagian[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function Header({
  breadcrumbs = [],
  subtitle,
  userName,
  userRole,
}: HeaderProps) {
  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Tidak ada nilai bawaan berupa nama orang. Versi lama memakai
  // userName = "Nanang" dan userRole = "Super Admin", sehingga header
  // menampilkan identitas yang salah selama sesi belum terbaca — dan
  // seterusnya kalau pembacaannya gagal.
  const nama = userName?.trim() ?? "";
  const peran = userRole?.trim() ?? "";
  const adaUser = nama.length > 0;

  return (
    <div className="px-6 py-4 bg-white border-b border-zinc-100 flex items-center justify-between">
      <div className="flex items-center gap-3 min-w-0">
        <SidebarToggle />
        <div className="min-w-0">
          {breadcrumbs.length > 0 && (
            <p className="text-xs text-zinc-400">
              {breadcrumbs.map((crumb, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <span> &rsaquo; </span>}
                  {crumb.href ? (
                    <a
                      href={crumb.href}
                      className="hover:text-zinc-700 transition-colors"
                    >
                      {crumb.label}
                    </a>
                  ) : (
                    <span className="font-semibold text-zinc-700">
                      {crumb.label}
                    </span>
                  )}
                </React.Fragment>
              ))}
            </p>
          )}
          <p className="text-xs text-zinc-400 mt-0.5">
            {subtitle ?? `Hari ini: ${today}`}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {adaUser ? (
          <>
            <div className="text-right">
              <p className="text-xs font-semibold text-zinc-800">{nama}</p>
              {peran && <p className="text-[10px] text-zinc-400">{peran}</p>}
            </div>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
              style={{
                backgroundColor: generatePastelBg(nama),
                color: generatePastelText(nama),
              }}
            >
              {inisial(nama)}
            </div>
          </>
        ) : (
          // Rangka kosong selama nama belum ada, supaya tata letaknya tidak
          // bergeser dan tidak ada identitas palsu yang tampil.
          <>
            <div className="text-right space-y-1" aria-hidden="true">
              <div className="h-3 w-20 rounded bg-zinc-100" />
              <div className="h-2 w-12 rounded bg-zinc-100 ml-auto" />
            </div>
            <div className="w-8 h-8 rounded-full bg-zinc-100 shrink-0" />
          </>
        )}
      </div>
    </div>
  );
}
