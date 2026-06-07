// components/(form)/card-instansi-sekolah.tsx
"use client";

import React, { useEffect, useState } from "react";
import { School, ChevronDown, Pencil } from "lucide-react";
import FormInput from "@/components/base/form-input";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export interface InstansiSekolahFormData {
  instansi: string;
  kode: string;
}

interface CardInstansiSekolahProps {
  initialData?: Partial<InstansiSekolahFormData>;
  onChange?: (data: InstansiSekolahFormData) => void;
  disabled?: boolean;
  isEdit?: boolean;
  onEdit?: () => void;
}

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

export default function CardInstansiSekolah({
  initialData = {},
  onChange,
  disabled = false,
  isEdit = false,
  onEdit,
}: CardInstansiSekolahProps) {
  const [isOpen, setIsOpen] = useState(true);

  const [form, setForm] = useState<InstansiSekolahFormData>({
    instansi: initialData.instansi ?? "",
    kode: initialData.kode ?? "",
  });

  function setField(key: keyof InstansiSekolahFormData, value: string) {
    const updated = { ...form, [key]: value };
    setForm(updated);
    onChange?.(updated);
  }

  const isLocked = isEdit || disabled;

  useEffect(() => {
    setForm({
      instansi: initialData.instansi ?? "",
      kode: initialData.kode ?? "",
    });
  }, [initialData]);

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
      <div className="w-full flex items-center justify-between px-5 py-4 border-b border-zinc-100">
        <span className="flex items-center gap-2 text-sm font-bold text-zinc-800">
          <School className="w-4 h-4 text-emerald-500" />
          Instansi Sekolah
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
      {isOpen && (
        <div className="px-5 py-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <FormInput
              label="Instansi"
              value={form.instansi}
              onChange={(v) => setField("instansi", v)}
              placeholder="Belum ada data"
              disabled={isLocked}
            />
            <FormInput
              label="Kode"
              value={form.kode}
              onChange={(v) => setField("kode", v)}
              placeholder="Belum ada data"
              disabled={isLocked}
            />
          </div>
        </div>
      )}
    </div>
  );
}
