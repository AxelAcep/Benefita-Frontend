"use client";

import React, { useState, useRef, useCallback } from "react";
import { Mail, Download, Trash2, Plus, GripVertical } from "lucide-react";
import AppLayout from "@/components/app-layout";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Block =
  | { id: string; type: "text"; content: string }
  | { id: string; type: "table"; rows: string[][] };

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function parseExcelPaste(text: string): string[][] {
  return text
    .split(/\r?\n/)
    .filter((line) => line.trim() !== "")
    .map((line) => line.split("\t"));
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function TextBlock({
  block,
  onChange,
  onDelete,
  placeholder,
}: {
  block: Extract<Block, { type: "text" }>;
  onChange: (val: string) => void;
  onDelete: () => void;
  placeholder?: string;
}) {
  return (
    <div className="group relative">
      <textarea
        value={block.content}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? "Ketik teks di sini..."}
        rows={3}
        className="w-full resize-none text-sm text-zinc-700 leading-relaxed outline-none bg-transparent placeholder:text-zinc-300 border-b border-transparent focus:border-zinc-200 transition-colors py-1"
        style={{ fontFamily: "inherit" }}
      />
      <button
        onClick={onDelete}
        className="absolute top-1 right-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-red-50 text-zinc-300 hover:text-red-400"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

function TableBlock({
  block,
  onChange,
  onDelete,
}: {
  block: Extract<Block, { type: "table" }>;
  onChange: (rows: string[][]) => void;
  onDelete: () => void;
}) {
  const [hoveredCol, setHoveredCol] = useState<number | null>(null);

  // Paste handler — works on any cell
  function handlePaste(e: React.ClipboardEvent) {
    const text = e.clipboardData.getData("text/plain");
    if (!text.includes("\t") && !text.includes("\n")) return;
    e.preventDefault();
    const parsed = parseExcelPaste(text);
    if (parsed.length > 0) onChange(parsed);
  }

  function updateCell(r: number, c: number, val: string) {
    const next = block.rows.map((row, ri) =>
      row.map((cell, ci) => (ri === r && ci === c ? val : cell)),
    );
    onChange(next);
  }

  function addRow() {
    const cols = block.rows[0]?.length ?? 1;
    onChange([...block.rows, Array(cols).fill("")]);
  }

  function addCol() {
    onChange(block.rows.map((row) => [...row, ""]));
  }

  function deleteRow(r: number) {
    const next = block.rows.filter((_, i) => i !== r);
    onChange(next.length ? next : [[""]]);
  }

  function deleteCol(c: number) {
    const next = block.rows.map((row) => row.filter((_, i) => i !== c));
    const cleaned = next.map((r) => (r.length ? r : [""]));
    onChange(cleaned);
  }

  const cols = block.rows[0]?.length ?? 1;

  return (
    <div className="group relative my-2">
      {/* Delete block */}
      <button
        onClick={onDelete}
        className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full bg-white border border-zinc-200 hover:bg-red-50 text-zinc-300 hover:text-red-400 z-10"
      >
        <Trash2 className="w-3 h-3" />
      </button>

      <div className="overflow-x-auto rounded-lg border border-zinc-200">
        <table className="w-full border-collapse text-xs" onPaste={handlePaste}>
          <tbody>
            {block.rows.map((row, ri) => (
              <tr
                key={ri}
                className={
                  ri === 0
                    ? "bg-emerald-600 text-white"
                    : ri % 2 === 0
                      ? "bg-white"
                      : "bg-zinc-50/60"
                }
              >
                {/* Row delete handle */}
                <td className="w-5 px-1">
                  {ri > 0 && (
                    <button
                      onClick={() => deleteRow(ri)}
                      className="opacity-0 group-hover:opacity-100 text-zinc-300 hover:text-red-400 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </td>

                {row.map((cell, ci) => (
                  <td
                    key={ci}
                    className={`border-r border-zinc-200 last:border-r-0 relative ${
                      hoveredCol === ci ? "bg-emerald-50/40" : ""
                    } ${ri === 0 ? "border-emerald-500" : ""}`}
                    onMouseEnter={() => setHoveredCol(ci)}
                    onMouseLeave={() => setHoveredCol(null)}
                  >
                    <input
                      value={cell}
                      onChange={(e) => updateCell(ri, ci, e.target.value)}
                      className={`w-full px-3 py-2 outline-none bg-transparent min-w-[80px] ${
                        ri === 0
                          ? "font-semibold text-white placeholder:text-emerald-300"
                          : "text-zinc-700 placeholder:text-zinc-300"
                      }`}
                      placeholder={ri === 0 ? "Header" : ""}
                    />
                  </td>
                ))}

                {/* Add col button (only on first row) */}
                {ri === 0 && (
                  <td className="w-8 px-1">
                    <button
                      onClick={addCol}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-emerald-100 text-emerald-400 transition-opacity"
                      title="Tambah kolom"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </td>
                )}
                {ri > 0 && <td className="w-8" />}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Col delete row */}
        <div className="flex bg-zinc-50 border-t border-zinc-200">
          <div className="w-5" />
          {Array.from({ length: cols }, (_, ci) => (
            <div
              key={ci}
              className="flex-1 flex justify-center py-0.5 border-r border-zinc-200 last:border-r-0"
            >
              <button
                onClick={() => deleteCol(ci)}
                className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-red-50 text-zinc-300 hover:text-red-400 transition-opacity"
                title="Hapus kolom"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
          <div className="w-8" />
        </div>
      </div>

      {/* Add row */}
      <button
        onClick={addRow}
        className="mt-1 opacity-0 group-hover:opacity-100 flex items-center gap-1 text-[11px] text-zinc-400 hover:text-emerald-500 transition-all"
      >
        <Plus className="w-3 h-3" />
        Tambah baris
      </button>

      {/* Paste hint */}
      <p className="mt-1 text-[10px] text-zinc-300 select-none">
        💡 Copy dari Excel/Sheets lalu paste ke tabel untuk import data
        sekaligus
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Add block menu
// ---------------------------------------------------------------------------

function AddBlockBar({ onAdd }: { onAdd: (type: "text" | "table") => void }) {
  return (
    <div className="flex items-center gap-2 py-2 opacity-40 hover:opacity-100 transition-opacity group">
      <div className="flex-1 h-px bg-zinc-200" />
      <button
        onClick={() => onAdd("text")}
        className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-zinc-200 text-[11px] text-zinc-500 hover:border-emerald-300 hover:text-emerald-600 bg-white transition-colors"
      >
        <Plus className="w-3 h-3" /> Teks
      </button>
      <button
        onClick={() => onAdd("table")}
        className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-zinc-200 text-[11px] text-zinc-500 hover:border-emerald-300 hover:text-emerald-600 bg-white transition-colors"
      >
        <Plus className="w-3 h-3" /> Tabel
      </button>
      <div className="flex-1 h-px bg-zinc-200" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Initial blocks (template kosong mirip email)
// ---------------------------------------------------------------------------

const INITIAL_BLOCKS: Block[] = [
  {
    id: uid(),
    type: "text",
    content: "",
  },
  {
    id: uid(),
    type: "table",
    rows: [
      [
        "NO",
        "KODE",
        "Judul Training",
        "Online",
        "Offline",
        "Tanggal Pelatihan",
        "Tanggal Uji",
        "Biaya Uji",
      ],
      ["", "", "", "", "", "", "", ""],
    ],
  },
  {
    id: uid(),
    type: "text",
    content: "",
  },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function EmailBlastingBulanIniPage() {
  const [blocks, setBlocks] = useState<Block[]>(INITIAL_BLOCKS);

  // ---- block helpers ----

  function updateBlock(id: string, patch: Partial<Block>) {
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? ({ ...b, ...patch } as Block) : b)),
    );
  }

  function deleteBlock(id: string) {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  }

  function addBlockAfter(afterId: string, type: "text" | "table") {
    const newBlock: Block =
      type === "text"
        ? { id: uid(), type: "text", content: "" }
        : {
            id: uid(),
            type: "table",
            rows: [
              ["Header 1", "Header 2", "Header 3"],
              ["", "", ""],
            ],
          };

    setBlocks((prev) => {
      const idx = prev.findIndex((b) => b.id === afterId);
      const next = [...prev];
      next.splice(idx + 1, 0, newBlock);
      return next;
    });
  }

  function addBlockAtEnd(type: "text" | "table") {
    const newBlock: Block =
      type === "text"
        ? { id: uid(), type: "text", content: "" }
        : {
            id: uid(),
            type: "table",
            rows: [
              ["Header 1", "Header 2", "Header 3"],
              ["", "", ""],
            ],
          };
    setBlocks((prev) => [...prev, newBlock]);
  }

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Perusahaan", href: "/perusahaan" },
        { label: "Aset Marketing", href: "/bdo/aset-marketing" },
        { label: "Email Blasting Bulan Ini" },
      ]}
      subtitle="Hari ini: Selasa, 3 Februari 2026"
      userName="Nanang"
      userRole="Super Admin"
    >
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="px-5 py-3 border-b border-zinc-100 flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center">
              <Mail className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <span className="font-bold text-zinc-800 text-sm">
              Email Blasting Bulan Ini
            </span>
          </div>

          <div className="ml-auto">
            <button
              onClick={() => console.log("export", blocks)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-semibold rounded-lg transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Export
            </button>
          </div>
        </div>

        {/* Email composer body */}
        <div className="px-8 py-6 max-w-4xl mx-auto">
          {/* Render blocks */}
          {blocks.map((block, idx) => (
            <div key={block.id}>
              {block.type === "text" ? (
                <TextBlock
                  block={block}
                  onChange={(content) => updateBlock(block.id, { content })}
                  onDelete={() => deleteBlock(block.id)}
                  placeholder={
                    idx === 0
                      ? "Yth.\n<#[g]#> <#[nama]#>\n<#[jabatan]#>\n<#[inst]#>\nTempat\n\nDengan Hormat,\n\n..."
                      : "Ketik teks di sini..."
                  }
                />
              ) : (
                <TableBlock
                  block={block}
                  onChange={(rows) => updateBlock(block.id, { rows })}
                  onDelete={() => deleteBlock(block.id)}
                />
              )}

              {/* Add block bar between blocks */}
              <AddBlockBar onAdd={(type) => addBlockAfter(block.id, type)} />
            </div>
          ))}

          {/* Final add block */}
          <div className="pt-2">
            <AddBlockBar onAdd={addBlockAtEnd} />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
