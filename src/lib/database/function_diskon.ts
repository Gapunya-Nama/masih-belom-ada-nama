import { query } from './db';
import { AuthCombined, Voucher, Promo } from '../dataType/interfaces';
import { v4 } from "uuid";

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

export async function getAllVoucher(): Promise<Voucher[] | null> {
    try {
      return await callStoredProcedure<Voucher[]>(
        'show_all_voucher',
        []
      );
    } catch (error) {
      console.error('Error calling getVoucher:', error);
      throw error;
    }
  }
  
export async function getAllPromo(): Promise<Promo[] | null> {
    try {
      return await callStoredProcedure<Promo[]>(
        'show_all_promo',
        []
      );
    } catch (error) {
      console.error('Error calling getPromo:', error);
      throw error;
    }
  }