"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, Save, Printer, ChevronDown } from "lucide-react";
import AppLayout from "@/components/app-layout";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export interface CetakKwitansiData {
  // Identitas Kwitansi
  tanggal: string;
  data1: string;
  noKwitansi: string;
  data2: string;
  data3: string;

  // Detail Pelatihan & Tagihan
  kode: string;
  noPO: string;
  jenis: string;
  partisipan: string;
  kota: string;
  harga: string;
  tglPelatihan: string;
  ppn: string;
  judulPelatihan: string;
  pph: string;
  namaPeserta: string;
  diskon: string;
  instansi: string;
  hargaTotal: string;
  alamat: string;

  // Pengesahan
  administrasi: string;
  inputBy: string;
  jabatan: string;
}

interface PageCetakKwitansiProps {
  initialData?: Partial<CetakKwitansiData>;
  onBack?: () => void;
  onSimpan?: (data: CetakKwitansiData) => void;
  onCetak?: (data: CetakKwitansiData) => void;
}

// ─────────────────────────────────────────────
// DEFAULT DATA
// ─────────────────────────────────────────────

const DEFAULT_DATA: CetakKwitansiData = {
  tanggal: "14 April 2026",
  data1: "23420",
  noKwitansi: "0029/KWT/REG-WM-01/V/26",
  data2: "2026279",
  data3: "202605",
  kode: "WM-01",
  noPO: "",
  jenis: "REG",
  partisipan: "2",
  kota: "Cikarang",
  harga: "Rp10.500.000",
  tglPelatihan: "04-06 Mei 2026",
  ppn: "",
  judulPelatihan: "Penanggung Jawab Pengendalian Pencemaran Air (PPPA)",
  pph: "",
  namaPeserta: "Uus Uswatun Hasanah dan Rahma Safitri",
  diskon: "Rp1.000.000",
  instansi: "PT Sucofindo Cabang Semarang",
  hargaTotal: "Rp20.000.000",
  alamat:
    "Jl. Pemuda No. 171, Sekayu, Kec. Semarang Tengah, Kota Semarang, Jawa Tengah - 50132",
  administrasi: "Siti Nazirah",
  inputBy: "ZIRAH-2026-05:25",
  jabatan: "Finance",
};

// ─────────────────────────────────────────────
// FIELD HELPERS
// ─────────────────────────────────────────────

function FieldRow({
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
    <div className="flex items-center border-b border-zinc-100 last:border-b-0 py-1">
      <span className="w-36 shrink-0 text-[11px] font-semibold text-zinc-500 px-4 py-2">
        {label}
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? ""}
        disabled={disabled}
        className="flex-1 px-4 py-2 text-xs text-zinc-700 outline-none focus:bg-emerald-50/30 transition-all placeholder:text-zinc-300 disabled:text-zinc-400 bg-transparent"
      />
    </div>
  );
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
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
      {open && <div>{children}</div>}
    </div>
  );
}

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

export default function PageCetakKwitansi({
  initialData = {},
  onBack,
  onSimpan,
  onCetak,
}: PageCetakKwitansiProps) {
  const [form, setForm] = useState<CetakKwitansiData>({
    ...DEFAULT_DATA,
    ...initialData,
  });

  useEffect(() => {
    setForm({ ...DEFAULT_DATA, ...initialData });
  }, []);

  function set(field: keyof CetakKwitansiData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Perusahaan", href: "/perusahaan" },
        { label: "Input Data", href: "/perusahaan/input-data" },
        { label: "Cetak Kwitansi" },
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

        {/* ── Identitas Kwitansi ── */}
        <SectionCard title="Identitas Kwitansi">
          <div className="grid grid-cols-2 divide-x divide-zinc-100">
            {/* Col Left */}
            <div className="divide-y divide-zinc-100">
              <FieldRow
                label="Tanggal"
                value={form.tanggal}
                onChange={(v) => set("tanggal", v)}
                placeholder="14 April 2026"
              />
              <FieldRow
                label="No Kwitansi"
                value={form.noKwitansi}
                onChange={(v) => set("noKwitansi", v)}
                placeholder="No. Kwitansi"
              />
            </div>
            {/* Col Right */}
            <div className="divide-y divide-zinc-100">
              <FieldRow
                label="Data 1"
                value={form.data1}
                onChange={(v) => set("data1", v)}
                placeholder="23420"
              />
              <FieldRow
                label="Data 2"
                value={form.data2}
                onChange={(v) => set("data2", v)}
                placeholder="2026279"
              />
              <FieldRow
                label="Data 3"
                value={form.data3}
                onChange={(v) => set("data3", v)}
                placeholder="202605"
              />
            </div>
          </div>
        </SectionCard>

        {/* ── Detail Pelatihan & Tagihan ── */}
        <SectionCard title="Detail Pelatihan & Tagihan">
          <div className="grid grid-cols-2 divide-x divide-zinc-100">
            {/* Col Left */}
            <div className="divide-y divide-zinc-100">
              <FieldRow
                label="Kode"
                value={form.kode}
                onChange={(v) => set("kode", v)}
                placeholder="WM-01"
              />
              <FieldRow
                label="Jenis"
                value={form.jenis}
                onChange={(v) => set("jenis", v)}
                placeholder="REG"
              />
              <FieldRow
                label="Kota"
                value={form.kota}
                onChange={(v) => set("kota", v)}
                placeholder="Kota"
              />
              <FieldRow
                label="Tgl. Pelatihan"
                value={form.tglPelatihan}
                onChange={(v) => set("tglPelatihan", v)}
                placeholder="04-06 Mei 2026"
              />
              <FieldRow
                label="Judul Pelatihan"
                value={form.judulPelatihan}
                onChange={(v) => set("judulPelatihan", v)}
                placeholder="Judul pelatihan"
              />
              <FieldRow
                label="Nama Peserta"
                value={form.namaPeserta}
                onChange={(v) => set("namaPeserta", v)}
                placeholder="Nama peserta"
              />
              <FieldRow
                label="Instansi"
                value={form.instansi}
                onChange={(v) => set("instansi", v)}
                placeholder="Nama instansi"
              />
              <FieldRow
                label="Alamat"
                value={form.alamat}
                onChange={(v) => set("alamat", v)}
                placeholder="Alamat lengkap"
              />
            </div>
            {/* Col Right */}
            <div className="divide-y divide-zinc-100">
              <FieldRow
                label="No. PO"
                value={form.noPO}
                onChange={(v) => set("noPO", v)}
                placeholder="Masukkan No.PO"
              />
              <FieldRow
                label="Partisipan"
                value={form.partisipan}
                onChange={(v) => set("partisipan", v)}
                placeholder="0"
              />
              <FieldRow
                label="Harga"
                value={form.harga}
                onChange={(v) => set("harga", v)}
                placeholder="Rp0"
              />
              <FieldRow
                label="PPN"
                value={form.ppn}
                onChange={(v) => set("ppn", v)}
                placeholder="Masukkan PPN"
              />
              <FieldRow
                label="PPH"
                value={form.pph}
                onChange={(v) => set("pph", v)}
                placeholder="Masukkan PPH"
              />
              <FieldRow
                label="Diskon"
                value={form.diskon}
                onChange={(v) => set("diskon", v)}
                placeholder="Rp0"
              />
              <FieldRow
                label="Harga"
                value={form.hargaTotal}
                onChange={(v) => set("hargaTotal", v)}
                placeholder="Rp0"
              />
            </div>
          </div>
        </SectionCard>

        {/* ── Pengesahan ── */}
        <SectionCard title="Pengesahan">
          <div className="grid grid-cols-2 divide-x divide-zinc-100">
            <div className="divide-y divide-zinc-100">
              <FieldRow
                label="Administrasi"
                value={form.administrasi}
                onChange={(v) => set("administrasi", v)}
                placeholder="Nama administrasi"
              />
              <FieldRow
                label="Jabatan"
                value={form.jabatan}
                onChange={(v) => set("jabatan", v)}
                placeholder="Jabatan"
              />
            </div>
            <div className="divide-y divide-zinc-100">
              <FieldRow
                label="Input by"
                value={form.inputBy}
                onChange={(v) => set("inputBy", v)}
                placeholder="ZIRAH-2026-05:25"
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
            onClick={() => onCetak?.(form)}
            className="flex items-center gap-1.5 px-4 py-2 bg-zinc-700 hover:bg-zinc-800 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            Cetak
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
