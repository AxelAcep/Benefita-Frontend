"use client";

import React, { useState, useEffect } from "react";
import { X, Save } from "lucide-react";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export interface TambahPesertaFormData {
  // Bagian 1
  nama: string;
  jabatan: string;
  instansi: string;
  noIndukInst: string;
  alamat: string;
  noTelp: string;
  noFax: string;
  noHpWa: string;
  pengirimanSertifikat: string;
  catatan: string;

  // Bagian 2
  accExecutive: string;
  status: string;
  inputOleh: string;
  tanggalInput: string;
  metode: string;
  ujian: string;
  tanggalUpdate: string;
  updateOleh: string;
  konfirmasiOleh: string;
  industri: string;

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
}

interface ModalTambahPesertaProps {
  isOpen: boolean;
  onClose: () => void;
  onSimpan: (data: TambahPesertaFormData) => void;
}

// ─────────────────────────────────────────────
// INITIAL STATE
// ─────────────────────────────────────────────

const INITIAL_FORM: TambahPesertaFormData = {
  nama: "",
  jabatan: "",
  instansi: "",
  noIndukInst: "",
  alamat: "",
  noTelp: "",
  noFax: "",
  noHpWa: "",
  pengirimanSertifikat: "",
  catatan: "",
  accExecutive: "",
  status: "",
  inputOleh: "",
  tanggalInput: "",
  metode: "",
  ujian: "",
  tanggalUpdate: "",
  updateOleh: "",
  konfirmasiOleh: "",
  industri: "",
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

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold text-zinc-500 mb-1">{children}</p>
  );
}

function TextInput({
  placeholder,
  value,
  onChange,
  disabled,
}: {
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="w-full px-3 py-2 text-xs text-zinc-700 border border-zinc-200 rounded-lg outline-none focus:border-emerald-300 transition-all placeholder:text-zinc-300 disabled:bg-zinc-50"
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
  options: string[];
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
      }}
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

function DateInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative flex items-center">
      <input
        type="text"
        placeholder="Pilih Tanggal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 pr-8 text-xs text-zinc-700 border border-zinc-200 rounded-lg outline-none focus:border-emerald-300 transition-all placeholder:text-zinc-300"
      />
      <svg
        className="absolute right-2.5 text-zinc-400 pointer-events-none"
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
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
}: ModalTambahPesertaProps) {
  const [form, setForm] = useState<TambahPesertaFormData>(INITIAL_FORM);

  useEffect(() => {
    if (isOpen) setForm(INITIAL_FORM);
  }, [isOpen]);

  function setField(field: keyof TambahPesertaFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSimpan() {
    onSimpan(form);
  }

  if (!isOpen) return null;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Modal */}
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
          <SectionTitle>Bagian 1</SectionTitle>

          {/* Nama */}
          <div className="mb-4">
            <Label>Nama</Label>
            <TextInput
              placeholder="Masukkan nama peserta"
              value={form.nama}
              onChange={(v) => setField("nama", v)}
            />
          </div>

          {/* Jabatan | Instansi | No.Induk_Inst */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div>
              <Label>Jabatan</Label>
              <TextInput
                placeholder="Masukkan nomor jabatan"
                value={form.jabatan}
                onChange={(v) => setField("jabatan", v)}
              />
            </div>
            <div>
              <Label>Instansi</Label>
              <TextInput
                placeholder="Masukkan nama instansi"
                value={form.instansi}
                onChange={(v) => setField("instansi", v)}
              />
            </div>
            <div>
              <Label>No.Induk_Inst</Label>
              <TextInput
                placeholder="Masukkan nomor jabatan"
                value={form.noIndukInst}
                onChange={(v) => setField("noIndukInst", v)}
              />
            </div>
          </div>

          {/* Alamat */}
          <div className="mb-4">
            <Label>Alamat</Label>
            <TextArea
              placeholder="Masukkan alamat"
              value={form.alamat}
              onChange={(v) => setField("alamat", v)}
              rows={3}
            />
          </div>

          {/* No.Telp | No.Fax | No. HP/WA */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div>
              <Label>No.Telp</Label>
              <TextInput
                placeholder="Masukkan No. Telp"
                value={form.noTelp}
                onChange={(v) => setField("noTelp", v)}
              />
            </div>
            <div>
              <Label>No.Fax</Label>
              <TextInput
                placeholder="Masukkan No.Fax"
                value={form.noFax}
                onChange={(v) => setField("noFax", v)}
              />
            </div>
            <div>
              <Label>No. HP/WA</Label>
              <TextInput
                placeholder="Masukkan No. Hp /WA"
                value={form.noHpWa}
                onChange={(v) => setField("noHpWa", v)}
              />
            </div>
          </div>

          {/* Pengiriman Sertifikat */}
          <div className="mb-4">
            <Label>Pengiriman Sertifikat</Label>
            <TextArea
              placeholder="Masukkan pengiriman sertifikat"
              value={form.pengirimanSertifikat}
              onChange={(v) => setField("pengirimanSertifikat", v)}
              rows={3}
            />
          </div>

          {/* Catatan */}
          <div className="mb-4">
            <Label>Catatan</Label>
            <TextArea
              placeholder="Masukkan catatan"
              value={form.catatan}
              onChange={(v) => setField("catatan", v)}
              rows={3}
            />
          </div>

          <Divider />

          {/* ── BAGIAN 2 ── */}
          <SectionTitle>Bagian 2</SectionTitle>

          {/* Acc.Executive | Status | Input Oleh | Tanggal Input */}
          <div className="grid grid-cols-4 gap-3 mb-4">
            <div>
              <Label>Acc.Executive</Label>
              <SelectInput
                placeholder="Pilih Account"
                value={form.accExecutive}
                onChange={(v) => setField("accExecutive", v)}
                options={["AE-01 Budi", "AE-02 Dewi", "AE-03 Andi"]}
              />
            </div>
            <div>
              <Label>Status</Label>
              <SelectInput
                placeholder="Pilih Status"
                value={form.status}
                onChange={(v) => setField("status", v)}
                options={["FIX", "Tentatif", "Cancel"]}
              />
            </div>
            <div>
              <Label>Input Oleh</Label>
              <TextInput
                placeholder="Masukkan nama"
                value={form.inputOleh}
                onChange={(v) => setField("inputOleh", v)}
              />
            </div>
            <div>
              <Label>Tanggal Input</Label>
              <DateInput
                value={form.tanggalInput}
                onChange={(v) => setField("tanggalInput", v)}
              />
            </div>
          </div>

          {/* Metode | Ujian */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <Label>Metode</Label>
              <SelectInput
                placeholder="Pilih Metode"
                value={form.metode}
                onChange={(v) => setField("metode", v)}
                options={["Online", "Offline", "Hybrid"]}
              />
            </div>
            <div>
              <Label>Ujian</Label>
              <SelectInput
                placeholder="Pilih Jenis"
                value={form.ujian}
                onChange={(v) => setField("ujian", v)}
                options={["Ujian Tulis", "Ujian Praktek", "Ujian Online"]}
              />
            </div>
          </div>

          {/* Tanggal Update | Update Oleh | Konfirmasi Oleh | Industri */}
          <div className="grid grid-cols-4 gap-3 mb-4">
            <div>
              <Label>Tanggal Update</Label>
              <DateInput
                value={form.tanggalUpdate}
                onChange={(v) => setField("tanggalUpdate", v)}
              />
            </div>
            <div>
              <Label>Update Oleh</Label>
              <TextInput
                placeholder="Masukkan nama"
                value={form.updateOleh}
                onChange={(v) => setField("updateOleh", v)}
              />
            </div>
            <div>
              <Label>Konfirmasi Oleh</Label>
              <TextInput
                placeholder="Masukkan nama"
                value={form.konfirmasiOleh}
                onChange={(v) => setField("konfirmasiOleh", v)}
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

          <Divider />

          {/* ── BAGIAN 3 ── */}
          <SectionTitle>Bagian 3</SectionTitle>

          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            {/* Col Left */}
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
                  placeholder="Masukkan biaya"
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

            {/* Col Right */}
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
                <DateInput
                  value={form.tanggalBayar}
                  onChange={(v) => setField("tanggalBayar", v)}
                />
              </div>
              <div>
                <Label>No. Invoice</Label>
                <TextInput
                  placeholder="Masukkan invoice"
                  value={form.noInvoice}
                  onChange={(v) => setField("noInvoice", v)}
                />
              </div>
              <div>
                <Label>No. Inv Ujian</Label>
                <TextInput
                  placeholder="Masukkan ujian"
                  value={form.noInvUjian}
                  onChange={(v) => setField("noInvUjian", v)}
                />
              </div>
              <div>
                <Label>No. Kwitansi</Label>
                <TextInput
                  placeholder="Masukkan kwitansi"
                  value={form.noKwitansi}
                  onChange={(v) => setField("noKwitansi", v)}
                />
              </div>
              <div>
                <Label>No. Kwt Ujian</Label>
                <TextInput
                  placeholder="Masukkan informasi"
                  value={form.noKwtUjian}
                  onChange={(v) => setField("noKwtUjian", v)}
                />
              </div>
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
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            Simpan Data
          </button>
        </div>
      </div>
    </div>
  );
}
