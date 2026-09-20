"use client";

import React, { useState, useMemo, useEffect } from "react";
import { X, Plus, Trash2, Save, Loader2 } from "lucide-react";
import type { AkunItem } from "@/lib/services/accounting.service";
import type { ModeJurnal, JurnalBarisInput } from "@/lib/services/jurnal-keuangan.service";

interface JurnalModalProps {
  open: boolean;
  akunList: AkunItem[];
  saving: boolean;
  onClose: () => void;
  onSubmit: (payload: {
    tanggal: string;
    deskripsi: string;
    mode: ModeJurnal;
    baris: JurnalBarisInput[];
  }) => Promise<void>;
}

interface AdvancedRow {
  akunId: string;
  debit: string;
  kredit: string;
  keterangan: string;
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function emptyRow(): AdvancedRow {
  return { akunId: "", debit: "", kredit: "", keterangan: "" };
}

function formatRupiah(val: number) {
  return `Rp${val.toLocaleString("id-ID")}`;
}

const inputCls =
  "w-full px-3 py-2 border border-zinc-200 rounded-xl text-xs text-zinc-700 outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 transition-all placeholder:text-zinc-300";

const labelCls = "block text-[11px] font-semibold text-zinc-500 mb-1.5";

export function JurnalModal({ open, akunList, saving, onClose, onSubmit }: JurnalModalProps) {
  const [mode, setMode] = useState<ModeJurnal>("SIMPLE");
  const [tanggal, setTanggal] = useState(todayIso());
  const [deskripsi, setDeskripsi] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Simple mode
  const [dariAkunId, setDariAkunId] = useState("");
  const [keAkunId, setKeAkunId] = useState("");
  const [nominal, setNominal] = useState("");

  // Advanced mode
  const [rows, setRows] = useState<AdvancedRow[]>([emptyRow(), emptyRow()]);

  useEffect(() => {
    if (open) {
      setMode("SIMPLE");
      setTanggal(todayIso());
      setDeskripsi("");
      setDariAkunId("");
      setKeAkunId("");
      setNominal("");
      setRows([emptyRow(), emptyRow()]);
      setErrorMsg(null);
    }
  }, [open]);

  const totalDebit = useMemo(() => {
    if (mode === "SIMPLE") return Number(nominal) || 0;
    return rows.reduce((sum, r) => sum + (Number(r.debit) || 0), 0);
  }, [mode, nominal, rows]);

  const totalKredit = useMemo(() => {
    if (mode === "SIMPLE") return Number(nominal) || 0;
    return rows.reduce((sum, r) => sum + (Number(r.kredit) || 0), 0);
  }, [mode, nominal, rows]);

  const isBalance = totalDebit > 0 && totalDebit === totalKredit;

  function onAddRow() {
    setRows((prev) => [...prev, emptyRow()]);
  }

  function onRemoveRow(index: number) {
    setRows((prev) => (prev.length > 2 ? prev.filter((_, i) => i !== index) : prev));
  }

  function onChangeRow(index: number, field: keyof AdvancedRow, value: string) {
    setRows((prev) =>
      prev.map((r, i) => (i === index ? { ...r, [field]: value } : r)),
    );
  }

  async function onSave() {
    setErrorMsg(null);
    if (!tanggal || !deskripsi.trim()) {
      setErrorMsg("Tanggal dan deskripsi wajib diisi.");
      return;
    }
    if (!isBalance) {
      setErrorMsg("Total debit dan kredit harus seimbang.");
      return;
    }

    let baris: JurnalBarisInput[];
    if (mode === "SIMPLE") {
      if (!dariAkunId || !keAkunId) {
        setErrorMsg("Pilih akun asal dan akun tujuan.");
        return;
      }
      if (dariAkunId === keAkunId) {
        setErrorMsg("Akun asal dan tujuan tidak boleh sama.");
        return;
      }
      baris = [
        { akunId: Number(keAkunId), debit: Number(nominal), keterangan: deskripsi },
        { akunId: Number(dariAkunId), kredit: Number(nominal), keterangan: deskripsi },
      ];
    } else {
      const filled = rows.filter((r) => r.akunId && (Number(r.debit) > 0 || Number(r.kredit) > 0));
      if (filled.length < 2) {
        setErrorMsg("Minimal 2 baris jurnal harus diisi.");
        return;
      }
      baris = filled.map((r) => ({
        akunId: Number(r.akunId),
        debit: Number(r.debit) || 0,
        kredit: Number(r.kredit) || 0,
        keterangan: r.keterangan || undefined,
      }));
    }

    try {
      await onSubmit({ tanggal, deskripsi: deskripsi.trim(), mode, baris });
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Gagal menyimpan jurnal.");
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.35)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
          <div>
            <p className="font-bold text-zinc-800 text-sm">Tambah Jurnal Keuangan</p>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Catat transaksi double-entry (debit = kredit).
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-zinc-100 transition-colors text-zinc-400 hover:text-zinc-600 shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setMode("SIMPLE")}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                mode === "SIMPLE" ? "bg-emerald-500 text-white" : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
              }`}
            >
              Simple
            </button>
            <button
              type="button"
              onClick={() => setMode("ADVANCED")}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                mode === "ADVANCED" ? "bg-emerald-500 text-white" : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
              }`}
            >
              Advanced
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Tanggal</label>
              <input
                type="date"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Deskripsi</label>
              <input
                type="text"
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                placeholder="Contoh: Pembayaran listrik kantor"
                className={inputCls}
              />
            </div>
          </div>

          {mode === "SIMPLE" ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCls}>Dari Akun (kredit)</label>
                <select
                  value={dariAkunId}
                  onChange={(e) => setDariAkunId(e.target.value)}
                  className={`${inputCls} bg-white`}
                >
                  <option value="">Pilih akun</option>
                  {akunList && akunList.length > 0
                    ? akunList.map((a) => {
                        return (
                          <option key={a.id} value={a.id}>
                            {a.kode ? `${a.kode} - ${a.nama}` : a.nama}
                          </option>
                        );
                      })
                    : null}
                </select>
              </div>
              <div>
                <label className={labelCls}>Ke Akun (debit)</label>
                <select
                  value={keAkunId}
                  onChange={(e) => setKeAkunId(e.target.value)}
                  className={`${inputCls} bg-white`}
                >
                  <option value="">Pilih akun</option>
                  {akunList && akunList.length > 0
                    ? akunList.map((a) => {
                        return (
                          <option key={a.id} value={a.id}>
                            {a.kode ? `${a.kode} - ${a.nama}` : a.nama}
                          </option>
                        );
                      })
                    : null}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Nominal</label>
                <input
                  type="number"
                  min={0}
                  value={nominal}
                  onChange={(e) => setNominal(e.target.value)}
                  placeholder="0"
                  className={inputCls}
                />
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-2 grid grid-cols-12 gap-2 text-[10px] font-semibold text-zinc-400">
                <div className="col-span-4">Akun</div>
                <div className="col-span-2">Debit</div>
                <div className="col-span-2">Kredit</div>
                <div className="col-span-3">Keterangan</div>
                <div className="col-span-1"></div>
              </div>
              {rows && rows.length > 0
                ? rows.map((row, index) => {
                    return (
                      <div key={index} className="mb-2 grid grid-cols-12 items-center gap-2">
                        <select
                          value={row.akunId}
                          onChange={(e) => onChangeRow(index, "akunId", e.target.value)}
                          className="col-span-4 px-2 py-1.5 border border-zinc-200 rounded-lg text-xs text-zinc-700 outline-none focus:border-emerald-300 transition-all bg-white"
                        >
                          <option value="">Pilih akun</option>
                          {akunList && akunList.length > 0
                            ? akunList.map((a) => {
                                return (
                                  <option key={a.id} value={a.id}>
                                    {a.kode ? `${a.kode} - ${a.nama}` : a.nama}
                                  </option>
                                );
                              })
                            : null}
                        </select>
                        <input
                          type="number"
                          min={0}
                          value={row.debit}
                          onChange={(e) => onChangeRow(index, "debit", e.target.value)}
                          className="col-span-2 px-2 py-1.5 border border-zinc-200 rounded-lg text-xs text-zinc-700 outline-none focus:border-emerald-300 transition-all"
                        />
                        <input
                          type="number"
                          min={0}
                          value={row.kredit}
                          onChange={(e) => onChangeRow(index, "kredit", e.target.value)}
                          className="col-span-2 px-2 py-1.5 border border-zinc-200 rounded-lg text-xs text-zinc-700 outline-none focus:border-emerald-300 transition-all"
                        />
                        <input
                          type="text"
                          value={row.keterangan}
                          onChange={(e) => onChangeRow(index, "keterangan", e.target.value)}
                          className="col-span-3 px-2 py-1.5 border border-zinc-200 rounded-lg text-xs text-zinc-700 outline-none focus:border-emerald-300 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => onRemoveRow(index)}
                          disabled={rows.length <= 2}
                          className="col-span-1 text-zinc-400 hover:text-red-500 disabled:opacity-30 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })
                : null}
              <button
                type="button"
                onClick={onAddRow}
                className="mt-1 flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah Baris
              </button>
            </div>
          )}

          <div className="flex items-center justify-between rounded-xl bg-zinc-50 border border-zinc-100 px-4 py-3 text-xs">
            <div className="text-zinc-500">
              Total Debit: <span className="font-semibold text-zinc-700">{formatRupiah(totalDebit)}</span>
            </div>
            <div className="text-zinc-500">
              Total Kredit: <span className="font-semibold text-zinc-700">{formatRupiah(totalKredit)}</span>
            </div>
            <div className={isBalance ? "font-semibold text-emerald-600" : "font-semibold text-red-500"}>
              {isBalance ? "Balance" : "Belum Balance"}
            </div>
          </div>

          {errorMsg ? <p className="text-[11px] text-red-500">{errorMsg}</p> : null}
        </div>

        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-zinc-100">
          <button
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 rounded-xl text-xs font-semibold border border-zinc-200 text-zinc-600 hover:bg-zinc-50 transition-colors disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={onSave}
            disabled={!isBalance || saving}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition-colors disabled:opacity-50 inline-flex items-center gap-1.5 min-w-[110px] justify-center"
          >
            {saving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                Simpan
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
