import type { UserProfile, Task } from "../types";
import CalendarView from "./CalendarView";
import NotificationCard from "./NotificationCard";

import TaskList from "./TaskList";

interface Props {
  profile: UserProfile;
  tasks: Task[];
}

export default function Dashboard({ tasks }: Props) {
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <NotificationCard tasks={tasks} />
      </div>

      <div className="dashboard-card calendar-card">
        <div className="card-header">
          <h2>
            <span className="calendar">📅</span> Calendar
          </h2>
        </div>
        <CalendarView tasks={tasks} />
      </div>

      {/* Task List */}
      <div className="dashboard-card tasklist-card">
        <div className="card-header">
          <h2>
            <span className="task">✅</span> Task List
          </h2>
        </div>
        <TaskList tasks={tasks} />
      </div>
    </div>
  );
}
