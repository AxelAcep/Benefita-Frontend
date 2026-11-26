"use client";

/**
 * Pop-up pengingat di dashboard.
 *
 * Muncul setiap kali dashboard dibuka selama pegawai yang login masih
 * punya tugas berjalan — itu permintaannya: pengingat, bukan notifikasi
 * sekali lihat. Yang disimpan di sessionStorage hanya penutupan dalam tab
 * yang sama, supaya berpindah halaman lalu kembali tidak memunculkannya
 * berulang kali dalam satu sesi kerja.
 *
 * Isi pengingat datang dari /api/bdo/pengingat, yang sudah dibatasi ke
 * pegawai yang login di sisi server.
 */
import { useEffect, useState } from "react";
import Link from "next/link";
import { AlarmClock, ArrowRight } from "lucide-react";
import { BaseModal } from "@/components/base/base-modal";
import { getPengingat } from "@/lib/services/bdo.service";
import type { Pengingat } from "@/lib/types/bdo";

const KUNCI_SESI = "pengingat-bdo-ditutup";

const formatTanggal = new Intl.DateTimeFormat("id-ID", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "Asia/Jakarta",
});

/** Selisih hari tenggat terhadap hari ini, negatif berarti lewat. */
function sisaHari(dueDate: string | null) {
  if (!dueDate) return null;
  const batas = new Date(dueDate);
  if (Number.isNaN(batas.getTime())) return null;
  return Math.ceil((batas.getTime() - Date.now()) / 86400000);
}

function LabelTenggat({ dueDate }: { dueDate: string | null }) {
  const sisa = sisaHari(dueDate);
  if (sisa === null) return <span className="text-zinc-400">Tanpa tenggat</span>;

  if (sisa < 0) {
    return (
      <span className="font-semibold text-red-600">
        Lewat {Math.abs(sisa)} hari
      </span>
    );
  }
  if (sisa === 0) return <span className="font-semibold text-red-600">Hari ini</span>;
  if (sisa <= 3) {
    return <span className="font-semibold text-amber-600">{sisa} hari lagi</span>;
  }
  return <span className="text-zinc-500">{formatTanggal.format(new Date(dueDate!))}</span>;
}

export default function PengingatModal() {
  const [data, setData] = useState<Pengingat | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let batal = false;

    // Gagal mengambil pengingat tidak boleh mengganggu dashboard, jadi
    // error-nya sengaja ditelan.
    getPengingat()
      .then((res) => {
        if (batal || res.total === 0) return;
        setData(res);

        let sudahDitutup = false;
        try {
          sudahDitutup = sessionStorage.getItem(KUNCI_SESI) === "1";
        } catch {
          // Mode privat atau penyimpanan diblokir: tampilkan saja.
        }
        if (!sudahDitutup) setOpen(true);
      })
      .catch(() => {});

    return () => {
      batal = true;
    };
  }, []);

  function tutup() {
    setOpen(false);
    try {
      sessionStorage.setItem(KUNCI_SESI, "1");
    } catch {
      // Tidak bisa diingat: pengingat muncul lagi di halaman berikutnya.
    }
  }

  if (!data || data.total === 0) return null;

  const { tugas, asap } = data;

  return (
    <BaseModal
      open={open}
      onClose={tutup}
      ukuran="lg"
      judul={
        <span className="flex items-center gap-2">
          <AlarmClock className="h-5 w-5 text-amber-500" />
          Pengingat
        </span>
      }
      deskripsi={`${data.total} pekerjaan Anda masih berjalan.`}
      footer={
        <div className="flex items-center justify-between gap-3">
          <Link
            href="/bdo/tugas"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700"
          >
            Buka daftar tugas
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <button
            type="button"
            onClick={tutup}
            className="rounded-lg bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-700"
          >
            Mengerti
          </button>
        </div>
      }
    >
      <div className="max-h-[55vh] space-y-5 overflow-y-auto pr-1">
        {tugas.length > 0 ? (
          <section>
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-zinc-400">
              Tugas berjalan ({tugas.length})
            </h3>
            <ul className="space-y-2">
              {tugas.map((t) => (
                <li
                  key={t.id}
                  className="rounded-xl border border-zinc-200 px-3 py-2.5"
                >
                  <p className="text-sm font-medium text-zinc-800">{t.kegiatan}</p>
                  <p className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs">
                    <LabelTenggat dueDate={t.dueDate} />
                    <span className="text-zinc-400">
                      PIC {t.pic?.nama ?? t.picNama ?? "-"}
                    </span>
                    {t.penerima?.nama ?? t.penerimaNama ? (
                      <span className="text-zinc-400">
                        Lapor ke {t.penerima?.nama ?? t.penerimaNama}
                      </span>
                    ) : null}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {asap.length > 0 ? (
          <section>
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-zinc-400">
              ASAP menunggu ditindaklanjuti ({asap.length})
            </h3>
            <ul className="space-y-2">
              {asap.map((a) => (
                <li
                  key={a.id}
                  className="rounded-xl border border-zinc-200 px-3 py-2.5"
                >
                  <p className="text-sm font-medium text-zinc-800">{a.saran}</p>
                  <p className="mt-1 flex flex-wrap gap-x-3 text-xs text-zinc-400">
                    <span>
                      {a.perusahaan?.company ?? a.perusahaanId ?? "Tanpa perusahaan"}
                    </span>
                    <span>{formatTanggal.format(new Date(a.tanggal))}</span>
                    {a.kategori ? <span>{a.kategori}</span> : null}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </BaseModal>
  );
}
