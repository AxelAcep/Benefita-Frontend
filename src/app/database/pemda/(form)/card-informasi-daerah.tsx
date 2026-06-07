"use client";

import React, { useState, useEffect } from "react";
import { MapPin, ChevronDown, Pencil } from "lucide-react";
import FormInput from "@/components/base/form-input";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export interface InformasiDaerahFormData {
  instansi: string;
  keterangan: string;
  sekilasLh: string;
  rsud: string;
}

interface CardInformasiDaerahProps {
  initialData?: Partial<InformasiDaerahFormData>;
  onChange?: (data: InformasiDaerahFormData) => void;
  disabled?: boolean;
  isEdit?: boolean;
  onEdit?: () => void;
}

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

export default function CardInformasiDaerah({
  initialData = {},
  onChange,
  disabled = false,
  isEdit = false,
  onEdit,
}: CardInformasiDaerahProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [form, setForm] = useState<InformasiDaerahFormData>({
    instansi: initialData.instansi ?? "",
    keterangan: initialData.keterangan ?? "",
    sekilasLh: initialData.sekilasLh ?? "",
    rsud: initialData.rsud ?? "",
  });

  useEffect(() => {
    setForm({
      instansi: initialData.instansi ?? "",
      keterangan: initialData.keterangan ?? "",
      sekilasLh: initialData.sekilasLh ?? "",
      rsud: initialData.rsud ?? "",
    });
  }, [initialData]);

  function setField(field: keyof InformasiDaerahFormData, value: string) {
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
          Informasi Daerah
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
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-3 items-start">
            {/* LEFT */}
            <div className="flex flex-col gap-3">
              <FormInput
                label="Instansi"
                value={form.instansi}
                onChange={(v) => setField("instansi", v)}
                placeholder="Nama instansi daerah"
                disabled={isLocked}
              />
              <FormInput
                label="Keterangan"
                value={form.keterangan}
                onChange={(v) => setField("keterangan", v)}
                placeholder="Contoh: Bup. Periode 2004 - 2009"
                disabled={isLocked}
              />
            </div>

            <div className="hidden md:block w-px bg-zinc-100 self-stretch" />

            {/* RIGHT */}
            <div className="flex flex-col gap-3">
              <FormInput
                label="Sekilas LH"
                value={form.sekilasLh}
                onChange={(v) => setField("sekilasLh", v)}
                placeholder="Informasi sekilas lingkungan hidup"
                disabled={isLocked}
              />
              <FormInput
                label="RSUD"
                value={form.rsud}
                onChange={(v) => setField("rsud", v)}
                placeholder="Contoh: RSU Dr. Slamet Garut"
                disabled={isLocked}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
