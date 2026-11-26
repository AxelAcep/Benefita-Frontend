import type { CreatePesertaTrainingRequest, PesertaTraining } from "@/lib/types/input-peserta";
import type { TambahPesertaFormData } from "./components/modal-tambah-peserta";

export function toRequest(formData: TambahPesertaFormData): CreatePesertaTrainingRequest {
  return {
    nama: formData.nama,
    jabatan: formData.jabatan,
    noIndukPerusahaan: formData.noIndukPerusahaan,
    alamat: formData.alamat,
    noTelp: formData.noTelp,
    noHp: formData.noHp,
    noFax: formData.noFax,
    email: formData.email,
    alamatPengirimanSertifikat: formData.alamatPengirimanSertifikat,
    catatan: formData.catatan,
    accExecutive: formData.accExecutive,
    status: formData.status,
    metode: formData.metode,
    ujian: formData.ujian,
    industri: formData.industri,
    ownEnv: formData.ownEnv,
    diskon: formData.diskon ? parseInt(formData.diskon) : undefined,
    ppn: formData.ppn ? parseInt(formData.ppn) : undefined,
    cashback: formData.cashback ? parseInt(formData.cashback) : undefined,
    hargaTotal: formData.hargaTotal
      ? parseInt(formData.hargaTotal)
      : undefined,
    bayar: formData.bayar ? parseInt(formData.bayar) : undefined,
    infoPembayaran: formData.infoPembayaran,
    infoPenagihan: formData.infoPenagihan,
    tglBayar: formData.tanggalBayar,
    noInvoice: formData.noInvoice,
    noKwitansi: formData.noKwitansi,
    noInvUjian: formData.noInvUjian,
    noKwtUjian: formData.noKwtUjian,
    fileBuktiPembayaran: formData.fileBuktiPembayaran,
    filePendaftaran: formData.filePendaftaran,
  };
}

export function toForm(detailPeserta: PesertaTraining): Partial<TambahPesertaFormData> {
  return {
    nama: detailPeserta.nama,
    jabatan: detailPeserta.jabatan ?? "",
    noIndukPerusahaan: detailPeserta.perusahaan?.noInduk ?? "",
    alamat: detailPeserta.alamat ?? "",
    noTelp: detailPeserta.noTelp ?? "",
    noHp: detailPeserta.noHp ?? "",
    noFax: detailPeserta.noFax ?? "",
    email: detailPeserta.email ?? "",
    alamatPengirimanSertifikat:
      detailPeserta.alamatPengirimanSertifikat ?? "",
    catatan: detailPeserta.catatan ?? "",
    accExecutive: detailPeserta.accExecutive ?? "",
    status: detailPeserta.status ?? "",
    metode: detailPeserta.metode ?? "",
    ujian: detailPeserta.ujian ?? "",
    konfirmasiOleh: detailPeserta.konfirmasiOleh ?? "",
    industri: detailPeserta.industri ?? "",
    ownEnv: detailPeserta.ownEnv ?? "",
    diskon: detailPeserta.diskon?.toString() ?? "",
    ppn: detailPeserta.ppn?.toString() ?? "",
    cashback: detailPeserta.cashback?.toString() ?? "",
    hargaTotal: detailPeserta.hargaTotal?.toString() ?? "",
    bayar: detailPeserta.bayar?.toString() ?? "",
    infoPembayaran: detailPeserta.infoPembayaran ?? "",
    infoPenagihan: detailPeserta.infoPenagihan ?? "",
    tanggalBayar: detailPeserta.tglBayar
      ? detailPeserta.tglBayar.split("T")[0]
      : "",
    noInvoice: detailPeserta.noInvoice ?? "",
    noKwitansi: detailPeserta.noKwitansi ?? "",
    noInvUjian: detailPeserta.noInvUjian ?? "",
    noKwtUjian: detailPeserta.noKwtUjian ?? "",
  };
}
