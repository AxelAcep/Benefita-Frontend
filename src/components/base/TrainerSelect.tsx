"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, Loader2, Search, X } from "lucide-react";
import {
  getTrainerOptions,
  TrainerOption,
} from "@/lib/services/dropdown.service";

interface TrainerSelectProps {
  value?: string[]; // array of kode, karena multi-select
  onChange: (kodes: string[], trainers: TrainerOption[]) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
}

export function TrainerSelect({
  value = [],
  onChange,
  placeholder = "Pilih trainer...",
  disabled = false,
  error,
}: TrainerSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [options, setOptions] = useState<TrainerOption[]>([]);
  const [filtered, setFiltered] = useState<TrainerOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<TrainerOption[]>([]);
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
        const data = await getTrainerOptions();
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

  // Filter client-side
  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      options.filter(
        (o) =>
          o.nama.toLowerCase().includes(q) || o.kode.toLowerCase().includes(q),
      ),
    );
  }, [search, options]);

  // Sync selected dari value (mode edit)
  useEffect(() => {
    if (!value || value.length === 0) {
      setSelected([]);
      return;
    }
    const found = options.filter((o) => value.includes(o.kode));
    if (found.length === value.length) {
      setSelected(found);
    } else {
      getTrainerOptions().then((data) => {
        const match = data.filter((o) => value.includes(o.kode));
        if (match.length > 0) {
          setSelected(match);
          setOptions(data);
        }
      });
    }
  }, [value]);

  const handleToggle = (opt: TrainerOption) => {
    const isSelected = selected.some((s) => s.kode === opt.kode);
    const next = isSelected
      ? selected.filter((s) => s.kode !== opt.kode)
      : [...selected, opt];
    setSelected(next);
    onChange(
      next.map((s) => s.kode),
      next,
    );
  };

  const handleRemove = (kode: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = selected.filter((s) => s.kode !== kode);
    setSelected(next);
    onChange(
      next.map((s) => s.kode),
      next,
    );
  };

  const inputCls =
    "w-full px-3 py-2 border rounded-xl text-xs text-zinc-700 outline-none transition-all";
  const borderCls = error
    ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
    : "border-zinc-200 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100";

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((p) => !p)}
        className={`${inputCls} ${borderCls} flex items-start justify-between gap-2 text-left min-h-[34px] ${
          disabled
            ? "opacity-50 cursor-not-allowed bg-zinc-50"
            : "bg-white cursor-pointer"
        }`}
      >
        {/* Selected tags / placeholder */}
        <div className="flex flex-wrap gap-1 flex-1">
          {selected.length === 0 ? (
            <span className="text-zinc-300 text-xs">{placeholder}</span>
          ) : (
            selected.map((s) => (
              <span
                key={s.kode}
                className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] font-medium px-2 py-0.5 rounded-full"
              >
                {s.nama}
                {!disabled && (
                  <span
                    onClick={(e) => handleRemove(s.kode, e)}
                    className="hover:text-red-500 cursor-pointer"
                  >
                    <X className="w-2.5 h-2.5" />
                  </span>
                )}
              </span>
            ))
          )}
        </div>
        <ChevronDown
          className={`w-3.5 h-3.5 text-zinc-400 transition-transform shrink-0 mt-0.5 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-zinc-200 rounded-xl shadow-lg overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-2 border-b border-zinc-100">
            <Search className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama atau kode trainer..."
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
              filtered.map((opt) => {
                const isActive = selected.some((s) => s.kode === opt.kode);
                return (
                  <button
                    key={opt.kode}
                    type="button"
                    onClick={() => handleToggle(opt)}
                    className={`w-full text-left px-3 py-2.5 text-xs hover:bg-emerald-50 transition-colors flex items-center justify-between ${
                      isActive
                        ? "bg-emerald-50 text-emerald-700"
                        : "text-zinc-700"
                    }`}
                  >
                    <div>
                      <p className="font-medium">{opt.nama}</p>
                      <p className="text-[10px] text-zinc-400">{opt.kode}</p>
                    </div>
                    {isActive && (
                      <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                        <svg
                          width="8"
                          height="8"
                          viewBox="0 0 10 8"
                          fill="none"
                        >
                          <path
                            d="M1 4L3.5 6.5L9 1"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}

      {error && <p className="mt-1 text-[10px] text-red-500">{error}</p>}
    </div>
  );
}
