// components/(form)/card-sertifikasi.tsx
"use client";

import { useEffect, useState } from "react";
import { BadgeCheck, ChevronDown, Pencil, Plus, Trash2 } from "lucide-react";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export interface IsoItem {
  id: string;
  nama: string; // Nama ISO, contoh: "ISO 9001:2015"
  tahun: string; // Tahun ISO, contoh: "2024"
}

export interface ProperItem {
  id: string;
  tahun: string; // Tahun PROPER
  warna: string; // Emas | Hijau | Biru | Merah | Hitam
}

export interface SertifikasiFormData {
  isoList: IsoItem[];
  properList: ProperItem[];
}

interface CardSertifikasiProps {
  initialData?: Partial<SertifikasiFormData>;
  onChange?: (data: SertifikasiFormData) => void;
  disabled?: boolean;
  isEdit?: boolean;
  onEdit?: () => void;
}

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────

export const WARNA_PROPER_OPTIONS: {
  value: string;
  dot: string;
}[] = [
  { value: "Emas", dot: "bg-yellow-400" },
  { value: "Hijau", dot: "bg-green-400" },
  { value: "Biru", dot: "bg-blue-400" },
  { value: "Merah", dot: "bg-red-400" },
  { value: "Hitam", dot: "bg-zinc-800" },
];

let localCounter = 0;
function genId(prefix: string) {
  localCounter += 1;
  return `${prefix}-${Date.now()}-${localCounter}`;
}

export function emptyIsoItem(): IsoItem {
  return { id: genId("iso"), nama: "", tahun: "" };
}

export function emptyProperItem(): ProperItem {
  return { id: genId("proper"), tahun: "", warna: "Biru" };
}

// ─────────────────────────────────────────────
// BRIDGE ke backend (sementara)
// ─────────────────────────────────────────────
// Backend perusahaan masih pakai 3 kolom string tetap
// (iso9000/iso14000/ohsas18001smk3), belum ada tabel untuk list ISO
// fleksibel maupun data PROPER per-perusahaan. Selama backend belum
// diupgrade, 3 entri ISO pertama dipetakan best-effort ke 3 kolom lama
// saat submit; entri ISO ke-4 dst & seluruh data PROPER hanya hidup di
// form sesi ini (tidak ikut tersimpan/reload dari server untuk sekarang).

export function isoListToLegacy(list: IsoItem[]): [string, string, string] {
  const format = (item?: IsoItem) =>
    item ? [item.nama, item.tahun].filter(Boolean).join(" - ") : "";
  return [format(list[0]), format(list[1]), format(list[2])];
}

export function legacyToIsoList(
  values: (string | null | undefined)[],
): IsoItem[] {
  return values
    .filter((v): v is string => !!v && v.trim().length > 0)
    .map((v) => ({ id: genId("iso"), nama: v.trim(), tahun: "" }));
}

// ─────────────────────────────────────────────
// SHARED EDITOR (dipakai di Card & Modal)
// ─────────────────────────────────────────────

const inputClass =
  "text-xs border border-zinc-200 rounded-lg px-3 py-2 outline-none focus:ring-2 ring-emerald-500/20 disabled:bg-white disabled:text-zinc-400 disabled:cursor-not-allowed placeholder:text-zinc-300 transition-all";

interface SertifikasiEditorProps {
  form: SertifikasiFormData;
  onChangeForm: (next: SertifikasiFormData) => void;
  locked?: boolean;
}

export function SertifikasiEditor({
  form,
  onChangeForm,
  locked = false,
}: SertifikasiEditorProps) {
  // ── ISO handlers ──
  const addIso = () =>
    onChangeForm({ ...form, isoList: [...form.isoList, emptyIsoItem()] });

  const setIsoField = (id: string, key: "nama" | "tahun", value: string) =>
    onChangeForm({
      ...form,
      isoList: form.isoList.map((item) =>
        item.id === id ? { ...item, [key]: value } : item,
      ),
    });

  const removeIso = (id: string) =>
    onChangeForm({
      ...form,
      isoList: form.isoList.filter((item) => item.id !== id),
    });

  // ── PROPER handlers ──
  const addProper = () =>
    onChangeForm({
      ...form,
      properList: [...form.properList, emptyProperItem()],
    });

  const setProperField = (id: string, key: "tahun" | "warna", value: string) =>
    onChangeForm({
      ...form,
      properList: form.properList.map((item) =>
        item.id === id ? { ...item, [key]: value } : item,
      ),
    });

  const removeProper = (id: string) =>
    onChangeForm({
      ...form,
      properList: form.properList.filter((item) => item.id !== id),
    });

  return (
    <div className="space-y-6">
      {/* ISO */}
      <div className="space-y-2">
        <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wide">
          ISO
        </label>

        {form.isoList.length === 0 && (
          <p className="text-xs text-zinc-300 italic">Belum ada data ISO.</p>
        )}

        <div className="space-y-2">
          {form.isoList.map((item) => (
            <div key={item.id} className="flex items-center gap-2">
              <input
                value={item.nama}
                onChange={(e) => setIsoField(item.id, "nama", e.target.value)}
                placeholder="Nama ISO (contoh: ISO 9001:2015)"
                disabled={locked}
                className={`flex-1 ${inputClass}`}
              />
              <input
                value={item.tahun}
                onChange={(e) => setIsoField(item.id, "tahun", e.target.value)}
                placeholder="Tahun"
                disabled={locked}
                className={`w-24 shrink-0 ${inputClass}`}
              />
              {!locked && (
                <button
                  type="button"
                  onClick={() => removeIso(item.id)}
                  className="p-1.5 hover:bg-red-50 text-zinc-400 hover:text-red-500 rounded-lg transition-colors shrink-0"
                  title="Hapus ISO"
                >
                  <Trash2 size={13} />
                </button>
              )}
            </div>
          ))}
        </div>

        {!locked && (
          <button
            type="button"
            onClick={addIso}
            className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            <Plus size={13} /> Tambah ISO
          </button>
        )}
      </div>

      {/* PROPER */}
      <div className="space-y-2 pt-4 border-t border-zinc-100">
        <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wide">
          PROPER
        </label>

        {form.properList.length === 0 && (
          <p className="text-xs text-zinc-300 italic">
            Belum ada data PROPER.
          </p>
        )}

        <div className="space-y-2">
          {form.properList.map((item) => {
            const warna = WARNA_PROPER_OPTIONS.find(
              (w) => w.value === item.warna,
            );
            return (
              <div key={item.id} className="flex items-center gap-2">
                <input
                  value={item.tahun}
                  onChange={(e) =>
                    setProperField(item.id, "tahun", e.target.value)
                  }
                  placeholder="Tahun"
                  disabled={locked}
                  className={`w-24 shrink-0 ${inputClass}`}
                />
                <div className="flex-1 flex items-center gap-2">
                  <select
                    value={item.warna}
                    onChange={(e) =>
                      setProperField(item.id, "warna", e.target.value)
                    }
                    disabled={locked}
                    className={`flex-1 bg-white ${inputClass}`}
                  >
                    {WARNA_PROPER_OPTIONS.map((w) => (
                      <option key={w.value} value={w.value}>
                        {w.value}
                      </option>
                    ))}
                  </select>
                  {warna && (
                    <span
                      className={`w-2.5 h-2.5 rounded-full shrink-0 ${warna.dot}`}
                    />
                  )}
                </div>
                {!locked && (
                  <button
                    type="button"
                    onClick={() => removeProper(item.id)}
                    className="p-1.5 hover:bg-red-50 text-zinc-400 hover:text-red-500 rounded-lg transition-colors shrink-0"
                    title="Hapus PROPER"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {!locked && (
          <button
            type="button"
            onClick={addProper}
            className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            <Plus size={13} /> Tambah PROPER
          </button>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

export default function CardSertifikasi({
  initialData = {},
  onChange,
  disabled = false,
  isEdit = false,
  onEdit,
}: CardSertifikasiProps) {
  const [isOpen, setIsOpen] = useState(true);

  const [form, setForm] = useState<SertifikasiFormData>({
    isoList: initialData.isoList ?? [],
    properList: initialData.properList ?? [],
  });

  const isLocked = isEdit || disabled;

  useEffect(() => {
    setForm({
      isoList: initialData.isoList ?? [],
      properList: initialData.properList ?? [],
    });
  }, [initialData]);

  function handleChangeForm(next: SertifikasiFormData) {
    setForm(next);
    onChange?.(next);
  }

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="w-full flex items-center justify-between px-5 py-4 border-b border-zinc-100">
        <span className="flex items-center gap-2 text-sm font-bold text-zinc-800">
          <BadgeCheck className="w-4 h-4 text-emerald-500" />
          Sertifikasi &amp; PROPER
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
          <SertifikasiEditor
            form={form}
            onChangeForm={handleChangeForm}
            locked={isLocked}
          />
        </div>
      )}
    </div>
  );
}
