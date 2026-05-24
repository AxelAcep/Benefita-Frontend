import { fetchWithAuth } from "@/lib/services/login.service";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Perusahaan {
  id: number;
  nama: string;
  alamatPusat: string;
  noTelp: string | null;
}

export interface PaginationMeta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface GetPerusahaanParams {
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface GetPerusahaanResponse {
  data: Perusahaan[];
  meta: PaginationMeta;
}

export interface CreatePerusahaanPayload {
  // Card Perusahaan
  noInduk: string;
  company: string;
  idSimpel?: string;

  // Card Lokasi
  alamat?: string;
  alamatWaktu?: string;
  alamatFactory?: string;
  alamatFactoryWaktu?: string;

  // Card Sertifikasi
  iso9000?: string;
  iso14000?: string;
  ohsas18001smk3?: string;

  // Card Klasifikasi
  kategoriCpn?: string;
  lineOfBusiness?: string;
  lineBisnisSub?: string;
  permodalan?: string;

  // Card Properti & Finansial
  nilaiSubBidangProper?: number;
  batasEmas?: number;
  batasHijau?: number;
  fasilitas?: string;
  infoKeu?: string;
  ket?: string;
  group?: string;
  bdoAction?: string;
  prioritasMa?: string;
  prioritasAe?: string;
  vendor?: string;

  // Card Informasi Lainnya
  cabangSite?: string;
  pesaing?: string;
  butuhTraining?: string;
  prosedurPelatihan?: string;

  //card kontak

  email?: string;
  telp?: string;
  fax?: string;
}

export interface CreatePerusahaanResponse {
  message: string;
  data: { noInduk: string };
}

export async function getPerusahaan(
  params: GetPerusahaanParams = {},
): Promise<GetPerusahaanResponse> {
  const query = new URLSearchParams();
  if (params.search) query.append("search", params.search);
  if (params.page) query.append("page", params.page.toString());
  if (params.pageSize) query.append("pageSize", params.pageSize.toString());

  const url = `${API_URL}/api/database/perusahaan?${query.toString()}`;

  const res = await fetchWithAuth(url);
  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Gagal mengambil data perusahaan.");
  }

  return {
    data: json.data.map((item: any) => ({
      id: item.noInduk,
      nama: item.company,
      alamatPusat: item.alamat,
      noTelp: item.telp ?? null,
    })),
    meta: {
      total: json.pagination.total,
      totalPages: json.pagination.totalPages,
      page: json.pagination.currentPage,
      pageSize: json.pagination.pageSize,
    },
  };
}

export async function createPerusahaan(
  payload: CreatePerusahaanPayload,
): Promise<CreatePerusahaanResponse> {
  const res = await fetchWithAuth(`${API_URL}/api/database/perusahaan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok)
    throw new Error(data.message || "Gagal menyimpan data perusahaan.");
  return data;
}

export interface PerusahaanRaw {
  noInduk: string;
  company: string;
  idSimpel: string | null;
  alamat: string | null;
  alamatWaktu: string | null;
  alamatFactory: string | null;
  alamatFactoryWaktu: string | null;
  lineOfBusiness: string | null;
  iso9000: string | null;
  iso14000: string | null;
  ohsas18001smk3: string | null;
  kategoriCpn: string | null;
  lineBisnisSub: string | null;
  permodalan: string | null;
  nilaiSubBidangProper: number | null;
  batasEmas: number | null;
  batasHijau: number | null;
  fasilitas: string | null;
  infoKeu: string | null;
  ket: string | null;
  group: string | null;
  bdoAction: string | null;
  prioritasMa: string | null;
  prioritasAe: string | null;
  vendor: string | null;
  cabangSite: string | null;
  pesaing: string | null;
  butuhTraining: string | null;
  prosedurPelatihan: string | null;
  telp: null;
  fax: null;
  email: null;
  sertifikasiBnsp: {
    pppa: number;
    popal: number;
    pppu: number;
    poippu: number;
    limbahB3: number;
    tpsLb3: number;
    sampah3R: number;
    pSampah: number;
    aEnergi: number;
    mEnergi: number;
    pcua: number;
    lca: number;
  };
}

// ─────────────────────────────────────────────
// TYPES — Sudah di-map, siap dipakai di card
// ─────────────────────────────────────────────

export type ZonaWaktu = "WIB" | "WITA" | "WIT" | "-";

export interface PerusahaanMapped {
  perusahaan: {
    instansi: string;
    kode: string;
    idSimpel: string;
  };
  lokasi: {
    alamatPusat: string;
    zonaWaktuPusat: ZonaWaktu;
    alamatFactory: string;
    zonaWaktuFactory: ZonaWaktu;
  };
  sertifikasi: {
    iso9001: string;
    iso14001: string;
    ohsas18001: string;
  };
  klasifikasi: {
    kategoriCpn: string;
    lineBisnis: string;
    lineBisnisSub: string;
    permodalan: string;
  };
  propertiFinansial: {
    subBidangNilai: string;
    subBidangBatasEmas: string;
    subBidangBatasHijau: string;
    fasilitas: string;
    infoKeuangan: string;
    keterangan: string;
    group: string;
    bdoAction: string;
    prioritasMANN: string;
    prioritasAE: string;
    vendor: string;
  };
  informasiLainnya: {
    cabangSite: string;
    pesaing: string;
    kebutuhanTraining: string;
    prosedurPelatihan: string;
  };
  sertifikasiBnsp: {
    pppa: string;
    popal: string;
    pppu: string;
    poippu: string;
    limbahB3: string;
    tpsLb3: string;
    sampah3R: string;
    pSampah: string;
    aEnergi: string;
    mEnergi: string;
    pcua: string;
    lca: string;
  };
  kontak: {
    telpon: string;
    fax: string;
    email: string;
  };
}

export type UpdatePerusahaanPayload = Partial<{
  company: string;
  idSimpel: string;
  alamat: string;
  alamatWaktu: string;
  alamatFactory: string;
  alamatFactoryWaktu: string;
  iso9000: string;
  iso14000: string;
  ohsas18001smk3: string;
  kategoriCpn: string;
  lineOfBusiness: string;
  lineBisnisSub: string;
  permodalan: string;
  nilaiSubBidangProper: number;
  batasEmas: number;
  batasHijau: number;
  fasilitas: string;
  infoKeu: string;
  ket: string;
  group: string;
  bdoAction: string;
  prioritasMa: string;
  prioritasAe: string;
  vendor: string;
  cabangSite: string;
  pesaing: string;
  butuhTraining: string;
  prosedurPelatihan: string;
  telp: string;
  fax: string;
  email: string;
}>;

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

function toZona(v: string | null | undefined): ZonaWaktu {
  if (v === "WIB" || v === "WITA" || v === "WIT") return v;
  return "-";
}

function str(v: string | number | null | undefined): string {
  if (v === null || v === undefined) return "";
  return String(v);
}

export function mapRawToForm(raw: PerusahaanRaw): PerusahaanMapped {
  return {
    perusahaan: {
      instansi: str(raw.company),
      kode: str(raw.noInduk),
      idSimpel: str(raw.idSimpel),
    },
    lokasi: {
      alamatPusat: str(raw.alamat),
      zonaWaktuPusat: toZona(raw.alamatWaktu),
      alamatFactory: str(raw.alamatFactory),
      zonaWaktuFactory: toZona(raw.alamatFactoryWaktu),
    },
    sertifikasi: {
      iso9001: str(raw.iso9000),
      iso14001: str(raw.iso14000),
      ohsas18001: str(raw.ohsas18001smk3),
    },
    klasifikasi: {
      kategoriCpn: str(raw.kategoriCpn),
      lineBisnis: str(raw.lineOfBusiness),
      lineBisnisSub: str(raw.lineBisnisSub),
      permodalan: str(raw.permodalan),
    },
    propertiFinansial: {
      subBidangNilai: str(raw.nilaiSubBidangProper),
      subBidangBatasEmas: str(raw.batasEmas),
      subBidangBatasHijau: str(raw.batasHijau),
      fasilitas: str(raw.fasilitas),
      infoKeuangan: str(raw.infoKeu),
      keterangan: str(raw.ket),
      group: str(raw.group),
      bdoAction: str(raw.bdoAction),
      prioritasMANN: str(raw.prioritasMa),
      prioritasAE: str(raw.prioritasAe),
      vendor: str(raw.vendor),
    },
    informasiLainnya: {
      cabangSite: str(raw.cabangSite),
      pesaing: str(raw.pesaing),
      kebutuhanTraining: str(raw.butuhTraining),
      prosedurPelatihan: str(raw.prosedurPelatihan),
    },
    sertifikasiBnsp: {
      pppa: str(raw.sertifikasiBnsp?.pppa),
      popal: str(raw.sertifikasiBnsp?.popal),
      pppu: str(raw.sertifikasiBnsp?.pppu),
      poippu: str(raw.sertifikasiBnsp?.poippu),
      limbahB3: str(raw.sertifikasiBnsp?.limbahB3),
      tpsLb3: str(raw.sertifikasiBnsp?.tpsLb3),
      sampah3R: str(raw.sertifikasiBnsp?.sampah3R),
      pSampah: str(raw.sertifikasiBnsp?.pSampah),
      aEnergi: str(raw.sertifikasiBnsp?.aEnergi),
      mEnergi: str(raw.sertifikasiBnsp?.mEnergi),
      pcua: str(raw.sertifikasiBnsp?.pcua),
      lca: str(raw.sertifikasiBnsp?.lca),
    },
    kontak: {
      telpon: str(raw.telp),
      fax: str(raw.fax),
      email: str(raw.email),
    },
  };
}

// ─────────────────────────────────────────────
// API CALLS
// ─────────────────────────────────────────────

export async function getOnePerusahaan(
  noInduk: string,
): Promise<PerusahaanMapped> {
  const res = await fetchWithAuth(
    `${API_URL}/api/database/perusahaan/${noInduk}`,
  );
  const json = await res.json();
  if (!res.ok)
    throw new Error(json.message || "Gagal mengambil data perusahaan.");
  return mapRawToForm(json.data as PerusahaanRaw);
}

export async function updatePerusahaan(
  noInduk: string,
  payload: UpdatePerusahaanPayload,
): Promise<void> {
  const res = await fetchWithAuth(
    `${API_URL}/api/database/perusahaan/${noInduk}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );
  const json = await res.json();
  if (!res.ok)
    throw new Error(json.message || "Gagal memperbarui data perusahaan.");
}

export interface ContactPersonItem {
  kode: string;
  kodePerusahaan: string;
  nama: string;
  teknisTertinggi: boolean;
  jabatan: string;
  hp: string;
  email: string;
  posisi: string;
  keuangan: string;
  minta: string;
  ket: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactPersonMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetContactPersonListResponse {
  message: string;
  data: ContactPersonItem[];
  meta: ContactPersonMeta;
}

export interface GetContactPersonListParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface GetOneContactPersonResponse {
  message: string;
  data: ContactPersonItem;
}

export interface ContactPersonPayload {
  nama: string;
  teknisTertinggi: boolean;
  jabatan?: string;
  hp?: string;
  email?: string;
  posisi?: string;
  keuangan?: string;
  minta?: string;
  ket?: string;
}

export interface CreateContactPersonResponse {
  message: string;
  data: ContactPersonItem;
}

export interface UpdateContactPersonResponse {
  message: string;
  data: ContactPersonItem;
}

// ─────────────────────────────────────────────
// GET PAGINATED
// ─────────────────────────────────────────────

export async function getContactPersonList(
  noInduk: string,
  params?: GetContactPersonListParams,
): Promise<GetContactPersonListResponse> {
  const query = new URLSearchParams();

  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.search) query.set("search", params.search);

  const res = await fetchWithAuth(
    `${API_URL}/api/database/perusahaan/${noInduk}/contact-person?${query.toString()}`,
    { method: "GET" },
  );

  const data = await res.json();
  if (!res.ok)
    throw new Error(data.message || "Gagal mengambil data contact person.");
  return data;
}

// ─────────────────────────────────────────────
// GET ONE
// ─────────────────────────────────────────────

export async function getOneContactPerson(
  noInduk: string,
  kode: string,
): Promise<GetOneContactPersonResponse> {
  const res = await fetchWithAuth(
    `${API_URL}/api/database/perusahaan/${noInduk}/contact-person/${kode}`,
    { method: "GET" },
  );

  const data = await res.json();
  if (!res.ok)
    throw new Error(data.message || "Gagal mengambil data contact person.");
  return data;
}

// ─────────────────────────────────────────────
// CREATE
// ─────────────────────────────────────────────

export async function createContactPerson(
  noInduk: string,
  payload: ContactPersonPayload,
): Promise<CreateContactPersonResponse> {
  const res = await fetchWithAuth(
    `${API_URL}/api/database/perusahaan/${noInduk}/contact-person`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );

  const data = await res.json();
  if (!res.ok)
    throw new Error(data.message || "Gagal menambahkan contact person.");
  return data;
}

// ─────────────────────────────────────────────
// UPDATE
// ─────────────────────────────────────────────

export async function updateContactPerson(
  noInduk: string,
  kode: string,
  payload: Partial<ContactPersonPayload>,
): Promise<UpdateContactPersonResponse> {
  const res = await fetchWithAuth(
    `${API_URL}/api/database/perusahaan/${noInduk}/contact-person/${kode}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );

  const data = await res.json();
  if (!res.ok)
    throw new Error(data.message || "Gagal memperbarui contact person.");
  return data;
}

// ─────────────────────────────────────────────
// DELETE
// ─────────────────────────────────────────────

export async function deleteContactPerson(
  noInduk: string,
  kode: string,
): Promise<{ message: string }> {
  const res = await fetchWithAuth(
    `${API_URL}/api/database/perusahaan/${noInduk}/contact-person/${kode}`,
    { method: "DELETE" },
  );

  const data = await res.json();
  if (!res.ok)
    throw new Error(data.message || "Gagal menghapus contact person.");
  return data;
}

export interface DailyActivityItem {
  id: string;
  pegawaiId: string;
  perusahaanId: string;
  kontak: string;
  jenisTraining: string;
  keterangan: string;
  kategori: string;
  inout: string;
  tanggal: string;
  perusahaan: string;
  dateTarget: string | null;
  pegawai: {
    id: string;
    nama: string;
    jabatan: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface DailyActivityMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetDailyActivityListResponse {
  message: string;
  data: DailyActivityItem[];
  meta: DailyActivityMeta;
}

export interface GetDailyActivityListParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface GetOneDailyActivityResponse {
  message: string;
  data: DailyActivityItem;
}

export interface DailyActivityPayload {
  pegawaiId: string;
  kontak: string;
  jenisTraining: string;
  keterangan: string;
  kategori: string;
  inout: string;
  tanggal: string;
  perusahaan: string;
  dateTarget?: string | null;
}

export interface CreateDailyActivityResponse {
  message: string;
  data: DailyActivityItem;
}

export interface UpdateDailyActivityResponse {
  message: string;
  data: DailyActivityItem;
}

// ─────────────────────────────────────────────
// GET PAGINATED
// ─────────────────────────────────────────────

export async function getDailyActivityList(
  noInduk: string,
  params?: GetDailyActivityListParams,
): Promise<GetDailyActivityListResponse> {
  const query = new URLSearchParams();

  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.search) query.set("search", params.search);

  const res = await fetchWithAuth(
    `${API_URL}/api/database/perusahaan/${noInduk}/daily-activity?${query.toString()}`,
    { method: "GET" },
  );

  const data = await res.json();
  if (!res.ok)
    throw new Error(data.message || "Gagal mengambil data daily activity.");
  return data;
}

// ─────────────────────────────────────────────
// GET ONE
// ─────────────────────────────────────────────

export async function getOneDailyActivity(
  noInduk: string,
  id: string,
): Promise<GetOneDailyActivityResponse> {
  const res = await fetchWithAuth(
    `${API_URL}/api/database/perusahaan/${noInduk}/daily-activity/${id}`,
    { method: "GET" },
  );

  const data = await res.json();
  if (!res.ok)
    throw new Error(data.message || "Gagal mengambil data daily activity.");
  return data;
}

// ─────────────────────────────────────────────
// CREATE
// ─────────────────────────────────────────────

export async function createDailyActivity(
  noInduk: string,
  payload: DailyActivityPayload,
): Promise<CreateDailyActivityResponse> {
  const res = await fetchWithAuth(
    `${API_URL}/api/database/perusahaan/${noInduk}/daily-activity`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );

  const data = await res.json();
  if (!res.ok)
    throw new Error(data.message || "Gagal menambahkan daily activity.");
  return data;
}

// ─────────────────────────────────────────────
// UPDATE
// ─────────────────────────────────────────────

export async function updateDailyActivity(
  noInduk: string,
  id: string,
  payload: Partial<DailyActivityPayload>,
): Promise<UpdateDailyActivityResponse> {
  const res = await fetchWithAuth(
    `${API_URL}/api/database/perusahaan/${noInduk}/daily-activity/${id}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );

  const data = await res.json();
  if (!res.ok)
    throw new Error(data.message || "Gagal memperbarui daily activity.");
  return data;
}

// ─────────────────────────────────────────────
// DELETE
// ─────────────────────────────────────────────

export async function deleteDailyActivity(
  noInduk: string,
  id: string,
): Promise<{ message: string }> {
  const res = await fetchWithAuth(
    `${API_URL}/api/database/perusahaan/${noInduk}/daily-activity/${id}`,
    { method: "DELETE" },
  );

  const data = await res.json();
  if (!res.ok)
    throw new Error(data.message || "Gagal menghapus daily activity.");
  return data;
}

export interface GetHakAksesPerusahaanResponse {
  perusahaanId: string;
  company: string;
  idSimpel: string | null;
  inputter: {
    userId: string;
    name: string;
  };
  akses: Array<{
    jenisAkses: string;
    status: string | null;
    pegawai: Array<{
      id: string;
      nama: string;
      jabatan: string;
    }>;
  }>;
}

export async function getHakAksesPerusahaan(
  perusahaanId: string,
): Promise<GetHakAksesPerusahaanResponse> {
  const res = await fetchWithAuth(
    `${API_URL}/api/database/perusahaan/${perusahaanId}/hak-akses`,
    { method: "GET" },
  );

  const data = await res.json();
  if (!res.ok)
    throw new Error(
      data.message || "Gagal mengambil data hak akses perusahaan.",
    );
  return data;
}

export interface UpdateHakAksesPayload {
  perusahaanId: string;
  akses: Array<{
    jenisAkses: string; // ENV, CSR, TSM, EPM
    pegawaiIds: string[]; // Array of pegawai IDs
  }>;
}

export async function updateHakAksesKaryawan(
  payload: UpdateHakAksesPayload,
): Promise<void> {
  const res = await fetchWithAuth(
    `${API_URL}/api/database/perusahaan/hak-akses`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(
      errorData.message || "Gagal memperbarui hak akses karyawan.",
    );
  }
}

export interface LogPerubahan {
  id: string;
  perusahaanId: string;
  field: string;
  dataLama: string | null;
  dataBaru: string | null;
  diubahOleh: string;
  tanggal: string;
}

export interface LogPaginationResponse {
  success: boolean;
  data: LogPerubahan[];
  pagination: {
    totalData: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}

export async function getLogPerusahaan(
  perusahaanId: string,
  page: number = 1,
  limit: number = 10,
  search: string = "",
): Promise<LogPaginationResponse> {
  // Build query string
  const query = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    search: search,
  }).toString();

  const res = await fetchWithAuth(
    `${API_URL}/api/database/perusahaan/${perusahaanId}/logs?${query}`,
    {
      method: "GET",
    },
  );

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Gagal mengambil data history.");
  }

  return res.json();
}

// ── Interfaces ──
export interface PosPerusahaan {
  id: string;
  nama: string;
  jabatan: string;
  acc: string;
  followUp: string | null;
  noInduk: string;
}

// ── CREATE ──
export async function createPosPerusahaan(data: {
  noInduk: string;
  nama: string;
  jabatan: string;
  acc: string;
  followUp?: string;
}): Promise<PosPerusahaan> {
  const res = await fetchWithAuth(`${API_URL}/api/database/perusahaan/pos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Gagal menambah POS.");
  }
  return res.json();
}

// ── GET ──
export async function getPosPerusahaan(
  idPerusahaan: string,
): Promise<PosPerusahaan[]> {
  const res = await fetchWithAuth(
    `${API_URL}/api/database/perusahaan/pos/${idPerusahaan}`,
    { method: "GET" },
  );
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Gagal mengambil data POS.");
  }
  return res.json();
}

// ── UPDATE ──
export async function updatePosPerusahaan(
  idPerusahaan: string,
  data: {
    id: string;
    nama?: string;
    jabatan?: string;
    acc?: string;
    followUp?: string;
  },
): Promise<PosPerusahaan> {
  const res = await fetchWithAuth(
    `${API_URL}/api/database/perusahaan/pos/${idPerusahaan}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    },
  );
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Gagal mengupdate POS.");
  }
  return res.json();
}

// ── DELETE ──
export async function deletePosPerusahaan(
  id: string,
): Promise<{ message: string }> {
  const res = await fetchWithAuth(`${API_URL}/api/database/perusahaan/pos`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Gagal menghapus POS.");
  }
  return res.json();
}

// ── Interfaces ──
export interface Penawaran {
  id: string;
  kodePelatihan: string[];
  tanggal: string;
  filePath: string | null;
}

// ── CREATE ──
export async function createPenawaran(data: {
  kodePelatihan: string[];
}): Promise<Penawaran> {
  const res = await fetchWithAuth(`${API_URL}/api/database/penawaran`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ kodePelatihan: data.kodePelatihan }),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Gagal membuat penawaran.");
  }
  return res.json();
}

// ── GET ALL ──
export async function getPenawaran(): Promise<Penawaran[]> {
  const res = await fetchWithAuth(`${API_URL}/api/database/penawaran`, {
    method: "GET",
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Gagal mengambil data penawaran.");
  }
  return res.json();
}

// ── GET BY ID ──
export async function getPenawaranById(id: string): Promise<Penawaran> {
  const res = await fetchWithAuth(`${API_URL}/api/database/penawaran/${id}`, {
    method: "GET",
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Gagal mengambil penawaran.");
  }
  return res.json();
}

// ── UPDATE ──
export async function updatePenawaran(
  id: string,
  data: {
    kodePelatihan?: string[];
    file?: File;
  },
): Promise<Penawaran> {
  const formData = new FormData();
  if (data.kodePelatihan) {
    formData.append("kodePelatihan", JSON.stringify(data.kodePelatihan));
  }
  if (data.file) {
    formData.append("file", data.file);
  }

  const res = await fetchWithAuth(`${API_URL}/api/database/penawaran/${id}`, {
    method: "PUT",
    body: formData,
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Gagal mengupdate penawaran.");
  }
  return res.json();
}

// ── DELETE ──
export async function deletePenawaran(
  id: string,
): Promise<{ message: string }> {
  const res = await fetchWithAuth(`${API_URL}/api/database/penawaran/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Gagal menghapus penawaran.");
  }
  return res.json();
}

// ── UPLOAD FILE ──
export async function uploadFilePenawaran(
  id: string,
  file: File,
): Promise<Penawaran> {
  return updatePenawaran(id, { file });
}
