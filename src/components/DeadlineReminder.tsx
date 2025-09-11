import { useState, useEffect } from "react";
import type { Task } from "../types";
import "../assets/styles/notification-card.scss";

interface Props {
  tasks: Task[];
}

interface ReminderNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export default function DeadlineReminder({ tasks }: Props) {
  const [open, setOpen] = useState(false);
  const [reminders, setReminders] = useState<ReminderNotification[]>([]);

  useEffect(() => {
    const now = new Date();

    const newReminders: ReminderNotification[] = [];

    tasks.forEach((t) => {
      if (!t.is_completed && t.due_date) {
        const due = new Date(t.due_date);
        const diffMinutes = (due.getTime() - now.getTime()) / (1000 * 60);

        if (diffMinutes <= 30 && diffMinutes > 10) {
          // Reminder 30 phút trước
          newReminders.push({
            id: t.task_id + "-30",
            title: `Task sắp đến hạn`,
            message: `${t.title} sẽ hết hạn sau 30 phút`,
            time: `Deadline: ${due.toLocaleTimeString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
            })}`,
            read: false,
          });
        } else if (diffMinutes <= 10 && diffMinutes > 0) {
          // Reminder 10 phút trước
          newReminders.push({
            id: t.task_id + "-10",
            title: `Task sắp hết hạn`,
            message: `${t.title} sẽ hết hạn sau 10 phút`,
            time: `Deadline: ${due.toLocaleTimeString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
            })}`,
            read: false,
          });
        }
      }
    });

    setReminders(newReminders);
  }, [tasks]);

  return (
    <div className="notification-wrapper">
      <button
        className="notification-bell"
        onClick={() => setOpen((prev) => !prev)}>
        ⏰{reminders.length > 0 && <span className="unread-dot"></span>}
      </button>

      {open && (
        <div className="notification-popup">
          <h4 className="popup-header">Deadline Reminders</h4>
          <ul className="notification-list">
            {reminders.map((r) => (
              <li key={r.id} className="notification-item unread">
                <div className="notification-title">{r.title}</div>
                <div className="notification-message">{r.message}</div>
                <div className="notification-time">{r.time}</div>
              </li>
            ))}
          </ul>
          {reminders.length === 0 && (
            <p className="empty-text">Không có nhắc nhở nào</p>
          )}
        </div>
      )}
    </div>
  );
}
