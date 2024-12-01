
export type Role = 'user' | 'worker' | 'guest';
export type Gender = 'Male' | 'Female' | 'Other';

export interface AuthBase {
  id: string;
  pno: string;
  password: string;
  role: Role;
  name: string;
  gender: Gender;
  birthDate: string;
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