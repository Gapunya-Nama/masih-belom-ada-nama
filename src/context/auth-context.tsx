"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { User, AuthState } from "@/lib/roles";
import { AuthCombined } from "@/lib/dataType/interfaces";
import { guestUser } from "./guest";

interface AuthContextType extends AuthState {
  login: (user: AuthCombined) => void;
  logout: (user: AuthCombined) => void;
  updateUser: (updates: Partial<AuthCombined>) => void;
  isGuest: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: guestUser,
    isAuthenticated: false,
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setAuthState({ user: JSON.parse(storedUser), isAuthenticated: true });
    } else {
      setAuthState({ user: guestUser, isAuthenticated: false });
    }
  }, []);
  

  const login = useCallback((user: AuthCombined) => {
    setAuthState({ user, isAuthenticated: true });
    localStorage.removeItem("user");
    localStorage.setItem("user", JSON.stringify(user)); 
  }, []);

  const logout = useCallback((user: AuthCombined) => {
    setAuthState({ user: guestUser, isAuthenticated: false });
    localStorage.removeItem("user"); 
  }, []);

  const updateUser = useCallback((updates: Partial<AuthCombined>) => {
    setAuthState((prevState) => {
      // Ensure `id` is always a string
      if (!prevState.user?.id) {
        throw new Error("User ID is missing. Cannot update user without a valid ID.");
      }
  
      const updatedUser: AuthCombined = {
        ...prevState.user,
        ...updates,
        id: prevState.user.id, // Ensure `id` remains unchanged and is a string
      };
  
      // Sync with local storage
      localStorage.setItem("user", JSON.stringify(updatedUser));
  
      // Update state
      return { ...prevState, user: updatedUser };
    });
  }, []);
  


  const isGuest = !authState.isAuthenticated && authState.user?.id === "guest";

  return (
    <AuthContext.Provider value={{ ...authState, login, logout, updateUser, isGuest }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
