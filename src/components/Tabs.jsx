import React from "react";

const Tabs = ({ tabs, activeTab, onTabChange }) => (
  <div className="tabs">
    {tabs.map((tab) => (
      <button
        key={tab.value}
        className={`tab-btn${activeTab === tab.value ? " active" : ""}`}
        onClick={() => onTabChange(tab.value)}
      >
        {tab.label}
      </button>
    ))}
  </div>
);

export default Tabs;
