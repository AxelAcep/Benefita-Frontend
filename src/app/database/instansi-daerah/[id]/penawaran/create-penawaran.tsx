"use client";

import { useState } from "react";
import { FileText, Save } from "lucide-react";

interface Props {
  loading: boolean;
  onCreate: (kodePelatihan: string[]) => Promise<any>;
}

export default function CreatePenawaran({ loading, onCreate }: Props) {
  const [input, setInput] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    const kodes = input
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);
    if (!kodes.length) return;
    setSaving(true);
    try {
      await onCreate(kodes);
      setInput("");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-zinc-100">
        <span className="flex items-center gap-2 text-sm font-bold text-zinc-800">
          <FileText className="w-4 h-4 text-emerald-500" />
          Buat Penawaran
        </span>
      </div>
      <div className="px-5 py-4 flex items-center gap-3">
        <label className="text-xs font-semibold text-zinc-500 w-24 shrink-0">
          Kode Pelatihan
        </label>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Masukkan kode pelatihan, pisahkan dengan koma"
          className="flex-1 text-xs border border-zinc-200 rounded-lg px-3 py-2 outline-none focus:ring-2 ring-emerald-500/20"
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
        />
        <button
          onClick={handleSave}
          disabled={saving || loading || !input.trim()}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg shadow-sm transition-all disabled:opacity-50"
        >
          <Save size={13} />
          Simpan Data
        </button>
      </div>
    </div>
  );
}
