// components/(form)/card-detail-perusahaan.tsx
"use client";

import { useRouter } from "next/navigation";
import { AlignCenter, ArrowLeft, Pencil } from "lucide-react";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export type AkunStatus = "MA" | "MU" | "AM" | "-";

export interface AkunItem {
  status: AkunStatus;
  kode: string[]; // maks 4
}

export interface AkunGroup {
  env: AkunItem;
  csr: AkunItem;
  tsm: AkunItem;
  epm: AkunItem;
}

interface CardDetailPerusahaanProps {
  kode: string;
  idSimpel: string;
  inputBy: string;
  namaPerusahaan: string;
  akun: AkunGroup;
  onEdit?: () => void;
}

// ─────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────

const BADGE_CONFIG = {
  env: {
    label: "ENV",
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    border: "border-emerald-200",
    align: "center",
  },
  csr: {
    label: "CSR",
    bg: "bg-blue-100",
    text: "text-blue-700",
    border: "border-blue-200",
  },
  tsm: {
    label: "TSM",
    bg: "bg-purple-100",
    text: "text-purple-700",
    border: "border-purple-200",
  },
  epm: {
    label: "EPM",
    bg: "bg-amber-100",
    text: "text-amber-700",
    border: "border-amber-200",
  },
} as const;

type BadgeKey = keyof typeof BADGE_CONFIG;

// ─────────────────────────────────────────────
// SUB COMPONENT — Akun Column
// ─────────────────────────────────────────────

function AkunColumn({ type, item }: { type: BadgeKey; item: AkunItem }) {
  const config = BADGE_CONFIG[type];
  const visible = item.kode.slice(0, 4);

  return (
    <div className="flex-1 min-w-0">
      {/* Label */}
      <div
        className={`${config.bg} ${config.border} border rounded-md px-3 py-1.5 mb-2`}
      >
        <span
          className={`text-[11px]  tracking-widest uppercase block text-center ${config.text}`}
        >
          {config.label}
        </span>
      </div>

      {/* Kode items + status sejajar di kanan */}
      <div className="flex items-start justify-between gap-2 px-1">
        <div className="text-[11px] text-zinc-500 leading-relaxed">
          {visible.length > 0 ? (
            visible.join(" | ")
          ) : (
            <span className="text-zinc-300">—</span>
          )}
        </div>
        <span className={`text-[11px] font-bold shrink-0 ${config.text}`}>
          {item.status}
        </span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────

export default function CardDetailPerusahaan({
  kode,
  idSimpel,
  inputBy,
  namaPerusahaan,
  akun,
  onEdit,
}: CardDetailPerusahaanProps) {
  const router = useRouter();

  return (
    <div className="space-y-3">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-800 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Kembali</span>
      </button>

      {/* Card */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5">
          {/* Top row — meta + edit */}
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-[11px] text-zinc-400">
                Kode <span className="font-semibold text-zinc-600">{kode}</span>
              </span>
              <div className="w-px h-3 bg-zinc-200" />
              <span className="text-[11px] text-zinc-400">
                ID Simpel{" "}
                <span className="font-semibold text-zinc-600">{idSimpel}</span>
              </span>
              <div className="w-px h-3 bg-zinc-200" />
              <span className="text-[11px] text-zinc-400">
                Input by{" "}
                <span className="font-semibold text-zinc-600">{inputBy}</span>
              </span>
            </div>

            {onEdit && (
              <button
                onClick={onEdit}
                className="flex items-center gap-1.5 text-xs text-emerald-600 hover:text-emerald-700 font-medium transition-colors shrink-0"
              >
                Edit <Pencil className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Nama perusahaan */}
          <h2 className="text-lg font-bold text-zinc-800 mb-5">
            {namaPerusahaan}
          </h2>

          {/* Akun grid */}
          <div className="flex gap-4">
            {(Object.keys(BADGE_CONFIG) as BadgeKey[]).map((key) => (
              <AkunColumn key={key} type={key} item={akun[key]} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
