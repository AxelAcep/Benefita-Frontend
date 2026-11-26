export interface LogPerubahanItem {
  id: string;
  diubahOleh: string;
  tanggal: string;
  field: string;
  perusahaan: {
    company: string;
  };
}

export interface LogPerubahanMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface LogPerubahanResponse {
  data: LogPerubahanItem[];
  meta: LogPerubahanMeta;
}
