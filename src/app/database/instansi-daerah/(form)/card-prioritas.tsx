// components/(form)/card-prioritas.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Star, ChevronDown, Pencil } from "lucide-react";
import FormInput from "@/components/base/form-input";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export interface PrioritasFormData {
  prioritasMANN: "MA" | "NN" | "";
  prioritasAE: string;
}

interface CardPrioritasProps {
  initialData?: Partial<PrioritasFormData>;
  onChange?: (data: PrioritasFormData) => void;
  disabled?: boolean;
  isEdit?: boolean;
  onEdit?: () => void;
}

// ─────────────────────────────────────────────
// FORM SELECT
// ─────────────────────────────────────────────

function FormSelect({
  label,
  value,
  onChange,
  options,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-wide">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full px-3 py-2 text-xs text-zinc-700 bg-white border border-zinc-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 transition-all disabled:bg-white disabled:cursor-not-allowed appearance-none"
      >
        <option value="">Belum ada data</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

export default function CardPrioritas({
  initialData = {},
  onChange,
  disabled = false,
  isEdit = false,
  onEdit,
}: CardPrioritasProps) {
  const [isOpen, setIsOpen] = useState(true);

  const [form, setForm] = useState<PrioritasFormData>({
    prioritasMANN: initialData.prioritasMANN ?? "",
    prioritasAE: initialData.prioritasAE ?? "",
  });

  function setField(key: keyof PrioritasFormData, value: string) {
    const updated = { ...form, [key]: value };
    setForm(updated as PrioritasFormData);
    onChange?.(updated as PrioritasFormData);
  }

  const isLocked = isEdit || disabled;

  useEffect(() => {
    setForm({
      prioritasMANN: initialData.prioritasMANN ?? "",
      prioritasAE: initialData.prioritasAE ?? "",
    });
  }, [initialData]);

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="w-full flex items-center justify-between px-5 py-4 border-b border-zinc-100">
        <span className="flex items-center gap-2 text-sm font-bold text-zinc-800">
          <Star className="w-4 h-4 text-emerald-500" />
          Prioritas
        </span>

        {isEdit ? (
          <button
            type="button"
            onClick={onEdit}
            className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" />
            Edit
          </button>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <FormSelect
              label="Prioritas MA/NN"
              value={form.prioritasMANN}
              onChange={(v) => setField("prioritasMANN", v)}
              options={[
                { label: "MA", value: "MA" },
                { label: "NN", value: "NN" },
              ]}
              disabled={isLocked}
            />
            <FormInput
              label="Prioritas AE"
              value={form.prioritasAE}
              onChange={(v) => setField("prioritasAE", v)}
              placeholder="Belum ada data"
              disabled={isLocked}
            />
          </div>
        </div>
      )}
    </div>
  );
}
