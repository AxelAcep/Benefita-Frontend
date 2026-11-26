/** Hotel — master data penginapan untuk pelaksanaan training. */
export interface Hotel {
  id: string;
  kodeHotel: string;
  namaHotel: string;
  alamat: string;
  kota: string;
  telepon: string;
  fax?: string | null;
  pubRate?: number | null;
  corRate?: number | null;
}

export interface CreateHotelRequest {
  kodeHotel: string;
  namaHotel: string;
  alamat: string;
  kota: string;
  telepon: string;
  fax?: string;
  pubRate?: number;
  corRate?: number;
}

/**
 * kodeHotel tidak ada di sini karena memang tidak bisa diubah: backend
 * mencari barisnya dengan `where: { kodeHotel: id }`, jadi kode itu
 * sekaligus berfungsi sebagai identitas baris.
 */
export interface UpdateHotelRequest {
  namaHotel?: string;
  alamat?: string;
  kota?: string;
  telepon?: string;
  fax?: string;
  pubRate?: number;
  corRate?: number;
}
