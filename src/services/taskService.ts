// src/services/taskService.ts
import type { Task, TaskPriority } from "../types/index";
import { API_BASE } from "../constants/api";

function getAuthToken(): string | null {
  const stored = localStorage.getItem("user");
  if (!stored) return null;

  try {
    const user = JSON.parse(stored);
    return user?.access_token || null;
  } catch {
    return null;
  }
}

// ✅ fetchTasks tự lấy token trong localStorage
export async function fetchTasks(
  params: { wallet_address?: string; user_id?: string; group_id?: string } = {}
): Promise<Task[]> {
  const url = new URL(`${API_BASE}/tasks`);
  if (params.wallet_address)
    url.searchParams.set("wallet_address", params.wallet_address);
  if (params.user_id) url.searchParams.set("user_id", params.user_id);
  if (params.group_id) url.searchParams.set("group_id", params.group_id);

  const token = getAuthToken();
  if (!token) throw new Error("Not authenticated");

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error(`fetchTasks failed: ${res.status} ${await res.text()}`);
  }
  return (await res.json()) as Task[];
}

export async function createTask(
  payload: {
    title: string;
    description?: string;
    tags: string[];
    priority?: TaskPriority;
    due_date?: string | null;
    group_id?: string | null;
  },
  token: string
): Promise<Task> {
  const res = await fetch(`${API_BASE}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`createTask failed: ${res.status} ${text}`);
  }
  return (await res.json()) as Task;
}

export async function updateTask(
  taskId: string,
  updates: Partial<Task>,
  token: string
): Promise<Task> {
  const res = await fetch(`${API_BASE}/tasks/${taskId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`updateTask failed: ${res.status} ${text}`);
  }
  return (await res.json()) as Task;
}

export async function deleteTask(
  taskId: string,
  token: string
): Promise<{ status: string; task_id: string }> {
  const res = await fetch(`${API_BASE}/tasks/${taskId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`deleteTask failed: ${res.status} ${text}`);
  }
  return (await res.json()) as { status: string; task_id: string };
}
