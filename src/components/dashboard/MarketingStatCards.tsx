"use client";

interface StatCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  progress?: number;
  progressLabel?: string;
  progressValue?: string;
}

function StatCard({ title, icon, children, progress, progressLabel, progressValue }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm px-4 py-4 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <span className="text-xs text-zinc-400 leading-snug pr-2">{title}</span>
        <span className="text-emerald-400 shrink-0">{icon}</span>
      </div>
      <div>{children}</div>
      {progress !== undefined && (
        <div>
          <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-emerald-400 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-[10px] text-zinc-400">{progressLabel}</span>
            <span className="text-[10px] font-semibold text-zinc-500">{progressValue}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MarketingStatCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 px-4 pt-4">

      {/* Kunjungan Hari Ini */}
      <StatCard
        title="Kunjungan Hari Ini (vs Target)"
        icon={<span className="text-lg">🏢</span>}
        progress={40}
        progressLabel="Target Tercapai"
        progressValue="40%"
      >
        <p className="text-2xl font-bold text-zinc-800">
          32 <span className="text-sm font-normal text-zinc-400">/ 80 Perusahaan</span>
        </p>
      </StatCard>

      {/* AE On-Track */}
      <StatCard
        title="AE On-Track (≥ 20 Kunjungan)"
        icon={
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
            <polyline points="17 6 23 6 23 12" />
          </svg>
        }
        progress={25}
        progressLabel="Kinerja Tim"
        progressValue="25%"
      >
        <p className="text-2xl font-bold text-zinc-800">
          1 <span className="text-sm font-normal text-zinc-400">/ 4 AE</span>
        </p>
      </StatCard>

      {/* Progress Bulanan Pelatihan */}
      <StatCard
        title="Progress Bulanan Pelatihan"
        icon={
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        }
      >
        <div className="flex items-end gap-6">
          <div>
            <p className="text-2xl font-bold text-zinc-800">26 <span className="text-sm font-normal text-zinc-500">FIX</span></p>
            <p className="text-[10px] text-emerald-500 font-medium mt-0.5">+7% vs bulan lalu ↗</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-zinc-800">18 <span className="text-sm font-normal text-zinc-500">TEN</span></p>
            <p className="text-[10px] text-red-400 font-medium mt-0.5">-2% vs bulan lalu ↘</p>
          </div>
        </div>
      </StatCard>

    </div>
  );
}