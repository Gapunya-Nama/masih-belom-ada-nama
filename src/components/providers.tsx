"use client";

import Navbar from "@/app/components/navbar";
import { useAuth } from "@/context/auth-context";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export function Providers({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();  // Destructure user here
  const pathname = usePathname();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // Define public routes
    const publicRoutes = ["/login", "/logout", "/homepage", "/test"];
    const isPublicRoute = publicRoutes.some((route) => pathname?.startsWith(route));

    if (!authChecked && isAuthenticated !== undefined) {
      if (!isAuthenticated && !isPublicRoute) {
        window.location.href = "/login";  // Redirect to login if not authenticated
      }
      setAuthChecked(true);
    }
  }, [isAuthenticated, authChecked, pathname]);

  // Wait for user to be loaded before rendering the children
  if (!authChecked || !user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p><Loader2 className="mr-2 h-8 w-8 animate-spin" /></p>
      </div>
    );
  }

  return (
    <>
      {pathname !== "/login" && <Navbar />}
      {children}
    </>
  );
}
