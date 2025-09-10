// src/hooks/useAuthContext.ts
import { useContext } from "react";
import { AuthContext } from "../context/AuthContextInstance";
import type { AuthContextType } from "../context/AuthContext";

export function useAuthContext(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuthContext must be used inside AuthProvider");
  }
  return ctx;
}
