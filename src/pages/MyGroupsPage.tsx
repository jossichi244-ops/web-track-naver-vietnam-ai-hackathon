// src/pages/MyGroupsPage.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGroupService } from "../services/useGroupService";
import type { GroupResponse } from "../types";
import GroupCard from "../components/GroupCard";

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
      // Không truyền walletAddress => backend lấy theo user hiện tại
      const data = await groupService.list();
      setGroups(data);
    } catch (e) {
      console.error(e);
      alert("Failed to load my groups");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Groups</h1>
      {loading ? (
        <div>Loading...</div>
      ) : groups.length === 0 ? (
        <div className="text-gray-500">You don’t own any groups yet.</div>
      ) : (
        <div className="space-y-3">
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
