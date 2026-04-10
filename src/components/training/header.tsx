"use client";

import React from "react";
import { Menu } from "lucide-react";
import { generatePastelBg, generatePastelText } from "@/lib/pastelColor";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface HeaderProps {
  onMenuClick?: () => void;
  breadcrumbs?: BreadcrumbItem[];
  subtitle?: string;
  userName?: string;
  userRole?: string;
}

export default function Header({
  onMenuClick,
  breadcrumbs = [],
  subtitle,
  userName = "Nanang",
  userRole = "Super Admin",
}: HeaderProps) {
  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const initials = userName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="px-6 py-4 bg-white border-b border-zinc-100 flex items-center justify-between">
      {/* Left */}
      <div className="flex items-center gap-3 min-w-0">

        <div className="min-w-0">
          {/* Breadcrumb */}
          {breadcrumbs.length > 0 && (
            <p className="text-xs text-zinc-400">
              {breadcrumbs.map((crumb, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <span> &rsaquo; </span>}
                  {crumb.href ? (
                    <a href={crumb.href} className="hover:text-zinc-700 transition-colors">
                      {crumb.label}
                    </a>
                  ) : (
                    <span className="font-semibold text-zinc-700">{crumb.label}</span>
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

      {/* Right: user */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="text-right">
          <p className="text-xs font-semibold text-zinc-800">{userName}</p>
          <p className="text-[10px] text-zinc-400">{userRole}</p>
        </div>
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
          style={{
            backgroundColor: generatePastelBg(userName),
            color: generatePastelText(userName),
          }}
        >
          {initials}
        </div>
      </div>
    </div>
  );
}