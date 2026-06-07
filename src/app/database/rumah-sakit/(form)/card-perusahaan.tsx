"use client";

import React, { useState, useEffect } from "react";
import { Building2, ChevronDown, Pencil } from "lucide-react";
import FormInput from "@/components/base/form-input";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export interface PerusahaanFormData {
  instansi: string;
  kode: string;
  idSimpel: string;
}

interface CardPerusahaanProps {
  initialData: Partial<PerusahaanFormData>;
  onChange: (data: PerusahaanFormData) => void;
  disabled: boolean;
  isEdit?: boolean;
  onEdit?: () => void;
}

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

export default function CardPerusahaan({
  initialData = {},
  onChange,
  disabled,
  isEdit = false,
  onEdit,
}: CardPerusahaanProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [form, setForm] = useState<PerusahaanFormData>({
    instansi: initialData.instansi ?? "",
    kode: initialData.kode ?? "",
    idSimpel: initialData.idSimpel ?? "",
  });

  useEffect(() => {
    setForm({
      instansi: initialData.instansi ?? "",
      kode: initialData.kode ?? "",
      idSimpel: initialData.idSimpel ?? "",
    });
  }, [initialData]);

  function setField(field: keyof PerusahaanFormData, value: string) {
    const updatedForm = { ...form, [field]: value };
    setForm(updatedForm);
    onChange(updatedForm);
  }

  const isLocked = isEdit || disabled;

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="w-full flex items-center justify-between px-5 py-4 border-b border-zinc-100">
        <span className="flex items-center gap-2 text-sm font-bold text-zinc-800">
          <Building2 className="w-4 h-4 text-emerald-500" />
          Perusahaan
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
              className={`w-4 h-4 text-zinc-400 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>
        )}
      </div>

      {/* Body */}
      {isOpen && (
        <div className="px-5 py-5">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto_1fr] gap-3 items-start">
            <FormInput
              label="Instansi/Perusahaan"
              value={form.instansi}
              onChange={(v) => setField("instansi", v)}
              placeholder="Nama instansi atau perusahaan"
              disabled={isLocked}
              error={undefined}
            />

            <div className="hidden md:block w-px h-full bg-zinc-100 self-stretch mt-5" />

            <FormInput
              label="Kode"
              value={form.kode}
              onChange={(v) => setField("kode", v)}
              placeholder="PR00000"
              disabled={isLocked}
              error={undefined}
            />

            <div className="hidden md:block w-px h-full bg-zinc-100 self-stretch mt-5" />

            <FormInput
              label="ID Simpel"
              value={form.idSimpel}
              onChange={(v) => setField("idSimpel", v)}
              placeholder="000"
              disabled={isLocked}
              error={undefined}
            />
          </div>
        </div>
      )}
    </div>
  );
}
