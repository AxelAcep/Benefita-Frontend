import type { AERow } from "@/lib/types/peserta-rekap-ae";

function makeRow(
  id: number,
  ae: string,
  janP: number | null,
  febR: number | null,
  totalP: number | null,
  totalR: number | null,
): AERow {
  return {
    id,
    ae,
    jan: { p: janP, r: null },
    feb: { p: null, r: febR },
    mar: { p: null, r: null },
    apr: { p: null, r: null },
    mei: { p: null, r: null },
    jun: { p: null, r: null },
    jul: { p: null, r: null },
    aug: { p: null, r: null },
    sep: { p: null, r: null },
    okt: { p: null, r: null },
    nov: { p: null, r: null },
    dec: { p: totalP, r: null },
    total: { p: totalP, r: totalR },
  };
}

export const NON_AFFILIATE_DATA = {
  regular: [
    makeRow(1, "Eni", 1, null, 1, null),
    makeRow(2, "Mulyadi", null, 3, null, 3),
    makeRow(3, "Sylva", null, 2, null, 2),
    makeRow(4, "Rifqi", null, 5, null, 5),
  ],
  tentatif: [
    makeRow(1, "Eni", 1, null, 1, null),
    makeRow(2, "Mulyadi", null, 3, null, 3),
    makeRow(3, "Sylva", null, 2, null, 2),
    makeRow(4, "Rifqi", null, 5, null, 5),
  ],
  cancel: [
    makeRow(1, "Eni", 1, null, 1, null),
    makeRow(2, "Mulyadi", null, 3, null, 3),
    makeRow(3, "Sylva", null, 2, null, 2),
    makeRow(4, "Rifqi", null, 5, null, 5),
  ],
};

export const AFFILIATE_DATA = {
  regular: [
    makeRow(1, "Eni", 2, null, 2, null),
    makeRow(2, "Mulyadi", null, 1, null, 1),
    makeRow(3, "Sylva", null, 4, null, 4),
    makeRow(4, "Rifqi", 1, null, 1, null),
  ],
  tentatif: [
    makeRow(1, "Eni", null, 2, null, 2),
    makeRow(2, "Mulyadi", 1, null, 1, null),
    makeRow(3, "Sylva", null, 3, null, 3),
    makeRow(4, "Rifqi", null, 2, null, 2),
  ],
  cancel: [
    makeRow(1, "Eni", null, 1, null, 1),
    makeRow(2, "Mulyadi", 2, null, 2, null),
    makeRow(3, "Sylva", null, 1, null, 1),
    makeRow(4, "Rifqi", 1, null, 1, null),
  ],
};
