// src/components/GroupTasksGantt.tsx
import * as Gantt from "frappe-gantt-react";

import type { Task } from "../types";
import "../assets/styles/gantt.scss";

type Props = {
  tasks: Task[];
};

export default function GroupTasksGantt({ tasks }: Props) {
  // Map task sang format của Gantt
  const ganttTasks = tasks.map((t) => ({
    id: t.task_id,
    name: t.title,
    start: t.created_at || new Date().toISOString(),
    end: t.due_date || new Date().toISOString(),
    progress: t.is_completed ? 100 : 0,
    dependencies: "", // có thể bổ sung sau
    custom_class:
      t.priority === "high"
        ? "gantt-task-high"
        : t.priority === "low"
        ? "gantt-task-low"
        : "gantt-task-medium",
  }));

  return (
    <div style={{ marginTop: 20 }}>
      <h3 style={{ marginBottom: 12 }}>📊 Gantt Chart</h3>
      <Gantt.default tasks={ganttTasks} viewMode="Day" />
    </div>
  );
}
