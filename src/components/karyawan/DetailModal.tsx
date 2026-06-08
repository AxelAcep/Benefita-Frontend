// DetailModal.tsx
import { useEffect, useState } from "react";
import { useGetDetailPengajuan } from "@/hooks/use-cuti";
import type { RiwayatIzinItem } from "@/lib/services/cuti.service";

interface DetailModalProps {
  item: RiwayatIzinItem | null;
  onClose: () => void;
  isView?: boolean;
  onTerima?: (id: string) => void;
  onTolak?: (id: string, alasanTolak: string) => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;
function toFullUrl(path: string) {
  return `${API_URL}/${path.replace(/^\/+/, "")}`;
}

const statusStyle: Record<string, string> = {
  DISETUJUI: "bg-emerald-100 text-emerald-600",
  PENDING: "bg-yellow-100 text-yellow-600",
  DITOLAK: "bg-red-100 text-red-500",
};

const statusLabel: Record<string, string> = {
  DISETUJUI: "Disetujui",
  PENDING: "Menunggu",
  DITOLAK: "Ditolak",
};

const jenisLabel: Record<string, string> = {
  CUTI: "Cuti",
  SAKIT: "Sakit",
  IZIN: "Izin",
};

function formatDate(dateStr: string | null) {
  if (!dateStr) return "–";
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function DetailModal({
  item,
  onClose,
  isView = false,
  onTerima,
  onTolak,
}: DetailModalProps) {
  const { fetch, data: detail, loading } = useGetDetailPengajuan();
  const [alasanTolak, setAlasanTolak] = useState("");

  useEffect(() => {
    if (item?.id) {
      fetch(item.id);
      setAlasanTolak("");
    }
  }, [item?.id]);

  if (!item) return null;

  const handleTolak = () => {
    if (!alasanTolak.trim()) return;
    onTolak?.(item.id, alasanTolak.trim());
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.35)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
          <p className="font-bold text-zinc-800 text-sm">Detail Pengajuan</p>
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-zinc-100 transition-colors text-zinc-400 hover:text-zinc-600"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Status Badge */}
          <div className="flex items-center justify-between">
            <span
              className={`px-2.5 py-1 rounded-full text-[10px] font-medium ${statusStyle[item.status]}`}
            >
              {statusLabel[item.status] ?? item.status}
            </span>
            <span className="text-[11px] text-zinc-400">
              Diajukan: {formatDate(item.createdAt)}
            </span>
          </div>

          {/* Identitas Diri */}
          {item.pegawai && (
            <>
              <div>
                <p className="text-xs font-bold text-emerald-500 mb-3">
                  Identitas Diri
                </p>
                <div className="space-y-3">
                  <div>
                    <p className="text-[11px] text-zinc-400">Nama</p>
                    <p className="text-xs font-semibold text-zinc-800">
                      {item.pegawai.nama}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-zinc-400">Jabatan</p>
                    <p className="text-xs font-semibold text-zinc-800">
                      {item.pegawai.jabatan ?? "–"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-zinc-400">Departemen</p>
                    <p className="text-xs font-semibold text-zinc-800">
                      {item.pegawai.departemen ?? "–"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="border-t border-zinc-100" />
            </>
          )}

          {/* Detail Pengajuan */}
          <div>
            <p className="text-xs font-bold text-emerald-500 mb-3">
              Detail Pengajuan
            </p>
            <div className="space-y-3">
              <div>
                <p className="text-[11px] text-zinc-400">Jenis</p>
                <p className="text-xs font-semibold text-zinc-800">
                  {jenisLabel[item.jenisIzin] ?? item.jenisIzin}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-zinc-400">Rentang Tanggal</p>
                <p className="text-xs font-semibold text-zinc-800">
                  {formatDate(item.tanggalMulai)} –{" "}
                  {formatDate(item.tanggalSelesai)}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-zinc-400">Alasan</p>
                <p className="text-xs text-zinc-700 leading-relaxed">
                  {item.alasan}
                </p>
              </div>
              {item.tanggalKonfirmasi && (
                <div>
                  <p className="text-[11px] text-zinc-400">Tanggal Diproses</p>
                  <p className="text-xs font-semibold text-zinc-800">
                    {formatDate(item.tanggalKonfirmasi)}
                  </p>
                </div>
              )}
              {item.status === "DITOLAK" && item.alasanTolak && (
                <div>
                  <p className="text-[11px] text-zinc-400">Alasan Ditolak</p>
                  <p className="text-xs text-red-500 leading-relaxed">
                    {item.alasanTolak}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Lampiran */}
          <div className="border-t border-zinc-100" />
          <div>
            <p className="text-xs font-bold text-emerald-500 mb-3">Lampiran</p>
            {loading ? (
              <p className="text-xs text-zinc-400">Memuat lampiran...</p>
            ) : detail?.bukti && detail.bukti.length > 0 ? (
              <div className="space-y-2">
                {detail.bukti.map((b) => (
                  <div
                    key={b.id}
                    className="flex items-center justify-between border border-zinc-200 rounded-xl px-4 py-3"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="2"
                        >
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                        </svg>
                      </div>
                      <p className="text-xs text-zinc-700 font-medium">
                        {b.nama}
                      </p>
                    </div>
                    <a
                      href={toFullUrl(b.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-500 hover:text-emerald-600 transition-colors"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-zinc-300">Tidak ada lampiran</p>
            )}
          </div>

          {/* Alasan Tolak Input */}
          {!isView && (
            <>
              <div className="border-t border-zinc-100" />
              <div>
                <p className="text-xs font-bold text-red-400 mb-2">
                  Alasan Penolakan
                </p>
                <textarea
                  value={alasanTolak}
                  onChange={(e) => setAlasanTolak(e.target.value)}
                  placeholder="Tulis alasan penolakan di sini..."
                  rows={3}
                  className="w-full border border-zinc-200 rounded-xl px-3 py-2.5 text-xs text-zinc-700 outline-none focus:border-red-300 resize-none placeholder:text-zinc-300"
                />
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        {!isView && (
          <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-zinc-100">
            <button
              onClick={handleTolak}
              disabled={!alasanTolak.trim()}
              className="px-4 py-2 rounded-lg text-xs font-semibold border border-red-200 text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Tolak
            </button>
            <button
              onClick={() => onTerima?.(item.id)}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition-colors"
            >
              Terima
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
