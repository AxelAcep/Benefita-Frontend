// components/(form)/card-informasi-sekolah-detail.tsx
"use client";

import React, { useEffect, useState } from "react";
import { ClipboardList, ChevronDown, Pencil } from "lucide-react";
import FormInput from "@/components/base/form-input";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export interface InformasiSekolahDetailFormData {
  pemilik: string;
  fasilitas: string;
  yayasan: string;
  akreditasi: string;
  group: string;
  cp: string;
  keterangan: string;
}

interface CardInformasiSekolahDetailProps {
  initialData?: Partial<InformasiSekolahDetailFormData>;
  onChange?: (data: InformasiSekolahDetailFormData) => void;
  disabled?: boolean;
  isEdit?: boolean;
  onEdit?: () => void;
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
  rows = 2,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
  rows?: number;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-wide">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? "Belum ada data"}
        disabled={disabled}
        rows={rows}
        className="w-full px-3 py-2 text-xs text-zinc-700 bg-white border border-zinc-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 transition-all resize-none placeholder:text-zinc-300 disabled:bg-white disabled:cursor-not-allowed"
      />
    </div>
  );
}

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

export default function CardInformasiSekolahDetail({
  initialData = {},
  onChange,
  disabled = false,
  isEdit = false,
  onEdit,
}: CardInformasiSekolahDetailProps) {
  const [isOpen, setIsOpen] = useState(true);

  const [form, setForm] = useState<InformasiSekolahDetailFormData>({
    pemilik: initialData.pemilik ?? "",
    fasilitas: initialData.fasilitas ?? "",
    yayasan: initialData.yayasan ?? "",
    akreditasi: initialData.akreditasi ?? "",
    group: initialData.group ?? "",
    cp: initialData.cp ?? "",
    keterangan: initialData.keterangan ?? "",
  });

  function setField(key: keyof InformasiSekolahDetailFormData, value: string) {
    const updated = { ...form, [key]: value };
    setForm(updated);
    onChange?.(updated);
  }

  const isLocked = isEdit || disabled;

  useEffect(() => {
    setForm({
      pemilik: initialData.pemilik ?? "",
      fasilitas: initialData.fasilitas ?? "",
      yayasan: initialData.yayasan ?? "",
      akreditasi: initialData.akreditasi ?? "",
      group: initialData.group ?? "",
      cp: initialData.cp ?? "",
      keterangan: initialData.keterangan ?? "",
    });
  }, [initialData]);

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
      <div className="w-full flex items-center justify-between px-5 py-4 border-b border-zinc-100">
        <span className="flex items-center gap-2 text-sm font-bold text-zinc-800">
          <ClipboardList className="w-4 h-4 text-emerald-500" />
          Informasi Sekolah Detail
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
            {/* ── Kolom Kiri ── */}
            <div className="space-y-4">
              <FormInput
                label="Pemilik"
                value={form.pemilik}
                onChange={(v) => setField("pemilik", v)}
                placeholder="Belum ada data"
                disabled={isLocked}
              />
              <FormTextarea
                label="Fasilitas"
                value={form.fasilitas}
                onChange={(v) => setField("fasilitas", v)}
                disabled={isLocked}
              />
              <FormInput
                label="Yayasan"
                value={form.yayasan}
                onChange={(v) => setField("yayasan", v)}
                placeholder="Belum ada data"
                disabled={isLocked}
              />
              <FormInput
                label="Akreditasi"
                value={form.akreditasi}
                onChange={(v) => setField("akreditasi", v)}
                placeholder="Belum ada data"
                disabled={isLocked}
              />
            </div>

            {/* ── Kolom Kanan ── */}
            <div className="space-y-4">
              <FormInput
                label="Group"
                value={form.group}
                onChange={(v) => setField("group", v)}
                placeholder="Belum ada data"
                disabled={isLocked}
              />
              <FormInput
                label="CP"
                value={form.cp}
                onChange={(v) => setField("cp", v)}
                placeholder="Belum ada data"
                disabled={isLocked}
              />
              <FormTextarea
                label="Keterangan"
                value={form.keterangan}
                onChange={(v) => setField("keterangan", v)}
                disabled={isLocked}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
