'use client';

import Link from 'next/link';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function LogoutButton() {

  const router = useRouter();

  const handleLogout = () => {

    localStorage.removeItem('authToken');
    sessionStorage.removeItem('user');
    document.cookie = 'authToken=; Max-Age=0; path=/;';


    router.push('/login');
  };


  return (
    <div className="p-4 border-t">
      <button
        onClick={handleLogout} // Custom logout handler
        className="flex items-center space-x-3 text-gray-600 hover:text-red-600 hover:bg-blue-50 px-4 py-3 rounded-lg transition-colors w-full"
      >
        <LogOut className="h-5 w-5" aria-hidden="true" />
        <span className="font-medium">Logout</span>
      </button>
    </div>
  );
}
