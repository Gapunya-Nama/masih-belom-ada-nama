"use client";

import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/app/components/navbar";
import { useAuth } from "@/context/auth-context";
import { usePathname } from "next/navigation"; 
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export function Providers({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const pathname = usePathname(); 
  const [authChecked, setAuthChecked] = useState(false); 

  useEffect(() => {
    // Define public routes
    const publicRoutes = ["/login", "/register"];
    const isPublicRoute = publicRoutes.some((route) => pathname?.startsWith(route));

    if (!authChecked && isAuthenticated !== undefined) {
      if (!isAuthenticated && !isPublicRoute) {

        window.location.href = "/login";
      }
      setAuthChecked(true); 
    }
  }, [isAuthenticated, authChecked, pathname]);

  if (!authChecked) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>{<Loader2 className="mr-2 h-4 w-4 animate-spin" />}</p>
      </div>
    );
  }

  return (
    <>
      {isAuthenticated && <Navbar />}
      {children}
      <Toaster />
    </>
  );
}
