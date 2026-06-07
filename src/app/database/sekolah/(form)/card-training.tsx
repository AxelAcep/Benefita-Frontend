// components/(form)/card-training.tsx
"use client";

import React, { useEffect, useState } from "react";
import { GraduationCap, ChevronDown, Pencil } from "lucide-react";
import FormInput from "@/components/base/form-input";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export interface TrainingFormData {
  kebutuhanTraining: string;
  yangPernahDiikuti: string;
  fasilitas: string;
}

interface CardTrainingProps {
  initialData?: Partial<TrainingFormData>;
  onChange?: (data: TrainingFormData) => void;
  disabled?: boolean;
  isEdit?: boolean;
  onEdit?: () => void;
}

// ─────────────────────────────────────────────
// TEXTAREA
// ─────────────────────────────────────────────

function FormTextarea({
  label,
  value,
  onChange,
  placeholder,
  disabled,
  rows = 2,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
  rows?: number;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-wide">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? "Belum ada data"}
        disabled={disabled}
        rows={rows}
        className="w-full px-3 py-2 text-xs text-zinc-700 bg-white border border-zinc-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 transition-all resize-none placeholder:text-zinc-300 disabled:bg-white disabled:cursor-not-allowed"
      />
    </div>
  );
}

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

export default function CardTraining({
  initialData = {},
  onChange,
  disabled = false,
  isEdit = false,
  onEdit,
}: CardTrainingProps) {
  const [isOpen, setIsOpen] = useState(true);

  const [form, setForm] = useState<TrainingFormData>({
    kebutuhanTraining: initialData.kebutuhanTraining ?? "",
    yangPernahDiikuti: initialData.yangPernahDiikuti ?? "",
    fasilitas: initialData.fasilitas ?? "",
  });

  function setField(key: keyof TrainingFormData, value: string) {
    const updated = { ...form, [key]: value };
    setForm(updated);
    onChange?.(updated);
  }

  const isLocked = isEdit || disabled;

  useEffect(() => {
    setForm({
      kebutuhanTraining: initialData.kebutuhanTraining ?? "",
      yangPernahDiikuti: initialData.yangPernahDiikuti ?? "",
      fasilitas: initialData.fasilitas ?? "",
    });
  }, [initialData]);

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="w-full flex items-center justify-between px-5 py-4 border-b border-zinc-100">
        <span className="flex items-center gap-2 text-sm font-bold text-zinc-800">
          <GraduationCap className="w-4 h-4 text-emerald-500" />
          Training
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
          <div className="space-y-4">
            <FormTextarea
              label="Kebutuhan Training"
              value={form.kebutuhanTraining}
              onChange={(v) => setField("kebutuhanTraining", v)}
              disabled={isLocked}
            />
            <FormTextarea
              label="Yang Pernah Diikuti"
              value={form.yangPernahDiikuti}
              onChange={(v) => setField("yangPernahDiikuti", v)}
              disabled={isLocked}
            />
            <FormTextarea
              label="Fasilitas"
              value={form.fasilitas}
              onChange={(v) => setField("fasilitas", v)}
              disabled={isLocked}
            />
          </div>
        </div>
      )}
    </div>
  );
}
