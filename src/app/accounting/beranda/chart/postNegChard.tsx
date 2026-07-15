// components/BarChartPosNeg.tsx
"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from "recharts";

type DataItem = {
  label: string;
  value: number;
};

type Props = {
  title: string;
  subtitle?: string;
  data: DataItem[];
  formatValue?: (value: number) => string;
  height?: number;
};

const COLORS = ["#fb923c", "#6ee7b7", "#fbbf24", "#60a5fa", "#a78bfa"];

export default function BarChartPosNeg({
  title,
  subtitle,
  data,
  formatValue,
  height = 220,
}: Props) {
  return (
    <div className="border border-zinc-100 rounded-xl p-4 flex flex-col gap-1">
      <p className="text-xs font-semibold text-zinc-700">{title}</p>
      {subtitle && <p className="text-[10px] text-zinc-400 mb-2">{subtitle}</p>}
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={data}
          barCategoryGap="35%"
          margin={{ top: 16, bottom: 0 }}
        >
          <CartesianGrid vertical={false} stroke="#f4f4f5" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 10, fill: "#a1a1aa" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 9, fill: "#a1a1aa" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => (formatValue ? formatValue(v) : v)}
          />
          <ReferenceLine y={0} stroke="#e4e4e7" />
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
          <Bar dataKey="value" radius={[3, 3, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
