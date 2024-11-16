'use client';

import Link from 'next/link';
import { Home, WalletIcon, Package, Briefcase, Tag, UserCircle } from 'lucide-react';
import { useRouter } from 'next/router';

export const navLinks = [
  { name: 'Homepage', href: '/homepage', icon: Home },
  { name: 'MyPay', href: '/mypay', icon: WalletIcon },
  { name: 'View Pemesanan Jasa', href: '/orders', icon: Package },
  { name: 'View Pekerjaan Jasa', href: '/jobs', icon: Briefcase },
  { name: 'Diskon', href: '/discounts', icon: Tag },
  { name: 'Profile', href: '/profile', icon: UserCircle },
];

export function NavLinks({ closeSidebar }: Readonly<{ closeSidebar: () => void }>) {
  const router = useRouter();

  const handleLinkClick = async (href: string) => {
    try {
      router.push(href); 
      await new Promise((resolve) => {
        const onRouteChange = () => {
          resolve(true);
          router.events?.off('routeChangeComplete', onRouteChange); 
        };
        router.events?.on('routeChangeComplete', onRouteChange);
      });
    } catch (error) {
      console.error("Fetch failed:", error);
    } finally {
      closeSidebar(); 
    }
  };

  return (
    <div className="flex-1 overflow-auto py-4">
      <div className="space-y-1 px-4">
        {navLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => handleLinkClick(link.href)} // Close sidebar when a link is clicked
              className="flex items-center space-x-3 text-black hover:text-[#2ECC71] hover:bg-blue-50 px-4 py-3 rounded-lg transition-colors"
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              <span className="font-medium">{link.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
