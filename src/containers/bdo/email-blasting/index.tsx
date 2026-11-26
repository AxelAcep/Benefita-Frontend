"use client";

import { Plus, Trash2 } from "lucide-react";
import AppLayout from "@/components/app-layout";
import { TextArea } from "@/components/base/form-field";
import { TableBlock } from "./components/table-block";
import type { Block } from "./editor";
import { useEmailBlastingManage } from "./manage";

const JUDUL = "Email Blasting Bulan Ini";
const SALAM = "Yth.\n<#[g]#> <#[nama]#>\n<#[jabatan]#>\n<#[inst]#>\nTempat\n\nDengan Hormat,\n\n...";

function AddBlockBar({ onAdd }: { onAdd: (type: Block["type"]) => void }) {
  return (
    <div className="flex items-center gap-2 py-2">
      <div className="h-px flex-1 bg-zinc-200" />
      <button type="button" onClick={() => onAdd("text")} className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 px-2 py-1 text-xs text-zinc-600 hover:text-emerald-700">
        <Plus className="size-3" /> Teks
      </button>
      <button type="button" onClick={() => onAdd("table")} className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 px-2 py-1 text-xs text-zinc-600 hover:text-emerald-700">
        <Plus className="size-3" /> Tabel
      </button>
      <div className="h-px flex-1 bg-zinc-200" />
    </div>
  );
}

export default function EmailBlastingContainer() {
  const m = useEmailBlastingManage();

  return (
    <AppLayout breadcrumbs={[{ label: "BDO" }, { label: "Aset Marketing" }, { label: JUDUL }]}>
      <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <header className="border-b border-zinc-100 px-5 py-4">
          <h1 className="text-sm font-bold text-zinc-800">{JUDUL}</h1>
          <p className="text-xs text-zinc-500">Draf hilang saat halaman dimuat ulang.</p>
        </header>
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-8">
          {m.blocks.map((block, index) => (
            <div key={block.id}>
              {block.type === "text" ? (
                <div className="flex items-start gap-2">
                  <TextArea
                    aria-label={`Teks blok ${index + 1}`}
                    value={block.content}
                    onChange={(event) => m.updateBlock({ ...block, content: event.target.value })}
                    placeholder={block.id === 1 ? SALAM : "Ketik teks di sini..."}
                    wrapperClassName="flex-1"
                  />
                  <button
                    type="button"
                    aria-label={`Hapus teks blok ${index + 1}`}
                    onClick={() => m.deleteBlock(block.id)}
                    className="p-2 text-zinc-500 hover:text-red-600"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ) : (
                <TableBlock
                  rows={block.rows}
                  onChange={(rows) => m.updateBlock({ ...block, rows })}
                  onDelete={() => m.deleteBlock(block.id)}
                />
              )}
              <AddBlockBar onAdd={(type) => m.addBlock(type, block.id)} />
            </div>
          ))}
          {m.blocks.length === 0 && <AddBlockBar onAdd={m.addBlock} />}
        </div>
      </div>
    </AppLayout>
  );
}
