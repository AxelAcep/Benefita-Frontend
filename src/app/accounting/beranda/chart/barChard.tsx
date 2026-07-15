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
  data: DataItem[];
  legend: [string, string];
  formatValue?: (value: number, barIndex?: number) => string;
};

export default function BarChartKelompok({
  title,
  data,
  legend,
  formatValue,
}: Props) {
  const chartData = data.map((d) => ({
    name: d.label,
    [legend[0]]: d.reguler,
    [legend[1]]: d.inhouse,
  }));

  return (
    <div className="border border-zinc-100 rounded-xl p-4 flex flex-col gap-3">
      <p className="text-xs font-semibold text-zinc-700">{title}</p>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={chartData} barCategoryGap="30%" barGap={2}>
          <CartesianGrid vertical={false} stroke="#f4f4f5" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 10, fill: "#a1a1aa" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis hide />
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
          <Bar dataKey={legend[0]} fill="#6ee7b7" radius={[3, 3, 0, 0]}>
            <LabelList
              dataKey={legend[0]}
              position="top"
              style={{ fontSize: 9, fill: "#6ee7b7" }}
              formatter={(v: unknown) => {
                const num = typeof v === "number" ? v : 0;
                return formatValue ? formatValue(num, 0) : num;
              }}
            />
          </Bar>
          <Bar dataKey={legend[1]} fill="#0d9488" radius={[3, 3, 0, 0]}>
            <LabelList
              dataKey={legend[1]}
              position="top"
              style={{ fontSize: 9, fill: "#0d9488" }}
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
