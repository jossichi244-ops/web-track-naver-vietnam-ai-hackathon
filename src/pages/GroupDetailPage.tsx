import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGroupService } from "../services/useGroupService";
import GroupForm from "../components/GroupForm";
import type {
  GroupResponse,
  GroupMemberResponse,
  GroupCreatePayload,
} from "../types/index";
import { AuthContext } from "../context/AuthContextInstance";
import { groupMemberService } from "../services/groupMemberService";
import { shortenAddress } from "../utils/helpers";
import { FaTrashAlt, FaPen, FaLock, FaGlobe } from "react-icons/fa";
import "../assets/styles/group-detail-page.scss";
import MembersPopup from "../components/MembersPopup";

export default function GroupDetailPage() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useGroupService must be used within an AuthProvider");
  }
  const { user } = context;
  const currentWallet = user?.wallet_address;

  const groupService = useGroupService();
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const [showMembersPopup, setShowMembersPopup] = useState(false);
  const [group, setGroup] = useState<GroupResponse | null>(null);
  const [members, setMembers] = useState<GroupMemberResponse[]>([]);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    if (!groupId) return;
    const id = groupId;
    async function loadData() {
      try {
        const g = await groupService.get(id);
        setGroup(g);
        console.log("Calling loadMembers...");
        await loadMembers(id);
      } catch (e) {
        console.error(e);
        alert("Not found");
        navigate("/groups");
      }
    }
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId]);

  // Load members list
  async function loadMembers(groupId: string) {
    try {
      const res = await groupMemberService.list(groupId);
      console.log("Loaded members:", res);
      setMembers(res);
    } catch (err) {
      console.error("Failed to load members", err);
    }
  }

  // Tìm current member trong nhóm
  const currentMember = members.find(
    (m) => m.wallet_address.toLowerCase() === currentWallet?.toLowerCase()
  );
  const isOwnerOrAdmin =
    currentMember?.role === "owner" || currentMember?.role === "admin";

  const isOwner =
    currentWallet?.toLowerCase() === group?.wallet_address.toLowerCase();

  async function handleChangeRole(wallet_address: string, newRole: string) {
    console.log("🧾 Changing role for wallet:", wallet_address, "to", newRole);

    const role = newRole as "owner" | "admin" | "member" | "guest";
    try {
      if (!groupId) return;
      if (!wallet_address) {
        console.error("❌ Wallet address không hợp lệ");
        return;
      }

      // Update the API call to pass wallet_address in the query string
      await groupMemberService.updateByWallet(groupId, wallet_address, {
        role,
      });

      alert("Cập nhật vai trò thành công");

      // Refresh members list after role update
      await loadMembers(groupId); // Refresh lại danh sách
    } catch (err) {
      alert("Không thể cập nhật vai trò");
      console.error(err);
    }
  }

  async function handleUpdate(payload: Partial<GroupCreatePayload>) {
    if (!group) return;
    try {
      const updated = await groupService.update(group.group_id, payload);
      setGroup(updated);
      alert("Updated");
    } catch {
      alert("Update failed");
    }
  }

  async function handleDelete() {
    if (!group) return;
    if (!confirm("Delete group?")) return;
    try {
      await groupService.remove(group.group_id);
      alert("Deleted");
      navigate("/groups");
    } catch {
      alert("Delete failed");
    }
  }

  async function handleJoin() {
    if (!groupId) return;
    setJoining(true);
    try {
      await groupMemberService.join(groupId);
      alert("Yêu cầu tham gia đã được gửi!");
    } catch {
      alert("Không thể gửi yêu cầu tham gia");
    } finally {
      setJoining(false);
    }
  }
  function openMembersPopup() {
    setShowMembersPopup(true);
  }
  function closeMembersPopup() {
    setShowMembersPopup(false);
  }
  if (!group) return <div className="p-6">Loading...</div>;

  return (
    <div className="group-detail-container">
      <div className="group-header">
        <h1 className="group-name">{group.name}</h1>
        <div className="status-badges">
          <span className="badge owner-badge">
            <FaPen /> {isOwner ? "Owner" : "Member"}
          </span>
          <span
            className={`badge ${
              group.is_public ? "public-badge" : "private-badge"
            }`}>
            {group.is_public ? <FaGlobe /> : <FaLock />}{" "}
            {group.is_public ? "Public" : "Private"}
          </span>
          <button
            className="badge action-badge"
            onClick={() => navigate(`/groups/${group.group_id}/tasks`)}>
            ✅ Group Tasks
          </button>
        </div>
      </div>

      <div className="info-grid">
        <div className="info-card">
          <h2 className="card-title">Group Details</h2>
          <div className="info-item">
            <span className="info-label">Smart Contract Address:</span>
            <span className="info-value address-value">
              {shortenAddress(group.group_id)}
            </span>
          </div>
          <div className="info-item">
            <span className="info-label">Creator Wallet:</span>
            <span className="info-value address-value">
              {shortenAddress(group.wallet_address)}
            </span>
          </div>
          <div className="info-item">
            <span className="info-label">Members ({members.length}):</span>
            {/* <ul>
              {members.map((m) => (
                <li key={m._id}>
                  {shortenAddress(m.wallet_address)} -{" "}
                  {isOwnerOrAdmin ? (
                    <select
                      value={m.role}
                      onChange={(e) => handleChangeRole(m._id, e.target.value)}>
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
            </ul> */}{" "}
            <button onClick={openMembersPopup} className="cta">
              <span className="hover-underline-animation"> View Members</span>
              <svg
                id="arrow-horizontal"
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="10"
                viewBox="0 0 46 16">
                <path
                  id="Path_10"
                  data-name="Path 10"
                  d="M8,0,6.545,1.455l5.506,5.506H-30V9.039H12.052L6.545,14.545,8,16l8-8Z"
                  transform="translate(30)"></path>
              </svg>
            </button>
            {showMembersPopup && (
              <MembersPopup
                members={members}
                isOwnerOrAdmin={isOwnerOrAdmin}
                onChangeRole={handleChangeRole}
                onClose={closeMembersPopup}
              />
            )}
          </div>
          <div className="info-item">
            <span className="info-label">Join Policy:</span>
            <span className="info-value">{group.join_policy}</span>
          </div>
        </div>
        <div className="description-card">
          <h2 className="card-title">Description</h2>
          <p className="description-text">{group.description}</p>
        </div>
      </div>

      <div className="action-section">
        {isOwner ? (
          <>
            <h2 className="section-title">Manage Group</h2>
            <div className="owner-actions">
              <GroupForm
                initial={{
                  name: group.name,
                  description: group.description,
                  is_public: group.is_public,
                  join_policy: group.join_policy,
                }}
                onSubmit={handleUpdate}
              />
              <button className="delete-button" onClick={handleDelete}>
                <FaTrashAlt /> Delete Group
              </button>
            </div>
          </>
        ) : (
          <div className="visitor-actions">
            {group.join_policy === "open" && (
              <button
                onClick={handleJoin}
                disabled={joining}
                className="mt-4 px-4 py-2 rounded bg-blue-500 text-white">
                {joining ? "Đang gửi..." : "Yêu cầu tham gia"}{" "}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
