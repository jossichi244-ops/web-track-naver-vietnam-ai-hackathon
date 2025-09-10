// src/services/taskSubmitService.ts
import { API_BASE } from "../constants/api";

export async function uploadAttachment(
  taskId: string,
  payload: { file_name: string; file_url: string },
  token: string
) {
  const res = await fetch(`${API_BASE}/tasks/${taskId}/attachments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Failed to upload attachment: ${res.status}`);
  }

  return res.json();
}

export async function verifyTask(
  taskId: string,
  payload: { message: string; signature: string; tx_hash?: string },
  token: string
) {
  const res = await fetch(`${API_BASE}/tasks/${taskId}/verifications`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Failed to verify task: ${res.status}`);
  }

  return res.json();
}
export async function getAttachments(taskId: string, token: string) {
  const res = await fetch(`${API_BASE}/tasks/${taskId}/attachments`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to load attachments: ${res.status}`);
  }
  return res.json();
}
