"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SelectInput, TextInput } from "@/components/base/form-field";
import type { PesertaTraining } from "@/lib/services/input.service";
import type { Konfirmasi, UpdateKonfirmasiRequest } from "@/lib/types/konfirmasi";

const schema = z.object({
  metode: z.string().trim().min(1, "Pilih metode."),
  tanggalPelatihan: z.union([z.literal(""), z.iso.date()]),
  kepada: z.string().trim(),
  jabatan: z.string().trim(),
  kontak: z.string().trim(),
  file: z.custom<FileList>().optional(),
});

export function KonfirmasiForm({ peserta, konfirmasi, simpan }: {
  peserta: PesertaTraining;
  konfirmasi: Konfirmasi | null;
  simpan: (values: UpdateKonfirmasiRequest) => Promise<void>;
}) {
  const [error, setError] = useState<string | null>(null);
  const metode = konfirmasi?.metode || peserta.metode || peserta.jadwalTraining.metode || "Offline";
  const pilihan = [...new Set(["Offline", "Online", metode])];
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      metode,
      tanggalPelatihan: (konfirmasi?.tanggalPelatihan ?? peserta.jadwalTraining.tglMulai)?.split("T")[0] ?? "",
      kepada: konfirmasi?.kepada ?? "Pimpinan",
      jabatan: konfirmasi?.jabatan ?? peserta.jabatan ?? "",
      kontak: konfirmasi?.kontak ?? peserta.noTelp ?? "",
    },
  });
  const fileUrl = konfirmasi?.filePath
    ? `${process.env.NEXT_PUBLIC_API_URL}/${konfirmasi.filePath.replace(/\\/g, "/").replace(/^\/+/, "")}`
    : null;

  async function submit({ file, ...values }: z.infer<typeof schema>) {
    setError(null);
    try {
      await simpan({
        metode: values.metode,
        tanggalPelatihan: values.tanggalPelatihan || undefined,
        kepada: values.kepada || undefined,
        jabatan: values.jabatan || undefined,
        kontak: values.kontak || undefined,
        file: file?.[0],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan konfirmasi.");
    }
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <fieldset disabled={isSubmitting} className="grid gap-4 sm:grid-cols-2">
        <SelectInput label="Metode" opsi={pilihan.map((value) => ({ label: value, value }))} {...register("metode")} error={errors.metode?.message} />
        <TextInput label="Tanggal Pelatihan" type="date" optional {...register("tanggalPelatihan")} error={errors.tanggalPelatihan?.message} />
        <TextInput label="Kepada" optional {...register("kepada")} />
        <TextInput label="Jabatan" optional {...register("jabatan")} />
        <TextInput label="Kontak" optional {...register("kontak")} />
        <TextInput label="Lampiran" type="file" optional {...register("file")} />
      </fieldset>
      {fileUrl && <a href={fileUrl} target="_blank" rel="noreferrer" className="block text-sm font-medium text-emerald-700 underline">Lihat lampiran tersimpan</a>}
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
      <button type="submit" disabled={isSubmitting} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
        {isSubmitting ? "Menyimpan..." : "Simpan Konfirmasi"}
      </button>
    </form>
  );
}
