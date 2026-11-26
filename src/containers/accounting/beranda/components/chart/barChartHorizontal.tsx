// components/BarChartHorizontal.tsx
"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  Cell,
} from "recharts";

type DataItem = {
  label: string;
  value: number;
  type: "pemasukan" | "pengeluaran";
};

type Props = {
  title: string;
  subtitle?: string;
  data: DataItem[];
  formatValue?: (value: number) => string;
};

const COLOR_MAP = {
  pemasukan: "#6ee7b7",
  pengeluaran: "#0d9488",
};

export default function BarChartHorizontal({
  title,
  subtitle,
  data,
  formatValue,
}: Props) {
  const chartData = data.map((d) => ({
    name: d.label,
    value: d.value,
    type: d.type,
  }));

  return (
    <div className="border border-zinc-100 rounded-xl p-4 flex flex-col gap-1 h-full">
      <p className="text-xs font-semibold text-zinc-700">{title}</p>
      {subtitle && <p className="text-[10px] text-zinc-400 mb-2">{subtitle}</p>}
      <ResponsiveContainer width="100%" height={200}>
        <BarChart
          layout="vertical"
          data={chartData}
          margin={{ left: 8, right: 80 }}
          barCategoryGap="25%"
        >
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 10, fill: "#71717a" }}
            axisLine={false}
            tickLine={false}
            width={130}
          />
          <Tooltip
            contentStyle={{
              fontSize: 11,
              borderRadius: 8,
              border: "1px solid #f4f4f5",
            }}
            formatter={(
              value: number | undefined,
              name: string | undefined,
            ) => [
              formatValue && value !== undefined
                ? formatValue(value)
                : (value ?? 0),
              name ?? "",
            ]}
          />
          <Bar dataKey="value" radius={[0, 3, 3, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={index} fill={COLOR_MAP[entry.type]} />
            ))}
            <LabelList
              dataKey="value"
              position="right"
              style={{ fontSize: 10, fill: "#52525b" }}
              formatter={(v: unknown) => {
                const num = typeof v === "number" ? v : 0;
                return formatValue ? formatValue(num) : num;
              }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
