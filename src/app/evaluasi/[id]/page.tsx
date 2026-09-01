"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import {
  Loader2,
  Send,
  ClipboardList,
  User2,
  MessageSquare,
  Info,
  CheckCircle2,
} from "lucide-react";
import { useEvaluasiPelatihan } from "@/hooks/use-evaluasi";
import Notification from "@/components/base/notifications";
import type { CreateEvaluasiPelatihanRequest } from "@/lib/services/input.service";

const cardCls = "bg-white border border-zinc-200 rounded-2xl p-6 space-y-5";
const sectionTitleCls =
  "flex items-center gap-2 text-emerald-600 text-xs font-semibold";
const labelCls = "block text-xs font-semibold text-zinc-700 mb-1.5";
const textareaCls =
  "w-full px-3 py-2 border border-zinc-200 rounded-xl text-xs text-zinc-700 outline-none transition-all placeholder:text-zinc-300 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 bg-white resize-none";
const disabledCls = "opacity-50 cursor-not-allowed bg-zinc-50";

const RATING_ITEMS: {
  key: keyof RatingState;
  label: string;
}[] = [
  {
    key: "nilaiSistematikaMateri",
    label: "A. Sistematika materi pelatihan mempermudah penyerapan materi",
  },
  {
    key: "nilaiTampilanSlide",
    label: "B. Tampilan slide presentasi menarik",
  },
  { key: "nilaiAlokasiWaktu", label: "C. Alokasi waktu pelatihan cukup" },
  { key: "nilaiPenerapanMateri", label: "D. Materi dapat diterapkan" },
  {
    key: "nilaiPeningkatanKompetensi",
    label: "E. Meningkatkan kompetensi",
  },
];

interface RatingState {
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

function RatingPicker({
  value,
  onChange,
  disabled,
}: {
  value: number;
  onChange: (val: number) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={disabled}
          onClick={() => onChange(n)}
          className={`w-8 h-8 rounded-lg text-xs font-semibold border transition-colors ${
            value === n
              ? "bg-emerald-500 border-emerald-500 text-white"
              : "bg-white border-zinc-200 text-zinc-500 hover:border-emerald-300"
          } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        >
          {n}
        </button>
      ))}
    </div>
  );
}

export default function EvaluasiPelatihanPage() {
  const params = useParams();
  const id = params.id as string;

  const {
    context,
    isLoadingContext,
    contextError,
    judulTrainingOptions,
    isLoadingOptions,
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

  if (isLoadingContext) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (contextError || !context) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4">
        <p className="text-sm text-red-500 text-center">
          {contextError ?? "Data peserta tidak ditemukan"}
        </p>
      </div>
    );
  }

  const alreadyDone = context.sudahMengisi || submitted;

  return (
    <div className="min-h-screen bg-zinc-50 py-10 px-4 flex flex-col">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="max-w-xl mx-auto w-full flex-1">
        <div className="flex justify-center mb-6">
          <Image
            src="/logo-benefita.png"
            alt="Benefita"
            width={160}
            height={48}
            className="h-10 w-auto"
            priority
            unoptimized
          />
        </div>

        <div className="mb-6 text-center">
          <h1 className="text-lg font-bold text-zinc-800">
            Form Evaluasi Pelatihan
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            {context.jadwalTraining.judulLengkap}
          </p>
          <p className="text-[11px] text-zinc-400">Peserta: {context.nama}</p>
        </div>

        {alreadyDone ? (
          <div className={`${cardCls} items-center text-center`}>
            <div className="flex justify-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            </div>
            <p className="text-sm font-semibold text-zinc-700">Terima kasih!</p>
            <p className="text-xs text-zinc-400">
              Evaluasi untuk pelatihan ini sudah tercatat.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Pelaksanaan */}
            <div className={cardCls}>
              <div className={sectionTitleCls}>
                <ClipboardList className="w-3.5 h-3.5" />
                PELAKSANAAN
              </div>
              <p className="text-[11px] text-zinc-400 -mt-3">
                Berikan nilai 1 sampai 5
              </p>

              {RATING_ITEMS.map((item) => (
                <div
                  key={item.key}
                  className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
                >
                  <label className="text-xs text-zinc-700 flex-1 pr-2">
                    {item.label}
                  </label>
                  <RatingPicker
                    value={form[item.key]}
                    onChange={(val) => handleRatingChange(item.key, val)}
                  />
                </div>
              ))}
            </div>

            {/* Trainer */}
            <div className={cardCls}>
              <div className={sectionTitleCls}>
                <User2 className="w-3.5 h-3.5" />
                TRAINER
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <label className="text-xs text-zinc-700 flex-1 pr-2">
                  Penilaian terhadap trainer/pengajar
                </label>
                <RatingPicker
                  value={form.nilaiTrainer}
                  onChange={(val) => handleRatingChange("nilaiTrainer", val)}
                />
              </div>
            </div>

            {/* Manfaat */}
            <div className={cardCls}>
              <div className={sectionTitleCls}>
                <MessageSquare className="w-3.5 h-3.5" />
                MANFAAT
              </div>

              <div>
                <label className={labelCls}>
                  Jelaskan manfaat yang Anda peroleh dari pelatihan ini.
                </label>
                <textarea
                  rows={3}
                  value={form.manfaatUntukPeserta}
                  onChange={handleTextChange("manfaatUntukPeserta")}
                  placeholder="Tuliskan jawaban Anda..."
                  className={textareaCls}
                />
              </div>

              <div>
                <label className={labelCls}>
                  Menurut Anda, apa manfaat pelatihan ini bagi perusahaan?
                </label>
                <textarea
                  rows={3}
                  value={form.manfaatUntukPerusahaan}
                  onChange={handleTextChange("manfaatUntukPerusahaan")}
                  placeholder="Tuliskan jawaban Anda..."
                  className={textareaCls}
                />
              </div>
            </div>

            {/* Informasi Pelatihan */}
            <div className={cardCls}>
              <div className={sectionTitleCls}>
                <ClipboardList className="w-3.5 h-3.5" />
                INFORMASI PELATIHAN
              </div>
              <p className="text-[11px] text-zinc-400 -mt-3">
                Pelatihan lain yang diminati (boleh pilih lebih dari satu)
              </p>

              {isLoadingOptions ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="w-4 h-4 animate-spin text-zinc-400" />
                </div>
              ) : (
                <div className="max-h-64 overflow-y-auto border border-zinc-100 rounded-xl divide-y divide-zinc-100">
                  {judulTrainingOptions.map((opt) => (
                    <label
                      key={opt.id}
                      className="flex items-start gap-2.5 px-3 py-2.5 text-xs text-zinc-700 hover:bg-emerald-50/50 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={pelatihanDiminatiIds.includes(opt.id)}
                        onChange={() => toggleJudulTraining(opt.id)}
                        className="mt-0.5 accent-emerald-500"
                      />
                      <span>
                        <span className="font-semibold text-emerald-600">
                          {opt.kode}
                        </span>{" "}
                        — {opt.judulTraining}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Informasi Tambahan */}
            <div className={cardCls}>
              <div className={sectionTitleCls}>
                <Info className="w-3.5 h-3.5" />
                INFORMASI TAMBAHAN
              </div>

              <div>
                <label className={labelCls}>
                  Siapa/divisi yang disarankan mengikuti pelatihan ini?
                </label>
                <textarea
                  rows={2}
                  value={form.divisiDisarankan}
                  onChange={handleTextChange("divisiDisarankan")}
                  placeholder="Tuliskan jawaban Anda..."
                  className={textareaCls}
                />
              </div>

              <div>
                <label className={labelCls}>
                  Prosedur pengajuan training di perusahaan
                </label>
                <textarea
                  rows={2}
                  value={form.prosedurPengajuan}
                  onChange={handleTextChange("prosedurPengajuan")}
                  placeholder="Tuliskan jawaban Anda..."
                  className={textareaCls}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold rounded-xl py-2.5 transition-colors ${
                isSubmitting ? disabledCls : ""
              }`}
            >
              {isSubmitting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
              {isSubmitting ? "Mengirim..." : "Kirim Evaluasi"}
            </button>
          </form>
        )}
      </div>

      <footer className="max-w-xl mx-auto w-full mt-8 pt-6 border-t border-zinc-200 text-center">
        <p className="text-xs font-semibold text-zinc-700">PT BENEFITA</p>
        <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
          Jababeka Education Park, JL. Ki Hajar Dewantara Blok 2A No 159
          Cikarang Bekasi 17550
        </p>
        <p className="text-[11px] text-zinc-400 mt-1">
          Telp: 021-8911 1660, 021-8983 0305
        </p>
        <a
          href="https://www.benefita.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] text-emerald-600 hover:text-emerald-700 font-medium mt-1 inline-block"
        >
          www.benefita.com
        </a>
      </footer>
    </div>
  );
}
