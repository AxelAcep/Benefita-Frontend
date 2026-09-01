"use client";

import React from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Loader2, ClipboardList, ClipboardCheck } from "lucide-react";
import { useJadwalPesertaLinks } from "@/hooks/use-informas-link";

const cardCls = "bg-white border border-zinc-200 rounded-2xl p-6 space-y-4";
const sectionTitleCls =
  "flex items-center gap-2 text-emerald-600 text-sm font-bold";

function formatTanggal(dateStr: string | null): string {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function PengumumanLinkPage() {
  const params = useParams();
  const noJadwal = params.noJadwal as string;

  const { data, isLoading, error } = useJadwalPesertaLinks({ noJadwal });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4">
        <p className="text-sm text-red-500 text-center">
          {error ?? "Jadwal training tidak ditemukan"}
        </p>
      </div>
    );
  }

  const origin = typeof window !== "undefined" ? window.location.origin : "";

  return (
    <div className="min-h-screen bg-zinc-50 py-10 px-4 flex flex-col">
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
          <h1 className="text-base font-bold text-zinc-800">
            Link Pengisian Data Peserta Training secara Online
          </h1>
          <p className="text-sm text-zinc-600 mt-2">
            Judul Pelatihan: {data.jadwal.judulLengkap}
          </p>
          <p className="text-xs text-zinc-400 mt-0.5">
            {data.jadwal.metode ?? "-"} / {formatTanggal(data.jadwal.tglMulai)}
          </p>
        </div>

        {/* DATA PESERTA */}
        <div className={cardCls}>
          <div className={sectionTitleCls}>
            <ClipboardList className="w-4 h-4" />
            DATA PESERTA
          </div>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Terlampir link Data Peserta, mohon link tersebut diisi dengan
            lengkap dan benar, karena data tersebut nantinya untuk pembuatan
            Sertifikat Pelatihan. Silahkan klik link sesuai nama masing-masing,
            setelah diisi lengkap lalu di SIMPAN. Terimakasih atas perhatian dan
            kerjasamanya yang baik 🙏
          </p>

          <ol className="space-y-2.5">
            {data.peserta.map((p, idx) => (
              <li key={p.id} className="text-xs">
                <p className="font-semibold text-zinc-700">
                  {idx + 1}. {p.nama}
                </p>
                <a
                  href={`${origin}/biodata/${p.id}`}
                  className="text-emerald-600 hover:text-emerald-700 underline break-all"
                >
                  {origin}/biodata/{p.id}
                </a>
              </li>
            ))}
          </ol>
        </div>

        {/* EVALUASI */}
        <div className={`${cardCls} mt-4`}>
          <div className={sectionTitleCls}>
            <ClipboardCheck className="w-4 h-4" />
            EVALUASI
          </div>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Terlampir link evaluasi peserta, setelah selesai training ini mohon
            link tersebut diisi, karena data tersebut untuk laporan ke kantor
            kami. Silahkan klik link sesuai nama masing-masing, setelah diisi
            lalu di SIMPAN. Terimakasih atas perhatian, bantuan dan kerjasamanya
            yang baik 🙏☺️
          </p>

          <ol className="space-y-2.5">
            {data.peserta.map((p, idx) => (
              <li key={p.id} className="text-xs">
                <p className="font-semibold text-zinc-700">
                  {idx + 1}. {p.nama}
                </p>
                <a
                  href={`${origin}/evaluasi/${p.id}`}
                  className="text-emerald-600 hover:text-emerald-700 underline break-all"
                >
                  {origin}/evaluasi/{p.id}
                </a>
              </li>
            ))}
          </ol>
        </div>
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
