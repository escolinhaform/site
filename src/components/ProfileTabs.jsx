import React from "react";

const ProfileTabs = ({ tabs, activeTab, onTabChange }) => (
  <div className="profile-tabs">
    {tabs.map((tab) => (
      <button
        key={tab.value}
        className={`profile-tab-btn${activeTab === tab.value ? " active" : ""}`}
        onClick={() => onTabChange(tab.value)}
      >
        {tab.label}
      </button>
    ))}
  </div>
);

export default ProfileTabs;
