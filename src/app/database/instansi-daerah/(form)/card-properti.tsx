// components/(form)/card-properti-finansial.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Banknote, ChevronDown, Pencil } from "lucide-react";
import FormInput from "@/components/base/form-input";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export interface PropertiFinansialFormData {
  // Kiri
  subBidangNilai: string;
  subBidangBatasEmas: string;
  subBidangBatasHijau: string;
  fasilitas: string;
  infoKeuangan: string;
  keterangan: string;
  // Kanan
  group: string;
  bdoAction: string;
  prioritasMANN: string;
  prioritasAE: string;
  vendor: string;
}

interface CardPropertiFinansialProps {
  initialData?: Partial<PropertiFinansialFormData>;
  onChange?: (data: PropertiFinansialFormData) => void;
  disabled?: boolean;
  isEdit?: boolean;
  onEdit?: () => void;
}

const PRIORITAS_HURUF_OPTIONS = ["A", "B", "C", "D", "E"].map((huruf) => ({
  label: huruf,
  value: huruf,
}));

// ─────────────────────────────────────────────
// SELECT
// ─────────────────────────────────────────────

function FormSelect({
  label,
  value,
  onChange,
  options,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-wide">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full px-3 py-2 text-xs text-zinc-700 bg-white border border-zinc-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 transition-all disabled:bg-white disabled:cursor-not-allowed appearance-none"
      >
        <option value="">Belum ada data</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
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

export default function CardPropertiFinansial({
  initialData = {},
  onChange,
  disabled = false,
  isEdit = false,
  onEdit,
}: CardPropertiFinansialProps) {
  const [isOpen, setIsOpen] = useState(true);

  const [form, setForm] = useState<PropertiFinansialFormData>({
    subBidangNilai: initialData.subBidangNilai ?? "",
    subBidangBatasEmas: initialData.subBidangBatasEmas ?? "",
    subBidangBatasHijau: initialData.subBidangBatasHijau ?? "",
    fasilitas: initialData.fasilitas ?? "",
    infoKeuangan: initialData.infoKeuangan ?? "",
    keterangan: initialData.keterangan ?? "",
    group: initialData.group ?? "",
    bdoAction: initialData.bdoAction ?? "",
    prioritasMANN: initialData.prioritasMANN ?? "",
    prioritasAE: initialData.prioritasAE ?? "",
    vendor: initialData.vendor ?? "",
  });

  function setField(key: keyof PropertiFinansialFormData, value: string) {
    const updated = { ...form, [key]: value };
    setForm(updated);
    onChange?.(updated);
  }

  const isLocked = isEdit || disabled;

  const numberInputClass =
    "w-full px-3 py-2 text-xs text-zinc-700 bg-white border border-zinc-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 transition-all placeholder:text-zinc-300 disabled:bg-white disabled:cursor-not-allowed";

  useEffect(() => {
    setForm({
      subBidangNilai: initialData.subBidangNilai ?? "",
      subBidangBatasEmas: initialData.subBidangBatasEmas ?? "",
      subBidangBatasHijau: initialData.subBidangBatasHijau ?? "",
      fasilitas: initialData.fasilitas ?? "",
      infoKeuangan: initialData.infoKeuangan ?? "",
      keterangan: initialData.keterangan ?? "",
      group: initialData.group ?? "",
      bdoAction: initialData.bdoAction ?? "",
      prioritasMANN: initialData.prioritasMANN ?? "",
      prioritasAE: initialData.prioritasAE ?? "",
      vendor: initialData.vendor ?? "",
    });
  }, [initialData]);

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="w-full flex items-center justify-between px-5 py-4 border-b border-zinc-100">
        <span className="flex items-center gap-2 text-sm font-bold text-zinc-800">
          <Banknote className="w-4 h-4 text-emerald-500" />
          Properti & Finansial
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
            {/* ── Kolom Kiri ── */}
            <div className="space-y-4">
              {/* Sub Bidang PROPER — 3 kolom */}
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-wide">
                  Sub Bidang PROPER
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <div className="flex flex-col gap-1">
                    <input
                      type="number"
                      value={form.subBidangNilai}
                      onChange={(e) =>
                        setField("subBidangNilai", e.target.value)
                      }
                      placeholder="0"
                      disabled={isLocked}
                      className={numberInputClass}
                    />
                    <span className="text-[10px] text-zinc-400">Nilai</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <input
                      type="number"
                      value={form.subBidangBatasEmas}
                      onChange={(e) =>
                        setField("subBidangBatasEmas", e.target.value)
                      }
                      placeholder="0"
                      disabled={isLocked}
                      className={numberInputClass}
                    />
                    <span className="text-[10px] text-zinc-400 leading-tight">
                      Nilai batas
                      <br />
                      bawah Emas
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <input
                      type="number"
                      value={form.subBidangBatasHijau}
                      onChange={(e) =>
                        setField("subBidangBatasHijau", e.target.value)
                      }
                      placeholder="0"
                      disabled={isLocked}
                      className={numberInputClass}
                    />
                    <span className="text-[10px] text-zinc-400 leading-tight">
                      Nilai batas
                      <br />
                      bawah Hijau
                    </span>
                  </div>
                </div>
              </div>

              <FormTextarea
                label="Fasilitas"
                value={form.fasilitas}
                onChange={(v) => setField("fasilitas", v)}
                rows={3}
                disabled={isLocked}
              />

              <FormTextarea
                label="Info Keuangan"
                value={form.infoKeuangan}
                onChange={(v) => setField("infoKeuangan", v)}
                disabled={isLocked}
              />

              <FormTextarea
                label="Keterangan"
                value={form.keterangan}
                onChange={(v) => setField("keterangan", v)}
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
                label="BDO Action"
                value={form.bdoAction}
                onChange={(v) => setField("bdoAction", v)}
                placeholder="Belum ada data"
                disabled={isLocked}
              />
              <FormSelect
                label="Prioritas (MA/NN)"
                value={form.prioritasMANN}
                onChange={(v) => setField("prioritasMANN", v)}
                options={PRIORITAS_HURUF_OPTIONS}
                disabled={isLocked}
              />
              <FormSelect
                label="Prioritas (AE)"
                value={form.prioritasAE}
                onChange={(v) => setField("prioritasAE", v)}
                options={PRIORITAS_HURUF_OPTIONS}
                disabled={isLocked}
              />
              <FormInput
                label="Vendor"
                value={form.vendor}
                onChange={(v) => setField("vendor", v)}
                placeholder="Belum ada data"
                disabled={isLocked}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
