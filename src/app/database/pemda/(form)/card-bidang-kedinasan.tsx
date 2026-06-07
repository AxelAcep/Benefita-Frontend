"use client";

import React, { useState, useEffect } from "react";
import { Briefcase, ChevronDown, Pencil } from "lucide-react";
import FormInput from "@/components/base/form-input";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export interface BidangKedinasanFormData {
  indPengolahan: string;
  pertambangan: string;
  listrikGasAirBersih: string;
  hotelResto: string;
  angkutTrans: string;
  bangunan: string;
  pertanian: string;
  keuangan: string;
  laut: string;
  jasa: string;
}

interface CardBidangKedinasanProps {
  initialData?: Partial<BidangKedinasanFormData>;
  onChange?: (data: BidangKedinasanFormData) => void;
  disabled?: boolean;
  isEdit?: boolean;
  onEdit?: () => void;
}

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

const rows: [
  string,
  keyof BidangKedinasanFormData,
  string,
  keyof BidangKedinasanFormData,
][] = [
  ["Ind Pengolahan", "indPengolahan", "Bangunan", "bangunan"],
  ["Pertambangan", "pertambangan", "Pertanian", "pertanian"],
  ["Listrik/Gas/Air/Bersih", "listrikGasAirBersih", "Keuangan", "keuangan"],
  ["Hotel &Resto", "hotelResto", "Laut", "laut"],
  ["Angkut&Trans", "angkutTrans", "Jasa", "jasa"],
];

export default function CardBidangKedinasan({
  initialData = {},
  onChange,
  disabled = false,
  isEdit = false,
  onEdit,
}: CardBidangKedinasanProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [form, setForm] = useState<BidangKedinasanFormData>({
    indPengolahan: initialData.indPengolahan ?? "",
    pertambangan: initialData.pertambangan ?? "",
    listrikGasAirBersih: initialData.listrikGasAirBersih ?? "",
    hotelResto: initialData.hotelResto ?? "",
    angkutTrans: initialData.angkutTrans ?? "",
    bangunan: initialData.bangunan ?? "",
    pertanian: initialData.pertanian ?? "",
    keuangan: initialData.keuangan ?? "",
    laut: initialData.laut ?? "",
    jasa: initialData.jasa ?? "",
  });

  useEffect(() => {
    setForm({
      indPengolahan: initialData.indPengolahan ?? "",
      pertambangan: initialData.pertambangan ?? "",
      listrikGasAirBersih: initialData.listrikGasAirBersih ?? "",
      hotelResto: initialData.hotelResto ?? "",
      angkutTrans: initialData.angkutTrans ?? "",
      bangunan: initialData.bangunan ?? "",
      pertanian: initialData.pertanian ?? "",
      keuangan: initialData.keuangan ?? "",
      laut: initialData.laut ?? "",
      jasa: initialData.jasa ?? "",
    });
  }, [initialData]);

  function setField(field: keyof BidangKedinasanFormData, value: string) {
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
          <Briefcase className="w-4 h-4 text-emerald-500" />
          Bidang Kedinasan
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
          <div className="flex flex-col gap-3">
            {rows.map(([labelL, keyL, labelR, keyR]) => (
              <div key={keyL} className="grid grid-cols-2 gap-3">
                <FormInput
                  label={labelL}
                  value={form[keyL]}
                  onChange={(v) => setField(keyL, v)}
                  placeholder="0"
                  disabled={isLocked}
                />
                <FormInput
                  label={labelR}
                  value={form[keyR]}
                  onChange={(v) => setField(keyR, v)}
                  placeholder="0"
                  disabled={isLocked}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
