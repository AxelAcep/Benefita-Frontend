"use client";

import React from "react";
import Sidebar from "@/components/sidebar";
import Header from "@/components/training/header";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface AppLayoutProps {
  children: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  subtitle?: string;
  userName?: string;
  userRole?: string;
}

export default function AppLayout({
  children,
  breadcrumbs,
  subtitle,
  userName,
  userRole,
}: AppLayoutProps) {
  return (
    <div className="flex min-h-screen bg-zinc-100 overflow-hidden">
      <Sidebar />

      {/* Main area — offset by sidebar width on desktop */}
      <div className="flex flex-col flex-1 md:ml-[250px] min-w-0 overflow-x-hidden">
        <Header
          breadcrumbs={breadcrumbs}
          subtitle={subtitle}
          userName={userName}
          userRole={userRole}
        />
        <main className="flex-1 overflow-y-auto p-6 pb-20 md:pb-6">
          {children}
        </main>
      </div>
    </div>
  );
}