"use client";

import { useEffect, useMemo, useState } from "react";
import { useBoolean } from "@/hooks/use-boolean";
import { getAkunList, type AkunItem } from "@/lib/services/accounting.service";
import {
  previewImportJurnal,
  commitImportJurnal,
  type ImportJurnalRow,
  type ImportJurnalRingkasan,
} from "@/lib/services/jurnal-keuangan.service";

export type ImportJurnalFilter = "SEMUA" | "PERLU_DILENGKAPI" | "SIAP";

export function useImportJurnalManage() {
  const [file, setFile] = useState<File | null>(null);
  const [rows, setRows] = useState<ImportJurnalRow[]>([]);
  const [ringkasan, setRingkasan] = useState<ImportJurnalRingkasan | null>(null);
  const [akunList, setAkunList] = useState<AkunItem[]>([]);
  const [filter, setFilter] = useState<ImportJurnalFilter>("SEMUA");
  const [halaman, setHalaman] = useState(1);
  const { value: memproses, onTrue: prosesMulai, onFalse: prosesSelesai } = useBoolean(false);
  const [progres, setProgres] = useState<{ terkirim: number; total: number } | null>(null);
  const [notif, setNotif] = useState<{ message: string; type: "success" | "error"; key: number } | null>(null);
  const perHalaman = 100;

  useEffect(() => {
    let batal = false;
    getAkunList({ page: 1, limit: 500, isActive: true })
      .then((response) => {
        if (!batal) setAkunList(response.data);
      })
      .catch(() => {
        if (!batal) {
          setNotif({ message: "Gagal memuat daftar akun", type: "error", key: Date.now() });
        }
      });
    return () => {
      batal = true;
    };
  }, []);

  const perluDilengkapi = useMemo(() => rows.filter((row) => row.anomali).length, [rows]);
  const siap = rows.length - perluDilengkapi;
  const terfilter = useMemo(() => {
    if (filter === "PERLU_DILENGKAPI") return rows.filter((row) => row.anomali);
    if (filter === "SIAP") return rows.filter((row) => !row.anomali);
    return rows;
  }, [rows, filter]);
  const terlihat = terfilter.slice((halaman - 1) * perHalaman, halaman * perHalaman);
  const totalHalaman = Math.max(1, Math.ceil(terfilter.length / perHalaman));
  const belumMasuk = rows.filter((row) => !row.anomali && !row.sudahDiimport).length;

  function ubahAkun(id: number, sisi: "akunDebit" | "akunKredit", kode: string | null) {
    setRows((previous) =>
      previous.map((row) => {
        if (row.id !== id) return row;
        const next = { ...row, [sisi]: kode };
        next.anomali = !next.akunDebit || !next.akunKredit;
        return next;
      }),
    );
  }

  async function onPreview() {
    if (!file) return;
    prosesMulai();
    try {
      const response = await previewImportJurnal(file);
      setRows(response.data.rows);
      setRingkasan(response.data.ringkasan);
      setHalaman(1);
      setFilter(response.data.ringkasan.anomali > 0 ? "PERLU_DILENGKAPI" : "SEMUA");
    } catch (error) {
      setNotif({
        message: error instanceof Error ? error.message : "Gagal membaca file",
        type: "error",
        key: Date.now(),
      });
    } finally {
      prosesSelesai();
    }
  }

  async function onImport() {
    const siapKirim = rows.filter((row) => !row.anomali && !row.sudahDiimport);
    if (!siapKirim.length) return;
    prosesMulai();
    setProgres({ terkirim: 0, total: siapKirim.length });
    try {
      const response = await commitImportJurnal(siapKirim, (terkirim, total) =>
        setProgres({ terkirim, total }),
      );
      setNotif({
        message: `${response.message}. Dilewati: ${response.data.dilewati}.`,
        type: "success",
        key: Date.now(),
      });
      const masuk = new Set(siapKirim.map((row) => row.noJurnal));
      setRows((previous) =>
        previous.map((row) => (masuk.has(row.noJurnal) ? { ...row, sudahDiimport: true } : row)),
      );
    } catch (error) {
      setNotif({
        message: error instanceof Error ? error.message : "Gagal menyimpan import",
        type: "error",
        key: Date.now(),
      });
    } finally {
      prosesSelesai();
      setProgres(null);
    }
  }

  return {
    file,
    setFile,
    rows,
    ringkasan,
    akunList,
    filter,
    setFilter,
    halaman,
    setHalaman,
    memproses,
    progres,
    notif,
    setNotif,
    perluDilengkapi,
    siap,
    terfilter,
    terlihat,
    totalHalaman,
    belumMasuk,
    ubahAkun,
    onPreview,
    onImport,
  };
}
