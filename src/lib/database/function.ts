import { query } from './db';
import { AuthCombined, KategoriJasa, Transaction } from '../dataType/interfaces';

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

export async function getSubKategoriJasa(): Promise<KategoriJasa | null> {
  try {
    return await callStoredProcedure<KategoriJasa>(
      'get_kategori_jasa',
      []
    );
  } catch (error) {
    console.error('Error calling getUserMyPayFunction:', error);
    throw error;
  }
}