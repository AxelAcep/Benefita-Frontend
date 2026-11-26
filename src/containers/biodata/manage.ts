import type React from "react";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { usePesertaBiodata } from "@/hooks/use-peserta-biodata";
import type { UpdateBiodataPesertaRequest } from "@/lib/services/input.service";

interface FormState {
  nama: string;
  tempatLahir: string;
  tanggalLahir: string;
  jenisKelamin: string;
  noIndukPerusahaan: string;
  companyLabel: string;
  jabatan: string;
  bidang: string;
  email: string;
  noHp: string;
}

const emptyForm: FormState = {
  nama: "",
  tempatLahir: "",
  tanggalLahir: "",
  jenisKelamin: "",
  noIndukPerusahaan: "",
  companyLabel: "",
  jabatan: "",
  bidang: "",
  email: "",
  noHp: "",
};

export function useBiodataManage() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, error, submitBiodata, isSubmitting } =
    usePesertaBiodata({ id });

  const [form, setForm] = useState<FormState>(emptyForm);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Sync form dari data yang udah ada, sekali data ke-load
  useEffect(() => {
    if (!data) return;
    setForm({
      nama: data.nama ?? "",
      tempatLahir: data.tempatLahir ?? "",
      tanggalLahir: data.tanggalLahir ? data.tanggalLahir.split("T")[0] : "",
      jenisKelamin: data.jenisKelamin ?? "",
      noIndukPerusahaan: data.noIndukPerusahaan ?? "",
      companyLabel: data.perusahaan?.company ?? "",
      jabatan: data.jabatan ?? "",
      bidang: data.bidang ?? "",
      email: data.email ?? "",
      noHp: data.noHp ?? "",
    });
  }, [data]);

  function handleChange(
    field: keyof FormState,
  ): React.ChangeEventHandler<HTMLInputElement | HTMLSelectElement> {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const payload: UpdateBiodataPesertaRequest = {
      nama: form.nama,
      tempatLahir: form.tempatLahir,
      tanggalLahir: form.tanggalLahir,
      jenisKelamin: form.jenisKelamin,
      noIndukPerusahaan: form.noIndukPerusahaan,
      jabatan: form.jabatan,
      bidang: form.bidang,
      email: form.email,
      noHp: form.noHp,
    };

    try {
      await submitBiodata(payload);
      setNotification({
        message: "Biodata berhasil disimpan",
        type: "success",
      });
    } catch (err) {
      setNotification({
        message: err instanceof Error ? err.message : "Gagal menyimpan biodata",
        type: "error",
      });
    }
  }

  function handlePerusahaanChange(noInduk: string, company: string) {
    setForm((prev) => ({
      ...prev,
      noIndukPerusahaan: noInduk,
      companyLabel: company,
    }));
  }

  return {
    data,
    isLoading,
    error,
    form,
    notification,
    isSubmitting,
    handleChange,
    handleSubmit,
    handlePerusahaanChange,
    clearNotification: () => setNotification(null),
  };
}
