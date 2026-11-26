"use client";

import React from "react";
import Sidebar from "@/components/sidebar";
import Header from "@/components/training/header";
import { useAuth } from "@/context/AuthContext";
import { useSidebar } from "@/context/SidebarContext";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface AppLayoutProps {
  children: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
}

export default function AppLayout({ children, breadcrumbs }: AppLayoutProps) {
  // Nama dan role diambil dari sesi, bukan dari permintaan tambahan.
  // Backend sudah mengirim nama pegawai saat login dan refresh
  // (user.controller.js: `nama: user.pegawai.nama`), jadi nilainya tersedia
  // sejak render pertama. Versi lama memanggil getUserDetail() di dalam
  // useEffect, sehingga header sempat kosong lalu terisi, dan kegagalannya
  // ditelan console.error.
  const { user } = useAuth();
  const { desktopOpen } = useSidebar();

  const hariIni = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date());

  return (
    <div className="flex min-h-screen bg-zinc-100 overflow-hidden">
      <Sidebar />
      <div className={`flex flex-col flex-1 min-w-0 overflow-x-hidden ${desktopOpen ? "md:ml-[220px]" : ""}`}>
        <Header
          breadcrumbs={breadcrumbs}
          subtitle={`Hari Ini : ${hariIni}`}
          userName={user?.nama}
          userRole={user?.role}
        />
        <main className="flex-1 overflow-y-auto p-6 pb-20 md:pb-6">
          {children}
        </main>
      </div>
    </div>
  );
}
