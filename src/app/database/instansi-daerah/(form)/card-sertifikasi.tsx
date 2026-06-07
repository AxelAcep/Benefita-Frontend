// components/(form)/card-sertifikasi.tsx
"use client";

import React, { useEffect, useState } from "react";
import { BadgeCheck, ChevronDown, Pencil } from "lucide-react";
import FormInput from "@/components/base/form-input";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export interface SertifikasiFormData {
  iso9001: string;
  iso14001: string;
  ohsas18001: string;
}

interface CardSertifikasiProps {
  initialData?: Partial<SertifikasiFormData>;
  onChange?: (data: SertifikasiFormData) => void;
  disabled?: boolean;
  isEdit?: boolean;
  onEdit?: () => void;
}

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

export default function CardSertifikasi({
  initialData = {},
  onChange,
  disabled = false,
  isEdit = false,
  onEdit,
}: CardSertifikasiProps) {
  const [isOpen, setIsOpen] = useState(true);

  const [form, setForm] = useState<SertifikasiFormData>({
    iso9001: initialData.iso9001 ?? "",
    iso14001: initialData.iso14001 ?? "",
    ohsas18001: initialData.ohsas18001 ?? "",
  });

  function setField(key: keyof SertifikasiFormData, value: string) {
    const updated = { ...form, [key]: value };
    setForm(updated);
    onChange?.(updated);
  }

  const isLocked = isEdit || disabled;

  useEffect(() => {
    setForm({
      iso9001: initialData.iso9001 ?? "",
      iso14001: initialData.iso14001 ?? "",
      ohsas18001: initialData.ohsas18001 ?? "",
    });
  }, [initialData]);

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="w-full flex items-center justify-between px-5 py-4 border-b border-zinc-100">
        <span className="flex items-center gap-2 text-sm font-bold text-zinc-800">
          <BadgeCheck className="w-4 h-4 text-emerald-500" />
          Sertifikasi
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
        <div className="px-5 py-5 space-y-3">
          <FormInput
            label="ISO 9001"
            value={form.iso9001}
            onChange={(v) => setField("iso9001", v)}
            placeholder="-"
            disabled={isLocked}
          />
          <FormInput
            label="ISO 14001"
            value={form.iso14001}
            onChange={(v) => setField("iso14001", v)}
            placeholder="-"
            disabled={isLocked}
          />
          <FormInput
            label="OHSAS 18001"
            value={form.ohsas18001}
            onChange={(v) => setField("ohsas18001", v)}
            placeholder="-"
            disabled={isLocked}
          />
        </div>
      )}
    </div>
  );
}
