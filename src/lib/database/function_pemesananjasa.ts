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