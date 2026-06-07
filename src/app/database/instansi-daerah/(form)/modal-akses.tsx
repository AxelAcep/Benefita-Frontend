"use client";

import { useState, useRef, useEffect } from "react";
import type { AkunStatus } from "../(form)/card-overview";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Pegawai {
  id: string;
  prefix: string;
  nama: string;
  kode: string;
}

interface AksesForm {
  status: AkunStatus;
  pegawaiIds: string[];
}

interface FormData {
  env: AksesForm;
  csr: AksesForm;
  tsm: AksesForm;
  epm: AksesForm;
}

interface ModalHakAksesProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
  pegawaiOptions: Pegawai[];
  loadingPegawai?: boolean;
  updating?: boolean;
  updateError?: string | null;
  initialData?: Partial<FormData>;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const JENIS_AKSES: {
  key: keyof FormData;
  label: string;
  description: string;
}[] = [
  { key: "env", label: "ENV", description: "Environment" },
  { key: "csr", label: "CSR", description: "Corporate Social Responsibility" },
  { key: "tsm", label: "TSM", description: "Territory Sales Manager" },
  { key: "epm", label: "EPM", description: "Enterprise Partnership Manager" },
];

const STATUS_OPTIONS: { value: AkunStatus; label: string; color: string }[] = [
  { value: "MA", label: "MA", color: "emerald" },
  { value: "MU", label: "MU", color: "blue" },
  { value: "AM", label: "AM", color: "amber" },
  { value: "-", label: "–", color: "zinc" },
];

const STATUS_STYLE: Record<string, string> = {
  MA: "bg-emerald-50 text-emerald-700 ring-emerald-200 hover:bg-emerald-100",
  MU: "bg-blue-50 text-blue-700 ring-blue-200 hover:bg-blue-100",
  AM: "bg-amber-50 text-amber-700 ring-amber-200 hover:bg-amber-100",
  "-": "bg-zinc-100 text-zinc-500 ring-zinc-200 hover:bg-zinc-200",
};

const STATUS_ACTIVE_STYLE: Record<string, string> = {
  MA: "bg-emerald-500 text-white ring-emerald-500",
  MU: "bg-blue-500 text-white ring-blue-500",
  AM: "bg-amber-500 text-white ring-amber-500",
  "-": "bg-zinc-400 text-white ring-zinc-400",
};

const DEFAULT_FORM: FormData = {
  env: { status: "MA", pegawaiIds: [] },
  csr: { status: "MU", pegawaiIds: [] },
  tsm: { status: "AM", pegawaiIds: [] },
  epm: { status: "-", pegawaiIds: [] },
};

// ─── Combobox Multi-Select ─────────────────────────────────────────────────────

interface ComboboxProps {
  options: Pegawai[];
  selected: string[];
  onChange: (ids: string[]) => void;
  loading?: boolean;
  placeholder?: string;
}

function PegawaiCombobox({
  options,
  selected,
  onChange,
  loading,
  placeholder = "Cari pegawai...",
}: ComboboxProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = options.filter((p) => {
    const q = query.toLowerCase();
    return (
      p.nama.toLowerCase().includes(q) ||
      p.kode.toLowerCase().includes(q) ||
      p.prefix.toLowerCase().includes(q)
    );
  });

  const toggle = (id: string) => {
    onChange(
      selected.includes(id)
        ? selected.filter((x) => x !== id)
        : [...selected, id],
    );
  };

  const removeOne = (id: string) => onChange(selected.filter((x) => x !== id));

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selectedPegawai = options.filter((p) => selected.includes(p.id));

  const initials = (nama: string) =>
    nama
      .split(" ")
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase();

  return (
    <div ref={containerRef} className="relative">
      {/* Tags + Input */}
      <div
        className={`min-h-[42px] flex flex-wrap gap-1.5 items-center px-3 py-2 rounded-xl border bg-white cursor-text transition-all ${
          open
            ? "border-emerald-400 ring-2 ring-emerald-100"
            : "border-zinc-200 hover:border-zinc-300"
        }`}
        onClick={() => {
          setOpen(true);
          (
            containerRef.current?.querySelector("input") as HTMLInputElement
          )?.focus();
        }}
      >
        {selectedPegawai.map((p) => (
          <span
            key={p.id}
            className="inline-flex items-center gap-1 text-xs font-medium bg-emerald-50 text-emerald-700 rounded-lg px-2 py-1 border border-emerald-100"
          >
            <span className="w-4 h-4 rounded-full bg-emerald-500 text-white text-[9px] flex items-center justify-center font-semibold flex-shrink-0">
              {initials(p.nama)}
            </span>
            {p.nama}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeOne(p.id);
              }}
              className="ml-0.5 text-emerald-400 hover:text-emerald-700 leading-none"
            >
              ×
            </button>
          </span>
        ))}

        <input
          className="flex-1 min-w-[120px] text-sm outline-none bg-transparent placeholder:text-zinc-400 text-zinc-700"
          placeholder={selected.length === 0 ? placeholder : ""}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          disabled={loading}
        />

        {selected.length > 0 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange([]);
            }}
            className="text-zinc-300 hover:text-zinc-500 text-sm px-1"
          >
            ×
          </button>
        )}
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-1.5 w-full bg-white border border-zinc-200 rounded-xl shadow-xl shadow-zinc-100 overflow-hidden">
          <div className="max-h-52 overflow-y-auto">
            {loading ? (
              <div className="px-4 py-3 text-sm text-zinc-400">Memuat...</div>
            ) : filtered.length === 0 ? (
              <div className="px-4 py-3 text-sm text-zinc-400">
                Tidak ditemukan
              </div>
            ) : (
              filtered.map((p) => {
                const isSelected = selected.includes(p.id);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => toggle(p.id)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                      isSelected ? "bg-emerald-50" : "hover:bg-zinc-50"
                    }`}
                  >
                    {/* Avatar */}
                    <span
                      className={`w-7 h-7 rounded-full text-xs font-semibold flex items-center justify-center flex-shrink-0 ${
                        isSelected
                          ? "bg-emerald-500 text-white"
                          : "bg-zinc-100 text-zinc-500"
                      }`}
                    >
                      {initials(p.nama)}
                    </span>

                    {/* Name + Code */}
                    <span className="flex-1">
                      <span className="text-sm font-medium text-zinc-800">
                        {p.prefix} {p.nama}
                      </span>
                      <span className="text-xs text-zinc-400 ml-1.5">
                        {p.kode}
                      </span>
                    </span>

                    {/* Checkmark */}
                    {isSelected && (
                      <span className="text-emerald-500 text-sm font-bold">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>

          {selected.length > 0 && (
            <div className="px-4 py-2 border-t border-zinc-100 text-xs text-zinc-400">
              {selected.length} dipilih
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Status Toggle Pills ───────────────────────────────────────────────────────

interface StatusToggleProps {
  value: AkunStatus;
  onChange: (v: AkunStatus) => void;
}

function StatusToggle({ value, onChange }: StatusToggleProps) {
  return (
    <div className="flex gap-1.5">
      {STATUS_OPTIONS.map((s) => {
        const isActive = value === s.value;
        return (
          <button
            key={s.value}
            type="button"
            onClick={() => onChange(s.value)}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold ring-1 transition-all ${
              isActive ? STATUS_ACTIVE_STYLE[s.value] : STATUS_STYLE[s.value]
            }`}
          >
            {s.label}
          </button>
        );
      })}
    </div>
  );
}

// ─── Main Modal ────────────────────────────────────────────────────────────────

export default function ModalHakAkses({
  open,
  onClose,
  onSubmit,
  pegawaiOptions,
  loadingPegawai,
  updating,
  updateError,
  initialData,
}: ModalHakAksesProps) {
  const [formData, setFormData] = useState<FormData>(DEFAULT_FORM);

  // Sync initial data saat modal dibuka
  useEffect(() => {
    if (open) {
      setFormData({
        env: { ...DEFAULT_FORM.env, ...initialData?.env },
        csr: { ...DEFAULT_FORM.csr, ...initialData?.csr },
        tsm: { ...DEFAULT_FORM.tsm, ...initialData?.tsm },
        epm: { ...DEFAULT_FORM.epm, ...initialData?.epm },
      });
    }
  }, [open]);

  const setAkses = (key: keyof FormData, patch: Partial<AksesForm>) => {
    setFormData((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } }));
  };

  const handleSubmit = async () => {
    await onSubmit(formData);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-zinc-100">
          <h2 className="text-base font-semibold text-zinc-900">
            Edit Hak Akses Karyawan
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Pilih pegawai dan status untuk setiap jenis akses
          </p>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-6 max-h-[60vh] overflow-y-auto">
          {updateError && (
            <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-xs text-red-600">
              {updateError}
            </div>
          )}

          {JENIS_AKSES.map(({ key, label, description }) => (
            <div key={key}>
              {/* Section header */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold tracking-widest text-zinc-400 uppercase">
                  {label}
                </span>
                <span className="text-xs text-zinc-300">·</span>
                <span className="text-xs text-zinc-400">{description}</span>
              </div>

              {/* Status pills */}
              <div className="mb-2.5">
                <StatusToggle
                  value={formData[key].status}
                  onChange={(v) => setAkses(key, { status: v })}
                />
              </div>

              {/* Combobox */}
              <PegawaiCombobox
                options={pegawaiOptions}
                selected={formData[key].pegawaiIds}
                onChange={(ids) => setAkses(key, { pegawaiIds: ids })}
                loading={loadingPegawai}
              />
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-zinc-100 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-zinc-500 hover:text-zinc-700 hover:bg-zinc-50 rounded-xl transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={updating}
            className="px-5 py-2 text-sm font-medium bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {updating ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </div>
    </div>
  );
}
