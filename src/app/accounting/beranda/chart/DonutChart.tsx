// components/DonutChart.tsx
"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

type DistribusiItem = {
  label: string;
  persentase: number;
  nilai: number;
};

type Props = {
  title: string;
  subtitle?: string;
  data: DistribusiItem[];
  totalLabel: string;
  totalValue: string;
};

const COLORS = ["#6ee7b7", "#fb923c", "#fbbf24"];

export default function DonutChart({
  title,
  subtitle,
  data,
  totalLabel,
  totalValue,
}: Props) {
  const chartData = data.map((d) => ({ name: d.label, value: d.persentase }));

  return (
    <div className="border border-zinc-100 rounded-xl p-4 flex flex-col gap-1">
      <p className="text-xs font-semibold text-zinc-700">{title}</p>
      {subtitle && <p className="text-[10px] text-zinc-400 mb-2">{subtitle}</p>}
      <div className="flex items-center gap-4">
        <div className="relative w-[120px] h-[120px] flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={38}
                outerRadius={55}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
              >
                {chartData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  fontSize: 11,
                  borderRadius: 8,
                  border: "1px solid #f4f4f5",
                }}
                formatter={(value: number | undefined) => [
                  `${value ?? 0}%`,
                  "",
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className="text-[9px] text-zinc-400 leading-tight">
              {totalLabel}
            </p>
            <p className="text-sm font-bold text-zinc-800">{totalValue}</p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {data.map((d, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: COLORS[i % COLORS.length] }}
              />
              <span className="text-[10px] text-zinc-500">
                {d.label} ({d.persentase}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
