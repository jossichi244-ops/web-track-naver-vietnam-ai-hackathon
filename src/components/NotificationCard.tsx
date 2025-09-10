import { useState, useMemo } from "react";
import type { Task } from "../types";
import "../assets/styles/notification-card.scss";

interface Props {
  tasks: Task[];
}

export default function NotificationCard({ tasks }: Props) {
  const [open, setOpen] = useState(false);

  // Lấy các task chưa hoàn thành
  const pendingTasks = useMemo(
    () => tasks.filter((t) => !t.is_completed && t.status !== "completed"),
    [tasks]
  );

  // Convert thành notifications
  const notifications = useMemo(
    () =>
      pendingTasks.map((t) => {
        const due = t.due_date
          ? new Date(t.due_date).toLocaleString("vi-VN", {
              day: "2-digit",
              month: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "No deadline";

        return {
          id: t.task_id,
          title: `Task: ${t.title}`,
          message: `Deadline: ${due}`,
          time: `Priority: ${t.priority}`,
          read: false,
        };
      }),
    [pendingTasks]
  );

  return (
    <div className="notification-wrapper">
      {/* Icon bell */}
      <button
        className="notification-bell"
        onClick={() => setOpen((prev) => !prev)}>
        🔔
        {notifications.length > 0 && <span className="unread-dot"></span>}
      </button>

      {/* Popup */}
      {open && (
        <div className="notification-popup">
          <h4 className="popup-header">Notifications</h4>
          <ul className="notification-list">
            {notifications.map((n) => (
              <li key={n.id} className="notification-item unread">
                <div className="notification-title">{n.title}</div>
                <div className="notification-message">{n.message}</div>
                <div className="notification-time">{n.time}</div>
              </li>
            ))}
          </ul>
          {notifications.length === 0 && (
            <p className="empty-text">Không có thông báo nào</p>
          )}
        </div>
      )}
    </div>
  );
}
