// src/hooks/useAuth.tsx
import { useState } from "react";
import { ethers } from "ethers";
import type { User } from "../types";
import { useAuthContext } from "./useAuthContext";

export function useAuth() {
  const [account, setAccount] = useState<string | null>(null);
  // const [user, setUser] = useState<User | null>(null);
  const { user, setUser, logout } = useAuthContext();
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask not found");
      return;
    }
    const provider = new ethers.BrowserProvider(window.ethereum!); // ✅ Đã sửa
    const accounts = await provider.send("eth_requestAccounts", []);
    setAccount(accounts[0]);
  };

  const login = async () => {
    if (!account) return;

    try {
      const res = await fetch("http://localhost:8000/auth/challenge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet_address: account }),
      });

      if (!res.ok) {
        throw new Error(
          `Failed to get challenge: ${res.status} ${res.statusText}`
        );
      }

      const data = await res.json();

      if (!data.challenge) {
        throw new Error("No challenge received from server");
      }

      const challenge = data.challenge;

      const provider = new ethers.BrowserProvider(window.ethereum!);
      const signer = await provider.getSigner();
      const signature = await signer.signMessage(challenge); // ✅ Giờ challenge chắc chắn là string

      const res2 = await fetch("http://localhost:8000/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet_address: account, signature }),
      });

      if (!res2.ok) {
        const errorText = await res2.text();
        throw new Error(`Verify failed: ${res2.status} ${errorText}`);
      }

      const data2 = await res2.json();
      const loggedInUser: User = {
        user_id: data2.user_id,
        wallet_address: data2.wallet_address,
        access_token: data2.access_token,
      };
      setUser(loggedInUser);
    } catch (err) {
      console.error("Login error:", err);
      alert(
        "Login failed: " +
          (err instanceof Error ? err.message : "Unknown error")
      );
    }
  };

  return { account, user, connectWallet, login, logout };
}
