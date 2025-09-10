import { request } from "./request";
import type { GroupMemberResponse, GroupMemberCreate } from "../types";
import { API_BASE } from "../constants/api";
export const groupMemberService = {
  list: (groupId: string) =>
    request<GroupMemberResponse[]>(`/group-members/${groupId}`),

  add: (payload: GroupMemberCreate) =>
    request<GroupMemberResponse>("/group-members", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  update: (memberId: string, payload: Partial<GroupMemberCreate>) =>
    request<GroupMemberResponse>(`/group-members/${memberId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  updateByWallet: async (
    groupId: string,
    walletAddress: string,
    data: { role: string }
  ): Promise<GroupMemberResponse> => {
    const url = `${API_BASE}/group-members/${groupId}?wallet_address=${encodeURIComponent(
      walletAddress
    )}`;
    const body = JSON.stringify({
      ...data,
      wallet_address: walletAddress, // Send wallet_address in the body
    });
    console.log("Request Body:", body);
    const res = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: body,
    });

    if (!res.ok) {
      throw new Error("Không thể cập nhật vai trò người dùng");
    }

    return res.json();
  },

  join: (groupId: string) =>
    request<GroupMemberResponse>(`/group-members/join?group_id=${groupId}`, {
      method: "POST",
    }),
};
