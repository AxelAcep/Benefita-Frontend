// components/(form)/card-klasifikasi.tsx
"use client";

import React, { useEffect, useState } from "react";
import { LayoutGrid, ChevronDown, Pencil } from "lucide-react";
import FormInput from "@/components/base/form-input";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export interface KlasifikasiFormData {
  kategoriCpn: string;
  lineBisnis: string;
  lineBisnisSub: string;
  permodalan: string;
}

interface CardKlasifikasiProps {
  initialData?: Partial<KlasifikasiFormData>;
  onChange?: (data: KlasifikasiFormData) => void;
  disabled?: boolean;
  isEdit?: boolean;
  onEdit?: () => void;
}

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

export default function CardKlasifikasi({
  initialData = {},
  onChange,
  disabled = false,
  isEdit = false,
  onEdit,
}: CardKlasifikasiProps) {
  const [isOpen, setIsOpen] = useState(true);

  const [form, setForm] = useState<KlasifikasiFormData>({
    kategoriCpn: initialData.kategoriCpn ?? "",
    lineBisnis: initialData.lineBisnis ?? "",
    lineBisnisSub: initialData.lineBisnisSub ?? "",
    permodalan: initialData.permodalan ?? "",
  });

  function setField(key: keyof KlasifikasiFormData, value: string) {
    const updated = { ...form, [key]: value };
    setForm(updated);
    onChange?.(updated);
  }

  // Ketika isEdit, semua input dikunci
  const isLocked = isEdit || disabled;

  useEffect(() => {
    setForm({
      kategoriCpn: initialData.kategoriCpn ?? "",
      lineBisnis: initialData.lineBisnis ?? "",
      lineBisnisSub: initialData.lineBisnisSub ?? "",
      permodalan: initialData.permodalan ?? "",
    });
  }, [initialData]);

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="w-full flex items-center justify-between px-5 py-4 border-b border-zinc-100">
        {/* Kiri: icon + judul */}
        <span className="flex items-center gap-2 text-sm font-bold text-zinc-800">
          <LayoutGrid className="w-4 h-4 text-emerald-500" />
          Klasifikasi & Kepemilikan
        </span>

        {/* Kanan: tombol Edit (isEdit) atau tombol minimize */}
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
            label="Kategori CPN"
            value={form.kategoriCpn}
            onChange={(v) => setField("kategoriCpn", v)}
            placeholder="-"
            disabled={isLocked}
          />

          {/* Line Bisnis — 2 kolom */}
          <div className="grid grid-cols-2 gap-3">
            <FormInput
              label="Line Bisnis"
              value={form.lineBisnis}
              onChange={(v) => setField("lineBisnis", v)}
              placeholder="-"
              disabled={isLocked}
            />
            <FormInput
              label="&nbsp;"
              value={form.lineBisnisSub}
              onChange={(v) => setField("lineBisnisSub", v)}
              placeholder="Sub kategori"
              disabled={isLocked}
            />
          </div>

          <FormInput
            label="Permodalan"
            value={form.permodalan}
            onChange={(v) => setField("permodalan", v)}
            placeholder="-"
            disabled={isLocked}
          />
        </div>
      )}
    </div>
  );
}
