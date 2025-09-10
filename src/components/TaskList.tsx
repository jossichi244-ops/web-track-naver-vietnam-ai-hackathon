import { useState } from "react";
import type { Task } from "../types";
import "../assets/styles/task-list.scss";

interface Props {
  tasks: Task[];
}

export default function TaskList({ tasks }: Props) {
  const [filter, setFilter] = useState("all");

  const filtered = tasks.filter((t) => {
    if (filter === "all") return true;
    if (filter === "completed")
      return t.is_completed || t.status === "completed";
    if (filter === "pending")
      return !(t.is_completed || t.status === "completed");
    return true;
  });
  console.log("Tasks in TaskList:", tasks);

  const getPriorityClass = (priority: string) => {
    if (priority === "high") return "high";
    if (priority === "medium") return "medium";
    return "low";
  };

  return (
    <div className="task-list-container">
      {/* Filter */}
      <div className="mb-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="task-filter-select">
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="pending">Incomplete</option>
        </select>
      </div>

      {/* Task List */}
      <ul className="task-list">
        {filtered.map((t) => (
          <li key={t.task_id} className="task-item">
            <span className="task-title">{t.title}</span>
            <span
              className={`task-priority-badge ${getPriorityClass(t.priority)}`}>
              {t.priority}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
