"use client";

import { useState, useEffect } from "react";
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

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// FULL NAV ITEMS (TIDAK DIPOTONG)
// ---------------------------------------------------------------------------

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
      {
        label: "Daftar Perusahaan Bersertifikat BNSP",
        href: "/perusahaan/bnsp",
      },
      {
        label: "Daftar Perusahaan Kantor Pusat",
        href: "/perusahaan/kantor-pusat",
      },
      { label: "Daftar Perusahaan TBK", href: "/perusahaan/tbk" },
      { label: "Daftar Perusahaan PROPER", href: "/perusahaan/proper" },
      {
        label: "Daftar Perusahaan PROPER 2x Kali Biru",
        href: "/perusahaan/proper-2kali-biru",
      },
      { label: "Daftar Perusahaan ISO", href: "/perusahaan/iso" },
      { label: "Daftar Perusahaan Customer", href: "/perusahaan/customer" },
      { label: "Daftar Perusahaan Prioritas", href: "/perusahaan/prioritas" },
      { label: "Daftar Perusahaan ENV : MA", href: "/perusahaan/env-ma" },
      { label: "Daftar Perusahaan Vendor", href: "/perusahaan/vendor" },
      {
        label: "Daftar Perusahaan Per. berdasarkan Alamat",
        href: "/perusahaan/berdasarkan-alamat",
      },
      { label: "Daftar Jabatan Teknis", href: "/perusahaan/jabatan-teknis" },
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
    ],
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function Sidebar() {
  const pathname = usePathname();

  // ✅ Persist state
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>(() => {
    if (typeof window !== "undefined") {
      try {
        return JSON.parse(localStorage.getItem("openMenus") || "{}");
      } catch {
        return {};
      }
    }
    return {};
  });

  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("openMenus", JSON.stringify(openMenus));
  }, [openMenus]);

  function toggleMenu(label: string) {
    setOpenMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  }

  function isActive(href?: string) {
    if (!href) return false;
    return pathname === href || pathname.startsWith(href + "/");
  }

  function isParentActive(item: NavItem) {
    if (item.href) return isActive(item.href);
    return item.children?.some((c) => isActive(c.href)) ?? false;
  }

  function NavContent({ onLinkClick }: { onLinkClick?: () => void }) {
    return (
      <>
        <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isParentActive(item);

            // 🔥 ini kuncinya
            const isOpen = openMenus[item.label] ?? active;

            if (!item.children) {
              return (
                <Link
                  key={item.label}
                  href={item.href!}
                  onClick={onLinkClick}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium ${
                    active
                      ? "bg-emerald-50 text-emerald-600"
                      : "text-zinc-600 hover:bg-emerald-50 hover:text-emerald-600"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            }

            return (
              <div key={item.label}>
                <button
                  onClick={() => toggleMenu(item.label)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium ${
                    active
                      ? "bg-emerald-50 text-emerald-600"
                      : "text-zinc-600 hover:bg-emerald-50 hover:text-emerald-600"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="flex-1 text-left">{item.label}</span>
                  <ChevronDown
                    className={`w-3 h-3 transition-transform ${
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
                        className={`block px-2 py-1.5 text-xs ${
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

        {/* Bottom */}
        <div className="px-2 py-3 border-t border-zinc-200 space-y-0.5">
          <Link
            href="/karyawan/profil"
            className="flex items-center gap-2.5 px-3 py-2 text-xs text-zinc-600 hover:text-emerald-600"
          >
            <Settings className="w-4 h-4" />
            <span>Pengaturan</span>
          </Link>

          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              window.location.href = "/login";
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-zinc-600 hover:text-red-500"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Desktop */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 h-screen w-[250px] bg-white">
        <div className="flex justify-center pb-4 pt-4">
          <div className="w-full max-w-[10rem]">
            <Image
              src={Icons.BenefitaText}
              alt="logo"
              className="w-full h-auto object-contain"
              priority
            />
          </div>
        </div>

        <NavContent />
      </aside>

      {/* Mobile */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-3 left-3 z-50 p-2 bg-white rounded"
      >
        <Menu className="w-5 h-5" />
      </button>

      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />

          <aside className="fixed left-0 top-0 h-screen w-[220px] bg-white z-50">
            <button onClick={() => setMobileOpen(false)}>
              <X />
            </button>
            <NavContent />
          </aside>
        </>
      )}
    </>
  );
}
