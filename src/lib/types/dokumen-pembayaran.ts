export type JenisDokumen = "invoice" | "kwitansi";
export interface IsianDokumen {
  nomor:string; tanggal:string; noPO:string; namaPeserta:string; instansi:string; alamat:string;
  kode:string; judul:string; kota:string; periode:string;
  harga:string; ppn:string; diskon:string; total:string; dibayar:string; administrasi:string; jabatan:string;
}
export interface DokumenPembayaranData {
  dokumen:{id:number;nomor:string;versi:number}|null;
  isian:IsianDokumen;
}
