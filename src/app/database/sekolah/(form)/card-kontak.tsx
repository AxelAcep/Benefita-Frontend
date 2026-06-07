"use client";

import React, { useState, useEffect } from "react";
import { Phone, ChevronDown, Pencil } from "lucide-react";
import FormInput from "@/components/base/form-input";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export interface KontakFormData {
  telpon: string;
  fax: string;
  email: string;
}

interface CardKontakProps {
  initialData?: Partial<KontakFormData>;
  onChange?: (data: KontakFormData) => void;
  disabled?: boolean;
  isEdit?: boolean;
  onEdit?: () => void;
}

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

export default function CardKontak({
  initialData = {},
  onChange,
  disabled = false,
  isEdit = false,
  onEdit,
}: CardKontakProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [form, setForm] = useState<KontakFormData>({
    telpon: initialData.telpon ?? "",
    fax: initialData.fax ?? "",
    email: initialData.email ?? "",
  });

  useEffect(() => {
    setForm({
      telpon: initialData.telpon ?? "",
      fax: initialData.fax ?? "",
      email: initialData.email ?? "",
    });
  }, [initialData]);

  function setField(field: keyof KontakFormData, value: string) {
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
          <Phone className="w-4 h-4 text-emerald-500" />
          Kontak
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
              label="Telepon"
              value={form.telpon}
              onChange={(v) => setField("telpon", v)}
              placeholder="+62..."
              disabled={isLocked}
            />

            <div className="hidden md:block w-px h-full bg-zinc-100 self-stretch mt-5" />

            <FormInput
              label="Fax"
              value={form.fax}
              onChange={(v) => setField("fax", v)}
              placeholder="+62..."
              disabled={isLocked}
            />

            <div className="hidden md:block w-px h-full bg-zinc-100 self-stretch mt-5" />

            <FormInput
              label="Email"
              value={form.email}
              onChange={(v) => setField("email", v)}
              placeholder="email@perusahaan.com"
              disabled={isLocked}
            />
          </div>
        </div>
      )}
    </div>
  );
}
