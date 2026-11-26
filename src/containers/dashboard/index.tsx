"use client";
import { useState, Suspense } from "react";
import { ForbiddenToast } from "./forbidden-toast";
import Sidebar from "@/components/sidebar";
import DashboardHeader from "@/components/dashboard/header";
import MarketingActivityTable from "@/components/dashboard/MarketingActivity";
import JadwalFix from "@/components/dashboard/jadwalfix";
import KalenderTraining from "@/components/dashboard/kalender";
import MarketingChart from "@/components/dashboard/MarketingChart";
import MarketingStatCards from "@/components/dashboard/MarketingStatCards";
import JadwalFIXChart from "@/components/dashboard/JadwalFixChart";

export default function DashboardContainer() {
  const [viewMode, setViewMode] = useState<"table" | "chart">("table");

  return (
    <div className="flex min-h-screen bg-zinc-100 overflow-hidden">
      <Suspense fallback={null}>
        <ForbiddenToast />
      </Suspense>
      <Sidebar />
      <div className="flex flex-col flex-1 md:ml-[250px] min-w-0 overflow-x-hidden">
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
