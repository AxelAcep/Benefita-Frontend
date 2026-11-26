"use client";

import type { ClipboardEvent } from "react";
import { Plus, Trash2 } from "lucide-react";
import { parseSpreadsheet } from "../editor";

interface Props {
  rows: string[][];
  onChange: (rows: string[][]) => void;
  onDelete: () => void;
}

export function TableBlock({ rows, onChange, onDelete }: Props) {
  const columns = rows[0].length;

  function paste(event: ClipboardEvent<HTMLTableElement>) {
    const text = event.clipboardData.getData("text/plain");
    if (!/[\t\r\n]/.test(text)) return;

    event.preventDefault();
    const pasted = parseSpreadsheet(text);
    if (pasted.length) onChange(pasted);
  }

  function updateCell(rowIndex: number, columnIndex: number, value: string) {
    onChange(rows.map((row, index) => index === rowIndex
      ? row.map((cell, column) => column === columnIndex ? value : cell)
      : row));
  }

  return (
    <div className="my-2 space-y-2">
      <div className="flex flex-wrap items-center gap-3 text-xs">
        <button type="button" onClick={() => onChange([...rows, Array<string>(columns).fill("")])} className="inline-flex items-center gap-1 text-emerald-700">
          <Plus className="size-3.5" /> Tambah baris
        </button>
        <button type="button" onClick={() => onChange(rows.map((row) => [...row, ""]))} className="inline-flex items-center gap-1 text-emerald-700">
          <Plus className="size-3.5" /> Tambah kolom
        </button>
        <button type="button" onClick={onDelete} className="ml-auto inline-flex items-center gap-1 text-red-600">
          <Trash2 className="size-3.5" /> Hapus tabel
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-zinc-200">
        <table className="w-full border-collapse text-xs" onPaste={paste}>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className={rowIndex === 0 ? "bg-emerald-700 text-white" : "even:bg-zinc-50"}>
                <td className="w-8 px-2">
                  {rowIndex > 0 && (
                    <button
                      type="button"
                      aria-label={`Hapus baris ${rowIndex + 1}`}
                      onClick={() => onChange(rows.filter((_, index) => index !== rowIndex))}
                      className="text-zinc-500 hover:text-red-600"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  )}
                </td>
                {row.map((cell, column) => (
                  <td key={column} className="border-l border-zinc-200/50">
                    <input
                      aria-label={`Baris ${rowIndex + 1}, kolom ${column + 1}`}
                      className="w-full min-w-24 bg-transparent px-2 py-2 focus-visible:outline-emerald-400"
                      value={cell}
                      onChange={(event) => updateCell(rowIndex, column, event.target.value)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot className="border-t border-zinc-200 bg-zinc-50">
            <tr>
              <td />
              {rows[0].map((_, column) => (
                <td key={column} className="text-center">
                  <button
                    type="button"
                    aria-label={`Hapus kolom ${column + 1}`}
                    disabled={columns === 1}
                    onClick={() => onChange(rows.map((row) => row.filter((_, index) => index !== column)))}
                    className="p-1 text-zinc-500 hover:text-red-600 disabled:opacity-30"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>
      <p className="text-xs text-zinc-500">Tempel data dari spreadsheet ke sel untuk mengganti isi tabel.</p>
    </div>
  );
}
