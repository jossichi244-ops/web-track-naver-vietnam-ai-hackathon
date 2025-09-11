// src/components/ShareChallengeForm.tsx
import { useState } from "react";
import { shareChallenge } from "../services/communityChallengeService";
import type { ChallengeCreate } from "../types";
import { useAuthContext } from "../hooks/useAuthContext";
import { Link, Text, Tag, Send } from "lucide-react";
import "../assets/styles/share-challenge-form.scss";
import { useUserProfile } from "../hooks/useUser";

const ShareChallengeForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const { user } = useAuthContext(); // user đã có thuộc tính profile
  const token = user?.access_token;
  const { profile } = useUserProfile(user?.wallet_address || null);
  const [form, setForm] = useState<ChallengeCreate>({
    challenge_url: "",
    title: "",
    description: "",
    tags: [],
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError("Bạn chưa đăng nhập hoặc token không hợp lệ.");
      return;
    }

    setSubmitting(true);
    try {
      await shareChallenge(form, token);
      setForm({
        challenge_url: "",
        title: "",
        description: "",
        tags: [],
      });
      onSuccess();
    } catch (err) {
      setError("Có lỗi xảy ra khi chia sẻ challenge.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const getShortAddress = (address?: string) => {
    if (!address) return "Không có địa chỉ ví";
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  const userAvatar = profile?.avatar_url;

  return (
    <form onSubmit={handleSubmit} className="challenge-form-cyb">
      {/* User Info (Tùy chọn) */}
      <div className="user-info-cyb">
        <div className="user-avatar-cyb">
          {/* Hiển thị Avatar nếu có, nếu không thì hiển thị chữ cái đầu của tên người dùng */}
          {userAvatar ? (
            <img
              src={userAvatar}
              alt="User Avatar"
              className="user-avatar-img-cyb"
            />
          ) : (
            user?.wallet_address && (
              <span className="user-avatar-placeholder-cyb">
                {user.wallet_address[0].toUpperCase()}
              </span>
            )
          )}
        </div>
        <div className="username-cyb">
          {getShortAddress(user?.wallet_address)}
        </div>
      </div>

      {error && <div className="form-error-cyb">{error}</div>}

      {/* Main Input Area */}
      <div className="input-group-cyb">
        <textarea
          placeholder="Bạn có challenge nào hay không? Chia sẻ với mọi người nhé..."
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="main-textarea-cyb"
          disabled={submitting}
        />
        <div className="form-icons-cyb">
          <Link size={20} className="icon-cyb" />
          <Text size={20} className="icon-cyb" />
          <Tag size={20} className="icon-cyb" />
        </div>
      </div>

      {/* Additional Fields (Hidden until focus/click) */}
      <div className="additional-fields-cyb">
        <div className="input-field-cyb">
          <Link size={16} />
          <input
            type="url"
            placeholder="URL của Challenge"
            value={form.challenge_url}
            onChange={(e) =>
              setForm({ ...form, challenge_url: e.target.value })
            }
            required
            disabled={submitting}
          />
        </div>

        <div className="input-field-cyb">
          <Text size={16} />
          <input
            type="text"
            placeholder="Tiêu đề (tùy chọn)"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            disabled={submitting}
          />
        </div>

        <div className="input-field-cyb">
          <Tag size={16} />
          <input
            type="text"
            placeholder="Tags (phân cách bằng dấu phẩy)"
            value={form.tags?.join(", ") || ""}
            onChange={(e) =>
              setForm({
                ...form,
                tags: e.target.value.split(",").map((t) => t.trim()),
              })
            }
            disabled={submitting}
          />
        </div>
      </div>

      <button type="submit" disabled={submitting} className="submit-button-cyb">
        {submitting ? (
          <>
            <div className="spinner-cyb" />
            Đang chia sẻ...
          </>
        ) : (
          <>
            Chia sẻ Challenge
            <Send size={16} />
          </>
        )}
      </button>
    </form>
  );
};

export default ShareChallengeForm;
