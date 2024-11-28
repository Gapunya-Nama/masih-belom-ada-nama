import { query } from './db';

// Type definitions for function parameters and results
export interface AuthenticateUserParams {
  phone: string;
  password: string;
}

export interface UserResult {
  id: string;
  nama: string;
  nohp: string;
  alamat: string;
  saldomypay: number;
  level?: string;
}

// Function to call PostgreSQL stored procedure
export async function callStoredProcedure<T>(
  procedureName: string,
  params: any[]
): Promise<T> {
  const paramPlaceholders = params
    .map((_, index) => `$${index + 1}`)
    .join(', ');
    
  const text = `SELECT * FROM SIJARTA.${procedureName}(${paramPlaceholders})`;
  
  const result = await query(text, params);
  return result.rows[0];
}

// Example of a specific function call
export async function authenticateUserFunction(
  params: AuthenticateUserParams
): Promise<UserResult | null> {
  try {
    return await callStoredProcedure<UserResult>(
      'authenticate_user',
      [params.phone, params.password]
    );
  } catch (error) {
    console.error('Error calling authenticate_user:', error);
    throw error;
  }
}