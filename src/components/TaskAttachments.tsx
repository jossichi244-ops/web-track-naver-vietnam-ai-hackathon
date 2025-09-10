// src/components/TaskAttachments.tsx
import { useEffect, useState } from "react";
import { getAttachments } from "../services/taskSubmitService";
import { useAuthContext } from "../hooks/useAuthContext";

interface Props {
  taskId: string;
}

interface Attachment {
  _id: string;
  file_name: string;
  file_url: string;
  mime_type?: string;
  uploaded_at: string;
}

export default function TaskAttachments({ taskId }: Props) {
  const { user } = useAuthContext();
  const token = user?.access_token;
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    getAttachments(taskId, token)
      .then(setAttachments)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [taskId, token]);

  if (loading) return <div>Đang tải file...</div>;
  if (!attachments.length) return <div>No attachment available.</div>;

  return (
    <div className="attachments">
      {attachments.map((a) => (
        <div key={a._id} className="attachment-item">
          <p>
            📎 <strong>{a.file_name}</strong> ({a.mime_type}) <br />
            <small>Uploaded: {new Date(a.uploaded_at).toLocaleString()}</small>
          </p>

          {/* 👉 Embed file trực tiếp */}
          {a.mime_type?.startsWith("image/") ? (
            <img
              src={a.file_url}
              alt={a.file_name}
              style={{ maxWidth: "300px" }}
            />
          ) : a.mime_type?.startsWith("video/") ? (
            <video controls width="400">
              <source src={a.file_url} type={a.mime_type} />
              Trình duyệt không hỗ trợ video.
            </video>
          ) : a.mime_type === "application/pdf" ? (
            <iframe
              src={a.file_url}
              title={a.file_name}
              width="100%"
              height="400px"
            />
          ) : (
            <a href={a.file_url} target="_blank" rel="noreferrer">
              View file
            </a>
          )}
        </div>
      ))}
    </div>
  );
}
