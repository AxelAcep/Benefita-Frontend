"use client";

import React, { useEffect, useState } from "react";
import { X, Save } from "lucide-react";
import FormInput from "@/components/base/form-input";
import type { PerusahaanFormData } from "./card-perusahaan";
import type { LokasiFormData, ZonaWaktu } from "./card-lokasi";
import type { SertifikasiFormData } from "./card-sertifikasi";
import type { KlasifikasiFormData } from "./card-klasifikasi";
import type { PropertiFinansialFormData } from "./card-properti";
import type { InformasiLainnyaFormData } from "./card-lainya";
import type { KontakFormData } from "./card-kontak";
import type { InformasiDaerahFormData } from "./card-informasi-daerah";
import type { BidangKedinasanFormData } from "./card-bidang-kedinasan";
import type {
  StatistikProperFormData,
  StatistikProperRow,
} from "./card-proper";
import type { LokasiPemdaFormData } from "./card-lokasi-pemda";
import type FormState from "../[id]/page";

// ─────────────────────────────────────────────
// SHARED UI PRIMITIVES
// ─────────────────────────────────────────────

function FormTextarea({
  label,
  value,
  onChange,
  placeholder,
  rows = 2,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
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
        placeholder={placeholder ?? "-"}
        rows={rows}
        className="w-full px-3 py-2 text-xs text-zinc-700 bg-white border border-zinc-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 transition-all resize-none placeholder:text-zinc-300"
      />
    </div>
  );
}

const ZONA_OPTIONS: ZonaWaktu[] = ["WIB", "WITA", "WIT", "-"];

function ZonaWaktuSelect({
  label,
  value,
  onChange,
}: {
  label: string;
  value: ZonaWaktu;
  onChange: (v: ZonaWaktu) => void;
}) {
  return (
    <div className="flex flex-col gap-1 min-w-[90px]">
      <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-wide">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as ZonaWaktu)}
        className="w-full px-3 py-2 text-xs text-zinc-700 bg-white border border-zinc-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 transition-all"
      >
        {ZONA_OPTIONS.map((z) => (
          <option key={z} value={z}>
            {z}
          </option>
        ))}
      </select>
    </div>
  );
}

const numberInputClass =
  "w-full px-3 py-2 text-xs text-zinc-700 bg-white border border-zinc-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 transition-all placeholder:text-zinc-300";

// ─────────────────────────────────────────────
// MODAL WRAPPER
// ─────────────────────────────────────────────

interface ModalWrapperProps {
  title: string;
  subtitle: string;
  onClose: () => void;
  onSave: () => void;
  isSaving: boolean;
  children: React.ReactNode;
}

function ModalWrapper({
  title,
  subtitle,
  onClose,
  onSave,
  isSaving,
  children,
}: ModalWrapperProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-xl mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-zinc-100">
          <div>
            <p className="text-sm font-bold text-zinc-800">{title}</p>
            <p className="text-xs text-zinc-400 mt-0.5">{subtitle}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-zinc-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-zinc-400" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto">
          {children}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-zinc-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-zinc-600 hover:bg-zinc-50 rounded-lg transition-colors"
          >
            Batal
          </button>
          <button
            onClick={onSave}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 rounded-lg transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            {isSaving ? "Menyimpan..." : "Simpan Data"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// MODAL PERUSAHAAN
// ─────────────────────────────────────────────

interface ModalPerusahaanProps {
  initialData: PerusahaanFormData;
  isSaving: boolean;
  onClose: () => void;
  onSave: (data: PerusahaanFormData) => void;
}

export function ModalPerusahaan({
  initialData,
  isSaving,
  onClose,
  onSave,
}: ModalPerusahaanProps) {
  const [form, setForm] = useState<PerusahaanFormData>(initialData);

  useEffect(() => {
    setForm(initialData);
  }, [initialData]);

  function setField(key: keyof PerusahaanFormData, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <ModalWrapper
      title="Edit Identitas"
      subtitle="Perbarui informasi yang diperlukan."
      onClose={onClose}
      onSave={() => onSave(form)}
      isSaving={isSaving}
    >
      <FormInput
        label="Nama Perusahaan"
        value={form.instansi}
        onChange={(v) => setField("instansi", v)}
        placeholder="Nama instansi atau perusahaan"
      />
      <div className="grid grid-cols-2 gap-3">
        <FormInput
          label="Kode"
          value={form.kode}
          onChange={(v) => setField("kode", v)}
          placeholder="PR00000"
        />
        <FormInput
          label="ID Simpel"
          value={form.idSimpel}
          onChange={(v) => setField("idSimpel", v)}
          placeholder="000"
        />
      </div>
    </ModalWrapper>
  );
}

// ─────────────────────────────────────────────
// MODAL LOKASI
// ─────────────────────────────────────────────

interface ModalLokasiProps {
  initialData: LokasiFormData;
  isSaving: boolean;
  onClose: () => void;
  onSave: (data: LokasiFormData) => void;
}

export function ModalLokasi({
  initialData,
  isSaving,
  onClose,
  onSave,
}: ModalLokasiProps) {
  const [form, setForm] = useState<LokasiFormData>(initialData);

  useEffect(() => {
    setForm(initialData);
  }, [initialData]);

  function setField<K extends keyof LokasiFormData>(
    key: K,
    value: LokasiFormData[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <ModalWrapper
      title="Edit Lokasi"
      subtitle="Perbarui alamat pusat dan factory."
      onClose={onClose}
      onSave={() => onSave(form)}
      isSaving={isSaving}
    >
      <div className="flex flex-col gap-8 px-6 py-4">
        {/* Alamat Pusat */}
        <div className="flex flex-col md:flex-row md:items-center md:gap-6">
          <div className="flex-1">
            <FormTextarea
              label="Alamat Pusat"
              value={form.alamatPusat}
              onChange={(v) => setField("alamatPusat", v)}
              placeholder="Jl. Contoh Alamat No.123, Jakarta"
              rows={6} // memperbesar textarea
            />
          </div>
          <div className="mt-3 md:mt-0 md:w-48">
            <ZonaWaktuSelect
              label="Zona Waktu"
              value={form.zonaWaktuPusat}
              onChange={(v) => setField("zonaWaktuPusat", v)}
            />
          </div>
        </div>

        {/* Alamat Factory */}
        <div className="flex flex-col md:flex-row md:items-center md:gap-6">
          <div className="flex-1">
            <FormTextarea
              label="Alamat Factory"
              value={form.alamatFactory}
              onChange={(v) => setField("alamatFactory", v)}
              placeholder="Jl. Contoh Factory No.456, Bandung"
              rows={6} // memperbesar textarea
            />
          </div>
          <div className="mt-3 md:mt-0 md:w-48">
            <ZonaWaktuSelect
              label="Zona Waktu"
              value={form.zonaWaktuFactory}
              onChange={(v) => setField("zonaWaktuFactory", v)}
            />
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
}
// ─────────────────────────────────────────────
// MODAL KONTAK
// ─────────────────────────────────────────────

interface ModalKontakProps {
  initialData: KontakFormData;
  isSaving: boolean;
  onClose: () => void;
  onSave: (data: KontakFormData) => void;
}

export function ModalKontak({
  initialData,
  isSaving,
  onClose,
  onSave,
}: ModalKontakProps) {
  const [form, setForm] = useState<KontakFormData>(initialData);

  useEffect(() => {
    setForm(initialData);
  }, [initialData]);

  function setField(key: keyof KontakFormData, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-xl mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-zinc-100">
          <div>
            <p className="text-sm font-bold text-zinc-800">Edit Kontak</p>
            <p className="text-xs text-zinc-400 mt-0.5">
              Perbarui informasi kontak perusahaan.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-zinc-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-zinc-400" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          <FormInput
            label="Telepon"
            value={form.telpon}
            onChange={(v) => setField("telpon", v)}
            placeholder="+62..."
          />
          <FormInput
            label="Fax"
            value={form.fax}
            onChange={(v) => setField("fax", v)}
            placeholder="+62..."
          />
          <FormInput
            label="Email"
            value={form.email}
            onChange={(v) => setField("email", v)}
            placeholder="email@perusahaan.com"
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-zinc-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-zinc-600 hover:bg-zinc-50 rounded-lg transition-colors"
          >
            Batal
          </button>
          <button
            onClick={() => onSave(form)}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 rounded-lg transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            {isSaving ? "Menyimpan..." : "Simpan Data"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// MODAL SERTIFIKASI
// ─────────────────────────────────────────────

interface ModalSertifikasiProps {
  initialData: SertifikasiFormData;
  isSaving: boolean;
  onClose: () => void;
  onSave: (data: SertifikasiFormData) => void;
}

export function ModalSertifikasi({
  initialData,
  isSaving,
  onClose,
  onSave,
}: ModalSertifikasiProps) {
  const [form, setForm] = useState<SertifikasiFormData>(initialData);

  useEffect(() => {
    setForm(initialData);
  }, [initialData]);

  function setField(key: keyof SertifikasiFormData, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <ModalWrapper
      title="Edit Sertifikasi"
      subtitle="Perbarui data sertifikasi perusahaan."
      onClose={onClose}
      onSave={() => onSave(form)}
      isSaving={isSaving}
    >
      <FormInput
        label="ISO 9001"
        value={form.iso9001}
        onChange={(v) => setField("iso9001", v)}
        placeholder="-"
      />
      <FormInput
        label="ISO 14001"
        value={form.iso14001}
        onChange={(v) => setField("iso14001", v)}
        placeholder="-"
      />
      <FormInput
        label="OHSAS 18001"
        value={form.ohsas18001}
        onChange={(v) => setField("ohsas18001", v)}
        placeholder="-"
      />
    </ModalWrapper>
  );
}

// ─────────────────────────────────────────────
// MODAL KLASIFIKASI
// ─────────────────────────────────────────────

interface ModalKlasifikasiProps {
  initialData: KlasifikasiFormData;
  isSaving: boolean;
  onClose: () => void;
  onSave: (data: KlasifikasiFormData) => void;
}

export function ModalKlasifikasi({
  initialData,
  isSaving,
  onClose,
  onSave,
}: ModalKlasifikasiProps) {
  const [form, setForm] = useState<KlasifikasiFormData>(initialData);

  useEffect(() => {
    setForm(initialData);
  }, [initialData]);

  function setField(key: keyof KlasifikasiFormData, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <ModalWrapper
      title="Edit Klasifikasi & Kepemilikan"
      subtitle="Perbarui data klasifikasi perusahaan."
      onClose={onClose}
      onSave={() => onSave(form)}
      isSaving={isSaving}
    >
      <FormInput
        label="Kategori CPN"
        value={form.kategoriCpn}
        onChange={(v) => setField("kategoriCpn", v)}
        placeholder="-"
      />
      <div className="grid grid-cols-2 gap-3">
        <FormInput
          label="Line Bisnis"
          value={form.lineBisnis}
          onChange={(v) => setField("lineBisnis", v)}
          placeholder="-"
        />
        <FormInput
          label="Sub Kategori"
          value={form.lineBisnisSub}
          onChange={(v) => setField("lineBisnisSub", v)}
          placeholder="Sub kategori"
        />
      </div>
      <FormInput
        label="Permodalan"
        value={form.permodalan}
        onChange={(v) => setField("permodalan", v)}
        placeholder="-"
      />
    </ModalWrapper>
  );
}

// ─────────────────────────────────────────────
// MODAL PROPERTI FINANSIAL
// ─────────────────────────────────────────────

interface ModalPropertiFinansialProps {
  initialData: PropertiFinansialFormData;
  isSaving: boolean;
  onClose: () => void;
  onSave: (data: PropertiFinansialFormData) => void;
}

export function ModalPropertiFinansial({
  initialData,
  isSaving,
  onClose,
  onSave,
}: ModalPropertiFinansialProps) {
  const [form, setForm] = useState<PropertiFinansialFormData>(initialData);

  useEffect(() => {
    setForm(initialData);
  }, [initialData]);

  function setField(key: keyof PropertiFinansialFormData, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <ModalWrapper
      title="Edit Properti & Finansial"
      subtitle="Perbarui data properti dan finansial perusahaan."
      onClose={onClose}
      onSave={() => onSave(form)}
      isSaving={isSaving}
    >
      {/* Sub Bidang PROPER */}
      <div className="flex flex-col gap-1">
        <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-wide">
          Sub Bidang PROPER
        </label>
        <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col gap-1">
            <input
              type="number"
              value={form.subBidangNilai}
              onChange={(e) => setField("subBidangNilai", e.target.value)}
              placeholder="0"
              className={numberInputClass}
            />
            <span className="text-[10px] text-zinc-400">Nilai</span>
          </div>
          <div className="flex flex-col gap-1">
            <input
              type="number"
              value={form.subBidangBatasEmas}
              onChange={(e) => setField("subBidangBatasEmas", e.target.value)}
              placeholder="0"
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
              onChange={(e) => setField("subBidangBatasHijau", e.target.value)}
              placeholder="0"
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
      />
      <FormTextarea
        label="Info Keuangan"
        value={form.infoKeuangan}
        onChange={(v) => setField("infoKeuangan", v)}
      />
      <FormTextarea
        label="Keterangan"
        value={form.keterangan}
        onChange={(v) => setField("keterangan", v)}
      />
      <FormInput
        label="Group"
        value={form.group}
        onChange={(v) => setField("group", v)}
        placeholder="Belum ada data"
      />
      <FormInput
        label="BDO Action"
        value={form.bdoAction}
        onChange={(v) => setField("bdoAction", v)}
        placeholder="Belum ada data"
      />
      <FormInput
        label="Prioritas (MA/NN)"
        value={form.prioritasMANN}
        onChange={(v) => setField("prioritasMANN", v)}
        placeholder="Belum ada data"
      />
      <FormInput
        label="Prioritas (AE)"
        value={form.prioritasAE}
        onChange={(v) => setField("prioritasAE", v)}
        placeholder="Belum ada data"
      />
      <FormInput
        label="Vendor"
        value={form.vendor}
        onChange={(v) => setField("vendor", v)}
        placeholder="Belum ada data"
      />
    </ModalWrapper>
  );
}

// ─────────────────────────────────────────────
// MODAL INFORMASI LAINNYA
// ─────────────────────────────────────────────

interface ModalInformasiLainnyaProps {
  initialData: InformasiLainnyaFormData;
  isSaving: boolean;
  onClose: () => void;
  onSave: (data: InformasiLainnyaFormData) => void;
}

export function ModalInformasiLainnya({
  initialData,
  isSaving,
  onClose,
  onSave,
}: ModalInformasiLainnyaProps) {
  const [form, setForm] = useState<InformasiLainnyaFormData>(initialData);

  useEffect(() => {
    setForm(initialData);
  }, [initialData]);

  function setField(key: keyof InformasiLainnyaFormData, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <ModalWrapper
      title="Edit Informasi Lainnya"
      subtitle="Perbarui informasi tambahan perusahaan."
      onClose={onClose}
      onSave={() => onSave(form)}
      isSaving={isSaving}
    >
      <FormInput
        label="Cabang (Site)"
        value={form.cabangSite}
        onChange={(v) => setField("cabangSite", v)}
        placeholder="-"
      />
      <div className="flex flex-col gap-1">
        <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-wide">
          Pesaing
        </label>
        <input
          type="text"
          value={form.pesaing}
          onChange={(e) => setField("pesaing", e.target.value)}
          placeholder="-"
          className="w-full px-3 py-2 text-xs text-emerald-600 bg-white border border-zinc-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 transition-all placeholder:text-zinc-300"
        />
      </div>
      <FormTextarea
        label="Kebutuhan Training"
        value={form.kebutuhanTraining}
        onChange={(v) => setField("kebutuhanTraining", v)}
        placeholder="EM-01|EM-05|..."
        rows={2}
      />
      <FormTextarea
        label="Prosedur Pelatihan"
        value={form.prosedurPelatihan}
        onChange={(v) => setField("prosedurPelatihan", v)}
        rows={3}
      />
    </ModalWrapper>
  );
}

//MODAL INFORMASI DAERAH
interface ModalInformasiDaerahProps {
  initialData: InformasiDaerahFormData;
  isSaving: boolean;
  onClose: () => void;
  onSave: (data: InformasiDaerahFormData) => void;
}

export function ModalInformasiDaerah({
  initialData,
  isSaving,
  onClose,
  onSave,
}: ModalInformasiDaerahProps) {
  const [form, setForm] = useState<InformasiDaerahFormData>(initialData);

  useEffect(() => {
    setForm(initialData);
  }, [initialData]);

  function setField(key: keyof InformasiDaerahFormData, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <ModalWrapper
      title="Edit Informasi Daerah"
      subtitle="Perbarui informasi instansi dan data daerah."
      onClose={onClose}
      onSave={() => onSave(form)}
      isSaving={isSaving}
    >
      <FormInput
        label="Instansi"
        value={form.instansi}
        onChange={(v) => setField("instansi", v)}
        placeholder="Nama instansi daerah"
      />
      <FormInput
        label="Keterangan"
        value={form.keterangan}
        onChange={(v) => setField("keterangan", v)}
        placeholder="Contoh: Bup. Periode 2004 - 2009"
      />
      <FormInput
        label="Sekilas LH"
        value={form.sekilasLh}
        onChange={(v) => setField("sekilasLh", v)}
        placeholder="Informasi sekilas lingkungan hidup"
      />
      <FormInput
        label="RSUD"
        value={form.rsud}
        onChange={(v) => setField("rsud", v)}
        placeholder="Contoh: RSU Dr. Slamet Garut"
      />
    </ModalWrapper>
  );
}

interface ModalBidangKedinasanProps {
  initialData: BidangKedinasanFormData;
  isSaving: boolean;
  onClose: () => void;
  onSave: (data: BidangKedinasanFormData) => void;
}

export function ModalBidangKedinasan({
  initialData,
  isSaving,
  onClose,
  onSave,
}: ModalBidangKedinasanProps) {
  const [form, setForm] = useState<BidangKedinasanFormData>(initialData);

  useEffect(() => {
    setForm(initialData);
  }, [initialData]);

  function setField(key: keyof BidangKedinasanFormData, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <ModalWrapper
      title="Edit Bidang Kedinasan"
      subtitle="Perbarui data bidang kedinasan."
      onClose={onClose}
      onSave={() => onSave(form)}
      isSaving={isSaving}
    >
      <FormInput
        label="Ind Pengolahan"
        value={form.indPengolahan}
        onChange={(v) => setField("indPengolahan", v)}
        placeholder="-"
      />
      <FormInput
        label="Pertambangan"
        value={form.pertambangan}
        onChange={(v) => setField("pertambangan", v)}
        placeholder="-"
      />
      <FormInput
        label="Listrik/Gas/Air/Bersih"
        value={form.listrikGasAirBersih}
        onChange={(v) => setField("listrikGasAirBersih", v)}
        placeholder="-"
      />
      <FormInput
        label="Hotel &Resto"
        value={form.hotelResto}
        onChange={(v) => setField("hotelResto", v)}
        placeholder="-"
      />
      <FormInput
        label="Angkut&Trans"
        value={form.angkutTrans}
        onChange={(v) => setField("angkutTrans", v)}
        placeholder="-"
      />
      <FormInput
        label="Bangunan"
        value={form.bangunan}
        onChange={(v) => setField("bangunan", v)}
        placeholder="-"
      />
      <FormInput
        label="Pertanian"
        value={form.pertanian}
        onChange={(v) => setField("pertanian", v)}
        placeholder="-"
      />
      <FormInput
        label="Keuangan"
        value={form.keuangan}
        onChange={(v) => setField("keuangan", v)}
        placeholder="-"
      />
      <FormInput
        label="Laut"
        value={form.laut}
        onChange={(v) => setField("laut", v)}
        placeholder="-"
      />
      <FormInput
        label="Jasa"
        value={form.jasa}
        onChange={(v) => setField("jasa", v)}
        placeholder="-"
      />
    </ModalWrapper>
  );
}

interface ModalStatistikProperProps {
  initialData: StatistikProperFormData;
  isSaving: boolean;
  onClose: () => void;
  onSave: (data: StatistikProperFormData) => void;
}

export function ModalStatistikProper({
  initialData,
  isSaving,
  onClose,
  onSave,
}: ModalStatistikProperProps) {
  const [form, setForm] = useState<StatistikProperFormData>(initialData);

  useEffect(() => {
    setForm(initialData);
  }, [initialData]);

  function setRowField(
    tahun: number,
    key: keyof Omit<StatistikProperRow, "tahun">,
    value: string,
  ) {
    setForm((prev) => ({
      rows: prev.rows.map((r) =>
        r.tahun === tahun ? { ...r, [key]: value } : r,
      ),
    }));
  }

  return (
    <ModalWrapper
      title="Edit Statistik PROPER"
      subtitle="Perbarui data jumlah perusahaan PROPER per tahun."
      onClose={onClose}
      onSave={() => onSave(form)}
      isSaving={isSaving}
    >
      {form.rows.map((row) => (
        <div key={row.tahun} className="flex flex-col gap-2">
          <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wide">
            {row.tahun}
          </p>
          <div className="grid grid-cols-5 gap-2">
            {(["emas", "hijau", "biru", "merah", "hitam"] as const).map(
              (key) => (
                <FormInput
                  key={key}
                  label={key.charAt(0).toUpperCase() + key.slice(1)}
                  value={row[key]}
                  onChange={(v) => setRowField(row.tahun, key, v)}
                  placeholder="0"
                />
              ),
            )}
          </div>
        </div>
      ))}
    </ModalWrapper>
  );
}

interface ModalLokasiPemdaProps {
  initialData: LokasiPemdaFormData;
  isSaving: boolean;
  onClose: () => void;
  onSave: (data: LokasiPemdaFormData) => void;
}

export function ModalLokasiPemda({
  initialData,
  isSaving,
  onClose,
  onSave,
}: ModalLokasiPemdaProps) {
  const [form, setForm] = useState<LokasiPemdaFormData>(initialData);

  useEffect(() => {
    setForm(initialData);
  }, [initialData]);

  function setField(key: keyof LokasiPemdaFormData, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <ModalWrapper
      title="Edit Lokasi"
      subtitle="Perbarui data lokasi PEMDA."
      onClose={onClose}
      onSave={() => onSave(form)}
      isSaving={isSaving}
    >
      <FormInput
        label="Kota/Kabupaten"
        value={form.kotaKabupaten}
        onChange={(v) => setField("kotaKabupaten", v)}
        placeholder="Contoh: Kota Bekasi"
      />
      <FormInput
        label="Provinsi"
        value={form.provinsi}
        onChange={(v) => setField("provinsi", v)}
        placeholder="Contoh: Jawa Barat"
      />
      <FormInput
        label="Alamat"
        value={form.alamat}
        onChange={(v) => setField("alamat", v)}
        placeholder="Jl. Contoh No. 123"
      />
    </ModalWrapper>
  );
}
