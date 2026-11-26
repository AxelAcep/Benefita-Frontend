"use client";

import AppLayout from "@/components/app-layout";
import ModalResi from "./components/modal-resi";
import TablePagination from "@/components/base/table-pagination";
import { usePesertaDataUjiManage } from "./manage";

function InvBadge({ status }: { status: string }) {
  if (status === "Lunas")
    return (
      <span className="text-xs font-semibold text-emerald-600">{status}</span>
    );
  return <span className="text-xs text-zinc-500">{status}</span>;
}

export default function PesertaDataUjiContainer() {
  const {
    PAGE_SIZE,
    activeTab,
    setActiveTab,
    searchPeserta,
    namaCari,
    setNamaCari,
    instansiCari,
    setInstansiCari,
    tglUjiCari,
    setTglUjiCari,
    currentPagePeserta,
    setCurrentPagePeserta,
    searchPengiriman,
    currentPagePengiriman,
    setCurrentPagePengiriman,
    modalOpen,
    modalMode,
    modalData,
    openModal,
    totalPagesPeserta,
    paginatedPeserta,
    totalPagesPengiriman,
    paginatedPengiriman,
    totalPeserta,
    totalPengiriman,
    changeSearchPeserta,
    changeSearchPengiriman,
    applyPesertaFilter,
    closeModal,
  } = usePesertaDataUjiManage();

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Peserta" },
        { label: "Data Peserta Uji (LSP)" },
      ]}
    >
      <ModalResi
        isOpen={modalOpen}
        onClose={closeModal}
        mode={modalMode}
        data={modalData}
      />

      {/* Tabs */}
      <div className="flex border-b border-zinc-200 mb-5">
        <button
          onClick={() => setActiveTab("peserta")}
          className={`px-4 py-2.5 text-xs font-semibold transition-colors border-b-2 -mb-px ${
            activeTab === "peserta"
              ? "border-emerald-500 text-emerald-600"
              : "border-transparent text-zinc-500 hover:text-zinc-700"
          }`}
        >
          Data Peserta Uji (LSP)
        </button>
        <button
          onClick={() => setActiveTab("pengiriman")}
          className={`px-4 py-2.5 text-xs font-semibold transition-colors border-b-2 -mb-px ${
            activeTab === "pengiriman"
              ? "border-emerald-500 text-emerald-600"
              : "border-transparent text-zinc-500 hover:text-zinc-700"
          }`}
        >
          Data Pengiriman Dokumen
        </button>
      </div>

      {/* Tab: Data Peserta Uji */}
      {activeTab === "peserta" && (
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
          {/* Toolbar */}
          <div className="px-5 py-4 border-b border-zinc-100 flex flex-wrap items-center gap-3 justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-zinc-500">Nama</span>
              <input
                type="text"
                placeholder="Cari nama..."
                value={namaCari}
                onChange={(e) => setNamaCari(e.target.value)}
                className="border border-zinc-200 rounded-lg px-2.5 py-1.5 text-xs text-zinc-700 outline-none focus:border-emerald-300 w-32"
              />
              <span className="text-xs text-zinc-500">Instansi</span>
              <input
                type="text"
                placeholder="Cari instansi..."
                value={instansiCari}
                onChange={(e) => setInstansiCari(e.target.value)}
                className="border border-zinc-200 rounded-lg px-2.5 py-1.5 text-xs text-zinc-700 outline-none focus:border-emerald-300 w-32"
              />
              <span className="text-xs text-zinc-500">Tgl Uji</span>
              <div className="relative">
                <input
                  type="text"
                  value={tglUjiCari}
                  onChange={(e) => setTglUjiCari(e.target.value)}
                  className="border border-zinc-200 rounded-lg px-2.5 py-1.5 pr-7 text-xs text-zinc-700 outline-none focus:border-emerald-300 w-24"
                />
                <svg
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <button
                onClick={applyPesertaFilter}
                className="px-3 py-1.5 text-xs bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors"
              >
                Terapkan
              </button>
            </div>
            <div className="relative">
              <svg
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-300"
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Cari informasi..."
                value={searchPeserta}
                onChange={(e) => changeSearchPeserta(e.target.value)}
                className="w-52 pl-7 pr-3 py-1.5 border border-zinc-200 rounded-lg text-xs text-zinc-700 outline-none focus:border-emerald-300 transition-all"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full" style={{ minWidth: "1200px" }}>
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50/60">
                  <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-10">
                    No ↕
                  </th>
                  <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-28">
                    Nama
                  </th>
                  <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-32">
                    Perusahaan/Instansi
                  </th>
                  <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-20">
                    Kode
                  </th>
                  <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-24">
                    Tgl. Pel
                  </th>
                  <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-center w-24">
                    INV
                  </th>
                  <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-24">
                    Tgl. Uji
                  </th>
                  <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-20">
                    Metode
                  </th>
                  <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-28">
                    LSP
                  </th>
                  <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-center w-24">
                    INV
                  </th>
                  <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-center w-20">
                    Sertifikat
                  </th>
                  <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-24">
                    Tgl. Kirim
                  </th>
                  <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-36">
                    No. Resi
                  </th>
                  <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-24">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedPeserta.length === 0 ? (
                  <tr>
                    <td
                      colSpan={14}
                      className="px-4 py-12 text-center text-xs text-zinc-400"
                    >
                      Tidak ada data tersedia.
                    </td>
                  </tr>
                ) : (
                  paginatedPeserta.map((row, i) => (
                    <tr
                      key={row.id}
                      className="border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors"
                    >
                      <td className="px-4 py-3 text-xs text-zinc-400">
                        {(currentPagePeserta - 1) * PAGE_SIZE + i + 1}
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-700">
                        {row.nama}
                      </td>
                      <td className="px-4 py-3 text-xs text-emerald-600 font-semibold cursor-pointer hover:underline">
                        {row.perusahaan}
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-600">
                        {row.kode}
                      </td>
                      <td className="px-4 py-3 text-xs text-emerald-600 cursor-pointer hover:underline">
                        {row.tglPel}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <InvBadge status={row.invPeserta} />
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-600">
                        {row.tglUji}
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-600">
                        {row.metode}
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-600">
                        {row.lsp}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <InvBadge status={row.invLSP} />
                      </td>
                      <td className="px-4 py-3 text-xs text-center text-zinc-500">
                        {row.sertifikat ?? "-"}
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-500">
                        {row.tglKirim ?? "-"}
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-500">
                        {row.noResi ? (
                          <span>
                            {row.noResi.includes("/") ? row.noResi : row.noResi}
                          </span>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {row.noResi ? (
                          <button
                            onClick={() => openModal("lihat", row.kiriman)}
                            className="text-xs text-emerald-600 font-semibold hover:underline"
                          >
                            Lihat Resi
                          </button>
                        ) : (
                          <button
                            onClick={() => openModal("upload", undefined)}
                            className="text-xs text-emerald-600 font-semibold hover:underline"
                          >
                            Upload Resi
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <TablePagination
            page={currentPagePeserta}
            limit={PAGE_SIZE}
            total={totalPeserta}
            totalPages={totalPagesPeserta}
            onPageChange={setCurrentPagePeserta}
          />
        </div>
      )}

      {/* Tab: Data Pengiriman Dokumen */}
      {activeTab === "pengiriman" && (
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
          {/* Toolbar */}
          <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between gap-3">
            <span className="font-bold text-zinc-800 text-sm flex items-center gap-2">
              🗓️ Data Pengiriman Dokumen
            </span>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 text-xs border border-zinc-200 rounded-lg text-zinc-500 hover:bg-zinc-50 transition-colors flex items-center gap-1.5">
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="4" y1="6" x2="20" y2="6" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                  <line x1="11" y1="18" x2="13" y2="18" />
                </svg>
                Filter
              </button>
              <div className="relative">
                <svg
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-300"
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  placeholder="Cari informasi..."
                  value={searchPengiriman}
                  onChange={(e) => changeSearchPengiriman(e.target.value)}
                  className="w-52 pl-7 pr-3 py-1.5 border border-zinc-200 rounded-lg text-xs text-zinc-700 outline-none focus:border-emerald-300 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full" style={{ minWidth: "1100px" }}>
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50/60">
                  <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-10">
                    No ↕
                  </th>
                  <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-28">
                    Nama Penerima
                  </th>
                  <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-28">
                    Perusahaan/Instansi
                  </th>
                  <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left">
                    Alamat
                  </th>
                  <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-28">
                    No. Telp
                  </th>
                  <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-32">
                    Keterangan Dokumen
                  </th>
                  <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-32">
                    No. Resi
                  </th>
                  <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-24">
                    Tgl. Kirim
                  </th>
                  <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-20">
                    Kirim Via
                  </th>
                  <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-24">
                    Diterima Oleh
                  </th>
                  <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-24">
                    Tgl. Diterima
                  </th>
                  <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-16">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedPengiriman.length === 0 ? (
                  <tr>
                    <td
                      colSpan={12}
                      className="px-4 py-12 text-center text-xs text-zinc-400"
                    >
                      Tidak ada data tersedia.
                    </td>
                  </tr>
                ) : (
                  paginatedPengiriman.map((row, i) => (
                    <tr
                      key={row.id}
                      className="border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors"
                    >
                      <td className="px-4 py-3 text-xs text-zinc-400">
                        {(currentPagePengiriman - 1) * PAGE_SIZE + i + 1}
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-700">
                        {row.namaPenerima}
                      </td>
                      <td className="px-4 py-3 text-xs text-emerald-600 font-semibold cursor-pointer hover:underline">
                        {row.perusahaan}
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-600 leading-relaxed max-w-[200px]">
                        {row.alamat}
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-600">
                        {row.noTelp}
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-600">
                        {row.keteranganDokumen}
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-600">
                        {row.noResi ?? "-"}
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-600">
                        {row.tglKirim ?? "-"}
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-600">
                        {row.kirimVia ?? "-"}
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-600">
                        {row.diterimaOleh ?? "-"}
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-600">
                        {row.tglDiterima ?? "-"}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => openModal("edit", row.kiriman)}
                          className="text-xs text-emerald-600 font-semibold hover:underline"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <TablePagination
            page={currentPagePengiriman}
            limit={PAGE_SIZE}
            total={totalPengiriman}
            totalPages={totalPagesPengiriman}
            onPageChange={setCurrentPagePengiriman}
          />
        </div>
      )}
    </AppLayout>
  );
}
