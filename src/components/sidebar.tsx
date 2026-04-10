"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Activity,
  Users,
  GraduationCap,
  Leaf,
  UserCog,
  Settings,
  LogOut,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import { Icons } from "@/assets";

interface NavChild {
  label: string;
  href: string;
}

interface NavItem {
  label: string;
  href?: string;
  icon: React.ElementType;
  children?: NavChild[];
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Perusahaan",
    icon: Building2,
    children: [
      { label: "Daftar Perusahaan", href: "/perusahaan" },
      { label: "Tambah Perusahaan", href: "/perusahaan/tambah" },
    ],
  },
  {
    label: "BDO & Aktivitas",
    icon: Activity,
    children: [
      { label: "Aktivitas BDO", href: "/bdo" },
      { label: "Laporan", href: "/bdo/laporan" },
    ],
  },
  {
    label: "Peserta & Sertifikasi",
    icon: Users,
    children: [
      { label: "Peserta", href: "/peserta" },
      { label: "Sertifikasi", href: "/peserta/sertifikasi" },
    ],
  },
  {
    label: "Training",
    icon: GraduationCap,
    children: [
      { label: "Kebutuhan Training per Customer", href: "/training/customer" },
      { label: "Manajemen Berita", href: "/training/berita" },
      { label: "Manajemen Jadwal Training", href: "/training/jadwal" },
      { label: "Manajemen Judul Training", href: "/training/judul" },
      { label: "Manajemen Trainer", href: "/training/trainer" },
      { label: "Manajemen Hotel", href: "/training/hotel" },
      { label: "Pengajuan Judul Training", href: "/training/pengajuan-judul" },
    ],
  },
  {
    label: "PROPER",
    href: "/proper",
    icon: Leaf,
  },
  {
    label: "Karyawan & Aktivitas",
    icon: UserCog,
    children: [
      { label: "Update Data", href: "/karyawan/update-data" },
      { label: "Daftar Login", href: "/karyawan/daftar-login" },
      { label: "Form Cuti", href: "/karyawan/form-cuti" },
      { label: "List Cuti", href: "/karyawan/list-cuti" },
      { label: "Riwayat Cuti", href: "/karyawan/riwayat-cuti" },
      { label: "Profil", href: "/karyawan/profil" },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const [mobileOpen, setMobileOpen] = useState(false);

  function toggleMenu(label: string) {
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  }

  function isActive(href?: string) {
    if (!href) return false;
    return pathname === href || pathname.startsWith(href + "/");
  }

  function isParentActive(item: NavItem) {
    if (item.href) return isActive(item.href);
    return item.children?.some((c) => isActive(c.href)) ?? false;
  }

  // Shared nav content — dipakai di desktop dan mobile
  function NavContent({ onLinkClick }: { onLinkClick?: () => void }) {
    return (
      <>
        {/* Nav */}
        <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isParentActive(item);
            const isOpen = openMenus[item.label];

            if (!item.children) {
              return (
                <Link
                  key={item.label}
                  href={item.href!}
                  onClick={onLinkClick}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    active
                      ? "bg-emerald-50 text-emerald-600"
                      : "text-zinc-600 hover:bg-emerald-50 hover:text-emerald-600"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            }

            return (
              <div key={item.label}>
                <button
                  onClick={() => toggleMenu(item.label)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    active
                      ? "bg-emerald-50 text-emerald-600"
                      : "text-zinc-600 hover:bg-emerald-50 hover:text-emerald-600"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="flex-1 text-left">{item.label}</span>
                  <ChevronDown
                    className={`w-3 h-3 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="mt-0.5 ml-3 pl-3 border-l border-zinc-200 space-y-0.5">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={onLinkClick}
                        className={`block px-2 py-1.5 rounded-md text-xs transition-colors ${
                          isActive(child.href)
                            ? "text-emerald-600 font-medium"
                            : "text-zinc-500 hover:text-emerald-600"
                        }`}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Bottom: Settings & Logout */}
        <div className="px-2 py-3 border-t border-zinc-200 space-y-0.5">
          <Link
            href="/pengaturan"
            onClick={onLinkClick}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
              isActive("/pengaturan")
                ? "bg-emerald-50 text-emerald-600"
                : "text-zinc-600 hover:bg-emerald-50 hover:text-emerald-600"
            }`}
          >
            <Settings className="w-4 h-4 shrink-0" />
            <span>Pengaturan</span>
          </Link>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              window.location.href = "/login";
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-zinc-600 hover:bg-red-50 hover:text-red-500 transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      {/* ─── Desktop Sidebar ─── */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 h-screen w-[250px] bg-white z-40">
        {/* Logo */}
        <div className="flex items-center px-4 py-4 border-b border-zinc-200">
          <div className="relative w-full h-8">
            <Image
              src={Icons.BenefitaText}
              alt="Benefita"
              fill
              className="object-contain"
              priority
              quality={100}
            />
          </div>
        </div>

        <NavContent />
      </aside>

      {/* ─── Mobile: Hamburger trigger ─── */}
      {/* Tombol ini dirender di AppLayout/Header, tapi bisa juga di sini */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-3 left-3 z-50 p-2 rounded-lg bg-white text-zinc-600 hover:text-emerald-600 transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* ─── Mobile Sidebar Overlay ─── */}
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="md:hidden fixed inset-0 z-40 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />

          {/* Sidebar panel — sama persis dengan desktop, cuma lebih narrow */}
          <aside className="md:hidden fixed left-0 top-0 h-screen w-[220px] bg-white z-50 flex flex-col">
            {/* Logo + close */}
            <div className="flex items-center gap-2 px-4 py-4 border-b border-zinc-200">
              <div className="relative flex-1 h-8">
                <Image
                  src={Icons.BenefitaText}
                  alt="Benefita"
                  fill
                  className="object-contain"
                  priority
                  quality={100}
                />
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="shrink-0 p-1 text-zinc-600 hover:text-emerald-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <NavContent onLinkClick={() => setMobileOpen(false)} />
          </aside>
        </>
      )}
    </>
  );
}