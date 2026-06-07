// components/(form)/card-informasi-instansi.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Info, ChevronDown, Pencil } from "lucide-react";
import FormInput from "@/components/base/form-input";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export interface InformasiInstansiFormData {
  tender1: string;
  tender2: string;
  tender3: string;
  keterangan: string;
}

interface CardInformasiInstansiProps {
  initialData?: Partial<InformasiInstansiFormData>;
  onChange?: (data: InformasiInstansiFormData) => void;
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

export default function CardInformasiInstansi({
  initialData = {},
  onChange,
  disabled = false,
  isEdit = false,
  onEdit,
}: CardInformasiInstansiProps) {
  const [isOpen, setIsOpen] = useState(true);

  const [form, setForm] = useState<InformasiInstansiFormData>({
    tender1: initialData.tender1 ?? "",
    tender2: initialData.tender2 ?? "",
    tender3: initialData.tender3 ?? "",
    keterangan: initialData.keterangan ?? "",
  });

  function setField(key: keyof InformasiInstansiFormData, value: string) {
    const updated = { ...form, [key]: value };
    setForm(updated);
    onChange?.(updated);
  }

  const isLocked = isEdit || disabled;

  useEffect(() => {
    setForm({
      tender1: initialData.tender1 ?? "",
      tender2: initialData.tender2 ?? "",
      tender3: initialData.tender3 ?? "",
      keterangan: initialData.keterangan ?? "",
    });
  }, [initialData]);

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="w-full flex items-center justify-between px-5 py-4 border-b border-zinc-100">
        <span className="flex items-center gap-2 text-sm font-bold text-zinc-800">
          <Info className="w-4 h-4 text-emerald-500" />
          Informasi Instansi
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
            <FormInput
              label="Tender 1"
              value={form.tender1}
              onChange={(v) => setField("tender1", v)}
              placeholder="Belum ada data"
              disabled={isLocked}
            />
            <FormInput
              label="Tender 2"
              value={form.tender2}
              onChange={(v) => setField("tender2", v)}
              placeholder="Belum ada data"
              disabled={isLocked}
            />
            <FormInput
              label="Tender 3"
              value={form.tender3}
              onChange={(v) => setField("tender3", v)}
              placeholder="Belum ada data"
              disabled={isLocked}
            />
            <FormTextarea
              label="Keterangan"
              value={form.keterangan}
              onChange={(v) => setField("keterangan", v)}
              disabled={isLocked}
            />
          </div>
        </div>
      )}
    </div>
  );
}
