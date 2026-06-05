// app/database/instansi-perusahaan/page.tsx
"use client";

import React, { useState } from "react";
import AppLayout from "@/components/app-layout";
import TabPerusahaan from "./tab-perusahaan";
import TabRumahSakit from "./tab-rumah-sakit";
import TabPemda from "./tab-pemda";
import TabInstansiDaerah from "./tab-instansi-daerah";
import TabSekolah from "./tab-sekolah";
import TabDaily from "./tab-daily";
import TabAlokasiAkun from "./tab-alokasi-akun";

type TabKey =
  | "perusahaan"
  | "rumah-sakit"
  | "pemda"
  | "instansi-daerah"
  | "sekolah"
  | "daily"
  | "alokasi-akun";

const TABS: { key: TabKey; label: string }[] = [
  { key: "perusahaan", label: "Perusahaan" },
  { key: "rumah-sakit", label: "Rumah Sakit" },
  { key: "pemda", label: "PEMDA" },
  { key: "instansi-daerah", label: "Instansi Daerah" },
  { key: "sekolah", label: "Sekolah" },
  { key: "daily", label: "Daily" },
  { key: "alokasi-akun", label: "Alokasi Akun" },
];

export default function InstansiPerusahaanPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("perusahaan");

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Database", href: "/database" },
        { label: "Instansi/Perusahaan" },
      ]}
      subtitle="Hari ini: Selasa, 3 Februari 2026"
      userName="Nanang"
      userRole="Super Admin"
    >
      {/* Tabs */}
      <div className="flex border-b border-zinc-200 mb-5 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 -mb-px ${
              activeTab === tab.key
                ? "border-emerald-500 text-emerald-600"
                : "border-transparent text-zinc-500 hover:text-zinc-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "perusahaan" && <TabPerusahaan />}
      {activeTab === "rumah-sakit" && <TabRumahSakit />}
      {activeTab === "pemda" && <TabPemda />}
      {activeTab === "instansi-daerah" && <TabInstansiDaerah />}
      {activeTab === "sekolah" && <TabSekolah />}
      {activeTab === "daily" && <TabDaily id="daily" />}
      {activeTab === "alokasi-akun" && <TabAlokasiAkun />}
    </AppLayout>
  );
}
