import React from "react";

const DGCardSkeleton = () => (
  <div className="card skeleton-card">
    <div className="card-header-row">
      <div className="icon-circle shimmer-block"></div>
      <div className="shimmer-block card-id-skeleton"></div>
    </div>
    <div className="shimmer-block title-skeleton"></div>
    <div className="card-meta">
      <div className="meta-item">
        <div className="shimmer-block icon-skeleton"></div>
        <div className="shimmer-block text-skeleton date-text"></div>
      </div>
      <div className="meta-item">
        <div className="shimmer-block icon-skeleton"></div>
        <div className="shimmer-block text-skeleton players-text"></div>
      </div>
      <div className="meta-item">
        <div className="shimmer-block icon-skeleton"></div>
        <div className="shimmer-block text-skeleton dg-text"></div>
      </div>
      <div className="meta-item">
        <div className="shimmer-block icon-skeleton"></div>
        <div className="shimmer-block text-skeleton time-text"></div>
      </div>
    </div>
    <div className="view-more shimmer-block"></div>
  </div>
);

export default DGCardSkeleton;
