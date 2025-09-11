// src/components/ChallengeCard.tsx
import React, { useState } from "react";
import type { Challenge } from "../types";
import {
  ExternalLink,
  Hash,
  Clock,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import "../assets/styles/challenge-card.scss";

type Props = {
  data: Challenge;
};

const ChallengeCard: React.FC<Props> = ({ data }) => {
  const [showEmbeddedView, setShowEmbeddedView] = useState(false);
  const [isIframeFailed, setIsIframeFailed] = useState(false);

  const handleCardClick = (e: React.MouseEvent) => {
    // Ngăn chặn sự kiện click lan truyền
    const target = e.target as HTMLElement;
    if (
      target.tagName === "A" ||
      target.closest("a") ||
      target.tagName === "SPAN" ||
      target.closest("span") ||
      target.tagName === "BUTTON"
    ) {
      return;
    }
    setShowEmbeddedView(true);
  };

  const handleCloseEmbeddedView = () => {
    setShowEmbeddedView(false);
    setIsIframeFailed(false); // Reset trạng thái lỗi khi đóng
  };

  const handleIframeLoad = () => {
    // Logic kiểm tra iframe. Cần một cách đáng tin cậy hơn nếu có thể.
    // Ví dụ: sử dụng postMessage hoặc kiểm tra xem nội dung có bị chặn không.
    // Với iframe có cùng domain, có thể kiểm tra document.body.
    // Đối với cross-domain, cách này không hiệu quả và cần một cách tiếp cận khác.
    // Tuy nhiên, việc sử dụng sự kiện onError vẫn là cách phổ biến nhất
    // để xử lý các trường hợp chặn hiển thị.
  };

  const handleIframeError = () => {
    setIsIframeFailed(true);
  };

  return (
    <div className="challenge-card-cyb" onClick={handleCardClick}>
      {/* Embedded View (Ẩn/Hiện dựa vào state) */}
      {showEmbeddedView && (
        <div className="embedded-view-cyb">
          <button
            className="close-embedded-btn-cyb"
            onClick={handleCloseEmbeddedView}>
            <XCircle size={24} />
          </button>
          {isIframeFailed ? (
            <div className="iframe-error-state-cyb">
              <AlertTriangle size={48} className="error-icon-cyb" />
              <p className="error-message-cyb">
                This website does not allow embedding.
                <br />
                Please open it in a new tab.
              </p>
              <a
                href={data.challenge_url}
                target="_blank"
                rel="noopener noreferrer"
                className="open-link-btn-cyb">
                Open Challenge
                <ExternalLink size={16} />
              </a>
            </div>
          ) : (
            <iframe
              src={data.challenge_url}
              title={data.title || "Embedded Challenge"}
              className="embedded-iframe-cyb"
              frameBorder="0"
              sandbox="allow-scripts allow-same-origin allow-popups"
              onLoad={handleIframeLoad}
              onError={handleIframeError}></iframe>
          )}
        </div>
      )}

      {/* Content của card */}
      <a
        href={data.challenge_url}
        target="_blank"
        rel="noopener noreferrer"
        className="challenge-title-cyb"
        title={data.title || data.challenge_url}
        onClick={(e) => e.stopPropagation()}>
        <ExternalLink size={18} className="link-icon-cyb" />
        <span className="title-text-cyb">{data.title || "Challenge Link"}</span>
      </a>

      <p className="challenge-description-cyb">{data.description}</p>

      <div className="challenge-tags-cyb">
        {data.tags?.map((tag, index) => (
          <span
            key={index}
            className="tag-pill-cyb"
            onClick={(e) => e.stopPropagation()}>
            <Hash size={12} className="tag-icon-cyb" />
            {tag}
          </span>
        ))}
      </div>

      <div className="challenge-meta-cyb">
        <Clock size={14} className="meta-icon-cyb" />
        <span className="meta-text-cyb">
          Shared at: {new Date(data.shared_at).toLocaleString()}
        </span>
      </div>
    </div>
  );
};

export default ChallengeCard;
