"use client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const data = [
  { bulan: "Jan", fix: 30, ten: 20 },
  { bulan: "Feb", fix: 45, ten: 28 },
  { bulan: "Mar", fix: 38, ten: 35 },
  { bulan: "Apr", fix: 55, ten: 30 },
  { bulan: "Mei", fix: 48, ten: 42 },
  { bulan: "Jun", fix: 70, ten: 38 },
  { bulan: "Jul", fix: 90, ten: 55 },
  { bulan: "Agu", fix: 75, ten: 48 },
  { bulan: "Sep", fix: 60, ten: 40 },
  { bulan: "Okt", fix: 50, ten: 35 },
  { bulan: "Nov", fix: 42, ten: 30 },
  { bulan: "Des", fix: 38, ten: 25 },
];

export default function FIXvsTENChart() {
  return (
    <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-5">
      <p className="text-sm font-bold text-zinc-800">Perbandingan Jadwal FIX vs TEN (Tahunan)</p>
      <p className="text-[11px] text-zinc-400 mb-4">Akumulasi Data 1 Tahun</p>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
          <XAxis dataKey="bulan" tick={{ fontSize: 10, fill: "#a1a1aa" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: "#a1a1aa" }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #e4e4e7" }} />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
          <Line type="monotone" dataKey="fix" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} name="FIX" />
          <Line type="monotone" dataKey="ten" stroke="#6ee7b7" strokeWidth={2} dot={{ r: 3 }} name="TEN" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}