import React from 'react';
import { getRoleIcon } from '../utils/helpers';

const RoleBadge = ({ role }) => {
  const roleName = typeof role === "string" ? role : role ? String(role) : "N/A";
  const iconUrl = getRoleIcon(roleName);
  return (
    <span
      style={{
        background: "rgba(255,255,255,0.1)",
        padding: "4px 8px",
        borderRadius: "4px",
        fontSize: "0.8rem",
        whiteSpace: "nowrap",
        display: "inline-flex",
        alignItems: "center",
        width: "fit-content",
        maxWidth: "100%",
      }}
    >
      {iconUrl && <img src={iconUrl} className="role-icon-img" alt="" />}
      {roleName}
    </span>
  );
};

export default RoleBadge;
