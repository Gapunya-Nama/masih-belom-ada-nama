'use client';

import Link from 'next/link';
import { LogOut } from 'lucide-react';

export function LogoutButton() {
  return (
    <div className="p-4 border-t">
      <Link
        href="/logout"
        className="flex items-center space-x-3 text-gray-600 hover:text-red-600 hover:bg-blue-50 px-4 py-3 rounded-lg transition-colors"
      >
        <LogOut className="h-5 w-5" aria-hidden="true" />
        <span className="font-medium">Logout</span>
      </Link>
    </div>
  );
}