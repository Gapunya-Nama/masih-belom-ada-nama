import { callStoredProcedure } from "./function";

export async function updateStatus(idtr: string, idstatus: string, tglwaktu: string): Promise<void | null> {
    try {
      return await callStoredProcedure<void>('update_status_pesanan', [idtr, idstatus, tglwaktu]);
    } catch (error) {
      console.error('Error adding worker to category:', error);
      throw error;
    }
  }