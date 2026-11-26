import {apiGet,apiPut} from "@/lib/api/client";
import type {JenisDokumen,IsianDokumen,DokumenPembayaranData} from "@/lib/types/dokumen-pembayaran";
const path=(jadwal:string,id:string,jenis:JenisDokumen)=>`/api/input/jadwal/${encodeURIComponent(jadwal)}/peserta/${id}/dokumen/${jenis}`;
export const getDokumenPembayaran=(jadwal:string,id:string,jenis:JenisDokumen)=>apiGet<DokumenPembayaranData>(path(jadwal,id,jenis));
export const saveDokumenPembayaran=(jadwal:string,id:string,jenis:JenisDokumen,isian:IsianDokumen,versi:number)=>
  apiPut<DokumenPembayaranData>(path(jadwal,id,jenis),{isian,versi},"Gagal menyimpan dokumen pembayaran.");
