import React from "react";

const RankingSkeleton = () => (
  <div style={{ width: "100%", maxWidth: "1400px", margin: "0 auto" }}>
    <div className="top-three-skeleton">
      <div className="top-card-skeleton rank-2">
        <div className="sk-avatar shimmer-block"></div>
        <div className="sk-name shimmer-block"></div>
        <div className="sk-badge shimmer-block"></div>
        <div className="sk-score shimmer-block"></div>
      </div>
      <div className="top-card-skeleton rank-1">
        <div className="sk-avatar shimmer-block"></div>
        <div className="sk-name shimmer-block"></div>
        <div className="sk-badge shimmer-block"></div>
        <div className="sk-score shimmer-block"></div>
      </div>
      <div className="top-card-skeleton rank-3">
        <div className="sk-avatar shimmer-block"></div>
        <div className="sk-name shimmer-block"></div>
        <div className="sk-badge shimmer-block"></div>
        <div className="sk-score shimmer-block"></div>
      </div>
    </div>
    <div className="ranking-table-container">
      <div style={{ display: "flex", flexDirection: "column" }}>
        {[...Array(15)].map((_, i) => (
          <div key={i} className="table-skeleton-row">
            <div className="shimmer-block" style={{ width: 30, height: 20, borderRadius: 4 }}></div>
            <div className="sk-row-avatar shimmer-block"></div>
            <div className="sk-row-text shimmer-block"></div>
            <div className="sk-row-score shimmer-block"></div>
            <div className="sk-row-score shimmer-block" style={{ width: 30 }}></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default RankingSkeleton;
