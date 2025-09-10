import { useState } from "react";
import type { Task } from "../types";
import { motion } from "framer-motion";
import { uploadAttachment, verifyTask } from "../services/taskSubmitService";
import "../assets/styles/submittaskmodal.scss"; // Import the new stylesheet
import { useAuthContext } from "../hooks/useAuthContext";
interface Props {
  task: Task;
  onClose: () => void;
  onSuccess: () => void;
}

export default function SubmitTaskModal({ task, onClose, onSuccess }: Props) {
  const { user } = useAuthContext();
  const token = user?.access_token;
  const [fileName, setFileName] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    if (!fileName || !fileUrl) {
      setMessage({
        text: "Vui lòng điền đầy đủ tên & URL file.",
        type: "error",
      });
      return;
    }
    if (!token) {
      setMessage({
        text: "Bạn chưa đăng nhập hoặc token không hợp lệ.",
        type: "error",
      });
      return;
    }

    setLoading(true);
    try {
      // 1. Upload attachment
      await uploadAttachment(
        task.task_id,
        {
          file_name: fileName,
          file_url: fileUrl,
        },
        token
      );

      // 2. Sign message via Metamask (demo)
      const provider = window.ethereum;
      if (!provider) {
        throw new Error("Ví Metamask không được tìm thấy.");
      }

      const accounts = await provider.request({
        method: "eth_requestAccounts",
      });
      const wallet = accounts[0];
      const messageToSign = `Tôi đã hoàn thành công việc ${
        task.task_id
      } vào lúc ${new Date().toISOString()}`;
      const signature = await provider.request({
        method: "personal_sign",
        params: [messageToSign, wallet],
      });

      // 3. Save verification
      await verifyTask(
        task.task_id,
        { message: messageToSign, signature },
        token
      );

      setMessage({ text: "Nhiệm vụ đã được nộp thành công!", type: "success" });
      setTimeout(() => {
        onSuccess();
      }, 1000);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err);
      setMessage({
        text: `Gửi nhiệm vụ thất bại: ${err.message}`,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay">
      <motion.div
        className="modal-content"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}>
        <h3>Nộp nhiệm vụ</h3>
        <form onSubmit={handleSubmit}>
          {message && (
            <div className={`message ${message.type}`}>{message.text}</div>
          )}
          <input
            type="text"
            placeholder="Tên file"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            disabled={loading}
          />
          <input
            type="url"
            placeholder="URL file (ví dụ: https://...)"
            value={fileUrl}
            onChange={(e) => setFileUrl(e.target.value)}
            disabled={loading}
          />
          <div className="modal-actions">
            <button type="button" onClick={onClose} disabled={loading}>
              Hủy
            </button>
            <button type="submit" disabled={loading}>
              {loading ? "Đang gửi..." : "Gửi & Hoàn thành"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
