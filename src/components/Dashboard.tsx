// src/pages/Dashboard.tsx
import type { UserProfile, Task } from "../types";
import CalendarView from "../components/CalendarView";
import NotificationCard from "../components/NotificationCard";
import TaskList from "../components/TaskList";
import { CalendarDays, CheckSquare } from "lucide-react";
import "../assets/styles/dashboard.scss";
interface Props {
  profile: UserProfile;
  tasks: Task[];
}

export default function Dashboard({ tasks }: Props) {
  return (
    <div className="dashboard-cyb-container">
      {/* Dashboard Header with Notifications */}
      <div className="dashboard-header-cyb">
        <NotificationCard tasks={tasks} />
      </div>

      {/* Main Grid Layout */}
      <div className="dashboard-grid-cyb">
        {/* Calendar Card */}
        <div className="dashboard-card-cyb calendar-card-cyb">
          <div className="card-header-cyb">
            <h2 className="card-title-cyb">
              <CalendarDays size={24} className="icon-cyb neon-blue-glow" />
              Calendar
            </h2>
          </div>
          <CalendarView tasks={tasks} />
        </div>

        {/* Task List Card */}
        <div className="dashboard-card-cyb tasklist-card-cyb">
          <div className="card-header-cyb">
            <h2 className="card-title-cyb">
              <CheckSquare size={24} className="icon-cyb neon-purple-glow" />
              Task List
            </h2>
          </div>
          <TaskList tasks={tasks} />
        </div>
      </div>
    </div>
  );
}
