// components/BarChartKelompok.tsx
"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";

type DataItem = {
  label: string;
  reguler: number;
  inhouse: number;
};

type Props = {
  title: string;
  subtitle?: string;
  data: DataItem[];
  legend: [string, string];
  colors?: [string, string];
  formatValue?: (value: number, barIndex?: number) => string;
  height?: number;
};

export default function BarChartKelompok({
  title,
  subtitle,
  data,
  legend,
  colors = ["#6ee7b7", "#0d9488"],
  formatValue,
  height = 160,
}: Props) {
  const chartData = data.map((d) => ({
    name: d.label,
    [legend[0]]: d.reguler,
    [legend[1]]: d.inhouse,
  }));

  return (
    <div className="border border-zinc-100 rounded-xl p-4 flex flex-col gap-1">
      <p className="text-xs font-semibold text-zinc-700">{title}</p>
      {subtitle && <p className="text-[10px] text-zinc-400 mb-2">{subtitle}</p>}
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={chartData} barCategoryGap="30%" barGap={2}>
          <CartesianGrid vertical={false} stroke="#f4f4f5" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 10, fill: "#a1a1aa" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            hide={false}
            tick={{ fontSize: 9, fill: "#a1a1aa" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => (formatValue ? formatValue(v) : v)}
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
          <Legend
            wrapperStyle={{ fontSize: 10, paddingTop: 8 }}
            iconType="circle"
            iconSize={6}
          />
          <Bar dataKey={legend[0]} fill={colors[0]} radius={[3, 3, 0, 0]}>
            <LabelList
              dataKey={legend[0]}
              position="top"
              style={{ fontSize: 9, fill: colors[0] }}
              formatter={(v: unknown) => {
                const num = typeof v === "number" ? v : 0;
                return formatValue ? formatValue(num, 0) : num;
              }}
            />
          </Bar>
          <Bar dataKey={legend[1]} fill={colors[1]} radius={[3, 3, 0, 0]}>
            <LabelList
              dataKey={legend[1]}
              position="top"
              style={{ fontSize: 9, fill: colors[1] }}
              formatter={(v: unknown) => {
                const num = typeof v === "number" ? v : 0;
                return formatValue ? formatValue(num, 1) : num;
              }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
