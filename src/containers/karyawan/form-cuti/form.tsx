"use client";

import { useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SelectInput, TextArea, TextInput } from "@/components/base/form-field";
import type { CreatePengajuanRequest } from "@/lib/types/cuti";

const JENIS = [
  { value: "CUTI", label: "Cuti" },
  { value: "SAKIT", label: "Sakit" },
  { value: "IZIN", label: "Izin" },
];

const schema = z.object({
  jenisIzin: z.enum(["CUTI", "SAKIT", "IZIN"], { error: "Pilih jenis izin." }),
  tanggalMulai: z.iso.date({ error: "Isi tanggal mulai." }),
  tanggalSelesai: z.iso.date({ error: "Isi tanggal selesai." }),
  alasan: z.string().trim().min(1, "Isi alasan pengajuan."),
  bukti: z.custom<FileList>().optional(),
}).superRefine((input, ctx) => {
  if (input.tanggalMulai > input.tanggalSelesai) {
    ctx.addIssue({ code: "custom", path: ["tanggalSelesai"], message: "Tanggal selesai harus sama dengan atau setelah tanggal mulai." });
  }
  const files = Array.from(input.bukti ?? []);
  if (input.jenisIzin === "SAKIT" && files.length === 0) {
    ctx.addIssue({ code: "custom", path: ["bukti"], message: "Lampiran wajib untuk pengajuan sakit." });
  }
  if (files.length > 5 || files.some((file) => file.size > 10 * 1024 * 1024)) {
    ctx.addIssue({ code: "custom", path: ["bukti"], message: "Pilih hingga 5 berkas, masing-masing maksimal 10 MB." });
  }
});

type Input = Omit<CreatePengajuanRequest, "pegawaiId">;

export function FormCuti({ onSubmit }: { onSubmit: (values: Input) => Promise<boolean> }) {
  const formRef = useRef<HTMLFormElement>(null);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm({ resolver: zodResolver(schema) });

  const kirim = handleSubmit(async ({ bukti, ...values }) => {
    if (await onSubmit({ ...values, bukti: bukti?.length ? Array.from(bukti) : undefined })) {
      formRef.current?.reset();
      reset();
    }
  });

  return (
    <form ref={formRef} onSubmit={kirim} className="space-y-4">
      <fieldset disabled={isSubmitting} className="space-y-4">
        <SelectInput label="Jenis izin" placeholder="Pilih jenis izin" opsi={JENIS} {...register("jenisIzin")} error={errors.jenisIzin?.message} />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput label="Tanggal mulai" type="date" {...register("tanggalMulai")} error={errors.tanggalMulai?.message} />
          <TextInput label="Tanggal selesai" type="date" {...register("tanggalSelesai")} error={errors.tanggalSelesai?.message} />
        </div>
        <TextArea label="Alasan / keterangan" rows={4} {...register("alasan")} error={errors.alasan?.message} />
        <TextInput
          label="Lampiran"
          type="file"
          multiple
          accept=".png,.jpg,.jpeg,.pdf"
          aria-describedby="panduan-lampiran"
          {...register("bukti")}
          error={errors.bukti?.message}
        />
        <p id="panduan-lampiran" className="text-xs text-zinc-500">
          PNG, JPG, atau PDF. Maksimal 5 berkas hingga 10 MB per berkas. Wajib untuk pengajuan sakit.
        </p>
      </fieldset>
      <button type="submit" disabled={isSubmitting} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
        {isSubmitting ? "Mengirim..." : "Kirim Pengajuan"}
      </button>
    </form>
  );
}
