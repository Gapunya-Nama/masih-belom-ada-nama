// lib/database/functions/jobs.ts

import { callProcedure, callStoredProcedure } from "@/lib/database/function"; // Adjust the path as necessary

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

export async function KerjakanPesananFunction(
  transactionId: string,
  pekerjaId: string,
): Promise<void> {
  try {
    await callProcedure(
      'kerjakan_pesanan',
      [transactionId, pekerjaId]
    );
  } catch (error) {
    console.error('Error calling kerjakan_pesanan:', error);
    throw error;
  }
}


export interface takenJobs {
  Id: string; // UUID as string
  TglPemesanan: string; // ISO Date string
  TglPekerjaan: string; // ISO Date string
  WaktuPekerjaan: string; // ISO Timestamp string
  TotalBiaya: number; // DECIMAL converted to number
  IdPelanggan: string; // UUID as string
  NamaPelanggan: string;
  IdKategoriJasa: string; // UUID as string
  Sesi: number;
  KategoriId: string; // UUID as string
  NamaKategori: string;
  SubkategoriId: string; // UUID as string
  NamaSubkategori: string;
  IdStatus: string; // UUID as string
  Status: string;
  IdNextStatus: string; // UUID as string
  NextStatus: string;
}

// Function to get taken orders by pekerja (worker)
export async function getTakenJobs(
  pekerjaId: string,
  limit_val: number = 10,
  offset_val: number = 0,
): Promise<AvailableJobs[]> {
  try {
    const orders = await callStoredProcedure<takenJobs>(
      'get_taken_jobs',
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

// Define the TypeScript interface matching the RETURNS TABLE of your SQL function
export interface UpdatedJob {
  Id: string;
  IdStatus: string;
  Status: string;
  IdNextStatus: string | null;
  NextStatus: string | null;
}

// Updated Function to handle status updates with returned data
export async function updateStatusPesananFunction(
  orderId: string,
  nextStatusId: string,
): Promise<UpdatedJob | null> { // Return UpdatedJob or null
  try {
    const result = await callStoredProcedure<UpdatedJob>(
      'update_status_pesanan',
      [orderId, nextStatusId] // Pass the orderId and nextStatusId
    );
    if (!result || (Array.isArray(result) && result.length === 0)) {
      return null; // No data returned, meaning status was already applied
    }
    return Array.isArray(result) ? result[0] : result;
  } catch (error) {
    console.error('Error calling update_status_pesanan:', error);
    throw error;
  }
}