import { query } from './db';
import { AuthCombined, Voucher, Promo } from '../dataType/interfaces';
import { callProcedure, callStoredProcedure } from './function';
import { v4 as uuidv4 } from "uuid";

export interface AuthenticateUserParams {
    phone: string;
    password: string;
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

  export async function buyVoucher(
    userId: string,
    voucherId: string,
    metodeId: string,
  ): Promise<void> {
    const newId = uuidv4(); // Generate a new UUID
  
    try {
      await callStoredProcedure(
        'buy_voucher',
        [newId, userId, voucherId, metodeId] // Pass the generated UUID
      );
    } catch (error) {
      console.error('Error calling buy_voucher:', error);
      throw error;
    }
  }