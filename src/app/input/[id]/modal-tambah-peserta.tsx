"use client";

import React, { useState, useEffect } from "react";
import { X, Save } from "lucide-react";
import { PerusahaanSelect } from "@/components/base/PerusahaanSelect";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export interface TambahPesertaFormData {
  // Bagian 1
  nama: string;
  jabatan: string;
  noIndukPerusahaan: string;
  alamat: string;
  noTelp: string;
  noFax: string;
  email: string;
  alamatPengirimanSertifikat: string;
  catatan: string;

  // Bagian 2
  accExecutive: string;
  status: string;
  metode: string;
  ujian: string;
  konfirmasiOleh: string;
  industri: string;
  ownEnv: string;

  // Bagian 3
  diskon: string;
  infoPembayaran: string;
  ppn: string;
  tanggalBayar: string;
  cashback: string;
  noInvoice: string;
  hargaTotal: string;
  noInvUjian: string;
  bayar: string;
  noKwitansi: string;
  infoPenagihan: string;
  noKwtUjian: string;

  // Files
  fileBuktiPembayaran?: File;
  filePendaftaran?: File;
}

export interface Pegawai {
  id: string;
  nama: string;
}

export interface Perusahaan {
  noInduk: string;
  company: string | null;
}

interface ModalTambahPesertaProps {
  isOpen: boolean;
  onClose: () => void;
  onSimpan: (data: TambahPesertaFormData) => void;
  isLoading?: boolean;
  isEditMode?: boolean;
  initialData?: Partial<TambahPesertaFormData>;
  inputOleh?: string;
  tanggalInput?: string;
  tanggalUpdate?: string;
  updateOleh?: string;
}
// ─────────────────────────────────────────────
// INITIAL STATE
// ─────────────────────────────────────────────

const INITIAL_FORM: TambahPesertaFormData = {
  nama: "",
  jabatan: "",
  noIndukPerusahaan: "",
  alamat: "",
  noTelp: "",
  noFax: "",
  email: "",
  alamatPengirimanSertifikat: "",
  catatan: "",
  accExecutive: "",
  status: "",
  metode: "",
  ujian: "",
  konfirmasiOleh: "",
  industri: "",
  ownEnv: "",
  diskon: "",
  infoPembayaran: "",
  ppn: "",
  tanggalBayar: "",
  cashback: "",
  noInvoice: "",
  hargaTotal: "",
  noInvUjian: "",
  bayar: "",
  noKwitansi: "",
  infoPenagihan: "",
  noKwtUjian: "",
};

// ─────────────────────────────────────────────
// FIELD HELPERS
// ─────────────────────────────────────────────

function Label({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <p className="text-[11px] font-semibold text-zinc-500 mb-1">
      {children}
      {required && <span className="text-red-400 ml-0.5">*</span>}
    </p>
  );
}

function TextInput({
  placeholder,
  value,
  onChange,
  disabled,
  type = "text",
}: {
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  type?: string;
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="w-full px-3 py-2 text-xs text-zinc-700 border border-zinc-200 rounded-lg outline-none focus:border-emerald-300 transition-all placeholder:text-zinc-300 disabled:bg-zinc-50 disabled:text-zinc-400 disabled:cursor-not-allowed"
    />
  );
}

function TextArea({
  placeholder,
  value,
  onChange,
  rows = 3,
}: {
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      className="w-full px-3 py-2 text-xs text-zinc-700 border border-zinc-200 rounded-lg outline-none focus:border-emerald-300 transition-all placeholder:text-zinc-300 resize-none"
    />
  );
}

function SelectInput({
  placeholder,
  value,
  onChange,
  options,
}: {
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 text-xs text-zinc-700 border border-zinc-200 rounded-lg outline-none focus:border-emerald-300 transition-all bg-white appearance-none cursor-pointer"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%23a1a1aa' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 10px center",
        paddingRight: "28px",
      }}
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

function FileInput({
  label,
  onChange,
  value,
}: {
  label: string;
  onChange: (f: File | undefined) => void;
  value?: File;
}) {
  return (
    <div className="w-full">
      <label className="flex items-center gap-2 w-full px-3 py-2 text-xs border border-dashed border-zinc-300 rounded-lg cursor-pointer hover:border-emerald-300 transition-all bg-zinc-50 hover:bg-emerald-50/30">
        <svg
          className="w-3.5 h-3.5 text-zinc-400 shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
        </svg>
        <span className="text-zinc-400 truncate">
          {value ? value.name : label}
        </span>
        <input
          type="file"
          className="hidden"
          onChange={(e) => onChange(e.target.files?.[0])}
          accept=".pdf,.doc,.docx,.xls,.xlsx"
        />
      </label>
    </div>
  );
}

function ReadOnlyField({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="text-[11px] font-semibold text-zinc-400 mb-1">{label}</p>
      <p className="w-full px-3 py-2 text-xs text-zinc-400 border border-zinc-100 rounded-lg bg-zinc-50">
        {value || "-"}
      </p>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-sm font-bold text-zinc-800 mb-4">{children}</h3>;
}

function Divider() {
  return <div className="border-t border-zinc-100 my-6" />;
}

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

export default function ModalTambahPeserta({
  isOpen,
  onClose,
  onSimpan,
  isLoading,
  isEditMode,
  initialData,
  inputOleh,
  tanggalInput,
  tanggalUpdate,
  updateOleh,
}: ModalTambahPesertaProps) {
  const [form, setForm] = useState<TambahPesertaFormData>(INITIAL_FORM);

  useEffect(() => {
    if (isOpen) {
      setForm(initialData ? { ...INITIAL_FORM, ...initialData } : INITIAL_FORM);
    }
  }, [isOpen, initialData]);

  function setField(
    field: keyof TambahPesertaFormData,
    value: string | File | undefined,
  ) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSimpan() {
    onSimpan(form);
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-100 flex items-start justify-between shrink-0">
          <div>
            <h2 className="text-sm font-bold text-zinc-800">Tambah Peserta</h2>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Lengkapi formulir di bawah ini untuk menambah peserta.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-zinc-100 rounded-lg transition-colors text-zinc-400 hover:text-zinc-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto flex-1 px-6 py-5">
          {/* ── BAGIAN 1 ── */}
          <SectionTitle>Bagian 1 — Data Peserta</SectionTitle>

          <div className="mb-4">
            <Label required>Nama</Label>
            <TextInput
              placeholder="Masukkan nama peserta"
              value={form.nama}
              onChange={(v) => setField("nama", v)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <Label>Jabatan</Label>
              <TextInput
                placeholder="Masukkan jabatan"
                value={form.jabatan}
                onChange={(v) => setField("jabatan", v)}
              />
            </div>
            <div>
              <Label required>Perusahaan / Instansi</Label>
              <PerusahaanSelect
                value={form.noIndukPerusahaan}
                onChange={(noInduk) => setField("noIndukPerusahaan", noInduk)}
              />
            </div>
          </div>

          <div className="mb-4">
            <Label>Alamat</Label>
            <TextArea
              placeholder="Masukkan alamat"
              value={form.alamat}
              onChange={(v) => setField("alamat", v)}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-3 gap-3 mb-4">
            <div>
              <Label>No. Telp</Label>
              <TextInput
                placeholder="Masukkan No. Telp"
                value={form.noTelp}
                onChange={(v) => setField("noTelp", v)}
              />
            </div>
            <div>
              <Label>No. Fax</Label>
              <TextInput
                placeholder="Masukkan No. Fax"
                value={form.noFax}
                onChange={(v) => setField("noFax", v)}
              />
            </div>
            <div>
              <Label>Email</Label>
              <TextInput
                placeholder="Masukkan email"
                value={form.email}
                onChange={(v) => setField("email", v)}
                type="email"
              />
            </div>
          </div>

          <div className="mb-4">
            <Label>Pengiriman Sertifikat</Label>
            <TextArea
              placeholder="Masukkan alamat pengiriman sertifikat"
              value={form.alamatPengirimanSertifikat}
              onChange={(v) => setField("alamatPengirimanSertifikat", v)}
              rows={2}
            />
          </div>

          <div className="mb-4">
            <Label>Catatan</Label>
            <TextArea
              placeholder="Masukkan catatan"
              value={form.catatan}
              onChange={(v) => setField("catatan", v)}
              rows={2}
            />
          </div>

          <Divider />

          {/* ── BAGIAN 2 ── */}
          <SectionTitle>Bagian 2 — Informasi Training</SectionTitle>

          <div className="grid grid-cols-3 gap-3 mb-4">
            <div>
              <Label>Acc. Executive</Label>
              <TextInput
                placeholder="Masukkan nama AE"
                value={form.accExecutive}
                onChange={(v) => setField("accExecutive", v)}
              />
            </div>
            <div>
              <Label required>Status</Label>
              <SelectInput
                placeholder="Pilih Status"
                value={form.status}
                onChange={(v) => setField("status", v)}
                options={[
                  { label: "FIX", value: "FIX" },
                  { label: "Tentatif", value: "Tentatif" },
                  { label: "Cancel", value: "Cancel" },
                ]}
              />
            </div>
            <div>
              <Label>Own Env</Label>
              <TextInput
                placeholder="Masukkan own env"
                value={form.ownEnv}
                onChange={(v) => setField("ownEnv", v)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <Label required>Metode</Label>
              <SelectInput
                placeholder="Pilih Metode"
                value={form.metode}
                onChange={(v) => setField("metode", v)}
                options={[
                  { label: "Online", value: "Online" },
                  { label: "Offline", value: "Offline" },
                  { label: "Hybrid", value: "Hybrid" },
                ]}
              />
            </div>
            <div>
              <Label>Ujian</Label>
              <SelectInput
                placeholder="Pilih Jenis"
                value={form.ujian}
                onChange={(v) => setField("ujian", v)}
                options={[
                  { label: "Ujian", value: "Ujian" },
                  { label: "Refresh & Ujian", value: "Refresh & Ujian" },
                  { label: "Pel & Ujian", value: "Pel & Ujian" },
                  { label: "Pelatihan", value: "Pelatihan" },
                ]}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <Label>Konfirmasi Oleh</Label>
              <SelectInput
                placeholder="Pilih pegawai"
                value={form.konfirmasiOleh}
                onChange={(v) => setField("konfirmasiOleh", v)}
                options={[]}
              />
            </div>
            <div>
              <Label>Industri</Label>
              <TextInput
                placeholder="Masukkan industri"
                value={form.industri}
                onChange={(v) => setField("industri", v)}
              />
            </div>
          </div>

          {/* View Only - sistem */}
          <div className="grid grid-cols-4 gap-3 mb-4 p-3 bg-zinc-50 rounded-xl border border-zinc-100">
            <ReadOnlyField label="Input Oleh" value={inputOleh} />
            <ReadOnlyField label="Tanggal Input" value={tanggalInput} />
            <ReadOnlyField label="Update Oleh" value={updateOleh} />
            <ReadOnlyField label="Tanggal Update" value={tanggalUpdate} />
          </div>

          <Divider />

          {/* ── BAGIAN 3 ── */}
          <SectionTitle>Bagian 3 — Keuangan</SectionTitle>

          <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-6">
            <div className="flex flex-col gap-4">
              <div>
                <Label>Diskon</Label>
                <TextInput
                  placeholder="Masukkan diskon"
                  value={form.diskon}
                  onChange={(v) => setField("diskon", v)}
                />
              </div>
              <div>
                <Label>PPn</Label>
                <TextInput
                  placeholder="Masukkan PPn"
                  value={form.ppn}
                  onChange={(v) => setField("ppn", v)}
                />
              </div>
              <div>
                <Label>Cashback</Label>
                <TextInput
                  placeholder="Masukkan cashback"
                  value={form.cashback}
                  onChange={(v) => setField("cashback", v)}
                />
              </div>
              <div>
                <Label>Harga Total</Label>
                <TextInput
                  placeholder="Masukkan harga"
                  value={form.hargaTotal}
                  onChange={(v) => setField("hargaTotal", v)}
                />
              </div>
              <div>
                <Label>Bayar</Label>
                <TextInput
                  placeholder="Masukkan nominal"
                  value={form.bayar}
                  onChange={(v) => setField("bayar", v)}
                />
              </div>
              <div>
                <Label>Info Penagihan</Label>
                <TextInput
                  placeholder="Masukkan informasi"
                  value={form.infoPenagihan}
                  onChange={(v) => setField("infoPenagihan", v)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <Label>Info Pembayaran</Label>
                <TextInput
                  placeholder="Masukkan informasi"
                  value={form.infoPembayaran}
                  onChange={(v) => setField("infoPembayaran", v)}
                />
              </div>
              <div>
                <Label>Tanggal Bayar</Label>
                <TextInput
                  type="date"
                  placeholder="Pilih tanggal"
                  value={form.tanggalBayar}
                  onChange={(v) => setField("tanggalBayar", v)}
                />
              </div>
              <div>
                <Label>No. Invoice</Label>
                <TextInput
                  placeholder="Masukkan no. invoice"
                  value={form.noInvoice}
                  onChange={(v) => setField("noInvoice", v)}
                />
              </div>
              <div>
                <Label>No. Inv Ujian</Label>
                <TextInput
                  placeholder="Masukkan no. inv ujian"
                  value={form.noInvUjian}
                  onChange={(v) => setField("noInvUjian", v)}
                />
              </div>
              <div>
                <Label>No. Kwitansi</Label>
                <TextInput
                  placeholder="Masukkan no. kwitansi"
                  value={form.noKwitansi}
                  onChange={(v) => setField("noKwitansi", v)}
                />
              </div>
              <div>
                <Label>No. Kwt Ujian</Label>
                <TextInput
                  placeholder="Masukkan no. kwt ujian"
                  value={form.noKwtUjian}
                  onChange={(v) => setField("noKwtUjian", v)}
                />
              </div>
            </div>
          </div>

          {/* ── FILES ── */}
          <Divider />
          <SectionTitle>Dokumen</SectionTitle>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Bukti Pembayaran</Label>
              <FileInput
                label="Upload bukti pembayaran"
                value={form.fileBuktiPembayaran}
                onChange={(f) => setField("fileBuktiPembayaran", f)}
              />
            </div>
            <div>
              <Label>Form Pendaftaran</Label>
              <FileInput
                label="Upload form pendaftaran"
                value={form.filePendaftaran}
                onChange={(f) => setField("filePendaftaran", f)}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-zinc-100 flex items-center justify-end gap-2 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-zinc-500 border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleSimpan}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            {isLoading
              ? "Menyimpan..."
              : isEditMode
                ? "Update Data"
                : "Simpan Data"}
          </button>
        </div>
      </div>
    </div>
  );
}
