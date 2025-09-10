import type { TaskComment } from "../types";
import { API_BASE } from "../constants/api";

export async function fetchComments(
  taskId: string,
  token: string
): Promise<TaskComment[]> {
  const res = await fetch(`${API_BASE}/comments/task/${taskId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch comments");
  return res.json();
}

export async function createComment(
  taskId: string,
  content: string,
  token: string
): Promise<TaskComment> {
  const res = await fetch(`${API_BASE}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ task_id: taskId, content }),
  });
  if (!res.ok) throw new Error("Failed to create comment");
  return res.json();
}

export async function deleteComment(
  commentId: string,
  token: string
): Promise<void> {
  const res = await fetch(`${API_BASE}/comments/${commentId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to delete comment");
}
