// src/components/TaskForm.tsx
import React, { useEffect, useState } from "react";
import type { Task } from "../types";
import "../assets/styles/task-form.scss";

import "react-datepicker/dist/react-datepicker.css";
import {
  FaPlus,
  // FaCheck,
  FaExclamationTriangle,
  FaHourglassHalf,
  FaTag,
  FaCalendarAlt,
  FaPaperPlane,
} from "react-icons/fa";

type Props = {
  onCreate: (payload: {
    title: string;
    description?: string;
    tags: string[];
    priority?: "low" | "medium" | "high";
    due_date?: string | null;
    group_id?: string | null;
    metadata?: unknown;
  }) => Promise<Task>;
  groupId?: string | null;
};

export default function TaskForm({ onCreate, groupId }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tagsText, setTagsText] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [dueDate, setDueDate] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [estimatedHours, setEstimatedHours] = useState<number>(0);
  const [requiredSkills, setRequiredSkills] = useState<string>("");
  // const [estimatedHours, setEstimatedHours] = useState<number>(0);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // ✅ Chuẩn hóa tags (theo schema min_items=1, max_items=5)
    const tags = tagsText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 5);

    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    if (tags.length === 0) {
      setError("Please enter at least one tag");
      return;
    }

    setSubmitting(true);
    try {
      const metadata = groupId
        ? {
            estimated_hours: estimatedHours || undefined,
            required_skills: requiredSkills
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean),
          }
        : undefined;
      await onCreate({
        title: title.trim(),
        description: description.trim() || undefined,
        tags,
        priority,
        due_date: dueDate ? new Date(dueDate).toISOString() : null,
        group_id: groupId,
        metadata,
      });

      // Reset form
      setTitle("");
      setDescription("");
      setTagsText("");
      setPriority("medium");
      setDueDate("");
      setEstimatedHours(0);
      setRequiredSkills("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Create failed");
    } finally {
      setSubmitting(false);
    }
  };
  useEffect(() => {
    if (dueDate) {
      const dueDateObj = new Date(dueDate);
      const now = new Date();
      const diffMs = dueDateObj.getTime() - now.getTime();

      if (diffMs > 0) {
        const hours = diffMs / (1000 * 60 * 60);
        setEstimatedHours(parseFloat(hours.toFixed(2))); // giữ 2 chữ số thập phân
      } else {
        setEstimatedHours(0); // nếu dueDate trước hiện tại
      }
    } else {
      setEstimatedHours(0); // nếu không có dueDate
    }
  }, [dueDate]);
  return (
    <form onSubmit={handleSubmit} className="task-form-container">
      <h3 className="form-title">
        <FaPlus /> Create a New On-Chain Task
      </h3>

      <div className="form-group">
        <label className="form-label">Title *</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title (max 200 chars)"
          maxLength={200}
          className="form-input"
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional description (max 1000 chars)"
          maxLength={1000}
          className="form-textarea"
        />
      </div>

      <div className="form-row">
        <div className="form-group flex-1">
          <label className="form-label">
            <FaTag /> Tags * (comma separated)
          </label>
          <input
            value={tagsText}
            onChange={(e) => setTagsText(e.target.value)}
            placeholder="web3, dapp, contract"
            className="form-input"
          />
        </div>
        <div className="form-group priority-select-group">
          <label className="form-label">
            <FaExclamationTriangle /> Priority
          </label>
          <div className="priority-options">
            {["low", "medium", "high"].map((p) => (
              <button
                key={p}
                type="button"
                className={`priority-chip ${p} ${
                  priority === p ? "active" : ""
                }`}
                onClick={() => setPriority(p as "low" | "medium" | "high")}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">
          <FaCalendarAlt /> Due date (optional)
        </label>
        <input
          type="datetime-local"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="form-input"
        />
      </div>
      {groupId && (
        <>
          <div className="form-group">
            <label className="form-label">Estimated Hours</label>
            <input
              type="number"
              min={0}
              step={0.01}
              value={estimatedHours}
              onChange={(e) => setEstimatedHours(parseFloat(e.target.value))}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">
              Required Skills (comma-separated)
            </label>
            <input
              type="text"
              value={requiredSkills}
              onChange={(e) => setRequiredSkills(e.target.value)}
              placeholder="e.g. Solidity, React"
              className="form-input"
            />
          </div>
        </>
      )}

      {error && (
        <div className="error-message">
          <FaExclamationTriangle /> {error}
        </div>
      )}

      <div className="form-actions">
        <button
          type="submit"
          disabled={submitting}
          className={`submit-button ${submitting ? "is-submitting" : ""}`}>
          {submitting ? (
            <>
              <FaHourglassHalf className="spinner" /> Creating...
            </>
          ) : (
            <>
              <FaPaperPlane /> Create Task
            </>
          )}
        </button>
      </div>
    </form>
  );
}
