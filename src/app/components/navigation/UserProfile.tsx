'use client';

import { useAuth } from '@/context/auth-context';
import { User } from 'lucide-react';

export function UserProfile() {
  const { user } = useAuth();
  return (
    <div className="p-6 border-b">
      <div className="flex items-center space-x-4">
        <User className="h-10 w-10 text-black" aria-hidden="true" />
        <div>
          <div className="text-lg font-medium">{user?.name || 'anonym'}</div>
          <div className="text-sm text-gray-500">{user?.role || 'Guest'}</div>
        </div>
      </div>
    </div>
  );
}