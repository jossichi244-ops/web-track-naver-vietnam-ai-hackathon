// src/context/AuthContext.tsx
import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { User, UserProfile } from "../types";
import { AuthContext } from "./AuthContextInstance";

export interface AuthContextType {
  user: (User & { profile?: UserProfile }) | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  useEffect(() => {
    if (user) {
      // console.log("User:", user);
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
