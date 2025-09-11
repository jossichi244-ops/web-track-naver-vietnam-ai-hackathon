// src/pages/MyGroupsPage.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGroupService } from "../services/useGroupService";
import type { GroupResponse } from "../types";
import GroupCard from "../components/GroupCard";
import { PlusCircle, Search } from "lucide-react";
import "../assets/styles/my-groups-page.scss";
export default function MyGroupsPage() {
  const groupService = useGroupService();
  const [groups, setGroups] = useState<GroupResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadMyGroups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadMyGroups() {
    setLoading(true);
    try {
      const data = await groupService.list();
      setGroups(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const handleCreateGroup = () => {
    navigate("/groups/create");
  };

  return (
    <div className="page-container-cyb">
      <div className="page-header-cyb">
        <h1 className="page-title-cyb">My Groups</h1>
        <button className="create-group-btn-cyb" onClick={handleCreateGroup}>
          <PlusCircle size={20} />
          Create New Group
        </button>
      </div>

      {loading ? (
        <div className="loading-state-cyb">
          <div className="spinner-cyb"></div>
          <p>Loading groups...</p>
        </div>
      ) : groups.length === 0 ? (
        <div className="empty-state-cyb">
          <div className="empty-state-icon">
            <Search size={48} />
          </div>
          <h2 className="empty-state-title">No Groups Found</h2>
          <p className="empty-state-text">
            You are not the owner of any groups yet.
          </p>
          <button className="create-group-btn-cyb" onClick={handleCreateGroup}>
            <PlusCircle size={20} />
            Create Your First Group
          </button>
        </div>
      ) : (
        <div className="groups-list-cyb">
          {groups.map((g) => (
            <GroupCard
              key={g.group_id}
              group={g}
              onClick={() =>
                navigate(`/groups/${encodeURIComponent(g.group_id)}`)
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
