import { useState, useEffect } from "react";
import type { UserProfile, UserPreferencesUpdate } from "../types";
import { API_BASE } from "../constants/api";

export function useUserProfile(wallet: string | null) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!wallet) return;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const res = await fetch(`${API_BASE}/users/${wallet}`);
        if (!res.ok) throw new Error("Failed to load user profile");
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        console.error("Load profile error:", err);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    })();
  }, [wallet]);

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!wallet) return;
    try {
      const res = await fetch(`${API_BASE}/users/${wallet}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Update failed");
      const data = await res.json();
      setProfile(data);
      return data;
    } catch (err) {
      console.error("Update profile error:", err);
      throw err;
    }
  };

  const updatePreferences = async (prefs: UserPreferencesUpdate) => {
    return updateProfile({ preferences: prefs } as Partial<UserProfile>);
  };

  return {
    profile,
    setProfile,
    updateProfile,
    updatePreferences,
    loading,
    error,
  };
}
