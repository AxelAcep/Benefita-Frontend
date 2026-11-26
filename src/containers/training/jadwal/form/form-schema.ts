import { z } from "zod";

export const jadwalSchema = z.object({
  noJadwal: z.string().min(1, "No. Jadwal wajib diisi"),
  kodePelatihan: z.string().min(1, "Kode pelatihan wajib dipilih"),
  tglMulai: z.string().optional(),
  tglSelesai: z.string().optional(),
  judulLengkap: z.string().optional(),
  judulPendek: z.string().optional(),
  metode: z.string().optional(),
  jenisTraining: z.string().optional(),
  kota: z.string().optional(),
  lokasiDetail: z.string().optional(),
  biaya: z.string().optional(),
  trainerKodes: z.array(z.string()).optional(),
  status: z.string().optional(),
  catatan: z.string().optional(),
});

export type JadwalFormValues = z.infer<typeof jadwalSchema>;

export const NILAI_KOSONG: JadwalFormValues = {
  noJadwal: "",
  kodePelatihan: "",
  tglMulai: "",
  tglSelesai: "",
  judulLengkap: "",
  judulPendek: "",
  metode: "",
  jenisTraining: "",
  kota: "",
  lokasiDetail: "",
  biaya: "",
  trainerKodes: [],
  status: "",
  catatan: "",
};
