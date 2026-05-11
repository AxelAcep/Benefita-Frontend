// components/(form)/card-sertifikasi-bnsp.tsx
"use client";

import React, { useEffect, useState } from "react";
import { BadgeCheck, ChevronDown, Pencil } from "lucide-react";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export interface SertifikasiBnspFormData {
  pppa: string;
  popal: string;
  pppu: string;
  poippu: string;
  limbahB3: string;
  tpsLb3: string;
  sampah3R: string;
  pSampah: string;
  aEnergi: string;
  mEnergi: string;
  pcua: string;
  lca: string;
}

interface CardSertifikasiBnspProps {
  initialData?: Partial<SertifikasiBnspFormData>;
  onChange?: (data: SertifikasiBnspFormData) => void;
  disabled?: boolean;
  isEdit?: boolean;
  onEdit?: () => void;
}

// ─────────────────────────────────────────────
// FIELD ROW — label kiri, input kanan
// ─────────────────────────────────────────────

function FieldRow({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-24 shrink-0 text-xs text-zinc-500">{label}</span>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="flex-1 px-3 py-2 text-xs text-zinc-700 bg-white border border-zinc-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 transition-all placeholder:text-zinc-300 disabled:bg-white disabled:cursor-not-allowed"
      />
    </div>
  );
}

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

export default function CardSertifikasiBnsp({
  initialData = {},
  onChange,
  disabled = false,
  isEdit = false,
  onEdit,
}: CardSertifikasiBnspProps) {
  const [isOpen, setIsOpen] = useState(true);

  const [form, setForm] = useState<SertifikasiBnspFormData>({
    pppa: initialData.pppa ?? "",
    popal: initialData.popal ?? "",
    pppu: initialData.pppu ?? "",
    poippu: initialData.poippu ?? "",
    limbahB3: initialData.limbahB3 ?? "",
    tpsLb3: initialData.tpsLb3 ?? "",
    sampah3R: initialData.sampah3R ?? "",
    pSampah: initialData.pSampah ?? "",
    aEnergi: initialData.aEnergi ?? "",
    mEnergi: initialData.mEnergi ?? "",
    pcua: initialData.pcua ?? "",
    lca: initialData.lca ?? "",
  });

  function setField(key: keyof SertifikasiBnspFormData, value: string) {
    const updated = { ...form, [key]: value };
    setForm(updated);
    onChange?.(updated);
  }

  const isLocked = isEdit || disabled;

  // Pasangan kiri-kanan
  const rows: [
    keyof SertifikasiBnspFormData,
    string,
    keyof SertifikasiBnspFormData,
    string,
  ][] = [
    ["pppa", "PPPA", "popal", "POPAL"],
    ["pppu", "PPPU", "poippu", "POIPPU"],
    ["limbahB3", "Limbah B3", "tpsLb3", "TPS LB3"],
    ["sampah3R", "3R Sampah", "pSampah", "P. Sampah"],
    ["aEnergi", "A-Energi", "mEnergi", "M-Energi"],
    ["pcua", "PCUA", "lca", "LCA"],
  ];

  useEffect(() => {
    setForm({
      pppa: initialData.pppa ?? "",
      popal: initialData.popal ?? "",
      pppu: initialData.pppu ?? "",
      poippu: initialData.poippu ?? "",
      limbahB3: initialData.limbahB3 ?? "",
      tpsLb3: initialData.tpsLb3 ?? "",
      sampah3R: initialData.sampah3R ?? "",
      pSampah: initialData.pSampah ?? "",
      aEnergi: initialData.aEnergi ?? "",
      mEnergi: initialData.mEnergi ?? "",
      pcua: initialData.pcua ?? "",
      lca: initialData.lca ?? "",
    });
  }, [initialData]);

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="w-full flex items-center justify-between px-5 py-4 border-b border-zinc-100">
        <span className="flex items-center gap-2 text-sm font-bold text-zinc-800">
          <BadgeCheck className="w-4 h-4 text-emerald-500" />
          Sertifikasi BNSP
        </span>

        {isEdit ? (
          <p></p>
        ) : (
          <button
            type="button"
            onClick={() => setIsOpen((p) => !p)}
            className="p-1 hover:bg-zinc-50 rounded-md transition-colors"
          >
            <ChevronDown
              className={`w-4 h-4 text-zinc-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
            />
          </button>
        )}
      </div>

      {/* Body */}
      {isOpen && (
        <div className="px-5 py-5">
          <div className="border border-zinc-100 rounded-xl overflow-hidden">
            {rows.map(([leftKey, leftLabel, rightKey, rightLabel], i) => (
              <div
                key={leftKey}
                className={`grid grid-cols-2 gap-px ${i !== rows.length - 1 ? "border-b border-zinc-100" : ""}`}
              >
                {/* Kiri */}
                <div className="flex items-center gap-3 px-4 py-3">
                  <span className="w-20 shrink-0 text-xs text-zinc-500">
                    {leftLabel}
                  </span>
                  <input
                    type="number"
                    value={form[leftKey]}
                    onChange={(e) => setField(leftKey, e.target.value)}
                    disabled={isLocked}
                    className="flex-1 px-3 py-1.5 text-xs text-zinc-700 bg-white border border-zinc-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 transition-all disabled:bg-white disabled:cursor-not-allowed"
                  />
                </div>

                {/* Kanan */}
                <div className="flex items-center gap-3 px-4 py-3 border-l border-zinc-100">
                  <span className="w-20 shrink-0 text-xs text-zinc-500">
                    {rightLabel}
                  </span>
                  <input
                    type="number"
                    value={form[rightKey]}
                    onChange={(e) => setField(rightKey, e.target.value)}
                    disabled={isLocked}
                    className="flex-1 px-3 py-1.5 text-xs text-zinc-700 bg-white border border-zinc-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 transition-all disabled:bg-white disabled:cursor-not-allowed"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
