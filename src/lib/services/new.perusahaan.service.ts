import { fetchWithAuth } from "@/lib/services/login.service";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// =========================
// TYPES
// =========================

export type JenisInstansi =
  | "PERUSAHAAN"
  | "RUMAH_SAKIT"
  | "PEMDA"
  | "INSTANSI_DAERAH"
  | "SEKOLAH";

export interface TabPerusahaan {
  noInduk: string;
  jenisInstansi: JenisInstansi;
  company?: string;

  alamat?: string;
  alamatWaktu?: string;
  alamatFactory?: string;
  alamatFactoryWaktu?: string;

  telp?: string;
  fax?: string;
  email?: string;
  ket?: string;
  fasilitas?: string;
  butuhTraining?: string;
  prioritasMa?: string;
  prioritasAe?: string;
  group?: string;
  akreditasi?: string;

  // PERUSAHAAN / RUMAH_SAKIT
  idSimpel?: string;
  iso9000?: string;
  iso14000?: string;
  ohsas18001smk3?: string;
  kategoriCpn?: string;
  lineOfBusiness?: string;
  lineBisnisSub?: string;
  permodalan?: string;
  nilaiSubBidangProper?: number;
  batasEmas?: number;
  batasHijau?: number;
  infoKeu?: string;
  bdoAction?: string;
  vendor?: string;
  cabangSite?: string;
  pesaing?: string;
  prosedurPelatihan?: string;

  // PEMDA
  kode?: string;
  kotaKabupaten?: string;
  provinsi?: string;
  instansi?: string;
  sekilasLh?: string;
  rsud?: number;
  indPengolahan?: number;
  pertambangan?: number;
  listrikGasAirBersih?: number;
  hotelResto?: number;
  angkutTrans?: number;
  bangunan?: number;
  pertanian?: number;
  keuangan?: number;
  laut?: number;
  jasa?: number;

  // INSTANSI DAERAH
  tender1?: string;
  tender2?: string;
  tender3?: string;
  pelatihanDiikuti?: string;

  // SEKOLAH
  pemilik?: string;
  yayasan?: string;
  subKategori?: string;
  cpSekolah?: string;

  inputter?: string;
  updatter?: string;
  dateInput?: string;
  dateUpdate?: string;

  sertifikasiBnsp?: SertifikasiBnsp[];
  proper?: Proper[];
}

export interface SertifikasiBnsp {
  id: number;
  perusahaanId: string;
  pppa?: string;
  popal?: string;
  pppu?: string;
  poippu?: string;
  limbahB3?: string;
  tpsLb3?: string;
  sampah3R?: string;
  pSampah?: string;
  aEnergi?: string;
  mEnergi?: string;
  pcua?: string;
  lca?: string;
}

export interface Proper {
  id: number;
  perusahaanId: string;
  tahun: number;
  emas: number;
  hijau: number;
  biru: number;
  merah: number;
  hitam: number;
}

export type CreatePerusahaanPayload = Omit<
  TabPerusahaan,
  "inputter" | "updatter" | "dateInput" | "dateUpdate"
>;

export type UpdatePerusahaanPayload = Partial<
  Omit<
    TabPerusahaan,
    | "noInduk"
    | "jenisInstansi"
    | "inputter"
    | "updatter"
    | "dateInput"
    | "dateUpdate"
  >
>;

export interface PerusahaanResponse {
  message: string;
  data: TabPerusahaan;
}

// =========================
// SERVICE
// =========================

export async function getOneTabPerusahaan(
  noInduk: string,
): Promise<TabPerusahaan> {
  const res = await fetchWithAuth(
    `${API_URL}/api/database/perusahaan/${noInduk}`,
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal mengambil data.");
  return data;
}

export async function createTabPerusahaan(
  payload: CreatePerusahaanPayload,
): Promise<PerusahaanResponse> {
  const res = await fetchWithAuth(`${API_URL}/api/database/perusahaan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal menyimpan data.");
  return data;
}

export async function updateTabPerusahaan(
  noInduk: string,
  payload: UpdatePerusahaanPayload,
): Promise<PerusahaanResponse> {
  const res = await fetchWithAuth(
    `${API_URL}/api/database/perusahaan/${noInduk}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal mengupdate data.");
  return data;
}
