import { MetodeBayar } from '../dataType/interfaces';
import { callProcedure, callStoredProcedure } from './function';

export async function showMetodeBayar(): Promise<MetodeBayar[] | null> {
    try {
      return await callStoredProcedure<MetodeBayar[]>(
        'get_metode_bayar',
        []
      );
    } catch (error) {
      console.error('Error calling getUserMyPayFunction:', error);
      throw error;
    }
  }