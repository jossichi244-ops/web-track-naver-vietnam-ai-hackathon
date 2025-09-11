import axios from "axios";
import { API_BASE } from "../constants/api";
import type { Challenge, ChallengeCreate } from "../types";

export const getAllChallenges = async () => {
  const res = await axios.get<Challenge[]>(`${API_BASE}/community-challenges`);
  return res.data;
};

// Chia sẻ challenge mới
export const shareChallenge = async (data: ChallengeCreate, token: string) => {
  try {
    const res = await axios.post(`${API_BASE}/community-challenges`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error while sharing challenge:", error);
    throw error;
  }
};
