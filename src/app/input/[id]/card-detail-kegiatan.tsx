"use client";

import React, { useState, useEffect } from "react";
import { ClipboardList, ChevronDown, Pencil } from "lucide-react";
import FormInput from "@/components/base/form-input";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export interface DetailKegiatanFormData {
  noJadwal: string;
  kode: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  metode: string;
  lokasi: string;
  kota: string;
  biayaOnline: string;
  biayaOffline: string;
  biayaSertifikasi: string;
  judul: string;
  pesertaFIXOnline: string;
  pesertaFIXOffline: string;
  catatan: string;
  statusJadwal: string;
}

interface CardDetailKegiatanProps {
  initialData?: Partial<DetailKegiatanFormData>;
  onChange?: (data: DetailKegiatanFormData) => void;
  disabled?: boolean;
  isEdit?: boolean;
  onEdit?: () => void;
}

// ─────────────────────────────────────────────
// FIELD ROW HELPER
// ─────────────────────────────────────────────

function FieldRow({
  label,
  value,
  disabled,
  onChange,
  placeholder,
  isTextarea,
}: {
  label: string;
  value: string;
  disabled: boolean;
  onChange: (v: string) => void;
  placeholder?: string;
  isTextarea?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="w-32 shrink-0 text-[11px] font-semibold text-zinc-500 pt-2">
        {label}
      </span>
      {isTextarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder={placeholder ?? ""}
          rows={2}
          className="flex-1 px-3 py-2 text-xs text-zinc-700 border border-zinc-200 rounded-lg outline-none focus:border-emerald-300 transition-all resize-none disabled:bg-zinc-50 disabled:text-zinc-400 placeholder:text-zinc-300"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder={placeholder ?? ""}
          className="flex-1 px-3 py-2 text-xs text-zinc-700 border border-zinc-200 rounded-lg outline-none focus:border-emerald-300 transition-all disabled:bg-zinc-50 disabled:text-zinc-400 placeholder:text-zinc-300"
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

export default function CardDetailKegiatan({
  initialData = {},
  onChange,
  disabled = false,
  isEdit = false,
  onEdit,
}: CardDetailKegiatanProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [form, setForm] = useState<DetailKegiatanFormData>({
    noJadwal: initialData.noJadwal ?? "",
    kode: initialData.kode ?? "",
    tanggalMulai: initialData.tanggalMulai ?? "",
    tanggalSelesai: initialData.tanggalSelesai ?? "",
    metode: initialData.metode ?? "",
    lokasi: initialData.lokasi ?? "",
    kota: initialData.kota ?? "",
    biayaOnline: initialData.biayaOnline ?? "",
    biayaOffline: initialData.biayaOffline ?? "",
    biayaSertifikasi: initialData.biayaSertifikasi ?? "",
    judul: initialData.judul ?? "",
    pesertaFIXOnline: initialData.pesertaFIXOnline ?? "",
    pesertaFIXOffline: initialData.pesertaFIXOffline ?? "",
    catatan: initialData.catatan ?? "",
    statusJadwal: initialData.statusJadwal ?? "",
  });

  useEffect(() => {
    setForm({
      noJadwal: initialData.noJadwal ?? "",
      kode: initialData.kode ?? "",
      tanggalMulai: initialData.tanggalMulai ?? "",
      tanggalSelesai: initialData.tanggalSelesai ?? "",
      metode: initialData.metode ?? "",
      lokasi: initialData.lokasi ?? "",
      kota: initialData.kota ?? "",
      biayaOnline: initialData.biayaOnline ?? "",
      biayaOffline: initialData.biayaOffline ?? "",
      biayaSertifikasi: initialData.biayaSertifikasi ?? "",
      judul: initialData.judul ?? "",
      pesertaFIXOnline: initialData.pesertaFIXOnline ?? "",
      pesertaFIXOffline: initialData.pesertaFIXOffline ?? "",
      catatan: initialData.catatan ?? "",
      statusJadwal: initialData.statusJadwal ?? "",
    });
  }, [initialData]);

  function setField(field: keyof DetailKegiatanFormData, value: string) {
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
          <ClipboardList className="w-4 h-4 text-emerald-500" />
          Detail Kegiatan
        </span>

        {isEdit ? (
          <></>
        ) : (
          <button
            type="button"
            onClick={() => setIsOpen((p) => !p)}
            className="p-1 hover:bg-zinc-50 rounded-md transition-colors"
          >
            <ChevronDown
              className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>
        )}
      </div>

      {/* Body */}
      {isOpen && (
        <div className="px-5 py-5 grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4">
          {/* Col 1 */}
          <div className="flex flex-col gap-4">
            <FieldRow
              label="No. Jadwal"
              value={form.noJadwal}
              onChange={(v) => setField("noJadwal", v)}
              disabled={isLocked}
              placeholder="2026274"
            />
            <FieldRow
              label="Metode"
              value={form.metode}
              onChange={(v) => setField("metode", v)}
              disabled={isLocked}
              placeholder="Offline / Online"
            />
            <FieldRow
              label="Biaya"
              value={form.biayaOffline}
              onChange={(v) => setField("noJadwal", v)}
              disabled={isLocked}
              placeholder="2026274"
            />

            <FieldRow
              label="Status Jadwal"
              value={form.statusJadwal}
              onChange={(v) => setField("statusJadwal", v)}
              disabled={isLocked}
              placeholder="UJI_Running"
            />
          </div>

          {/* Divider */}
          <div className="hidden md:block absolute" />

          {/* Col 2 */}
          <div className="flex flex-col gap-4">
            <FieldRow
              label="Kode"
              value={form.kode}
              onChange={(v) => setField("kode", v)}
              disabled={isLocked}
              placeholder="EM-05"
            />
            <FieldRow
              label="Lokasi/Hotel"
              value={form.lokasi}
              onChange={(v) => setField("lokasi", v)}
              disabled={isLocked}
              placeholder="Nama hotel/lokasi"
            />
            <FieldRow
              label="Judul"
              value={form.judul}
              onChange={(v) => setField("judul", v)}
              disabled={isLocked}
              placeholder="Judul kegiatan"
            />
            <FieldRow
              label="Catatan"
              value={form.catatan}
              onChange={(v) => setField("catatan", v)}
              disabled={isLocked}
              placeholder="Tidak ada catatan"
              isTextarea
            />
          </div>

          {/* Col 3 */}
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <span className="w-32 shrink-0 text-[11px] font-semibold text-zinc-500 pt-2">
                Tanggal
              </span>
              <div className="flex-1 flex items-center gap-2">
                <input
                  type="text"
                  value={form.tanggalMulai}
                  onChange={(e) => setField("tanggalMulai", e.target.value)}
                  disabled={isLocked}
                  placeholder="02 Apr 2026"
                  className="flex-1 px-3 py-2 text-xs text-zinc-700 border border-zinc-200 rounded-lg outline-none focus:border-emerald-300 transition-all disabled:bg-zinc-50 disabled:text-zinc-400 placeholder:text-zinc-300"
                />
                <span className="text-xs text-zinc-400 shrink-0">s/d</span>
                <input
                  type="text"
                  value={form.tanggalSelesai}
                  onChange={(e) => setField("tanggalSelesai", e.target.value)}
                  disabled={isLocked}
                  placeholder="02 Apr 2026"
                  className="flex-1 px-3 py-2 text-xs text-zinc-700 border border-zinc-200 rounded-lg outline-none focus:border-emerald-300 transition-all disabled:bg-zinc-50 disabled:text-zinc-400 placeholder:text-zinc-300"
                />
              </div>
            </div>

            <FieldRow
              label="Kota"
              value={form.kota}
              onChange={(v) => setField("kota", v)}
              disabled={isLocked}
              placeholder="Bandung"
            />

            <div className="flex items-start gap-3">
              <span className="w-32 shrink-0 text-[11px] font-semibold text-zinc-500 pt-2">
                Peserta FIX
              </span>
              <div className="flex-1 flex items-center gap-2">
                <div className="flex-1 flex items-center gap-1.5">
                  <span className="text-[11px] text-zinc-400 shrink-0">
                    Online:
                  </span>
                  <input
                    type="text"
                    value={form.pesertaFIXOnline}
                    onChange={(e) =>
                      setField("pesertaFIXOnline", e.target.value)
                    }
                    disabled={isLocked}
                    placeholder="0"
                    className="flex-1 px-3 py-2 text-xs text-zinc-700 border border-zinc-200 rounded-lg outline-none focus:border-emerald-300 transition-all disabled:bg-zinc-50 disabled:text-zinc-400 placeholder:text-zinc-300"
                  />
                </div>
                <div className="flex-1 flex items-center gap-1.5">
                  <span className="text-[11px] text-zinc-400 shrink-0">
                    Offline:
                  </span>
                  <input
                    type="text"
                    value={form.pesertaFIXOffline}
                    onChange={(e) =>
                      setField("pesertaFIXOffline", e.target.value)
                    }
                    disabled={isLocked}
                    placeholder="0"
                    className="flex-1 px-3 py-2 text-xs text-zinc-700 border border-zinc-200 rounded-lg outline-none focus:border-emerald-300 transition-all disabled:bg-zinc-50 disabled:text-zinc-400 placeholder:text-zinc-300"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
