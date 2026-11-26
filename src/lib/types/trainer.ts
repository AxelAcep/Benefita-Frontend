/**
 * Trainer — pengajar pada pelaksanaan training.
 *
 * Ada dua bentuk: apa adanya dari backend (TrainerApi, TrainerListApi) dan
 * bentuk yang dipakai tampilan (Trainer). Bedanya bukan gaya-gayaan:
 * backend menyimpan `referensi` sebagai satu string dipisah koma, sedangkan
 * tampilan membutuhkannya sebagai array untuk dirender jadi tag.
 */

/** Bentuk detail dari GET /api/training/trainer/:id */
export interface TrainerApi {
  id: number;
  kode: string;
  nama: string;
  referensi?: string | null;
  alamat?: string | null;
  subjekKhusus?: string | null;
  telp?: string | null;
  keterangan?: string | null;
  email?: string | null;
  tugas?: string | null;
  kantor?: string | null;
  alamatKantor?: string | null;
  noTelpKantor?: string | null;
  statusAktif: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Bentuk baris dari GET /api/training/trainer */
export interface TrainerListApi {
  id: number;
  kode: string;
  nama: string;
  telp?: string | null;
  email?: string | null;
  kantor?: string | null;
  referensi?: string | null;
  subjekKhusus?: string | null;
  tugas?: string | null;
  jumlahHari?: number | null;
  statusAktif: boolean;
}

/** Bentuk yang dipakai tabel dan modal. */
export interface Trainer {
  id: number;
  kode: string;
  nama: string;
  hp: string;
  email: string;
  kantor: string;
  alamat: string;
  alamatKantor: string;
  noTelpKantor: string;
  referensi: string[];
  subyekKhusus: string | null;
  keterangan: string | null;
  tugas: string | null;
  /** null kalau sumbernya endpoint detail, yang memang tidak mengirim ini. */
  jumlahHari: number | null;
  statusAktif: boolean;
}

export interface CreateTrainerRequest {
  kode: string;
  nama: string;
  referensi?: string;
  alamat?: string;
  subjekKhusus?: string;
  telp?: string;
  keterangan?: string;
  email?: string;
  tugas?: string;
  kantor?: string;
  alamatKantor?: string;
  noTelpKantor?: string;
  statusAktif?: boolean;
}

export type UpdateTrainerRequest = Partial<CreateTrainerRequest>;

const keArray = (v: string | null | undefined): string[] =>
  v ? v.split(",").map((s) => s.trim()).filter(Boolean) : [];

/** Baris list dari backend jadi bentuk tampilan. */
export function dariListApi(item: TrainerListApi): Trainer {
  return {
    id: item.id,
    kode: item.kode,
    nama: item.nama,
    hp: item.telp ?? "",
    email: item.email ?? "",
    kantor: item.kantor ?? "",
    // Tiga field ini memang tidak dikirim endpoint list, baru ada di detail.
    alamat: "",
    alamatKantor: "",
    noTelpKantor: "",
    referensi: keArray(item.referensi),
    subyekKhusus: item.subjekKhusus ?? null,
    keterangan: null,
    tugas: item.tugas ?? null,
    jumlahHari: item.jumlahHari ?? 0,
    statusAktif: item.statusAktif,
  };
}

/** Detail dari backend jadi bentuk tampilan. */
export function dariDetailApi(item: TrainerApi): Trainer {
  return {
    id: item.id,
    kode: item.kode,
    nama: item.nama,
    hp: item.telp ?? "",
    email: item.email ?? "",
    kantor: item.kantor ?? "",
    alamat: item.alamat ?? "",
    alamatKantor: item.alamatKantor ?? "",
    noTelpKantor: item.noTelpKantor ?? "",
    referensi: keArray(item.referensi),
    subyekKhusus: item.subjekKhusus ?? null,
    keterangan: item.keterangan ?? null,
    tugas: item.tugas ?? null,
    // Endpoint detail tidak mengirim jumlahHari. Sebelumnya diisi 0, sehingga
    // modal detail selalu menampilkan "0 hari" walau di tabel angkanya lain.
    // null supaya tampilan bisa membedakan "tidak dikirim" dari "nol hari".
    jumlahHari: null,
    statusAktif: item.statusAktif,
  };
}
