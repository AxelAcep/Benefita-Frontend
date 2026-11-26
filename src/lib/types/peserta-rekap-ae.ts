export interface AERow {
  id: number;
  ae: string;
  jan: { p: number | null; r: number | null };
  feb: { p: number | null; r: number | null };
  mar: { p: number | null; r: number | null };
  apr: { p: number | null; r: number | null };
  mei: { p: number | null; r: number | null };
  jun: { p: number | null; r: number | null };
  jul: { p: number | null; r: number | null };
  aug: { p: number | null; r: number | null };
  sep: { p: number | null; r: number | null };
  okt: { p: number | null; r: number | null };
  nov: { p: number | null; r: number | null };
  dec: { p: number | null; r: number | null };
  total: { p: number | null; r: number | null };
}
