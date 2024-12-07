// apps/jobs/types.ts

export interface LatestOrder {
    Id: string;
    TglPemesanan: string; // ISO Date string
    TglPekerjaan: string; // ISO Date string
    WaktuPekerjaan: string; // ISO Timestamp string
    TotalBiaya: number;
    IdPelanggan: string;
    IdKategoriJasa: string;
    Sesi: number;
    KategoriId: string;
    NamaKategori: string;
    SubkategoriId: string;
    NamaSubkategori: string;
  }
  