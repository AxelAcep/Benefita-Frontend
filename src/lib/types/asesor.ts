/** Asesor — penguji pada pelaksanaan uji kompetensi. */
export interface Asesor {
  id: number;
  nama: string;
  noRegAsesor: string | null;
  updateOleh: string | null;
  pegawai: { id: string; nama: string } | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAsesorRequest {
  nama: string;
  noRegAsesor?: string;
}

export type UpdateAsesorRequest = Partial<CreateAsesorRequest>;
