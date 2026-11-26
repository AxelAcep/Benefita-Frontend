interface TextBlock {
  id: number;
  type: "text";
  content: string;
}

export interface TableBlock {
  id: number;
  type: "table";
  rows: string[][];
}

export type Block = TextBlock | TableBlock;

export const INITIAL_BLOCKS: Block[] = [
  { id: 1, type: "text", content: "" },
  {
    id: 2,
    type: "table",
    rows: [
      ["NO", "KODE", "Judul Training", "Online", "Offline", "Tanggal Pelatihan", "Tanggal Uji", "Biaya Uji"],
      Array<string>(8).fill(""),
    ],
  },
  { id: 3, type: "text", content: "" },
];

export function parseSpreadsheet(text: string): string[][] {
  const rows = text
    .replace(/(?:\r\n|\r|\n)$/, "")
    .split(/\r\n|\r|\n/)
    .map((line) => line.split("\t"));

  if (!rows.some((row) => row.some((cell) => cell.trim() !== ""))) return [];

  const width = rows.reduce((max, row) => Math.max(max, row.length), 1);
  return rows.map((row) => [...row, ...Array<string>(width - row.length).fill("")]);
}
