"use client";

import React, { useState, useMemo, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-lg">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-800">Tambah Jurnal Keuangan</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4 px-6 py-4">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setMode("SIMPLE")}
              className={`rounded-md px-4 py-2 text-sm font-medium ${
                mode === "SIMPLE" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
              }`}
            >
              Simple
            </button>
            <button
              type="button"
              onClick={() => setMode("ADVANCED")}
              className={`rounded-md px-4 py-2 text-sm font-medium ${
                mode === "ADVANCED" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
              }`}
            >
              Advanced
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Tanggal</label>
              <input
                type="date"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Deskripsi</label>
              <input
                type="text"
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                placeholder="Contoh: Pembayaran listrik kantor"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
          </div>

          {mode === "SIMPLE" ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Dari Akun (kredit)</label>
                <select
                  value={dariAkunId}
                  onChange={(e) => setDariAkunId(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
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
                <label className="mb-1 block text-sm font-medium text-gray-700">Ke Akun (debit)</label>
                <select
                  value={keAkunId}
                  onChange={(e) => setKeAkunId(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
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
              <div className="col-span-2">
                <label className="mb-1 block text-sm font-medium text-gray-700">Nominal</label>
                <input
                  type="number"
                  min={0}
                  value={nominal}
                  onChange={(e) => setNominal(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-2 grid grid-cols-12 gap-2 text-xs font-medium text-gray-500">
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
                          className="col-span-4 rounded-md border border-gray-300 px-2 py-1.5 text-sm"
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
                          className="col-span-2 rounded-md border border-gray-300 px-2 py-1.5 text-sm"
                        />
                        <input
                          type="number"
                          min={0}
                          value={row.kredit}
                          onChange={(e) => onChangeRow(index, "kredit", e.target.value)}
                          className="col-span-2 rounded-md border border-gray-300 px-2 py-1.5 text-sm"
                        />
                        <input
                          type="text"
                          value={row.keterangan}
                          onChange={(e) => onChangeRow(index, "keterangan", e.target.value)}
                          className="col-span-3 rounded-md border border-gray-300 px-2 py-1.5 text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => onRemoveRow(index)}
                          disabled={rows.length <= 2}
                          className="col-span-1 text-gray-400 hover:text-red-500 disabled:opacity-30"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    );
                  })
                : null}
              <button
                type="button"
                onClick={onAddRow}
                className="mt-1 flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                <Plus size={14} /> Tambah Baris
              </button>
            </div>
          )}

          <div className="flex items-center justify-between rounded-md bg-gray-50 px-4 py-3 text-sm">
            <div>
              Total Debit: <span className="font-semibold">{formatRupiah(totalDebit)}</span>
            </div>
            <div>
              Total Kredit: <span className="font-semibold">{formatRupiah(totalKredit)}</span>
            </div>
            <div className={isBalance ? "font-semibold text-emerald-600" : "font-semibold text-red-500"}>
              {isBalance ? "Balance" : "Belum Balance"}
            </div>
          </div>

          {errorMsg ? <p className="text-sm text-red-500">{errorMsg}</p> : null}
        </div>

        <div className="flex justify-end gap-2 border-t px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600"
          >
            Batal
          </button>
          <button
            onClick={onSave}
            disabled={!isBalance || saving}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
          >
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
}
