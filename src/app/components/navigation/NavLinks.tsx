'use client';

import Link from 'next/link';
import { Home, WalletIcon, Package, Briefcase, Tag, UserCircle } from 'lucide-react';
import { useRouter } from 'next/compat/router';

export const navLinks = [
  { name: 'Homepage', href: '/homepage', icon: Home },
  { name: 'MyPay', href: '/mypay', icon: WalletIcon },
  { name: 'View Pemesanan Jasa', href: '/orders', icon: Package },
  { name: 'View Pekerjaan Jasa', href: '/jobs', icon: Briefcase },
  { name: 'Diskon', href: '/discounts', icon: Tag },
  { name: 'Profile', href: '/profile', icon: UserCircle },
];

export function NavLinks({ closeSidebar }: { closeSidebar: () => void }) {
  const router = useRouter();

  const handleLinkClick = (href: string) => {
    closeSidebar();
    router?.push(href).catch((err) => {
      console.error('Navigation error:', err); 
    });
    
  };

  return (
    <div className="flex-1 overflow-auto py-4">
      <div className="space-y-1 px-4">
        {navLinks.map((link) => {
          const Icon = link.icon;
          return (
            <div key={link.href}>
              <Link
                href={link.href}
                onClick={(e) => {
                  handleLinkClick(link.href); // Custom navigation logic
                }}
                className="flex items-center space-x-3 text-black hover:text-[#2ECC71] hover:bg-blue-50 px-4 py-3 rounded-lg transition-colors"
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
                <span className="font-medium">{link.name}</span>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
