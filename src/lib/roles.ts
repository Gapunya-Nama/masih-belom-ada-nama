export type Role = 'user' | 'worker' | 'guest';

export interface User {
  id: string;
  Pno: string;
  role: Role;
  name: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}