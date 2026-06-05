"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, Save, Download, ChevronDown } from "lucide-react";
import AppLayout from "@/components/app-layout";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export interface KonfirmasiData {
  // Informasi Konfirmasi
  tanggal: string;
  jenisPelUjian: string;
  metodePelUjian: string;
  tglPelUjian: string;
  noKonfirmasi: string;

  // Detail Pelatihan
  tglTraining: string;
  tglUji: string;
  kode: string;
  harga: string;
  judulPelatihan: string;
  lokasi: string;
  alamat: string;
  waktu: string;

  // Data Penerima
  kepada: string;
  jabatan: string;
  instansi: string;
  kontak: string;
  namaPeserta: string;
}

interface PageKonfirmasiProps {
  initialData?: Partial<KonfirmasiData>;
  onBack?: () => void;
  onSimpan?: (data: KonfirmasiData) => void;
  onDownloadPdf?: (data: KonfirmasiData) => void;
}

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

function FieldBox({
  label,
  value,
  onChange,
  placeholder,
  disabled,
}: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center border border-zinc-100 rounded-lg overflow-hidden">
      {label && (
        <span className="px-4 py-3 text-[11px] font-semibold text-zinc-500 bg-zinc-50/60 border-r border-zinc-100 whitespace-nowrap shrink-0 min-w-[100px]">
          {label}
        </span>
      )}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? ""}
        disabled={disabled}
        className="flex-1 px-4 py-3 text-xs text-zinc-700 outline-none focus:bg-emerald-50/30 transition-all placeholder:text-zinc-300 disabled:text-zinc-400 bg-transparent"
      />
    </div>
  );
}

function SectionCard({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-6 py-4 border-b border-zinc-100 hover:bg-zinc-50/50 transition-colors"
      >
        <span className="text-sm font-bold text-zinc-800">{title}</span>
        <ChevronDown
          className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && <div className="px-6 py-5">{children}</div>}
    </div>
  );
}

// ─────────────────────────────────────────────
// DEFAULTS
// ─────────────────────────────────────────────

const DEFAULT_DATA: KonfirmasiData = {
  tanggal: "",
  jenisPelUjian: "Pel & Ujian",
  metodePelUjian: "Offline",
  tglPelUjian: "14 April 2026",
  noKonfirmasi: "0734/BNFT_K/HAX/0222",
  tglTraining: "20 - 22 April 2026",
  tglUji: "25 April 2026",
  kode: "HAZ-05",
  harga: "Rp12.500.000",
  judulPelatihan: "Workshop PPLH dan Sanitasi untuk RS",
  lokasi: "Cikarang",
  alamat: "Jababeka II, Jalan Haji Ismail",
  waktu: "08:30 - 16:00 WIB",
  kepada: "Pimpinan",
  jabatan: "",
  instansi: "Chandra Asri Pacific",
  kontak: "",
  namaPeserta: "Farras Kurniawan",
};

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

export default function PageKonfirmasi({
  initialData = {},
  onBack,
  onSimpan,
  onDownloadPdf,
}: PageKonfirmasiProps) {
  const [form, setForm] = useState<KonfirmasiData>({
    ...DEFAULT_DATA,
    ...initialData,
  });

  useEffect(() => {
    setForm({ ...DEFAULT_DATA, ...initialData });
  }, [initialData]);

  function set(field: keyof KonfirmasiData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Perusahaan", href: "/perusahaan" },
        { label: "Input Data", href: "/perusahaan/input-data" },
        { label: "Konfirmasi" },
      ]}
      subtitle="Hari ini: Selasa, 3 Februari 2026"
      userName="Nanang"
      userRole="Super Admin"
    >
      <div className="flex flex-col gap-4">
        {/* Back */}
        <div>
          <button
            type="button"
            onClick={onBack ?? (() => history.back())}
            className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-700 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Kembali
          </button>
        </div>

        {/* ── Informasi Konfirmasi ── */}
        <SectionCard title="Informasi Konfirmasi">
          <div className="flex items-center gap-0 border border-zinc-100 rounded-xl overflow-hidden">
            {/* Tanggal label */}
            <div className="px-4 py-3 text-[11px] font-semibold text-zinc-500 bg-zinc-50/60 border-r border-zinc-100 whitespace-nowrap shrink-0">
              Tanggal
            </div>
            {/* Jenis */}
            <input
              type="text"
              value={form.jenisPelUjian}
              onChange={(e) => set("jenisPelUjian", e.target.value)}
              placeholder="Pel & Ujian"
              className="flex-1 px-4 py-3 text-xs text-zinc-700 outline-none focus:bg-emerald-50/30 transition-all border-r border-zinc-100 placeholder:text-zinc-300"
            />
            {/* Metode */}
            <input
              type="text"
              value={form.metodePelUjian}
              onChange={(e) => set("metodePelUjian", e.target.value)}
              placeholder="Offline"
              className="flex-1 px-4 py-3 text-xs text-zinc-700 outline-none focus:bg-emerald-50/30 transition-all border-r border-zinc-100 placeholder:text-zinc-300"
            />
            {/* Tanggal value */}
            <input
              type="text"
              value={form.tglPelUjian}
              onChange={(e) => set("tglPelUjian", e.target.value)}
              placeholder="14 April 2026"
              className="flex-1 px-4 py-3 text-xs text-zinc-700 outline-none focus:bg-emerald-50/30 transition-all border-r border-zinc-100 placeholder:text-zinc-300"
            />
            {/* No Konfirmasi label */}
            <div className="px-4 py-3 text-[11px] font-semibold text-zinc-500 bg-zinc-50/60 border-r border-zinc-100 whitespace-nowrap shrink-0">
              No Konfirmasi
            </div>
            {/* No Konfirmasi value */}
            <input
              type="text"
              value={form.noKonfirmasi}
              onChange={(e) => set("noKonfirmasi", e.target.value)}
              placeholder="No. Konfirmasi"
              className="flex-2 px-4 py-3 text-xs text-zinc-700 outline-none focus:bg-emerald-50/30 transition-all placeholder:text-zinc-300 min-w-[200px]"
            />
          </div>
        </SectionCard>

        {/* ── Detail Pelatihan ── */}
        <SectionCard title="Detail Pelatihan">
          <div className="flex flex-col gap-3">
            {/* Row 1: Tgl Training | Tgl Uji | Kode | Harga */}
            <div className="grid grid-cols-4 gap-0 border border-zinc-100 rounded-xl overflow-hidden divide-x divide-zinc-100">
              <FieldBox
                label="Tgl. Training"
                value={form.tglTraining}
                onChange={(v) => set("tglTraining", v)}
                placeholder="20 - 22 April 2026"
              />
              <FieldBox
                label="Tgl. Uji"
                value={form.tglUji}
                onChange={(v) => set("tglUji", v)}
                placeholder="25 April 2026"
              />
              <FieldBox
                label="Kode"
                value={form.kode}
                onChange={(v) => set("kode", v)}
                placeholder="HAZ-05"
              />
              <FieldBox
                label="Harga"
                value={form.harga}
                onChange={(v) => set("harga", v)}
                placeholder="Rp0"
              />
            </div>

            {/* Row 2: Judul | Lokasi | Alamat | Waktu */}
            <div className="grid grid-cols-4 gap-0 border border-zinc-100 rounded-xl overflow-hidden divide-x divide-zinc-100">
              <FieldBox
                label="Judul Pelatihan"
                value={form.judulPelatihan}
                onChange={(v) => set("judulPelatihan", v)}
                placeholder="Judul pelatihan"
              />
              <FieldBox
                label="Lokasi"
                value={form.lokasi}
                onChange={(v) => set("lokasi", v)}
                placeholder="Kota/lokasi"
              />
              <FieldBox
                label="Alamat"
                value={form.alamat}
                onChange={(v) => set("alamat", v)}
                placeholder="Alamat lengkap"
              />
              <FieldBox
                label="Waktu"
                value={form.waktu}
                onChange={(v) => set("waktu", v)}
                placeholder="08:00 - 16:00 WIB"
              />
            </div>
          </div>
        </SectionCard>

        {/* ── Data Penerima ── */}
        <SectionCard title="Data Penerima">
          <div className="flex flex-col gap-3">
            {/* Row 1: Kepada | Jabatan | Instansi | Kontak */}
            <div className="grid grid-cols-4 gap-0 border border-zinc-100 rounded-xl overflow-hidden divide-x divide-zinc-100">
              <FieldBox
                label="Kepada"
                value={form.kepada}
                onChange={(v) => set("kepada", v)}
                placeholder="Pimpinan"
              />
              <FieldBox
                label="Jabatan"
                value={form.jabatan}
                onChange={(v) => set("jabatan", v)}
                placeholder="Masukkan jabatan"
              />
              <FieldBox
                label="Instansi"
                value={form.instansi}
                onChange={(v) => set("instansi", v)}
                placeholder="Nama instansi"
              />
              <FieldBox
                label="Kontak"
                value={form.kontak}
                onChange={(v) => set("kontak", v)}
                placeholder="Masukkan kontak"
              />
            </div>

            {/* Row 2: Nama Peserta (full width) */}
            <div className="border border-zinc-100 rounded-xl overflow-hidden">
              <FieldBox
                label="Nama Peserta"
                value={form.namaPeserta}
                onChange={(v) => set("namaPeserta", v)}
                placeholder="Nama lengkap peserta"
              />
            </div>
          </div>
        </SectionCard>

        {/* ── Action Buttons ── */}
        <div className="flex items-center justify-end gap-2 pb-2">
          <button
            type="button"
            onClick={() => onSimpan?.(form)}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            Simpan Data
          </button>
          <button
            type="button"
            onClick={() => onDownloadPdf?.(form)}
            className="flex items-center gap-1.5 px-4 py-2 bg-zinc-700 hover:bg-zinc-800 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Download PDF
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
