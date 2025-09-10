import type { GroupMemberResponse } from "../types/index";
import { shortenAddress } from "../utils/helpers";
import "../assets/styles/member_popup.scss";
interface MembersPopupProps {
  members: GroupMemberResponse[];
  isOwnerOrAdmin: boolean;
  onChangeRole: (memberId: string, newRole: string) => void;
  onClose: () => void;
}

export default function MembersPopup({
  members,
  isOwnerOrAdmin,
  onChangeRole,
  onClose,
}: MembersPopupProps) {
  return (
    <div className="popup-overlay" onClick={onClose}>
      <div
        className="popup-content"
        onClick={(e) => e.stopPropagation()} // tránh đóng popup khi click bên trong
      >
        <h2>Danh sách thành viên</h2>
        <ul>
          {members.map((m) => (
            <li key={m._id}>
              {shortenAddress(m.wallet_address)}
              {isOwnerOrAdmin ? (
                <select
                  value={m.role}
                  onChange={(e) =>
                    onChangeRole(m.wallet_address, e.target.value)
                  }>
                  <option value="owner" disabled>
                    owner
                  </option>
                  <option value="admin">admin</option>
                  <option value="member">member</option>
                  <option value="guest">guest</option>
                </select>
              ) : (
                <strong>{m.role}</strong>
              )}
            </li>
          ))}
        </ul>
        <button onClick={onClose} className="close-btn">
          Đóng
        </button>
      </div>
    </div>
  );
}
