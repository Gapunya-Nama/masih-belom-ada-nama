import { query } from './db';
import { AuthCombined, KategoriJasa, SubCategory, Transaction } from '../dataType/interfaces';
import { v4 } from "uuid";


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

export async function getUserMyPayFunction(
  id: string
): Promise<Transaction[] | null> {
  try {
    return await callStoredProcedure<Transaction[]>(
      'get_myPay_transac_history',
      [id]
    );
  } catch (error) {
    console.error('Error calling getUserMyPayFunction:', error);
    throw error;
  }
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

export async function getSubKategoriJasa(): Promise<SubCategory | null> {
  try {
    return await callStoredProcedure<SubCategory>(
      'get_kategori_jasa',
      []
    );
  } catch (error) {
    console.error('Error calling getUserMyPayFunction:', error);
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