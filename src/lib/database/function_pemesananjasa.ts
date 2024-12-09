import { PemesananJasa } from '../dataType/interfaces';
import { callStoredProcedure } from './function';

export async function showPemesananJasa(id : string): Promise<PemesananJasa[] | null> {
    console.log('masuk showPemesananJasa', id);
    try {
      return await callStoredProcedure<PemesananJasa[]>(
        'get_pemesanan_jasa',
        [id]
      );
    } catch (error) {
      console.error('Error calling getpemesananjasa:', error);
      throw error;
    }
}

export async function addPemesananJasa(
  tglPemesanan: string,
  tglPekerjaan: string,
  waktuPekerjaan: string,
  totalBiaya: number,
  idPelanggan: string,
  idPekerja: string,
  idKategoriJasa: string,
  sesi: number,
  idtransaksi: string,
  idMetodeBayar: string,
  idDiskon: string | null
): Promise<PemesananJasa | null> {
  try {
    console.log('masuk addPemesananJasa');
    return await callStoredProcedure<PemesananJasa>('insert_pemesanan_jasa', [
      tglPemesanan,
      tglPekerjaan,
      waktuPekerjaan,
      totalBiaya,
      idPelanggan,
      idPekerja,
      idKategoriJasa,
      sesi,
      idtransaksi,
      idMetodeBayar,
      idDiskon
    ]);
  } catch (error) {
    console.error('Error adding pemesanan jasa:', error);
    throw error;
  }
}