// components/(form)/card-instansi-daerah.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Building2, ChevronDown, Pencil } from "lucide-react";
import FormInput from "@/components/base/form-input";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export interface InstansiDaerahFormData {
  instansi: string;
  kode: string;
}

interface CardInstansiDaerahProps {
  initialData?: Partial<InstansiDaerahFormData>;
  onChange?: (data: InstansiDaerahFormData) => void;
  disabled?: boolean;
  isEdit?: boolean;
  onEdit?: () => void;
}

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

export default function CardInstansiDaerah({
  initialData = {},
  onChange,
  disabled = false,
  isEdit = false,
  onEdit,
}: CardInstansiDaerahProps) {
  const [isOpen, setIsOpen] = useState(true);

  const [form, setForm] = useState<InstansiDaerahFormData>({
    instansi: initialData.instansi ?? "",
    kode: initialData.kode ?? "",
  });

  function setField(key: keyof InstansiDaerahFormData, value: string) {
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
      {/* Header */}
      <div className="w-full flex items-center justify-between px-5 py-4 border-b border-zinc-100">
        <span className="flex items-center gap-2 text-sm font-bold text-zinc-800">
          <Building2 className="w-4 h-4 text-emerald-500" />
          Instansi Daerah
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
            {/* ── Kolom Kiri: Instansi ── */}
            <FormInput
              label="Instansi"
              value={form.instansi}
              onChange={(v) => setField("instansi", v)}
              placeholder="Belum ada data"
              disabled={isLocked}
            />

            {/* ── Kolom Kanan: Kode ── */}
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
