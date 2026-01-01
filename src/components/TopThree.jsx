import React from "react";

const TopThree = ({ top3, handleOpenProfile, getRoleGradient, formatPlayerName, RoleBadge, activeTab, getSafeImage, handleImageError }) => {
  const renderTopCard = (player, rank) => {
    const rankClasses = {
      1: "rank-1 gold-theme",
      2: "rank-2 silver-theme", 
      3: "rank-3 bronze-theme"
    };

    return (
      <div className={`top-card ${rankClasses[rank]}`} onClick={() => handleOpenProfile(player)}>
        <div className={`animated-bg animated-bg-${rank === 1 ? 'gold' : rank === 2 ? 'silver' : 'bronze'}`}></div>
        <div className="top-card-glow"></div>
        <div className="top-card-shine"></div>
        <div className="top-card-content">
          <div className="rank-badge">{rank}</div>
          <img src={getSafeImage(player.image)} className="top-avatar" onError={handleImageError} />
          <div className="top-info">
            <div className={`top-name ${getRoleGradient(player.role) ? "holo-text" : ""}`} style={getRoleGradient(player.role) ? { backgroundImage: getRoleGradient(player.role) } : {}}>
              {formatPlayerName(player.nickname)}
            </div>
            <div className="top-role">
              <RoleBadge role={player.most_frequent_role} />
            </div>
            <div className="top-stats">
              <div className="top-points">
                {activeTab === "ranking" ? player.total_points : player.total_points} {activeTab === "ranking" ? "PTS" : "DGs"}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="top-three-container">
      {top3[1] && renderTopCard(top3[1], 2)}
      {top3[0] && renderTopCard(top3[0], 1)}
      {top3[2] && renderTopCard(top3[2], 3)}
    </div>
  );
};

export default TopThree;
