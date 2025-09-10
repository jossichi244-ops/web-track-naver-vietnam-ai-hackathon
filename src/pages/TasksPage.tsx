// import { useState } from "react";
import TaskForm from "../components/TaskForm";
import TaskItem from "../components/TaskItem";
import { useTasks } from "../hooks/useTasks";
import type { Task } from "../types";
import { useAuthContext } from "../hooks/useAuthContext";
import "../assets/styles/tasksPage.scss";

export default function TasksPage() {
  const { user } = useAuthContext();
  const { tasks, loading, error, reload, addTask, saveTask, removeTask } =
    useTasks({
      walletAddress: user?.wallet_address || "",
      userId: user?.user_id || "",
    });

  const handleCreate = async (payload: Parameters<typeof addTask>[0]) => {
    if (!user) {
      throw new Error("User not authenticated");
    }
    console.log("Create task payload:", payload);

    return addTask(payload);
  };

  const handleToggle = async (task: Task) => {
    const newStatus = task.is_completed ? "pending" : "completed";
    await saveTask(task.task_id, { status: newStatus });
  };

  const handleDelete = async (taskId: string) => {
    // Replaced confirm() with a custom UI message
    const confirmed = window.confirm("Delete this task?");
    if (!confirmed) return;
    await removeTask(taskId);
  };

  if (!user) {
    return (
      <div className="tasks-page-unauth">
        <p className="status-message">Please connect wallet to view tasks.</p>
      </div>
    );
  }

  return (
    <div className="tasks-page-container">
      <aside className="task-form-panel">
        <div className="task-form-wrapper">
          <TaskForm onCreate={handleCreate} />
        </div>
      </aside>

      <main className="tasks-list-panel">
        <div className="tasks-list-header">
          <h1 className="header-title">Your On-Chain Tasks</h1>
          <div className="reload-btn-container">
            <button onClick={reload} className="reload-button">
              Reload
            </button>
          </div>
        </div>

        {loading && <div className="status-message loading">Loading...</div>}
        {error && <div className="status-message error">{error}</div>}

        {!loading && tasks.length === 0 && (
          <div className="status-message">
            No tasks yet — create your first one!
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
