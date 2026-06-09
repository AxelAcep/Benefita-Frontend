"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import Sidebar from "@/components/sidebar";
import DashboardHeader from "@/components/dashboard/header";
import MarketingActivityTable from "@/components/dashboard/MarketingActivity";
import JadwalFix from "@/components/dashboard/jadwalfix";
import KalenderTraining from "@/components/dashboard/kalender";
import MarketingChart from "@/components/dashboard/MarketingChart";
import MarketingStatCards from "@/components/dashboard/MarketingStatCards";
import JadwalFIXChart from "@/components/dashboard/JadwalFixChart";

// Pisah komponen kecil buat useSearchParams (wajib dibungkus Suspense di Next.js)
function ForbiddenToast() {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("forbidden") === "1") {
      toast.error("🚫 Anda tidak memiliki akses ke halaman tersebut.", {
        description: "Hubungi administrator jika Anda merasa ini keliru.",
        duration: 4000,
      });
      // Bersihkan query param dari URL tanpa reload
      window.history.replaceState({}, "", "/dashboard");
    }
  }, [searchParams]);

  return null;
}

export default function Home() {
  const [viewMode, setViewMode] = useState<"table" | "chart">("table");

  return (
    <div className="flex min-h-screen bg-zinc-100 overflow-hidden">
      <Suspense fallback={null}>
        <ForbiddenToast />
      </Suspense>
      <Sidebar />
      <div className="flex flex-col flex-1 md:ml-[250px] min-w-0 overflow-x-hidden">
        <DashboardHeader viewMode={viewMode} onViewModeChange={setViewMode} />

        {viewMode === "table" && (
          <>
            <MarketingActivityTable />
            <JadwalFix />
            <KalenderTraining />
          </>
        )}

        {viewMode === "chart" && (
          <>
            <MarketingStatCards />
            <MarketingChart />
            <JadwalFIXChart />
            <KalenderTraining />
          </>
        )}
      </div>
    </div>
  );
}
