// lib/database/functions/jobs.ts

import { callStoredProcedure } from "@/lib/database/function"; // Adjust the path as necessary

// Define the TypeScript interface matching the RETURNS TABLE of your SQL function
interface AvailableJobs {
  Id: string;
  TglPemesanan: string;      // DATE
  TglPekerjaan: string;      // DATE
  WaktuPekerjaan: string;    // TIMESTAMP
  TotalBiaya: number;        // DECIMAL(15, 2)
  IdPelanggan: string;       // UUID
  IdKategoriJasa: string;    // UUID
  Sesi: number;              // INT
  KategoriId: string;        // UUID
  NamaKategori: string;      // VARCHAR(100)
  SubkategoriId: string;     // UUID
  NamaSubkategori: string;   // VARCHAR(100)
}

// Function to get latest orders by pekerja (worker)
export async function getAvailableJobs(
  pekerjaId: string,
  limit_val: number = 10,
  offset_val: number = 0,
): Promise<AvailableJobs[]> {
  try {
    const orders = await callStoredProcedure<AvailableJobs>(
      'get_available_jobs',
      [pekerjaId, limit_val, offset_val],
    );
    if (!orders) {
        return [];
      }
    
    return Array.isArray(orders) ? orders : [orders];
  } catch (error) {
    console.error('Error fetching latest orders:', error);
    throw error;
  }
}