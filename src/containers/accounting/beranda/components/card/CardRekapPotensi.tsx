// components/CardRekapPotensi.tsx
import { useState } from "react";
import StatCard from "../chart/statChard";
import BarChartKelompok from "../chart/barChard";
import { TrendingUp, PersonStanding } from "lucide-react";

type StatItem = {
  value: number;
  subtitle: string;
};

type KelompokItem = {
  kode: string;
  reguler: number;
  inhouse: number;
};

type PerbandinganItem = {
  label: string;
  peserta: number;
  pendapatan: number;
};

type DropdownItem = {
  value: string;
  label: string;
};

type Props = {
  totalPeserta: StatItem;
  pesertaReguler: StatItem;
  pesertaInHouse: StatItem;
  totalPendapatan: StatItem;
  pesertaPerKelompok: KelompokItem[];
  pendapatanPerKelompok: KelompokItem[];
  perbandinganRegulerInhouse: PerbandinganItem[];
  kodeOptions: DropdownItem[];
  pickKode: string | null;
  onChangeKode: (_value: string | null) => void;
};

export default function CardRekapPotensi({
  totalPeserta,
  pesertaReguler,
  pesertaInHouse,
  totalPendapatan,
  pesertaPerKelompok,
  pendapatanPerKelompok,
  perbandinganRegulerInhouse,
  kodeOptions,
  pickKode,
  onChangeKode,
}: Props) {
  return (
    <div className="bg-white rounded-2xl border border-zinc-100 p-5 flex flex-col gap-5">
      {/* Card Header */}
      <div className="flex items-center gap-2">
        <span className="text-emerald-500">🏠</span>
        <span className="text-sm font-semibold text-zinc-800">
          Rekap Potensi dan Realisasi Pendapatan
        </span>
      </div>

      {/* Dropdown Kode */}
      <select
        value={pickKode ?? ""}
        onChange={(e) => onChangeKode(e.target.value || null)}
        className="w-48 border border-zinc-200 rounded-lg px-3 py-2 text-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
      >
        <option value="">Semua Kode</option>
        {kodeOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<PersonStanding size={18} className="text-emerald-500" />}
          label="Total Peserta"
          value={totalPeserta.value.toString()}
          subtitle={totalPeserta.subtitle}
        />
        <StatCard
          icon={<PersonStanding size={18} className="text-emerald-500" />}
          label="Peserta Reguler"
          value={pesertaReguler.value.toString()}
          subtitle={pesertaReguler.subtitle}
        />
        <StatCard
          icon={<PersonStanding size={18} className="text-emerald-500" />}
          label="Peserta In House"
          value={pesertaInHouse.value.toString()}
          subtitle={pesertaInHouse.subtitle}
        />
        <StatCard
          icon={<TrendingUp size={18} className="text-emerald-500" />}
          label="Total Pendapatan"
          value={`Rp${totalPendapatan.value.toLocaleString("id-ID")}`}
          subtitle={totalPendapatan.subtitle}
        />
      </div>

      {/* Bar Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <BarChartKelompok
          title="Peserta per Kelompok Kode"
          data={pesertaPerKelompok.map((d) => ({
            label: d.kode,
            reguler: d.reguler,
            inhouse: d.inhouse,
          }))}
          legend={["Reguler", "In House"]}
        />
        <BarChartKelompok
          title="Pendapatan per Kelompok Kode"
          data={pendapatanPerKelompok.map((d) => ({
            label: d.kode,
            reguler: d.reguler,
            inhouse: d.inhouse,
          }))}
          legend={["Reguler", "In House"]}
          formatValue={(v) => `${(v / 1000000).toFixed(0)}jt`}
        />
        <BarChartKelompok
          title="Perbandingan Reguler vs Inhouse"
          data={perbandinganRegulerInhouse.map((d) => ({
            label: d.label,
            reguler: d.peserta,
            inhouse: d.pendapatan,
          }))}
          legend={["Peserta", "Pendapatan"]}
          formatValue={(v, idx) =>
            idx === 1 ? `${(v / 1000000).toFixed(0)}jt` : v.toString()
          }
        />
      </div>
    </div>
  );
}
