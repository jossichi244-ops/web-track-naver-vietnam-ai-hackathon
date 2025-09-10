import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TaskForm from "../components/TaskForm";
import TaskItem from "../components/TaskItem";
import type { Task, TaskPriority } from "../types";
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../services/taskService";
import { useAuthContext } from "../hooks/useAuthContext";
import "../assets/styles/tasksPage.scss";

export default function GroupTasksPage() {
  const { groupId } = useParams<{ groupId: string }>();
  const { user } = useAuthContext();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  type TaskFormPayload = {
    title: string;
    description?: string;
    tags: string[];
    priority?: TaskPriority;
    due_date?: string | null;
    group_id?: string | null;
  };

  async function load() {
    if (!groupId || !user) return;
    setLoading(true);
    try {
      const data = await fetchTasks({ group_id: groupId });
      setTasks(data);
    } catch (err: unknown) {
      console.error(err);
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId, user]);

  async function handleCreate(payload: TaskFormPayload): Promise<Task> {
    if (!user) throw new Error("Not authenticated");
    const token = user.access_token!;
    const newTask = await createTask({ ...payload, group_id: groupId }, token);
    setTasks((prev) => [...prev, newTask]);
    return newTask;
  }

  async function handleToggle(task: Task) {
    if (!user) return;
    const token = user.access_token!;
    const newStatus = task.is_completed ? "pending" : "completed";
    const updated = await updateTask(
      task.task_id,
      { status: newStatus },
      token
    );
    setTasks((prev) =>
      prev.map((t) => (t.task_id === updated.task_id ? updated : t))
    );
  }

  async function handleDelete(taskId: string) {
    if (!user) return;
    const confirmed = window.confirm("Delete this task?");
    if (!confirmed) return;
    const token = user.access_token!;
    await deleteTask(taskId, token);
    setTasks((prev) => prev.filter((t) => t.task_id !== taskId));
  }

  if (!user) {
    return (
      <div className="tasks-page-unauth">
        <p className="status-message">
          Please connect wallet to view group tasks.
        </p>
      </div>
    );
  }

  return (
    <div className="tasks-page-container">
      <aside className="task-form-panel">
        <div className="task-form-wrapper">
          <h1 className="header-title">Group Tasks</h1>
          <TaskForm onCreate={handleCreate} groupId={groupId} />
        </div>
      </aside>

      <main className="tasks-list-panel">
        <div className="tasks-list-header">
          <h1 className="header-title">Your On-Chain Tasks</h1>
          <div className="reload-btn-container">
            <button onClick={load} className="reload-button">
              Reload
            </button>
          </div>
        </div>

        {loading && <div className="status-message loading">Loading...</div>}
        {error && <div className="status-message error">{error}</div>}

        {!loading && tasks.length === 0 && (
          <div className="status-message">
            No tasks yet — create the first one!
          </div>
        )}

        <div className="tasks-list-scroll">
          <div className="tasks-list">
            {tasks.map((t) => (
              <TaskItem
                key={t.task_id}
                task={t}
                onToggleComplete={handleToggle}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
