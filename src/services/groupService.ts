import { request } from "./request";
import type { GroupCreatePayload, GroupResponse } from "../types";

export const groupService = {
  list: (walletAddress?: string, isPublic?: boolean) => {
    const params = new URLSearchParams();
    if (walletAddress) params.append("wallet_address", walletAddress);
    if (typeof isPublic !== "undefined") {
      params.append("is_public", String(isPublic));
    }
    return request<GroupResponse[]>(`/groups?${params.toString()}`);
  },

  get: (groupId: string) =>
    request<GroupResponse>(`/groups/${encodeURIComponent(groupId)}`),

  create: (payload: GroupCreatePayload) =>
    request<GroupResponse>("/groups/", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};
