// components/(form)/card-lokasi-sekolah.tsx
"use client";

import React, { useEffect, useState } from "react";
import { MapPin, ChevronDown, Pencil } from "lucide-react";
import FormInput from "@/components/base/form-input";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export interface LokasiSekolahFormData {
  alamat: string;
}

interface CardLokasiSekolahProps {
  initialData?: Partial<LokasiSekolahFormData>;
  onChange?: (data: LokasiSekolahFormData) => void;
  disabled?: boolean;
  isEdit?: boolean;
  onEdit?: () => void;
}

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

export default function CardLokasiSekolah({
  initialData = {},
  onChange,
  disabled = false,
  isEdit = false,
  onEdit,
}: CardLokasiSekolahProps) {
  const [isOpen, setIsOpen] = useState(true);

  const [form, setForm] = useState<LokasiSekolahFormData>({
    alamat: initialData.alamat ?? "",
  });

  function setField(key: keyof LokasiSekolahFormData, value: string) {
    const updated = { ...form, [key]: value };
    setForm(updated);
    onChange?.(updated);
  }

  const isLocked = isEdit || disabled;

  useEffect(() => {
    setForm({ alamat: initialData.alamat ?? "" });
  }, [initialData]);

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
      <div className="w-full flex items-center justify-between px-5 py-4 border-b border-zinc-100">
        <span className="flex items-center gap-2 text-sm font-bold text-zinc-800">
          <MapPin className="w-4 h-4 text-emerald-500" />
          Lokasi Sekolah
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
          <FormInput
            label="Alamat"
            value={form.alamat}
            onChange={(v) => setField("alamat", v)}
            placeholder="Belum ada data"
            disabled={isLocked}
          />
        </div>
      )}
    </div>
  );
}
