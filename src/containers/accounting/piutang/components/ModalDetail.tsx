"use client";

import { useState, useEffect } from "react";
import {
  getDetailPiutang,
  DetailPiutangResponse,
} from "@/lib/services/accounting.service";

interface ModalDetailPiutangProps {
  isOpen: boolean;
  onClose: () => void;
  noJadwal: string | null;
}

export default function ModalDetailPiutang({
  isOpen,
  onClose,
  noJadwal,
}: ModalDetailPiutangProps) {
  const [data, setData] = useState<DetailPiutangResponse["data"] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && noJadwal) {
      const fetchDetail = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await getDetailPiutang(noJadwal);
          setData(response.data);
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "Gagal mengambil detail",
          );
        } finally {
          setLoading(false);
        }
      };
      fetchDetail();
    }
  }, [isOpen, noJadwal]);

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(num);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
          <h3 className="text-base font-bold text-zinc-800">Detail Piutang</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-zinc-100 transition-colors"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {loading && (
            <div className="text-center py-8 text-zinc-500">Loading...</div>
          )}
          {error && (
            <div className="text-center py-8 text-red-500">{error}</div>
          )}
          {data && (
            <>
              <div className="mb-4 pb-4 border-b border-zinc-100">
                <p className="text-sm text-zinc-500">
                  <span className="font-semibold text-zinc-700">
                    Kode Jadwal:
                  </span>{" "}
                  {data.kodeJadwal}
                </p>
                <p className="text-sm text-zinc-500">
                  <span className="font-semibold text-zinc-700">Judul:</span>{" "}
                  {data.judulLengkap}
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-zinc-100">
                      <th className="px-3 py-2 text-left text-xs font-semibold text-zinc-400">
                        No
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-zinc-400">
                        Nama Peserta
                      </th>
                      <th className="px-3 py-2 text-right text-xs font-semibold text-zinc-400">
                        Total Bayar
                      </th>
                      <th className="px-3 py-2 text-right text-xs font-semibold text-zinc-400">
                        Bayar
                      </th>
                      <th className="px-3 py-2 text-right text-xs font-semibold text-zinc-400">
                        Kurang Bayar
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.peserta
                      .sort((a, b) => b.kurang - a.kurang)
                      .map((p, i) => (
                        <tr
                          key={i}
                          className="border-b border-zinc-50 hover:bg-zinc-50 transition-colors"
                        >
                          <td className="px-3 py-2 text-xs text-zinc-500">
                            {i + 1}
                          </td>
                          <td className="px-3 py-2 text-xs text-zinc-700">
                            {p.nama}
                          </td>
                          <td className="px-3 py-2 text-xs text-zinc-700 text-right">
                            {formatRupiah(p.hargaTotal)}
                          </td>
                          <td className="px-3 py-2 text-xs text-zinc-700 text-right">
                            {formatRupiah(p.bayar)}
                          </td>
                          <td
                            className={`px-3 py-2 text-xs font-semibold text-right ${
                              p.kurang > 0 ? "text-red-500" : "text-emerald-500"
                            }`}
                          >
                            {formatRupiah(p.kurang)}
                          </td>
                        </tr>
                      ))}
                    {data.peserta.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-3 py-8 text-center text-xs text-zinc-400"
                        >
                          Tidak ada peserta
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-zinc-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-zinc-700 bg-zinc-100 rounded-lg hover:bg-zinc-200 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
