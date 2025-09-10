import React, { useState } from "react";
import type { GroupCreatePayload } from "../types/index";
import "../assets/styles/group-form.scss";
type GroupFormProps =
  | {
      initial?: undefined;
      onSubmit: (p: GroupCreatePayload) => void;
    }
  | {
      initial: Partial<GroupCreatePayload>;
      onSubmit: (p: Partial<GroupCreatePayload>) => void;
    };

export default function GroupForm({ initial, onSubmit }: GroupFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [isPublic, setIsPublic] = useState(initial?.is_public ?? false);
  const [joinPolicy, setJoinPolicy] = useState<
    GroupCreatePayload["join_policy"]
  >(initial?.join_policy ?? "invite_only");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const payload = {
      name,
      description,
      is_public: isPublic,
      join_policy: joinPolicy as GroupCreatePayload["join_policy"],
    };

    // nếu initial có -> update, nếu không -> create
    if (initial) {
      (onSubmit as (p: Partial<GroupCreatePayload>) => void)(payload);
    } else {
      (onSubmit as (p: GroupCreatePayload) => void)(
        payload as GroupCreatePayload
      );
    }
  }

  return (
    <form onSubmit={handleSubmit} className="group-form">
      <div className="form-field">
        <label className="field-label">Name</label>
        <input
          className="field-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="form-field">
        <label className="field-label">Description</label>
        <textarea
          className="field-textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="form-field form-field-inline">
        <label className="field-label">Public Group</label>
        <input
          type="checkbox"
          checked={isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
        />
      </div>
      <div className="form-field">
        <label className="field-label">Join Policy</label>
        <select
          className="field-select"
          value={joinPolicy}
          onChange={(e) =>
            setJoinPolicy(e.target.value as GroupCreatePayload["join_policy"])
          }>
          <option value="invite_only">Invite only</option>
          <option value="request_to_join">Request to join</option>
          <option value="open">Open</option>
        </select>
      </div>
      <div className="form-actions">
        <button type="submit" className="form-submit-button">
          Save
        </button>
      </div>
    </form>
  );
}
