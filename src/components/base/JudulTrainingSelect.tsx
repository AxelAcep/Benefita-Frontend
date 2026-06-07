"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, Loader2, Search, X } from "lucide-react";
import {
  getJudulTrainingOptions,
  JudulTrainingOption,
} from "@/lib/services/dropdown.service";

interface JudulTrainingSelectProps {
  value?: string; // kode
  onChange: (kode: string, judulTraining: string, tipe: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
}

export function JudulTrainingSelect({
  value,
  onChange,
  placeholder = "Pilih judul training...",
  disabled = false,
  error,
}: JudulTrainingSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [options, setOptions] = useState<JudulTrainingOption[]>([]);
  const [filtered, setFiltered] = useState<JudulTrainingOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<JudulTrainingOption | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Fetch sekali saat pertama open
  useEffect(() => {
    if (!open || options.length > 0) return;
    const fetch = async () => {
      setLoading(true);
      try {
        const data = await getJudulTrainingOptions();
        setOptions(data);
        setFiltered(data);
      } catch {
        setOptions([]);
        setFiltered([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [open]);

  // Filter client-side (data tidak terlalu besar)
  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      options.filter(
        (o) =>
          o.judulTraining.toLowerCase().includes(q) ||
          o.kode.toLowerCase().includes(q) ||
          o.tipe.toLowerCase().includes(q),
      ),
    );
  }, [search, options]);

  // Sync selected dari value (mode edit)
  useEffect(() => {
    if (!value) {
      setSelected(null);
      return;
    }
    const found = options.find((o) => o.kode === value);
    if (found) {
      setSelected(found);
    } else {
      getJudulTrainingOptions().then((data) => {
        const match = data.find((o) => o.kode === value);
        if (match) {
          setSelected(match);
          setOptions(data);
        }
      });
    }
  }, [value]);

  const handleSelect = (opt: JudulTrainingOption) => {
    setSelected(opt);
    onChange(opt.kode, opt.judulTraining, opt.tipe);
    setOpen(false);
    setSearch("");
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelected(null);
    onChange("", "", "");
  };

  const inputCls =
    "w-full px-3 py-2 border rounded-xl text-xs text-zinc-700 outline-none transition-all placeholder:text-zinc-300";
  const borderCls = error
    ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
    : "border-zinc-200 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100";

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((p) => !p)}
        className={`${inputCls} ${borderCls} flex items-center justify-between gap-2 text-left ${
          disabled
            ? "opacity-50 cursor-not-allowed bg-zinc-50"
            : "bg-white cursor-pointer"
        }`}
      >
        <span className={selected ? "text-zinc-700" : "text-zinc-300"}>
          {selected
            ? `[${selected.kode}] ${selected.judulTraining}`
            : placeholder}
        </span>
        <div className="flex items-center gap-1 shrink-0">
          {selected && !disabled && (
            <span
              onClick={handleClear}
              className="text-zinc-300 hover:text-zinc-500 cursor-pointer"
            >
              <X className="w-3 h-3" />
            </span>
          )}
          <ChevronDown
            className={`w-3.5 h-3.5 text-zinc-400 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-zinc-200 rounded-xl shadow-lg overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-2 border-b border-zinc-100">
            <Search className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari kode atau judul..."
              className="flex-1 text-xs text-zinc-700 outline-none placeholder:text-zinc-300"
            />
          </div>
          <div className="max-h-48 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="w-4 h-4 animate-spin text-zinc-400" />
              </div>
            ) : filtered.length === 0 ? (
              <p className="text-center text-xs text-zinc-400 py-6">
                Tidak ada hasil
              </p>
            ) : (
              filtered.map((opt) => (
                <button
                  key={opt.kode}
                  type="button"
                  onClick={() => handleSelect(opt)}
                  className={`w-full text-left px-3 py-2.5 text-xs hover:bg-emerald-50 transition-colors ${
                    selected?.kode === opt.kode
                      ? "bg-emerald-50 text-emerald-700 font-semibold"
                      : "text-zinc-700"
                  }`}
                >
                  <p className="font-medium">{opt.judulTraining}</p>
                  <p className="text-[10px] text-zinc-400">
                    {opt.kode} · {opt.tipe}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {error && <p className="mt-1 text-[10px] text-red-500">{error}</p>}
    </div>
  );
}
