"use client";

import { useState } from "react";
import AppLayout from "@/components/app-layout";
import { useRole } from "@/hooks/use-role";
import { DaftarInstansi } from "./components/daftar-instansi";
import TabAlokasiAkun from "./components/tab-alokasi-akun";
import TabDaily from "./components/tab-daily";
import TabGroup from "./components/tab-group";

const INSTANSI = {
  perusahaan: { label: "Perusahaan", jenisInstansi: "PERUSAHAAN" },
  "rumah-sakit": { label: "Rumah Sakit", jenisInstansi: "RUMAH_SAKIT" },
  pemda: { label: "PEMDA", jenisInstansi: "PEMDA" },
  "instansi-daerah": { label: "Instansi Daerah", jenisInstansi: "INSTANSI_DAERAH" },
  sekolah: { label: "Sekolah", jenisInstansi: "SEKOLAH" },
} as const;

type Instansi = keyof typeof INSTANSI;
const jenis = Object.keys(INSTANSI) as Instansi[];
const TABS = [
  ...jenis.map((key) => ({ key, label: INSTANSI[key].label })),
  { key: "group", label: "Group" },
  { key: "daily", label: "Daily" },
  { key: "alokasi-akun", label: "Alokasi Akun" },
] as const;
type TabKey = (typeof TABS)[number]["key"];

export default function DatabaseContainer() {
  const [active, setActive] = useState<TabKey>("perusahaan");
  const { isAdmin } = useRole();
  const instansi = active === "group" || active === "daily" || active === "alokasi-akun" ? null : INSTANSI[active];

  return (
    <AppLayout breadcrumbs={[{ label: "Database" }, { label: "Instansi/Perusahaan" }]}>
      <div className="mb-5 flex overflow-x-auto border-b border-zinc-200">
        {TABS.map((tab) => (
          <button
            type="button"
            key={tab.key}
            aria-pressed={active === tab.key}
            onClick={() => setActive(tab.key)}
            className="whitespace-nowrap border-b-2 border-transparent px-4 py-2.5 text-xs font-semibold text-zinc-600 aria-pressed:border-emerald-600 aria-pressed:text-emerald-700"
          >
            {tab.label}
          </button>
        ))}
      </div>
      {instansi && <DaftarInstansi key={active} slug={active} {...instansi} />}
      {active === "group" && <TabGroup />}
      {active === "daily" && isAdmin && <TabDaily id="daily" />}
      {active === "alokasi-akun" && isAdmin && <TabAlokasiAkun />}
      {(active === "daily" || active === "alokasi-akun") && !isAdmin && (
        <p role="alert" className="py-12 text-center text-sm text-zinc-600">Anda tidak memiliki akses ke tab ini.</p>
      )}
    </AppLayout>
  );
}
