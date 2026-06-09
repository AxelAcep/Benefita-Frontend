"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "@/components/sidebar";
import Header from "@/components/training/header";
import { getSession } from "@/lib/services/login.service";
import { getUserDetail } from "@/lib/services/login.service";
import type { UserDetail } from "@/lib/services/login.service";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface AppLayoutProps {
  children: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  subtitle?: string; // Tetap dipertahankan agar tidak merusak file lain
  userName?: string;
  userRole?: string;
}

export default function AppLayout({
  children,
  breadcrumbs,
  subtitle, // Tetap dideklarasikan di sini
  userName,
  userRole,
}: AppLayoutProps) {
  const [user, setUser] = useState<UserDetail | null>(null);

  // Mengambil tanggal hari ini dengan format Indonesia
  const todayFormatted = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date());

  // Nilai dari props 'subtitle' ditimpa langsung di sini
  const todaySubtitle = `Hari Ini : ${todayFormatted}`;

  useEffect(() => {
    const session = getSession();
    if (!session?.user?.id) return;

    getUserDetail(session.user.id).then(setUser).catch(console.error);
  }, []);

  return (
    <div className="flex min-h-screen bg-zinc-100 overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 md:ml-[250px] min-w-0 overflow-x-hidden">
        <Header
          breadcrumbs={breadcrumbs}
          subtitle={todaySubtitle} // Menggunakan variabel tanggal hari ini
          userName={user?.pegawai.nama}
          userRole={user?.role}
        />
        <main className="flex-1 overflow-y-auto p-6 pb-20 md:pb-6">
          {children}
        </main>
      </div>
    </div>
  );
}
