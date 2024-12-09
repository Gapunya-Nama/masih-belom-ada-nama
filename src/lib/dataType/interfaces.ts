
export type Role = 'user' | 'worker' | 'guest';
export type Gender = 'Laki-Laki' | 'Perempuan' | 'Other';

export interface AuthBase {
  id: string;
  pno: string;
  password: string;
  role: Role;
  name: string;
  gender: Gender;
  birth_date: string;
  address: string;
  balance: number;
}

export interface AuthUserFields {
  level: string;
}

export interface AuthWorkerFields {
  accountNumber: string;
  bankName: string;
  npwp: string;
  rating: number;
  completedOrders: number;
  photoUrl: string;
  categories: string[];
}

export type AuthCombined = AuthBase & Partial<AuthUserFields & AuthWorkerFields>;

export interface Transaction {
  id: string;
  userId: string;
  date: string;
  amount: number;
  category: string;
  namakategori: string;
  }

export interface KategoriJasa {
  id: string;
  namakategori: string;
  namasubkategori: string[];
  idsubkategori: string[];
  workers: Worker[];
}

export interface SesiLayanan {
  id: string;
  sesi: number;
  harga: number;
}

export interface Worker {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  completedJobs: number;
}

export interface Testimonial {
  nama_pekerja: string;
  nama_pengguna: string;
  rating: number;
  teks_testimoni: string;
  tgl_testimoni: string;
}

export interface SubCategory {
  id: string;
  nama: string;
  deskripsi: string;
  idkategori: string;
  namakategori: string;
}

export interface Pekerja {
  pekerjaid: string;
  namapekerja: string;
  linkfoto: string;
  rating: number;
  completedjobs: number;
}

export interface Voucher {
  potongan: number;  // DECIMAL(15, 2)
  mintrpemesanan: number;  // INT
  kode: string;  // UUID
  jmlhariberlaku: number;  // INT
  kuotapenggunaan: number;  // INT
  harga: number;  // DECIMAL(15, 2)
}

export interface Promo {
  potongan: number;  // DECIMAL(15, 2)
  mintrpemesanan: number;  // INT
  kode: string;  // UUID
  tglakhirberlaku: string;  // DATE (ISO String format, e.g. '2024-12-31')
}

export interface MetodeBayar {
  id: string;
  nama: string;
}

export interface PemesananJasa {
  id: string;
  namakategori: string;
  namasubkategori: string;
  idkategori: string;
  idsubkategori: string;
  namapekerja: string;
  idpekerja: string;
  tanggalpemesanan: string;
  biaya: number;
  sesi: number;
  statuspesanan: string;
}

