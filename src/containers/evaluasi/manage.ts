import type React from "react";
import { useState } from "react";
import { useParams } from "next/navigation";
import { useEvaluasiPelatihan } from "@/hooks/use-evaluasi";
import type { CreateEvaluasiPelatihanRequest } from "@/lib/services/input.service";

export interface RatingState {
  nilaiSistematikaMateri: number;
  nilaiTampilanSlide: number;
  nilaiAlokasiWaktu: number;
  nilaiPenerapanMateri: number;
  nilaiPeningkatanKompetensi: number;
}

interface FormState extends RatingState {
  nilaiTrainer: number;
  manfaatUntukPeserta: string;
  manfaatUntukPerusahaan: string;
  divisiDisarankan: string;
  prosedurPengajuan: string;
}

const emptyForm: FormState = {
  nilaiSistematikaMateri: 0,
  nilaiTampilanSlide: 0,
  nilaiAlokasiWaktu: 0,
  nilaiPenerapanMateri: 0,
  nilaiPeningkatanKompetensi: 0,
  nilaiTrainer: 0,
  manfaatUntukPeserta: "",
  manfaatUntukPerusahaan: "",
  divisiDisarankan: "",
  prosedurPengajuan: "",
};

export function useEvaluasiManage() {
  const { id } = useParams<{ id: string }>();

  const {
    context,
    isLoadingContext,
    contextError,
    judulTrainingOptions,
    isLoadingOptions,
    optionsError,
    submitEvaluasi,
    isSubmitting,
  } = useEvaluasiPelatihan({ id });

  const [form, setForm] = useState<FormState>(emptyForm);
  const [pelatihanDiminatiIds, setPelatihanDiminatiIds] = useState<number[]>(
    [],
  );
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [submitted, setSubmitted] = useState(false);

  function handleRatingChange(field: keyof FormState, val: number) {
    setForm((prev) => ({ ...prev, [field]: val }));
  }

  function handleTextChange(
    field: keyof FormState,
  ): React.ChangeEventHandler<HTMLTextAreaElement> {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  function toggleJudulTraining(judulId: number) {
    setPelatihanDiminatiIds((prev) =>
      prev.includes(judulId)
        ? prev.filter((v) => v !== judulId)
        : [...prev, judulId],
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const ratingFields: (keyof RatingState | "nilaiTrainer")[] = [
      "nilaiSistematikaMateri",
      "nilaiTampilanSlide",
      "nilaiAlokasiWaktu",
      "nilaiPenerapanMateri",
      "nilaiPeningkatanKompetensi",
      "nilaiTrainer",
    ];
    const belumDinilai = ratingFields.some((f) => form[f] === 0);
    if (belumDinilai) {
      setNotification({
        message: "Mohon lengkapi semua penilaian (1-5) sebelum mengirim.",
        type: "error",
      });
      return;
    }

    const payload: CreateEvaluasiPelatihanRequest = {
      nilaiSistematikaMateri: form.nilaiSistematikaMateri,
      nilaiTampilanSlide: form.nilaiTampilanSlide,
      nilaiAlokasiWaktu: form.nilaiAlokasiWaktu,
      nilaiPenerapanMateri: form.nilaiPenerapanMateri,
      nilaiPeningkatanKompetensi: form.nilaiPeningkatanKompetensi,
      nilaiTrainer: form.nilaiTrainer,
      manfaatUntukPeserta: form.manfaatUntukPeserta,
      manfaatUntukPerusahaan: form.manfaatUntukPerusahaan,
      divisiDisarankan: form.divisiDisarankan,
      prosedurPengajuan: form.prosedurPengajuan,
      pelatihanDiminatiIds,
    };

    try {
      await submitEvaluasi(payload);
      setSubmitted(true);
    } catch (err) {
      setNotification({
        message: err instanceof Error ? err.message : "Gagal mengirim evaluasi",
        type: "error",
      });
    }
  }

  return {
    context,
    isLoadingContext,
    contextError,
    judulTrainingOptions,
    isLoadingOptions,
    optionsError,
    form,
    pelatihanDiminatiIds,
    notification,
    submitted,
    isSubmitting,
    handleRatingChange,
    handleTextChange,
    toggleJudulTraining,
    handleSubmit,
    clearNotification: () => setNotification(null),
  };
}
