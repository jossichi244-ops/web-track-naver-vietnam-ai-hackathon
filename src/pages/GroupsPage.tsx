import { useEffect, useState } from "react";
import { useGroupService } from "../services/useGroupService";
import GroupCard from "../components/GroupCard";
import GroupForm from "../components/GroupForm";
import type { GroupResponse, GroupCreatePayload } from "../types/index";
import { useNavigate } from "react-router-dom";
import "../assets/styles/groups-page.scss";
export default function GroupsPage() {
  const groupService = useGroupService();
  const [groups, setGroups] = useState<GroupResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function load() {
    setLoading(true);
    try {
      const data = await groupService.list(undefined, true);
      // console.log("Public groups:", data);
      // const data = await groupService.list();
      setGroups(data);
    } catch (e) {
      console.error(e);
      alert("Failed to load groups");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(payload: GroupCreatePayload) {
    try {
      const g = await groupService.create(payload);
      setGroups((prev) => [g, ...prev]);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      alert("Create failed");
    }
  }

  return (
    <div className="groups-page-container">
      <h1 className="main-title">Decentralized Groups </h1>
      <div className="grid-layout">
        <div className="create-group-section">
          <div className="card-header">
            <h2 className="section-title">
              Create a New Group <span className="icon-plus">+</span>
            </h2>
            <p className="subtitle">
              Mint a smart contract for your community.
            </p>
          </div>
          <GroupForm onSubmit={handleCreate} />
        </div>
        <div className="groups-list-section">
          {loading ? (
            <div className="loading-state">
              <span className="spinner"></span>
              <p>Loading active groups on chain...</p>
            </div>
          ) : (
            <div className="group-card-list">
              {groups.length === 0 ? (
                <div className="empty-state">
                  <p>No groups found. Be the first to create one! ✨</p>
                </div>
              ) : (
                groups.map((g) => (
                  <GroupCard
                    key={g.group_id}
                    group={g}
                    onClick={() =>
                      navigate(`/groups/${encodeURIComponent(g.group_id)}`)
                    }
                  />
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
