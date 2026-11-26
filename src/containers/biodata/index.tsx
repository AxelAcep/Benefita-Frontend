"use client";

import Image from "next/image";
import { Loader2, Save, User, Building2, Phone, Mail } from "lucide-react";
import { PerusahaanSelect } from "@/components/base/PerusahaanSelect";
import { getListPerusahaanPublic } from "@/lib/services/dropdown.service";
import Notification from "@/components/base/notifications";
import { useBiodataManage } from "./manage";

const inputCls =
  "w-full px-3 py-2 border rounded-xl text-xs text-zinc-700 outline-none transition-all placeholder:text-zinc-300";
const borderCls =
  "border-zinc-200 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100";
const disabledCls = "opacity-50 cursor-not-allowed bg-zinc-50";
const labelCls = "block text-xs font-semibold text-zinc-700 mb-1.5";

export default function BiodataContainer() {
  const {
    data,
    isLoading,
    error,
    form,
    notification,
    isSubmitting,
    handleChange,
    handleSubmit,
    handlePerusahaanChange,
    clearNotification,
  } = useBiodataManage();

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
          {error ?? "Data peserta tidak ditemukan"}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 py-10 px-4 flex flex-col">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={clearNotification}
        />
      )}

      <div className="max-w-xl mx-auto w-full flex-1">
        {/* Logo */}
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
          <h1 className="text-lg font-bold text-zinc-800">
            Formulir Biodata Peserta
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Lengkapi atau perbarui data diri Anda di bawah ini
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-5"
        >
          {/* Data Diri */}
          <div className="flex items-center gap-2 text-emerald-600 text-xs font-semibold">
            <User className="w-3.5 h-3.5" />
            DATA DIRI
          </div>

          <div>
            <label className={labelCls}>Nama Lengkap</label>
            <input
              type="text"
              value={form.nama}
              onChange={handleChange("nama")}
              placeholder="Masukkan nama lengkap"
              className={`${inputCls} ${borderCls} bg-white`}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Tempat Lahir</label>
              <input
                type="text"
                value={form.tempatLahir}
                onChange={handleChange("tempatLahir")}
                placeholder="Kota kelahiran"
                className={`${inputCls} ${borderCls} bg-white`}
              />
            </div>
            <div>
              <label className={labelCls}>Tanggal Lahir</label>
              <input
                type="date"
                value={form.tanggalLahir}
                onChange={handleChange("tanggalLahir")}
                className={`${inputCls} ${borderCls} bg-white`}
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>Jenis Kelamin</label>
            <select
              value={form.jenisKelamin}
              onChange={handleChange("jenisKelamin")}
              className={`${inputCls} ${borderCls} bg-white`}
            >
              <option value="">Pilih jenis kelamin</option>
              <option value="L">Laki-laki</option>
              <option value="P">Perempuan</option>
            </select>
          </div>

          {/* Data Instansi */}
          <div className="flex items-center gap-2 text-emerald-600 text-xs font-semibold pt-2">
            <Building2 className="w-3.5 h-3.5" />
            DATA INSTANSI
          </div>

          <div>
            <label className={labelCls}>Nama Instansi</label>
            <PerusahaanSelect
              value={form.noIndukPerusahaan}
              onChange={handlePerusahaanChange}
              placeholder="Pilih atau cari instansi..."
              fetchFn={getListPerusahaanPublic}
            />
          </div>

          {(data.perusahaan?.alamat || data.perusahaan?.telp) && (
            <div className="bg-zinc-50 border border-zinc-100 rounded-xl px-3 py-2.5 text-[11px] text-zinc-500 space-y-1">
              {data.perusahaan?.alamat && (
                <p>Alamat: {data.perusahaan.alamat}</p>
              )}
              {data.perusahaan?.telp && (
                <p>Telp Kantor: {data.perusahaan.telp}</p>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Jabatan</label>
              <input
                type="text"
                value={form.jabatan}
                onChange={handleChange("jabatan")}
                placeholder="Jabatan"
                className={`${inputCls} ${borderCls} bg-white`}
              />
            </div>
            <div>
              <label className={labelCls}>Bidang</label>
              <input
                type="text"
                value={form.bidang}
                onChange={handleChange("bidang")}
                placeholder="Bidang kerja"
                className={`${inputCls} ${borderCls} bg-white`}
              />
            </div>
          </div>

          {/* Kontak */}
          <div className="flex items-center gap-2 text-emerald-600 text-xs font-semibold pt-2">
            <Phone className="w-3.5 h-3.5" />
            KONTAK PRIBADI
          </div>

          <div>
            <label className={labelCls}>Email Pribadi</label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 text-zinc-300 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={form.email}
                onChange={handleChange("email")}
                placeholder="nama@email.com"
                className={`${inputCls} ${borderCls} bg-white pl-8`}
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>No. Handphone</label>
            <input
              type="text"
              value={form.noHp}
              onChange={handleChange("noHp")}
              placeholder="08xxxxxxxxxx"
              className={`${inputCls} ${borderCls} bg-white`}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold rounded-xl py-2.5 transition-colors ${
              isSubmitting ? disabledCls : ""
            }`}
          >
            {isSubmitting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            {isSubmitting ? "Menyimpan..." : "Simpan Biodata"}
          </button>
        </form>
      </div>

      {/* Footer */}
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
