"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Loader2, Users, MessageSquare } from "lucide-react";
import AppLayout from "@/components/app-layout";
import { useRekapEvaluasi } from "@/hooks/use-evaluasi-pelatihan";
import type { RekapEvaluasiResponse } from "@/lib/types/rekap-evaluasi";

const cardCls = "bg-white border border-zinc-200 rounded-2xl p-6";

const PERTANYAAN_ITEMS: {
  key: keyof RekapEvaluasiResponse["rataRata"];
  label: string;
}[] = [
  { key: "nilaiSistematikaMateri", label: "Sistematika materi" },
  { key: "nilaiTampilanSlide", label: "Tampilan slide" },
  {
    key: "nilaiPenerapanMateri",
    label: "Pelatihan dapat diterapkan di perusahaan",
  },
  { key: "nilaiAlokasiWaktu", label: "Alokasi waktu pelatihan cukup" },
  {
    key: "nilaiPeningkatanKompetensi",
    label: "Meningkatkan kompetensi peserta",
  },
];

function formatTanggal(dateStr: string | null): string {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function ScoreBar({ value }: { value: number }) {
  const pct = Math.min(100, Math.max(0, (value / 5) * 100));
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-zinc-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-emerald-500 rounded-full transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-semibold text-zinc-700 w-8 text-right">
        {value || "-"}
      </span>
    </div>
  );
}

export default function RekapEvaluasiContainer() {
  const { id: noJadwal } = useParams<{ id: string }>();

  const { data, isLoading, error, refetch } = useRekapEvaluasi({ noJadwal });

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Input Data", href: `/input/${encodeURIComponent(noJadwal)}` },
        { label: "Rekap Evaluasi" },
      ]}
    >
      <div className="flex flex-col gap-4">
        <div>
          <Link
            href={`/input/${encodeURIComponent(noJadwal)}`}
            className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-700 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Kembali
          </Link>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-16" role="status" aria-label="Memuat rekap evaluasi">
            <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
          </div>
        )}

        {!isLoading && (error || !data) && (
          <div className={cardCls}>
            <p role="alert" className="text-sm text-red-700">
              {error ?? "Data rekap tidak ditemukan."}
            </p>
            {error && (
              <button type="button" className="mt-2 text-sm font-medium text-emerald-700 underline" onClick={refetch}>
                Coba lagi
              </button>
            )}
          </div>
        )}

        {!isLoading && !error && data && (
          <>
            <div className={cardCls}>
              <h1 className="text-base font-bold text-zinc-800">
                {data.jadwal.judulLengkap}
              </h1>
              <p className="text-xs text-zinc-400 mt-1">
                Tanggal: {formatTanggal(data.jadwal.tglMulai)}
                {data.jadwal.tglSelesai &&
                  data.jadwal.tglSelesai !== data.jadwal.tglMulai &&
                  ` - ${formatTanggal(data.jadwal.tglSelesai)}`}
              </p>
              <div className="flex items-center gap-1.5 mt-2 text-xs text-zinc-500">
                <Users className="w-3.5 h-3.5" />
                Jumlah Peserta Mengisi: {data.totalMengisi} /{" "}
                {data.totalPeserta}
              </div>
            </div>

            {/* Evaluasi Pelaksanaan Training */}
            <div className={cardCls}>
              <h2 className="text-sm font-bold text-zinc-800 mb-4">
                Evaluasi Pelaksanaan Training
              </h2>

              <div className="space-y-4">
                {PERTANYAAN_ITEMS.map((item) => (
                  <div key={item.key}>
                    <p className="text-xs text-zinc-600 mb-1.5">{item.label}</p>
                    <ScoreBar value={data.rataRata[item.key]} />
                  </div>
                ))}
              </div>
            </div>

            {/* Evaluasi Trainer */}
            <div className={cardCls}>
              <h2 className="text-sm font-bold text-zinc-800 mb-4">
                Evaluasi Trainer
              </h2>
              <ScoreBar value={data.rataRata.nilaiTrainer} />
            </div>

            {/* Komentar / Manfaat */}
            {(data.komentarManfaatPeserta.length > 0 ||
              data.komentarManfaatPerusahaan.length > 0) && (
              <div className={cardCls}>
                <div className="flex items-center gap-2 text-emerald-600 text-sm font-bold mb-4">
                  <MessageSquare className="w-4 h-4" />
                  Saran & Manfaat dari Peserta
                </div>

                {data.komentarManfaatPeserta.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-zinc-700 mb-2">
                      Manfaat untuk peserta
                    </p>
                    <ul className="space-y-2">
                      {data.komentarManfaatPeserta.map((teks, idx) => (
                        <li
                          key={idx}
                          className="text-xs text-zinc-600 bg-zinc-50 border border-zinc-100 rounded-xl px-3 py-2"
                        >
                          {teks}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {data.komentarManfaatPerusahaan.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-zinc-700 mb-2">
                      Manfaat untuk perusahaan
                    </p>
                    <ul className="space-y-2">
                      {data.komentarManfaatPerusahaan.map((teks, idx) => (
                        <li
                          key={idx}
                          className="text-xs text-zinc-600 bg-zinc-50 border border-zinc-100 rounded-xl px-3 py-2"
                        >
                          {teks}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
}
