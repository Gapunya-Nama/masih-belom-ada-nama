import { z } from "zod";
import { AuthState } from "./roles";
export type Role = 'user' | 'worker' | 'guest';
export type Gender = 'Male' | 'Female' | 'Other';

export interface AuthBase {
  id: string;
  Pno: string;
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

// Test users for development
const TEST_USERS: AuthCombined[] = [
  {
    id: '1',
    Pno: '1122334455',
    password: 'password123',
    role: 'user',
    name: 'John User',
    gender: 'Male',
    birthDate: '1990-01-01',
    address: '123 Main Street, City',
    balance: 1500000,
    level: 'Gold Member',
  },
  {
    id: '2',
    Pno: '2233445566',
    password: 'password123',
    role: 'worker',
    name: 'Jane Worker',
    gender: 'Female',
    birthDate: '1992-05-15',
    address: '456 Worker Street, City',
    balance: 2500000,
    bankName: 'Bank BCA',
    accountNumber: '1234567890',
    npwp: '12.345.678.9-012.345',
    rating: 4.8,
    completedOrders: 156,
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&auto=format&fit=crop&crop=face',
    categories: ['House Cleaning', 'Laundry Service'],
  },
  {
    id: '3',
    Pno: '3344556677',
    password: 'password123',
    role: 'guest',
    name: 'Alex Guest',
    gender: 'Male',
    birthDate: '',
    address: '',
    balance: 0,
  },
];

export const getDashboardPath = (role: Role): string => {
  const paths: Record<Role, string> = {
    user: '/dashboard/user',
    worker: '/dashboard/worker',
    guest: '/dashboard/guest',
  };
  return paths[role];
};

const ROLE_PERMISSIONS: Record<Role, string[]> = {
  user: ['viewProfile', 'editProfile'], // Hak akses untuk user biasa
  worker: ['viewProfile', 'editTasks'], // Hak akses untuk pekerja
  guest: ['viewProfile'], // Hak akses untuk tamu
};

export const canAccess = (role: Role, action: string): boolean => {
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(action);
};

// export const authenticateUser = async (
//   Pno: string,
//   password: string,
// ): Promise<AuthCombined> => {
//   // Simulate API call delay
//   await new Promise((resolve) => setTimeout(resolve, 1000));

//   const user = TEST_USERS.find(u => u.Pno === Pno);

//   if (!user || user.password !== password) {
//     throw new Error('Invalid credentials');
//   }

//   // Return user without password
//   const { password: _, ...userWithoutPassword } = user;
//   return userWithoutPassword as AuthCombined;
// };

export const loginSchema = z.object({
  phone: z
    .string()
    .regex(/^(?:\+?[1-9]\d{1,14}|0\d{9,14})$/, "Phone number must be in E.164 format (e.g., +1234567890) or start with 0"),
  password: z
    .string()
    .min(2, "Password must be at least 2 characters")
    .regex(/^[a-zA-Z0-9\s]*$/, "Password must contain only letters, numbers, and spaces")
});

export type LoginInput = z.infer<typeof loginSchema>;

export const authenticateUser = async (
  credentials: LoginInput
): Promise<AuthCombined> => {
  try {
    // Send the request to the login endpoint with the credentials
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),  // Send the entire credentials object
    });

    // Handle non-OK responses
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Invalid credentials');
    }

    // Parse the response from the server
    const user = await response.json();

    

    // Return the user object without the password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword as AuthCombined;

  } catch (error) {
    console.error("Authentication error:", error); // Log any authentication issues
    throw error; // Rethrow the error to be handled by the caller
  }
};
