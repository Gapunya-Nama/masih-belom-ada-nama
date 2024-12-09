// src/app/components/navigation/Navbar.tsx

'use client';

import { useState } from 'react';
import { Menu, Brush } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { UserProfile } from './navigation/NavProfile';
import { NavLinks } from './navigation/NavLinks';
import { LogoutButton } from './navigation/LogoutButton';
import { DialogTitle } from '@radix-ui/react-dialog'; // Import DialogTitle
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'; // Import VisuallyHidden

export default function Navbar() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const closeSidebar = () => setIsSheetOpen(false);

  return (
    <nav className="fixed top-0 left-0 h-16 w-full border-b bg-white z-50">
      <div className="h-full px-4 flex items-center">
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
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
            {/* Add DialogTitle for accessibility */}
            <VisuallyHidden>
              <DialogTitle>Navigation Menu</DialogTitle>
            </VisuallyHidden>

            <div className="h-full flex flex-col">
              <UserProfile />
              <NavLinks closeSidebar={closeSidebar} />
              <LogoutButton />
            </div>
          </SheetContent>
        </Sheet>

        <div className="ml-4 flex items-center">
          <Brush className="h-6 w-6 mr-2 text-[#2ECC71]" aria-hidden="true" />
          <span className="text-lg font-bold text-[#2ECC71]">Sijarta</span>
        </div>
      </div>
    </nav>
  );
}
