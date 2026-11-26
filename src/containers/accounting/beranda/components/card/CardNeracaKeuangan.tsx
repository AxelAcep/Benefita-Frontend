// components/CardNeracaKeuangan.tsx
import StatCard from "../chart/statChard";
import BarChartKelompok from "../chart/barChardKelompok";
import BarChartHorizontal from "../chart/barChartHorizontal";
import DonutChart from "../chart/DonutChart";
import { TrendingUp } from "lucide-react";

type StatItem = {
  value: number;
  subtitle: string;
};

type ArusKasItem = {
  tanggal: string;
  pemasukan: number;
  pengeluaran: number;
};

type Top5Item = {
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
  tahun: number;
  totalPemasukan: StatItem;
  totalPengeluaran: StatItem;
  saldoBersih: StatItem;
  arusKasHarian: ArusKasItem[];
  top5Pengeluaran: Top5Item[];
  distribusiPengeluaran: DistribusiItem[];
};

function formatRp(value: number) {
  return `Rp${value.toLocaleString("id-ID")}`;
}

export default function CardNeracaKeuangan({
  tahun,
  totalPemasukan,
  totalPengeluaran,
  saldoBersih,
  arusKasHarian,
  top5Pengeluaran,
  distribusiPengeluaran,
}: Props) {
  return (
    <div className="bg-white rounded-2xl border border-zinc-100 p-5 flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="text-emerald-500">🗂️</span>
        <span className="text-sm font-semibold text-zinc-800">
          Neraca Keuangan {tahun}
        </span>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <StatCard
          icon={<TrendingUp size={18} className="text-emerald-500" />}
          label="Total Pemasukan (Debet)"
          value={formatRp(totalPemasukan.value)}
          subtitle={totalPemasukan.subtitle}
        />
        <StatCard
          icon={<TrendingUp size={18} className="text-emerald-500" />}
          label="Total Pengeluaran (Kredit)"
          value={formatRp(totalPengeluaran.value)}
          subtitle={totalPengeluaran.subtitle}
        />
        <StatCard
          icon={<TrendingUp size={18} className="text-emerald-500" />}
          label="Saldo Bersih"
          value={formatRp(saldoBersih.value)}
          subtitle={saldoBersih.subtitle}
        />
      </div>

      {/* Arus Kas Harian */}
      <BarChartKelompok
        title="Arus Kas Harian"
        subtitle="Pemasukan vs pengeluaran per tanggal transaksi"
        data={arusKasHarian.map((d) => ({
          label: d.tanggal,
          reguler: d.pemasukan,
          inhouse: d.pengeluaran,
        }))}
        legend={["Pemasukan", "Pengeluaran"]}
        colors={["#6ee7b7", "#fb923c"]}
        formatValue={(v) => `${(v / 1000000).toFixed(0)}M`}
        height={220}
      />

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <BarChartHorizontal
            title="Top 5 Pengeluaran Terbesar"
            subtitle="Berdasarkan nominal transaksi individual"
            data={top5Pengeluaran}
            formatValue={formatRp}
          />
        </div>
        <DonutChart
          title="Distribusi Pengeluaran"
          subtitle="Per kategori"
          data={distribusiPengeluaran}
          totalLabel="Total Kredit"
          totalValue="611.9M"
        />
      </div>
    </div>
  );
}
