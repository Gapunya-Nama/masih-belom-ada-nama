// lib/fetcher.ts

import { Transaction } from "@/lib/dataType/interfaces";

/**
 * Fetches transactions for a given user.
 * @param userId - The ID of the user.
 * @returns A promise that resolves to an array of transactions.
 */
export const fetchUserTransactions = async (userId: string): Promise<Transaction[]> => {
  try {
    const response = await fetch("/api/mypay/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Include cookies for session-based auth
      body: JSON.stringify({ id: userId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch transactions");
    }

    const transactions: Transaction[] = await response.json();
    return transactions;
  } catch (error) {
    console.error("MyPay error:", error);
    throw error; // Propagate the error to handle it in SWR
  }
};
