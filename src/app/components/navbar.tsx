'use client';

import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { UserProfile } from './navigation/UserProfile';
import { NavLinks } from './navigation/NavLinks';
import { LogoutButton } from './navigation/LogoutButton';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 h-16 w-full border-b bg-white z-50">
      <div className="h-full px-4 flex items-center">
        <Sheet>
          <SheetTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              aria-label="Open navigation menu"
            >
              <Menu className="h-6 w-6" aria-hidden="true" />
            </Button>
          </SheetTrigger>

          <SheetContent 
            side="left" 
            className="w-[300px] sm:w-[400px] p-0"
            aria-label="Navigation menu"
          >
            
            <div className="h-full flex flex-col">
              <UserProfile />
              <NavLinks />
              <LogoutButton />
            </div>
          </SheetContent>
        </Sheet>

        <div className="ml-4">
          <span className="text-lg font-bold text-[#2ECC71]">Sijarta</span>
        </div>
      </div>
    </nav>
  );
}