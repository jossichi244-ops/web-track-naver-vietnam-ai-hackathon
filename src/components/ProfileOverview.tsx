// src/components/ProfileOverview.tsx
import type { UserProfile } from "../types";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import "../assets/styles/profile-overview.scss";

interface Props {
  profile: UserProfile;
  onUpdatePreferences: (
    prefs: Partial<UserProfile["preferences"]>
  ) => Promise<UserProfile>;
}

export default function ProfileOverview({
  profile,
}: // onUpdatePreferences,
Props) {
  const summary = profile.profile_summary;
  // const prefs = profile.preferences;

  // Dữ liệu Pie chart
  const data = [
    { name: "Completed", value: summary.completed_tasks },
    { name: "In Progress", value: summary.in_progress_tasks },
    { name: "Pending", value: summary.pending_tasks },
  ];

  const COLORS = ["#10b981", "#3b82f6", "#f59e0b"];

  // const handleTogglePush = async () => {
  //   try {
  //     await onUpdatePreferences({
  //       web_push_enabled: !prefs.web_push_enabled,
  //     });
  //   } catch (err) {
  //     console.error("Toggle push failed:", err);
  //     alert("Failed to update preferences.");
  //   }
  // };

  return (
    <div className="profile-overview-container">
      {/* Productivity stats */}
      <div className="productivity-stats">
        <div>
          <h3>Productivity Score</h3>
          <p className="score-value">
            {summary.productivity_score.toFixed(0)}%
          </p>
          <p className="task-count">
            {summary.completed_tasks} / {summary.total_tasks} tasks completed
          </p>
        </div>

        <div className="task-overview-chart">
          <PieChart width={250} height={200}>
            <Pie
              data={data}
              cx={120}
              cy={100}
              innerRadius={40}
              outerRadius={70}
              paddingAngle={4}
              dataKey="value"
              label>
              {data.map((_, i) => (
                <Cell
                  key={`cell-${i}`}
                  fill={COLORS[i % COLORS.length]}
                  className="recharts-pie-sector"
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      </div>

      {/* Web Push Toggle */}
      {/* <div className="toggle-section">
        <span className="toggle-label">Web Push Notifications</span>
        <button
          onClick={handleTogglePush}
          className={`toggle-button ${
            prefs.web_push_enabled ? "enabled" : "disabled"
          }`}>
          {prefs.web_push_enabled ? "ENABLED" : "DISABLED"}
        </button>
      </div> */}
    </div>
  );
}
