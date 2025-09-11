// src/components/CalendarView.tsx
import Calendar, { type CalendarProps } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useState } from "react";
import "../assets/styles/calendar-view.scss";
import type { Task } from "../types";
import Swal from "sweetalert2";

type Value = Date | null;

interface Props {
  tasks?: Task[];
}

export default function CalendarView({ tasks = [] }: Props) {
  const [value, setValue] = useState<Value>(new Date());

  const formatDateKey = (date: Date) => date.toLocaleDateString("en-CA");

  // Group tasks theo ngày (chỉ xử lý khi có due_date)
  const tasksByDate = tasks.reduce<Record<string, Task[]>>((acc, t) => {
    if (!t.due_date) return acc; // tránh lỗi khi null
    const key = t.due_date.slice(0, 10);
    acc[key] = acc[key] || [];
    acc[key].push(t);
    return acc;
  }, {});

  const handleClickDay: CalendarProps["onClickDay"] = (date) => {
    const key = formatDateKey(date);
    const dayTasks = tasksByDate[key] || [];
    if (dayTasks.length) {
      Swal.fire({
        title: `Tasks on ${key}`,
        html: dayTasks.map((t) => `<p>• ${t.title}</p>`).join(""),
        icon: "info",
        confirmButtonText: "Close",
        background: "#0b4224ff",
        color: "#e6e6e6ff",
        backdrop: `
          rgba(0,0,0,0.4)
          left top
          no-repeat
        `,
      });
    }
  };

  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month") {
      const key = formatDateKey(date);
      if (tasksByDate[key]) {
        return "react-calendar__tile--has-tasks";
      }
    }
  };

  return (
    <Calendar
      value={value}
      onChange={(val) => {
        if (val instanceof Date || val === null) {
          setValue(val);
        }
      }}
      onClickDay={handleClickDay}
      tileClassName={tileClassName}
    />
  );
}
