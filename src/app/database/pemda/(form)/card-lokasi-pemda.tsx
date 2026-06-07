"use client";

import React, { useState, useEffect } from "react";
import { MapPin, ChevronDown, Pencil } from "lucide-react";
import FormInput from "@/components/base/form-input";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export interface LokasiPemdaFormData {
  kotaKabupaten: string;
  provinsi: string;
  alamat: string;
}

interface CardLokasiPemdaProps {
  initialData?: Partial<LokasiPemdaFormData>;
  onChange?: (data: LokasiPemdaFormData) => void;
  disabled?: boolean;
  isEdit?: boolean;
  onEdit?: () => void;
}

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

export default function CardLokasiPemda({
  initialData = {},
  onChange,
  disabled = false,
  isEdit = false,
  onEdit,
}: CardLokasiPemdaProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [form, setForm] = useState<LokasiPemdaFormData>({
    kotaKabupaten: initialData.kotaKabupaten ?? "",
    provinsi: initialData.provinsi ?? "",
    alamat: initialData.alamat ?? "",
  });

  useEffect(() => {
    setForm({
      kotaKabupaten: initialData.kotaKabupaten ?? "",
      provinsi: initialData.provinsi ?? "",
      alamat: initialData.alamat ?? "",
    });
  }, [initialData]);

  function setField(field: keyof LokasiPemdaFormData, value: string) {
    const updated = { ...form, [field]: value };
    setForm(updated);
    onChange?.(updated);
  }

  const isLocked = isEdit || disabled;

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="w-full flex items-center justify-between px-5 py-4 border-b border-zinc-100">
        <span className="flex items-center gap-2 text-sm font-bold text-zinc-800">
          <MapPin className="w-4 h-4 text-emerald-500" />
          Lokasi
        </span>

        <div className="flex items-center gap-3">
          {isEdit && (
            <button
              type="button"
              onClick={onEdit}
              className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" />
              Edit
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsOpen((p) => !p)}
            className="p-1 hover:bg-zinc-50 rounded-md transition-colors"
          >
            <ChevronDown
              className={`w-4 h-4 text-zinc-400 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Body */}
      {isOpen && (
        <div className="px-5 py-5">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto_1fr] gap-3 items-start">
            <FormInput
              label="Kota/Kabupaten"
              value={form.kotaKabupaten}
              onChange={(v) => setField("kotaKabupaten", v)}
              placeholder="Contoh: Kota Bekasi"
              disabled={isLocked}
            />

            <div className="hidden md:block w-px h-full bg-zinc-100 self-stretch mt-5" />

            <FormInput
              label="Provinsi"
              value={form.provinsi}
              onChange={(v) => setField("provinsi", v)}
              placeholder="Contoh: Jawa Barat"
              disabled={isLocked}
            />

            <div className="hidden md:block w-px h-full bg-zinc-100 self-stretch mt-5" />

            <FormInput
              label="Alamat"
              value={form.alamat}
              onChange={(v) => setField("alamat", v)}
              placeholder="Jl. Contoh No. 123"
              disabled={isLocked}
            />
          </div>
        </div>
      )}
    </div>
  );
}
