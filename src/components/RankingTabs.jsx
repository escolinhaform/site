import React from "react";

const RankingTabs = ({ activeTab, setActiveTab }) => (
  <div className="ranking-filters">
    <button
      className={`rank-filter-btn ${activeTab === "TOTAL" ? "active" : ""}`}
      onClick={() => setActiveTab("TOTAL")}
    >
      TOTAL
    </button>
    <button
      className={`rank-filter-btn ${activeTab === "30D" ? "active" : ""}`}
      onClick={() => setActiveTab("30D")}
    >
      30D
    </button>
    <button
      className={`rank-filter-btn ${activeTab === "7D" ? "active" : ""}`}
      onClick={() => setActiveTab("7D")}
    >
      7D
    </button>
  </div>
);

export default RankingTabs;
