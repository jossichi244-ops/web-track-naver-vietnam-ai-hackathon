import { useContext } from "react";
import { AuthContext } from "../context/AuthContextInstance";
import { request } from "./api";
import type { GroupCreatePayload, GroupResponse } from "../types";

export function useGroupService() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useGroupService must be used within an AuthProvider");
  }

  const { user } = context;

  const token = user?.access_token;
  const walletAddress = user?.wallet_address;

  if (!token) {
    console.warn("⚠️ Token not found in AuthContext");
  }

  return {
    list: (overrideWallet?: string, isPublic?: boolean) => {
      const params = new URLSearchParams();

      const finalWallet = overrideWallet ?? walletAddress;

      if (finalWallet) params.append("wallet_address", finalWallet);
      if (typeof isPublic !== "undefined") {
        params.append("is_public", String(isPublic));
      }

      return request<GroupResponse[]>(
        `/groups?${params.toString()}`,
        {},
        token
      );
    },

    get: (groupId: string) =>
      request<GroupResponse>(
        `/groups/${encodeURIComponent(groupId)}`,
        {},
        token
      ),

    create: (payload: GroupCreatePayload) =>
      request<GroupResponse>(
        "/groups/",
        {
          method: "POST",
          body: JSON.stringify(payload),
        },
        token
      ),

    update: (groupId: string, payload: Partial<GroupCreatePayload>) =>
      request<GroupResponse>(
        `/groups/${encodeURIComponent(groupId)}`,
        {
          method: "PUT",
          body: JSON.stringify(payload),
        },
        token
      ),

    remove: (groupId: string) =>
      request<{ status: string; group_id: string }>(
        `/groups/${encodeURIComponent(groupId)}`,
        {
          method: "DELETE",
        },
        token
      ),
  };
}
