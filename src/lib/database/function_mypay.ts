import { query } from './db';
import { AuthCombined, KategoriJasa, Transaction } from '../dataType/interfaces';
import { v4 as uuidv4 } from 'uuid';
import { callProcedure, callStoredProcedure } from './function';

export async function getUserMyPayFunction(
  id: string
): Promise<Transaction[] | null> {
  try {
    const transactions = await callStoredProcedure<Transaction[]>(
      'get_myPay_transac_history',
      [id]
    );

    if (transactions) {
      // Sort transactions by date descending (newest first)
      transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    return transactions;
  } catch (error) {
    console.error('Error calling getUserMyPayFunction:', error);
    throw error;
  }
}

export async function topUpMyPayFunction(
  userId: string,
  amount: number
): Promise<void> {
  const newId = uuidv4(); // Generate a new UUID

  try {
    await callProcedure(
      'top_up_myPay',
      [newId, userId, amount] // Pass the generated UUID
    );
  } catch (error) {
    console.error('Error calling top_up_myPay:', error);
    throw error;
  }
}

export async function ServicePaymentMyPayFunction(
  userId: string,
  amount: number
): Promise<void> {
  const newId = uuidv4(); // Generate a new UUID

  try {
    await callProcedure(
      'service_payment',
      [newId, userId, amount] // Pass the generated UUID
    );
  } catch (error) {
    console.error('Error calling service_payment:', error);
    throw error;
  }
}