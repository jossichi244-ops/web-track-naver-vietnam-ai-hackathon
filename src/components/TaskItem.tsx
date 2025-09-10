import { useState } from "react";
import type { Task } from "../types";
import { motion, AnimatePresence } from "framer-motion";
import TaskComments from "./TaskComments";
import "../assets/styles/taskitem.scss";
import SubmitTaskModal from "./SubmitTaskModal";
import TaskAttachments from "./TaskAttachments";

interface Props {
  task: Task;
  onToggleComplete: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export default function TaskItem({ task, onToggleComplete, onDelete }: Props) {
  const [showComments, setShowComments] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
  };

  return (
    <motion.div
      className={`task-item ${task.is_completed ? "completed" : ""}`}
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      layout>
      <div className="task-header">
        <div className="task-content">
          <input
            type="checkbox"
            checked={task.is_completed}
            onChange={() => onToggleComplete(task)}
            className="task-checkbox"
          />
          <div className="task-details">
            <div className="task-title-group">
              <span className="task-title">{task.title}</span>
              <span className={`task-priority priority-${task.priority}`}>
                {task.priority}
              </span>
            </div>
            {task.tags.length > 0 && (
              <div className="task-tags">Tags: {task.tags.join(", ")}</div>
            )}
            {task.due_date && (
              <div className="task-due-date">
                ⏰ Due: {new Date(task.due_date).toLocaleString()}
              </div>
            )}
            {task.description && (
              <div className="task-description">{task.description}</div>
            )}{" "}
            <TaskAttachments taskId={task.task_id} />
          </div>
        </div>
        <div className="task-actions">
          <motion.button
            onClick={() => setShowComments(!showComments)}
            className="action-button comments"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}>
            {showComments ? "❌" : "💬"}
          </motion.button>
          {!task.is_completed && (
            <motion.button
              onClick={() => setShowSubmitModal(true)}
              className="action-button mark-done"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}>
              Mark Done
            </motion.button>
          )}
          <motion.button
            onClick={() => onDelete(task.task_id)}
            className="action-button delete"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}>
            <button aria-label="Delete item" className="delete-button">
              <svg
                className="trash-svg"
                viewBox="0 -10 64 74"
                xmlns="http://www.w3.org/2000/svg">
                <g id="trash-can">
                  <rect
                    x="16"
                    y="24"
                    width="32"
                    height="30"
                    rx="3"
                    ry="3"
                    fill="#dbdbdbff"></rect>
                  <g transform-origin="12 18" id="lid-group">
                    <rect
                      x="12"
                      y="12"
                      width="40"
                      height="6"
                      rx="2"
                      ry="2"
                      fill="#f5f2f2ff"></rect>
                    <rect
                      x="26"
                      y="8"
                      width="12"
                      height="4"
                      rx="2"
                      ry="2"
                      fill="#d8d7d7ff"></rect>
                  </g>
                </g>
              </svg>
            </button>
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {showComments && (
          <motion.div
            className="task-comments-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 20,
            }}
            layout>
            <TaskComments taskId={task.task_id} />
          </motion.div>
        )}
      </AnimatePresence>
      {showSubmitModal && (
        <AnimatePresence>
          {showSubmitModal && (
            <motion.div
              className="submit-modal-wrapper"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 20,
              }}
              layout>
              <SubmitTaskModal
                task={task}
                onClose={() => setShowSubmitModal(false)}
                onSuccess={() => {
                  setShowSubmitModal(false);
                  onToggleComplete(task);
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </motion.div>
  );
}
