// src/hooks/useTasks.ts
import { useEffect, useState, useCallback } from "react";
import type { Task } from "../types";
import * as api from "../services/taskService";

// Lấy access token từ localStorage key "user"
function getToken(): string | null {
  const userString = localStorage.getItem("user");
  if (!userString) return null;

  try {
    const user = JSON.parse(userString);
    return user.access_token ?? null;
  } catch {
    return null;
  }
}

export function useTasks(opts?: {
  access_token?: string;
  walletAddress?: string;
  userId?: string;
}) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getEffectiveToken = useCallback(() => {
    return opts?.access_token || getToken();
  }, [opts?.access_token]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await api.fetchTasks({
        wallet_address: opts?.walletAddress,
        user_id: opts?.userId,
      });
      setTasks(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to load tasks");
      }
    } finally {
      setLoading(false);
    }
  }, [opts?.walletAddress, opts?.userId]);

  useEffect(() => {
    load();
  }, [load]);

  const addTask = useCallback(
    async (payload: Parameters<typeof api.createTask>[0]) => {
      const token = getEffectiveToken();
      if (!token) throw new Error("Unauthorized: no access token");

      // Lấy user từ localStorage (hoặc có thể truyền qua opts nếu bạn sửa)
      const userString = localStorage.getItem("user");
      if (!userString) throw new Error("User data missing");

      const user = JSON.parse(userString);
      if (!user.user_id || !user.wallet_address)
        throw new Error("User ID or Wallet Address missing");

      const payloadWithUser = {
        ...payload,
        user_id: user.user_id,
        wallet_address: user.wallet_address,
      };

      try {
        const created = await api.createTask(payloadWithUser, token);
        setTasks((prev) => [created, ...prev]);
        return created;
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to create task");
        }
        throw err;
      }
    },
    [getEffectiveToken]
  );

  const saveTask = useCallback(
    async (taskId: string, updates: Partial<Task>) => {
      const token = getEffectiveToken();
      if (!token) throw new Error("Unauthorized: no access token");

      try {
        const updated = await api.updateTask(taskId, updates, token);
        setTasks((prev) =>
          prev.map((t) => (t.task_id === updated.task_id ? updated : t))
        );
        return updated;
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to update task");
        }
        throw err;
      }
    },
    [getEffectiveToken]
  );

  const removeTask = useCallback(
    async (taskId: string) => {
      const token = getEffectiveToken();
      if (!token) throw new Error("Unauthorized: no access token");

      if (!taskId) {
        setError("Task ID is required");
        return;
      }
      try {
        await api.deleteTask(taskId, token);
        setTasks((prev) => prev.filter((t) => t.task_id !== taskId));
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to delete task");
        }
        throw err;
      }
    },
    [getEffectiveToken]
  );

  return { tasks, loading, error, reload: load, addTask, saveTask, removeTask };
}
