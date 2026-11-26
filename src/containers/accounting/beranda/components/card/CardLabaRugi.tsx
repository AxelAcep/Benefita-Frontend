// components/CardLabaRugi.tsx
import StatCard from "../chart/statChard";
import BarChartPosNeg from "../chart/postNegChard";
import DonutChart from "../chart/DonutChart";
import { TrendingUp } from "lucide-react";

type StatItem = {
  value: number;
  subtitle: string;
};

type ArusKasItem = {
  label: string;
  value: number;
};

type DistribusiItem = {
  label: string;
  persentase: number;
  nilai: number;
};

type Props = {
  pendapatan: StatItem;
  totalBiaya: StatItem;
  labaOperasional: StatItem;
  arusKas: ArusKasItem[];
  komposisiHpp: DistribusiItem[];
  komposisiBiayaOps: DistribusiItem[];
};

function formatRp(value: number) {
  return `Rp${Math.abs(value).toLocaleString("id-ID")}`;
}

function formatShort(value: number) {
  const abs = Math.abs(value);
  if (abs >= 1000000000)
    return `${value < 0 ? "-" : ""}${(abs / 1000000000).toFixed(1)}M`;
  if (abs >= 1000000)
    return `${value < 0 ? "-" : ""}${(abs / 1000000).toFixed(0)}Jt`;
  return `${value}`;
}

export default function CardLabaRugi({
  pendapatan,
  totalBiaya,
  labaOperasional,
  arusKas,
  komposisiHpp,
  komposisiBiayaOps,
}: Props) {
  const totalHpp = komposisiHpp.reduce((acc, d) => acc + d.nilai, 0);
  const totalOps = komposisiBiayaOps.reduce((acc, d) => acc + d.nilai, 0);

  return (
    <div className="bg-white rounded-2xl border border-zinc-100 p-5 flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="text-emerald-500">📊</span>
        <span className="text-sm font-semibold text-zinc-800">
          Laporan Laba Rugi
        </span>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <StatCard
          icon={<TrendingUp size={18} className="text-emerald-500" />}
          label="Pendapatan"
          value={formatRp(pendapatan.value)}
          subtitle={pendapatan.subtitle}
        />
        <StatCard
          icon={<TrendingUp size={18} className="text-emerald-500" />}
          label="Total Biaya"
          value={formatRp(totalBiaya.value)}
          subtitle={totalBiaya.subtitle}
        />
        <StatCard
          icon={<TrendingUp size={18} className="text-emerald-500" />}
          label="Laba (Rugi) Operasional"
          value={formatRp(labaOperasional.value)}
          subtitle={labaOperasional.subtitle}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <BarChartPosNeg
          title="Arus Kas Harian"
          subtitle="Pemasukan vs pengeluaran per tanggal transaksi"
          data={arusKas}
          formatValue={formatShort}
        />
        <DonutChart
          title="Komposisi HPP"
          subtitle="Per kategori"
          data={komposisiHpp}
          totalLabel="Total HPP"
          totalValue={`${(totalHpp / 1000000).toFixed(1)}Jt`}
        />
        <DonutChart
          title="Komposisi Biaya Operasional"
          subtitle="Per kategori"
          data={komposisiBiayaOps}
          totalLabel="Total"
          totalValue={`${(totalOps / 1000000).toFixed(0)}Jt`}
        />
      </div>
    </div>
  );
}
