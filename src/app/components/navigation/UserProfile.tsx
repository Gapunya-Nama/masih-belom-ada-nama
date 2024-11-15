'use client';

import { User } from 'lucide-react';

export function UserProfile() {
  return (
    <div className="p-6 border-b">
      <div className="flex items-center space-x-4">
        <User className="h-10 w-10 text-black" aria-hidden="true" />
        <div>
          <div className="text-lg font-medium">John Doe</div>
          <div className="text-sm text-gray-500">Pengguna</div>
        </div>
      </div>
    </div>
  );
}