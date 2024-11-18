export type Role = 'user' | 'worker' | 'guest';

export interface AuthUser {
  id: string;
  Pno: string;
  password: string;
  role: Role;
  name: string;
}

// Test users for development
const TEST_USERS: AuthUser[] = [
  {
    id: '1',
    Pno: '1122334455',
    password: 'password123',
    role: 'user',
    name: 'John User'
  },
  {
    id: '2',
    Pno: '2233445566',
    password: 'password123',
    role: 'worker',
    name: 'Jane Worker'
  },
  {
    id: '3',
    Pno: '3344556677',
    password: 'password123',
    role: 'guest',
    name: 'Alex Guest'
  }
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
  user: ['viewProfile', 'editProfile', ], // Hak akses untuk user biasa
  worker: ['viewProfile', 'editTasks'], // Hak akses untuk pekerja
  guest: ['viewProfile'],               // Hak akses untuk tamu
};

export const canAccess = (role: Role, action: string): boolean => {
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(action);
};


export const authenticateUser = async (
  Pno: string,
  password: string,
): Promise<AuthUser> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const user = TEST_USERS.find(u => u.Pno === Pno);
  
  if (!user || user.password !== password) {
    throw new Error('Invalid credentials');
  }

  // Return user without password
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};