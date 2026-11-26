/**
 * Satu pintu untuk semua panggilan API.
 *
 * Sebelum ini, 23 file service masing-masing menulis ulang blok yang sama:
 * rakit URL dari NEXT_PUBLIC_API_URL, panggil fetchWithAuth, res.json(),
 * lalu `if (!res.ok) throw new Error(data.message || "...")`. Di sini
 * semuanya ditulis sekali.
 *
 * Autentikasi tetap ditangani fetchWithAuth (token + silent refresh);
 * file ini hanya membungkusnya.
 */
import { fetchWithAuth } from "@/lib/services/login.service";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/** Bentuk seragam hasil endpoint list, apa pun bentuk aslinya dari backend. */
export interface ListResult<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ListParams {
  page?: number;
  limit?: number;
  search?: string;
  [key: string]: string | number | boolean | undefined;
}

export class ApiError extends Error {
  readonly status: number;
  readonly body: unknown;

  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

function buildUrl(path: string, params?: ListParams): string {
  const url = `${API_URL}${path.startsWith("/") ? path : `/${path}`}`;
  if (!params) return url;

  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    // Buang nilai kosong supaya tidak mengirim "?search=" yang bikin
    // sebagian endpoint menganggapnya filter kosong, bukan tanpa filter.
    if (value === undefined || value === null || value === "") continue;
    query.append(key, String(value));
  }

  const qs = query.toString();
  return qs ? `${url}?${qs}` : url;
}

async function request<T>(
  path: string,
  init: RequestInit,
  pesanGagal: string,
  params?: ListParams,
  authenticated = true,
): Promise<T> {
  const url = buildUrl(path, params);
  const res = await (authenticated ? fetchWithAuth(url, init) : fetch(url, init));

  // Endpoint DELETE kadang membalas 204 tanpa isi; jangan paksa json().
  const teks = await res.text();
  let body: unknown = null;
  if (teks) {
    try {
      body = JSON.parse(teks);
    } catch {
      body = teks;
    }
  }

  if (!res.ok) {
    const pesan =
      (body as { message?: string } | null)?.message || pesanGagal;
    throw new ApiError(pesan, res.status, body);
  }

  return body as T;
}

const jsonInit = (method: string, payload?: unknown): RequestInit => ({
  method,
  headers: { "Content-Type": "application/json" },
  body: payload === undefined ? undefined : JSON.stringify(payload),
});

/**
 * Bentuk respons list backend belum seragam:
 *   { data, pagination: { total, totalPages } }  -> tuk, asesor, hotel, trainer, ...
 *   { data, meta: { total, totalPage } }         -> pegawai  (totalPage, tanpa "s")
 * Diseragamkan di sini supaya hook tidak perlu tahu bedanya.
 */
function normalisasiList<T>(body: unknown, paramPage: number, paramLimit: number): ListResult<T> {
  const b = (body ?? {}) as Record<string, unknown>;
  const data = (Array.isArray(b.data) ? b.data : []) as T[];

  const p = (b.pagination ?? b.meta ?? {}) as Record<string, unknown>;
  const angka = (v: unknown, fallback: number) =>
    typeof v === "number" && Number.isFinite(v) ? v : fallback;

  const total = angka(p.total, data.length);
  const limit = angka(p.limit, paramLimit);
  // "totalPage" (pegawai.service) dan "totalPages" (sisanya) dua-duanya diterima.
  const totalPages = angka(
    p.totalPages ?? p.totalPage,
    limit > 0 ? Math.max(1, Math.ceil(total / limit)) : 1,
  );

  return { data, page: angka(p.page, paramPage), limit, total, totalPages };
}

export async function apiList<T>(
  path: string,
  params: ListParams = {},
  pesanGagal = "Gagal mengambil data.",
): Promise<ListResult<T>> {
  const body = await request<unknown>(path, { method: "GET" }, pesanGagal, params);
  return normalisasiList<T>(body, Number(params.page) || 1, Number(params.limit) || 10);
}

/**
 * Endpoint detail/mutasi membungkus hasilnya di `data`, tapi tidak semuanya.
 * Ambil `data` kalau ada, kalau tidak pakai body apa adanya.
 */
function buka<T>(body: unknown): T {
  const b = body as { data?: unknown } | null;
  return (b && typeof b === "object" && "data" in b ? b.data : body) as T;
}

/** Untuk respons yang memuat ringkasan di samping data. */
export function apiGetResponse<T>(
  path: string,
  params?: ListParams,
  pesanGagal = "Gagal mengambil data.",
): Promise<T> {
  return request<T>(path, { method: "GET" }, pesanGagal, params);
}

export async function apiGet<T>(
  path: string,
  params?: ListParams,
  pesanGagal = "Gagal mengambil data.",
): Promise<T> {
  return buka<T>(await apiGetResponse<unknown>(path, params, pesanGagal));
}

/** Jalur formulir publik: tidak membaca token atau mencoba memperbarui sesi. */
export async function apiPublic<T>(
  path: string,
  options: { method?: "GET" | "POST" | "PATCH"; payload?: unknown; params?: ListParams },
  pesanGagal: string,
): Promise<T> {
  const { method = "GET", payload, params } = options;
  const init = method === "GET" ? { method } : jsonInit(method, payload);
  return buka<T>(await request<unknown>(path, init, pesanGagal, params, false));
}

export async function apiPost<T>(
  path: string,
  payload?: unknown,
  pesanGagal = "Gagal menyimpan data.",
): Promise<T> {
  return buka<T>(await request<unknown>(path, jsonInit("POST", payload), pesanGagal));
}

export async function apiPut<T>(
  path: string,
  payload?: unknown,
  pesanGagal = "Gagal mengubah data.",
): Promise<T> {
  return buka<T>(await request<unknown>(path, jsonInit("PUT", payload), pesanGagal));
}

/**
 * Varian multipart untuk endpoint yang menerima unggahan berkas.
 * Content-Type sengaja tidak diisi: browser harus menuliskannya sendiri
 * lengkap dengan boundary FormData.
 */
function formInit(method: string, form: FormData): RequestInit {
  return { method, body: form };
}

/**
 * Rakit FormData dari objek biasa.
 *
 * File dikirim apa adanya. Array dikirim sebagai field berulang dengan
 * nama yang sama (trainerKodes=A&trainerKodes=B), bukan diubah jadi satu
 * string — itu bentuk yang diharapkan backend.
 */
export function keFormData(payload: Record<string, unknown>): FormData {
  const form = new FormData();

  for (const [key, value] of Object.entries(payload)) {
    if (value === undefined || value === null) continue;

    if (Array.isArray(value)) {
      for (const item of value) {
        if (item === undefined || item === null) continue;
        form.append(key, item instanceof File ? item : String(item));
      }
      continue;
    }

    form.append(key, value instanceof File ? value : String(value));
  }

  return form;
}

export async function apiPostForm<T>(
  path: string,
  form: FormData,
  pesanGagal = "Gagal menyimpan data.",
): Promise<T> {
  return buka<T>(await request<unknown>(path, formInit("POST", form), pesanGagal));
}

export async function apiPutForm<T>(
  path: string,
  form: FormData,
  pesanGagal = "Gagal mengubah data.",
): Promise<T> {
  return buka<T>(await request<unknown>(path, formInit("PUT", form), pesanGagal));
}

export async function apiPatch<T>(
  path: string,
  payload?: unknown,
  pesanGagal = "Gagal mengubah data.",
): Promise<T> {
  return buka<T>(await request<unknown>(path, jsonInit("PATCH", payload), pesanGagal));
}

export async function apiDelete(
  path: string,
  pesanGagal = "Gagal menghapus data.",
): Promise<void> {
  await request<unknown>(path, { method: "DELETE" }, pesanGagal);
}
