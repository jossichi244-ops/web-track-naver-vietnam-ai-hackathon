// import React from "react";
import type { GroupResponse } from "../types/index";
import "../assets/styles/group-card.scss";
import { FaUsers, FaArrowRight } from "react-icons/fa";
import { shortenAddress } from "../utils/helpers";
export default function GroupCard({
  group,
  onClick,
}: {
  group: GroupResponse;
  onClick?: () => void;
}) {
  return (
    // <div
    //   className="p-4 border rounded-md hover:shadow cursor-pointer"
    //   onClick={onClick}>
    //   <div className="flex justify-between items-center">
    //     <h3 className="text-lg font-semibold">{group.name}</h3>
    //     <span className="text-sm">{group.join_policy}</span>
    //   </div>
    //   <p className="text-sm text-gray-600 mt-2">{group.description}</p>
    // </div>
    <div className="group-card" onClick={onClick}>
      <div className="card-body">
        <h3 className="group-name">{group.name}</h3>
        <p className="description">{group.description}</p>
      </div>
      <div className="card-footer">
        <div className="info-item">
          <FaUsers className="icon" />
          <span className="info-text">{group.join_policy} Members</span>
        </div>
        <div className="info-item">
          <span className="info-text-address">
            Contract: {shortenAddress(group.group_id)}
          </span>
        </div>
        <button className="view-button">
          View Group
          <FaArrowRight className="arrow-icon" />
        </button>
      </div>
    </div>
  );
}
