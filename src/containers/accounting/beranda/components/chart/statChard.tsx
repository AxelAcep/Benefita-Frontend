// components/StatCard.tsx
type Props = {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtitle: string;
};

export default function StatCard({ icon, label, value, subtitle }: Props) {
  return (
    <div className="border border-zinc-100 rounded-xl p-4 flex flex-col gap-2">
      <div className="flex items-center gap-1.5 text-zinc-500">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <p className="text-2xl font-bold text-zinc-800">{value}</p>
      <p className="text-xs text-zinc-400">{subtitle}</p>
    </div>
  );
}
