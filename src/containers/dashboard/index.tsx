"use client";
import { useState, Suspense } from "react";
import { ForbiddenToast } from "./forbidden-toast";
import Sidebar from "@/components/sidebar";
import { useSidebar } from "@/context/SidebarContext";
import DashboardHeader from "@/components/dashboard/header";
import MarketingActivityTable from "@/components/dashboard/MarketingActivity";
import JadwalFix from "@/components/dashboard/jadwalfix";
import KalenderTraining from "@/components/dashboard/kalender";
import MarketingChart from "@/components/dashboard/MarketingChart";
import MarketingStatCards from "@/components/dashboard/MarketingStatCards";
import JadwalFIXChart from "@/components/dashboard/JadwalFixChart";
import PengingatModal from "@/components/dashboard/pengingat-modal";

export default function DashboardContainer() {
  const [viewMode, setViewMode] = useState<"table" | "chart">("table");
  const { desktopOpen } = useSidebar();

  return (
    <div className="flex min-h-screen bg-zinc-100 overflow-hidden">
      <Suspense fallback={null}>
        <ForbiddenToast />
      </Suspense>
      <PengingatModal />
      <Sidebar />
      <div className={`flex flex-col flex-1 min-w-0 overflow-x-hidden ${desktopOpen ? "md:ml-[220px]" : ""}`}>
        <DashboardHeader viewMode={viewMode} onViewModeChange={setViewMode} />

        {viewMode === "table" ? (
          <>
            <MarketingActivityTable />
            <JadwalFix />
          </>
        ) : (
          <>
            <MarketingStatCards />
            <MarketingChart />
            <JadwalFIXChart />
          </>
        )}
        <KalenderTraining />
      </div>
    </div>
  );
}
