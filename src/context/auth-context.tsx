"use client";

import { createContext, useContext, useState, useCallback } from "react";
import type { User, AuthState } from "@/lib/roles";

interface AuthContextType extends AuthState {
  login: (user: User) => void;
  logout: () => void;
  isGuest: boolean;
}

const guestUser: User = {
  id: "guest",
  name: "Guest",
  role: "guest",
  Pno: ""
};


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: guestUser,
    isAuthenticated: false,
  });

  const login = useCallback((user: User) => {
    setAuthState({ user, isAuthenticated: true });
  }, []);

  const logout = useCallback(() => {
    setAuthState({ user: guestUser, isAuthenticated: false });
  }, []);

  const isGuest = !authState.isAuthenticated && authState.user?.id === "guest";

  return (
    <AuthContext.Provider value={{ ...authState, login, logout,isGuest }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  console.log(context);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}