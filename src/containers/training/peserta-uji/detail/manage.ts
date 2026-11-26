"use client";

/**
 * Keadaan halaman Detail Peserta Uji.
 *
 * Dua formulir terpisah di satu halaman: penetapan pelaksanaan (TUK,
 * asesor, tanggal) dan hasil uji (K/BK berikut nomor sertifikat). Keduanya
 * menyimpan ke endpoint berbeda, jadi keadaan menyimpannya juga terpisah.
 */
import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  assignPesertaUjiPelaksanaan,
  getPesertaUjiById,
  updatePesertaUjiHasil,
} from "@/lib/services/peserta-uji.service";
import { getAsesorList } from "@/lib/services/asesor.service";
import { getTUKList } from "@/lib/services/tuk.service";
import type { Asesor } from "@/lib/types/asesor";
import type { TUK } from "@/lib/types/tuk";
import type { PesertaUji } from "@/lib/types/peserta-uji";

/** Cukup banyak untuk mengisi dropdown tanpa paginasi. */
const BATAS_OPSI = 100;

interface Notif {
  message: string;
  type: "success" | "error";
  key: number;
}

/** ISO date jadi YYYY-MM-DD, satu-satunya format yang diterima input date. */
const keTanggalInput = (iso: string | null) => (iso ? iso.split("T")[0] : "");

export function usePesertaUjiDetailManage() {
  const params = useParams<{ id: string }>();
  const id = Number(params?.id);
  const idValid = Number.isInteger(id) && id > 0;

  const [peserta, setPeserta] = useState<PesertaUji | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notif, setNotif] = useState<Notif | null>(null);

  const [tukOptions, setTukOptions] = useState<TUK[]>([]);
  const [asesorOptions, setAsesorOptions] = useState<Asesor[]>([]);

  // Formulir penetapan pelaksanaan
  const [tukId, setTukId] = useState("");
  const [asesorId, setAsesorId] = useState("");
  const [tglUji, setTglUji] = useState("");
  const [assignSaving, setAssignSaving] = useState(false);

  // Formulir hasil uji
  const [statusHasil, setStatusHasil] = useState<"K" | "BK" | "">("");
  const [noReg, setNoReg] = useState("");
  const [noSerBNSP, setNoSerBNSP] = useState("");
  const [tglTerbit, setTglTerbit] = useState("");
  const [hasilSaving, setHasilSaving] = useState(false);

  const showNotif = (message: string, type: Notif["type"]) =>
    setNotif({ message, type, key: Date.now() });

  /** Isi kedua formulir dari data peserta yang baru diterima. */
  const isiFormulir = useCallback((data: PesertaUji) => {
    setTukId(data.tukId ? String(data.tukId) : "");
    setAsesorId(data.asesorId ? String(data.asesorId) : "");
    setTglUji(keTanggalInput(data.tglUji));
    setStatusHasil((data.statusHasil as "K" | "BK") ?? "");
    setNoReg(data.noReg ?? "");
    setNoSerBNSP(data.noSerBNSP ?? "");
    setTglTerbit(keTanggalInput(data.tglTerbit));
  }, []);

  const muat = useCallback(async () => {
    if (!idValid) {
      setError("ID peserta uji tidak valid.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await getPesertaUjiById(id);
      setPeserta(data);
      isiFormulir(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal mengambil data peserta",
      );
    } finally {
      setLoading(false);
    }
  }, [id, idValid, isiFormulir]);

  useEffect(() => {
    muat();
  }, [muat]);

  useEffect(() => {
    let batal = false;

    getTUKList({ limit: BATAS_OPSI })
      .then((res) => {
        if (!batal) setTukOptions(res.data);
      })
      // Dropdown kosong lebih baik daripada halaman gagal dimuat.
      .catch(() => {
        if (!batal) setTukOptions([]);
      });

    getAsesorList({ limit: BATAS_OPSI })
      .then((res) => {
        if (!batal) setAsesorOptions(res.data);
      })
      .catch(() => {
        if (!batal) setAsesorOptions([]);
      });

    return () => {
      batal = true;
    };
  }, []);

  const simpanAssign = async () => {
    setAssignSaving(true);
    try {
      const updated = await assignPesertaUjiPelaksanaan(id, {
        tukId: tukId ? Number(tukId) : "",
        asesorId: asesorId ? Number(asesorId) : "",
        tglUji: tglUji || undefined,
      });
      setPeserta(updated);
      // Dulu hanya formulir hasil yang diisi ulang setelah simpan, jadi
      // kalau backend menormalkan nilainya, tampilan formulir penetapan
      // bisa berbeda dari data yang benar-benar tersimpan.
      isiFormulir(updated);
      showNotif("Pelaksanaan uji berhasil disimpan", "success");
    } catch (err) {
      showNotif(
        err instanceof Error ? err.message : "Gagal menyimpan pelaksanaan uji",
        "error",
      );
    } finally {
      setAssignSaving(false);
    }
  };

  const simpanHasil = async () => {
    if (!statusHasil) {
      showNotif("Pilih hasil ujian dulu.", "error");
      return;
    }
    setHasilSaving(true);
    try {
      const updated = await updatePesertaUjiHasil(id, {
        statusHasil,
        noReg: noReg || undefined,
        // Nomor sertifikat dan tanggal terbit hanya berlaku kalau Kompeten.
        noSerBNSP: statusHasil === "K" ? noSerBNSP : undefined,
        tglTerbit: statusHasil === "K" ? tglTerbit : undefined,
      });
      setPeserta(updated);
      isiFormulir(updated);
      showNotif("Hasil uji berhasil disimpan", "success");
    } catch (err) {
      showNotif(
        err instanceof Error ? err.message : "Gagal menyimpan hasil uji",
        "error",
      );
    } finally {
      setHasilSaving(false);
    }
  };

  return {
    peserta,
    loading,
    error,
    notif,
    clearNotif: () => setNotif(null),
    tukOptions,
    asesorOptions,
    assign: {
      tukId,
      setTukId,
      asesorId,
      setAsesorId,
      tglUji,
      setTglUji,
      saving: assignSaving,
      simpan: simpanAssign,
    },
    hasil: {
      statusHasil,
      setStatusHasil,
      noReg,
      setNoReg,
      noSerBNSP,
      setNoSerBNSP,
      tglTerbit,
      setTglTerbit,
      saving: hasilSaving,
      simpan: simpanHasil,
    },
  };
}
