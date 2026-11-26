// components/CardLaporanHasilUsaha.tsx
import StatCard from "../chart/statChard";
import BarChartHorizontal from "../chart/barChartHorizontal";
import DonutChart from "../chart/DonutChart";
import { TrendingUp, GraduationCap } from "lucide-react";

type StatItem = {
  value: number;
  subtitle: string;
};

type ProgramItem = {
  label: string;
  value: number;
  type: "pemasukan" | "pengeluaran";
};

type DistribusiItem = {
  label: string;
  persentase: number;
  nilai: number;
};

type Props = {
  realisasiPendapatan: StatItem;
  realisasiBiaya: StatItem;
  programDenganRealisasi: StatItem;
  realisasiPerProgram: ProgramItem[];
  distribusiPerProgram: DistribusiItem[];
};

function formatRp(value: number) {
  return `Rp${value.toLocaleString("id-ID")}`;
}

export default function CardLaporanHasilUsaha({
  realisasiPendapatan,
  realisasiBiaya,
  programDenganRealisasi,
  realisasiPerProgram,
  distribusiPerProgram,
}: Props) {
  const totalNilai = distribusiPerProgram.reduce((acc, d) => acc + d.nilai, 0);
  const totalLabel = `${(totalNilai / 1000000).toFixed(0)}Jt`;

  return (
    <div className="bg-white rounded-2xl border border-zinc-100 p-5 flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="text-emerald-500">🏢</span>
        <span className="text-sm font-semibold text-zinc-800">
          Laporan Hasil Usaha
        </span>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <StatCard
          icon={<TrendingUp size={18} className="text-emerald-500" />}
          label="Realisasi Pendapatan"
          value={formatRp(realisasiPendapatan.value)}
          subtitle={realisasiPendapatan.subtitle}
        />
        <StatCard
          icon={<TrendingUp size={18} className="text-emerald-500" />}
          label="Realisasi Biaya"
          value={formatRp(realisasiBiaya.value)}
          subtitle={realisasiBiaya.subtitle}
        />
        <StatCard
          icon={<GraduationCap size={18} className="text-emerald-500" />}
          label="Program dengan Realisasi"
          value={`${programDenganRealisasi.value} Program`}
          subtitle={programDenganRealisasi.subtitle}
        />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <BarChartHorizontal
            title="Realisasi Pendapatan Per Program"
            subtitle="4 program aktif bulan Juni 2026"
            data={realisasiPerProgram}
            formatValue={formatRp}
          />
        </div>
        <DonutChart
          title="Distribusi Per Program"
          subtitle=""
          data={distribusiPerProgram}
          totalLabel="Total"
          totalValue={totalLabel}
        />
      </div>
    </div>
  );
}
