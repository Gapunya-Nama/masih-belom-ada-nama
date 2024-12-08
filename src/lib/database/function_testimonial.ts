// import { query } from './db';
import { AuthCombined, Testimonial } from '../dataType/interfaces';
import { callStoredProcedure } from './function';
// import { v4 as uuidv4 } from "uuid";

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

  export async function getTestimoni(
    idkategori: string
  ): Promise<Testimonial[] | null> {  
    try {
      return await callStoredProcedure<Testimonial[]>(
        'get_testimoni_by_kategori',
        [idkategori]
      );
    } catch (error) {
      console.error('Error calling getTestimoni:', error);
      throw error;
    }
  }