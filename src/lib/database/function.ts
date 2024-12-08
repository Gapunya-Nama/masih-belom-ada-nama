/* eslint-disable @typescript-eslint/no-explicit-any */
import { query } from './db';
import { AuthCombined, KategoriJasa, MetodeBayar, SubCategory, Pekerja} from '../dataType/interfaces';
// import { AuthCombined, AuthWorkerFields, KategoriJasa, Pekerja, SubCategory, Transaction } from '../dataType/interfaces';
// import { v4 } from "uuid";


// Type definitions for function parameters and results
export interface AuthenticateUserParams {
  phone: string;
  password: string;
}


export async function callStoredProcedure<T>(
  procedureName: string,
  params: any[]
): Promise<T | null> {
  const paramPlaceholders = params
    .map((_, index) => `$${index + 1}`)
    .join(', ');

  const text = `SELECT * FROM SIJARTA.${procedureName}(${paramPlaceholders})`;

  const result = await query(text, params);
  
  if (result.rows.length === 0) {
    return null;
  }
  
  if (result.rows.length === 1) {
    return result.rows[0] as T;  
  }

  return result.rows as T;
}


export async function authenticateUserFunction(
  params: AuthenticateUserParams
): Promise<AuthCombined | null> {
  try {
    return await callStoredProcedure<AuthCombined>(
      'authenticate_user',
      [params.phone, params.password]
    );
  } catch (error) {
    console.error('Error calling authenticate_user:', error);
    throw error;
  }
}

/**
 * Calls a PostgreSQL stored procedure.
 * @param procedureName - The name of the procedure to call.
 * @param params - An array of parameters to pass to the procedure.
 */
export async function callProcedure(
  procedureName: string,
  params: any[]
): Promise<void> {
  // Construct parameter placeholders ($1, $2, ...)
  const placeholders = params.map((_, index) => `$${index + 1}`).join(', ');
  
  // Construct the CALL statement
  const queryText = `CALL SIJARTA.${procedureName}(${placeholders})`;

  // Execute the CALL statement
  await query(queryText, params);
}

export async function getKategoriJasa(): Promise<KategoriJasa[] | null> {
  try {
    return await callStoredProcedure<KategoriJasa[]>(
      'get_kategori_jasa',
      []
    );
  } catch (error) {
    console.error('Error calling getUserMyPayFunction:', error);
    throw error;
  }
}

export async function getSubKategoriJasa(namaParam: string): Promise<SubCategory | null> {
  try {
    return await callStoredProcedure<SubCategory>(
      'show_subkategori',
      [namaParam]
    );
  } catch (error) {
    console.error('Error calling get_subkategori_jasa', error);
    throw error;
  }
}

export async function getMetodeBayar(): Promise<MetodeBayar[] | null> {
  try {
    return await callStoredProcedure<MetodeBayar[]>(
      'show_metode_bayar',
      []
    );
  } catch (error) {
    console.error('Error calling getMetodeBayar:', error);
    throw error;
  }
}

export async function submitWorkerRegis(
  params: AuthCombined
): Promise<void | null>{
  try{
    return await callStoredProcedure<void>(
      'insert_pekerja',
      [
        params.id,
        params.name,
        params.gender,
        params.pno,
        params.password,
        params.birth_date,
        params.address,
        params.balance,
        params.bankName,
        params.accountNumber,
        params.npwp,
        params.photoUrl,
        params.rating,
        params.completedOrders
      ]
    );
  }
  catch (error){
    throw error;
  }
}
export async function showPekerja(id : string): Promise<Pekerja | null> {
  try {
    return await callStoredProcedure<Pekerja>(
      'show_pekerja',
      [id]
    );
  } catch (error) {
    console.error('Error calling get_subkategori_jasa', error);
    throw error;
  }
}
export async function showSesilayanan(id : string): Promise<Pekerja | null> {
  try {
    return await callStoredProcedure<Pekerja>(
      'get_sesilayanan',
      [id]
    );
  } catch (error) {
    console.error('Error calling get_subkategori_jasa', error);
    throw error;
  }
}
export async function addWorkerToCategory(pekerjaId: string, kategoriJasaId: string): Promise<void | null> {
  try {
    return await callStoredProcedure('CALL SIJARTA.add_pekerja_kategori_jasa($1, $2)', [pekerjaId, kategoriJasaId]);
  } catch (error) {
    console.error('Error adding worker to category:', error);
    throw error;
  }
}