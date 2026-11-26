"use client";

import { useEffect, useState } from "react";
import { useResource } from "@/hooks/use-resource";
import {
  createJadwalTraining,
  deleteJadwalTraining,
  getJadwalTrainingById,
  getJadwalTraining,
  getNextNoJadwal,
  getOpsiJadwal,
  updateJadwalTraining,
} from "@/lib/services/jadwal-training.service";
import type {
  CreateJadwalTrainingRequest,
  JadwalTraining,
  JadwalTrainingListItem,
  OpsiJadwal,
  UpdateJadwalTrainingRequest,
} from "@/lib/types/jadwal-training";

/**
 * Service untuk useResource.
 *
 * Perlu dibentuk di sini, bukan diambil dari file service, karena endpoint
 * ubah dan hapus memakai noJadwal sebagai kunci sementara useResource
 * memanggilnya dengan satu identitas baris.
 */
const jadwalService = {
  list: getJadwalTraining,
  create: createJadwalTraining,
  update: updateJadwalTraining,
  remove: deleteJadwalTraining,
};

/** List + paginasi + search + filter status, jenis, dan metode. */
export function useJadwalTrainingList(limit = 10) {
  return useResource<
    JadwalTrainingListItem,
    string,
    CreateJadwalTrainingRequest,
    UpdateJadwalTrainingRequest,
    JadwalTraining
  >(jadwalService, {
    limit,
    filter: { status: "", jenisTraining: "", metode: "" },
    pesanGagal: "Gagal mengambil data jadwal training",
  });
}

/** Detail satu jadwal, untuk mengisi formulir saat mode ubah. */
export function useJadwalTrainingDetail(id: string | null) {
  const [data, setData] = useState<JadwalTraining | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setData(null);
      setError(null);
      return;
    }

    let batal = false;
    setLoading(true);
    setError(null);

    getJadwalTrainingById(id)
      .then((res) => {
        if (!batal) setData(res);
      })
      .catch((err: unknown) => {
        if (batal) return;
        setError(
          err instanceof Error ? err.message : "Gagal mengambil detail jadwal",
        );
      })
      .finally(() => {
        if (!batal) setLoading(false);
      });

    return () => {
      batal = true;
    };
  }, [id]);

  return { data, loading, error };
}

/**
 * Nomor jadwal berikutnya. Hanya diambil saat membuat jadwal baru —
 * saat mengubah, nomornya sudah ada dan tidak boleh diganti.
 */
export function useNextNoJadwal(aktif: boolean) {
  const [noJadwal, setNoJadwal] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!aktif) return;

    let batal = false;
    setLoading(true);
    setError(null);

    getNextNoJadwal()
      .then((res) => {
        if (!batal) setNoJadwal(res.noJadwal);
      })
      .catch((err: unknown) => {
        if (batal) return;
        setError(
          err instanceof Error ? err.message : "Gagal mengambil nomor jadwal",
        );
      })
      .finally(() => {
        if (!batal) setLoading(false);
      });

    return () => {
      batal = true;
    };
  }, [aktif]);

  return { noJadwal, loading, error };
}

/**
 * Opsi status, metode, dan jenis training dari database.
 *
 * Sebelumnya tiap halaman memaku daftarnya sendiri, dan daftar status-nya
 * salah: "TENTATIVE" dan "SELESAI", padahal yang tersimpan "TENTATIF",
 * "TERKONFIRMASI", dan "BATAL".
 */
export function useOpsiJadwal() {
  const [opsi, setOpsi] = useState<OpsiJadwal>({
    status: [],
    metode: [],
    jenisTraining: [],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let batal = false;
    setLoading(true);

    getOpsiJadwal()
      .then((res) => {
        if (!batal) setOpsi(res);
      })
      // Dropdown kosong lebih baik daripada halaman gagal dimuat.
      .catch(() => {})
      .finally(() => {
        if (!batal) setLoading(false);
      });

    return () => {
      batal = true;
    };
  }, []);

  return { opsi, loading };
}
