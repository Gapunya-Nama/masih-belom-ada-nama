
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
}

export interface ServiceSession {
  id: string;
  name: string;
  price: number;
  description: string;
}

export interface Worker {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  completedJobs: number;
}

export interface Testimonial {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
}

export interface SubCategory {
  idKategori: string;
  p_id: string;
  p_namesubkategori: string;
  p_deskripsi: string;
  categoryName: string;
  sessions: ServiceSession[];
  workers: Worker[];
  testimonials: Testimonial[];
}
