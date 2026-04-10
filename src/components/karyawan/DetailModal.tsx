interface PengajuanItem {
  id: number;
  tanggalPengajuan: string;
  nama: string;
  jabatan: string;
  divisi: string;
  jenisIzin: string;
  periodeAwal: string;
  periodeAkhir: string;
  alasan: string;
  lampiran: string | null;
}


interface DetailModalProps {
  item: PengajuanItem | null | any;
  onClose: () => void;
}

export function DetailModal({ item, onClose }: DetailModalProps) {
  if (!item) return null;
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
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Identitas Diri */}
          <div>
            <p className="text-xs font-bold text-emerald-500 mb-3">Identitas Diri</p>
            <div className="space-y-3">
              <div>
                <p className="text-[11px] text-zinc-400">Nama</p>
                <p className="text-xs font-semibold text-zinc-800">{item.nama}</p>
              </div>
              <div>
                <p className="text-[11px] text-zinc-400">Jabatan</p>
                <p className="text-xs font-semibold text-zinc-800">{item.jabatan}</p>
              </div>
              <div>
                <p className="text-[11px] text-zinc-400">Divisi</p>
                <p className="text-xs font-semibold text-zinc-800">{item.divisi}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-zinc-100" />

          {/* Detail Pengajuan */}
          <div>
            <p className="text-xs font-bold text-emerald-500 mb-3">Detail Pengajuan</p>
            <div className="space-y-3">
              <div>
                <p className="text-[11px] text-zinc-400">Jenis</p>
                <p className="text-xs font-semibold text-zinc-800">{item.jenisIzin}</p>
              </div>
              <div>
                <p className="text-[11px] text-zinc-400">Rentang Tanggal</p>
                <p className="text-xs font-semibold text-zinc-800">
                  {item.periodeAwal} – {item.periodeAkhir}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-zinc-400">Alasan</p>
                <p className="text-xs text-zinc-700 leading-relaxed">{item.alasan}</p>
              </div>
            </div>
          </div>

          {/* Informasi Tambahan */}
          {item.lampiran && (
            <>
              <div className="border-t border-zinc-100" />
              <div>
                <p className="text-xs font-bold text-emerald-500 mb-3">Informasi Tambahan</p>
                <div className="flex items-center justify-between border border-zinc-200 rounded-xl px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                    </div>
                    <p className="text-xs text-zinc-700 font-medium">{item.lampiran}</p>
                  </div>
                  <button className="text-emerald-500 hover:text-emerald-600 transition-colors">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-zinc-100">
          <button className="px-4 py-2 rounded-lg text-xs font-semibold border border-red-200 text-red-500 hover:bg-red-50 transition-colors">
            Tolak
          </button>
          <button className="px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition-colors">
            Terima
          </button>
        </div>
      </div>
    </div>
  );
}