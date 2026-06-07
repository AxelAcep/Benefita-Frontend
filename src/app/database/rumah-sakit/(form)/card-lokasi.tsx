// components/card-lokasi.tsx
"use client";

import React, { useEffect, useState } from "react";
import { MapPin, ChevronDown, Pencil } from "lucide-react";
import FormInput from "@/components/base/form-input";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export type ZonaWaktu = "WIB" | "WITA" | "WIT" | "-";

export interface LokasiFormData {
  alamatPusat: string;
  zonaWaktuPusat: ZonaWaktu;
  alamatFactory: string;
  zonaWaktuFactory: ZonaWaktu;
}

interface CardLokasiProps {
  initialData?: Partial<LokasiFormData>;
  onChange?: (data: LokasiFormData) => void;
  disabled?: boolean;
  isEdit?: boolean;
  onEdit?: () => void;
}

// ─────────────────────────────────────────────
// ZONA WAKTU SELECT
// ─────────────────────────────────────────────

const ZONA_OPTIONS: ZonaWaktu[] = ["WIB", "WITA", "WIT", "-"];

function ZonaWaktuSelect({
  value,
  onChange,
  disabled,
}: {
  value: ZonaWaktu;
  onChange: (v: ZonaWaktu) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1 min-w-[90px]">
      <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-wide">
        Zona Waktu
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as ZonaWaktu)}
          disabled={disabled}
          className="w-full appearance-none px-3 py-2 pr-7 text-xs text-zinc-700 bg-white border border-zinc-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 transition-all disabled:bg-white disabled:cursor-not-allowed"
        >
          {ZONA_OPTIONS.map((z) => (
            <option key={z} value={z}>
              {z}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-400 pointer-events-none" />
      </div>
    </div>
  );
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
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1 flex-1">
      <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-wide">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        rows={2}
        className="w-full px-3 py-2 text-xs text-zinc-700 bg-white border border-zinc-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 transition-all resize-none placeholder:text-zinc-300 disabled:bg-white disabled:cursor-not-allowed"
      />
    </div>
  );
}

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

export default function CardLokasi({
  initialData = {},
  onChange,
  disabled = false,
  isEdit = false,
  onEdit,
}: CardLokasiProps) {
  const [isOpen, setIsOpen] = useState(true);

  const [form, setForm] = useState<LokasiFormData>({
    alamatPusat: initialData.alamatPusat ?? "",
    zonaWaktuPusat: initialData.zonaWaktuPusat ?? "WIB",
    alamatFactory: initialData.alamatFactory ?? "",
    zonaWaktuFactory: initialData.zonaWaktuFactory ?? "-",
  });

  function setField<K extends keyof LokasiFormData>(
    key: K,
    value: LokasiFormData[K],
  ) {
    const updated = { ...form, [key]: value };
    setForm(updated);
    onChange?.(updated);
  }

  const isLocked = isEdit || disabled;

  useEffect(() => {
    setForm({
      alamatPusat: initialData.alamatPusat ?? "",
      zonaWaktuPusat: initialData.zonaWaktuPusat ?? "WIB",
      alamatFactory: initialData.alamatFactory ?? "",
      zonaWaktuFactory: initialData.zonaWaktuFactory ?? "-",
    });
  }, [initialData]);

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="w-full flex items-center justify-between px-5 py-4 border-b border-zinc-100">
        <span className="flex items-center gap-2 text-sm font-bold text-zinc-800">
          <MapPin className="w-4 h-4 text-emerald-500" />
          Lokasi
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {/* Kolom kiri — Alamat Pusat */}
            <div className="flex items-end gap-3">
              <FormTextarea
                label="Alamat Pusat"
                value={form.alamatPusat}
                onChange={(v) => setField("alamatPusat", v)}
                placeholder="Jl. ..."
                disabled={isLocked}
              />
              <ZonaWaktuSelect
                value={form.zonaWaktuPusat}
                onChange={(v) => setField("zonaWaktuPusat", v)}
                disabled={isLocked}
              />
            </div>

            {/* Kolom kanan — Alamat Factory */}
            <div className="flex items-end gap-3">
              <FormTextarea
                label="Alamat Factory"
                value={form.alamatFactory}
                onChange={(v) => setField("alamatFactory", v)}
                placeholder="Jl. ..."
                disabled={isLocked}
              />
              <ZonaWaktuSelect
                value={form.zonaWaktuFactory}
                onChange={(v) => setField("zonaWaktuFactory", v)}
                disabled={isLocked}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
