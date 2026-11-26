"use client";
import PesertaLaporanContainer from "@/containers/peserta/laporan";

export default function PageContainer({ judul }: { judul?: string }) {
  return <PesertaLaporanContainer mode={judul?.includes("FIX") ? "fix" : "bulanan"} />;
}
