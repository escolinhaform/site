import React from "react";

const RankingTable = ({ currentRanking, handleOpenProfile, activeTab, RoleBadge, getRoleGradient, formatPlayerName, Icons, getSafeImage, handleImageError, rankOffset = 0 }) => (
  <div className="ranking-table-container">
    <table className="ranking-table">
      <thead>
        <tr>
          <th style={{ width: 60, textAlign: "center" }}>#</th>
          <th>Aluno</th>
          {activeTab !== "ranking_aulas" && <th style={{ color: activeTab === "ranking" ? "var(--accent)" : "inherit" }}>Pontos Maestria</th>}
          {activeTab !== "ranking" && <th style={{ color: activeTab === "ranking_aulas" ? "var(--accent)" : "inherit" }}>DGs Totais</th>}
          <th>Main Role</th>
        </tr>
      </thead>
      <tbody>
        {currentRanking.map((profile, idx) => {
          const rowKey = profile.id ?? profile.nickname ?? idx;
          const displayRole = profile.role || profile.most_frequent_role;

          return (
            <tr key={rowKey} onClick={() => handleOpenProfile(profile)}>
              <td className="rank-number" style={{ color: "#666" }}>{rankOffset + idx}</td>
              <td>
                <div className="player-cell">
                  <img src={getSafeImage(profile.image)} className="player-avatar-small" alt={profile.nickname} onError={handleImageError} />
                  <div>
                    <div className={getRoleGradient(displayRole) ? "holo-text" : ""} style={{ fontWeight: "600", color: "#fff", backgroundImage: getRoleGradient(displayRole) }}>
                      {formatPlayerName(profile.nickname)}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#666" }}>@{profile.username}</div>
                  </div>
                </div>
              </td>
              {activeTab !== "ranking_aulas" && <td style={{ fontWeight: "700", color: activeTab === "ranking" ? "var(--accent)" : "#fff" }}>{profile.total_points}</td>}
              {activeTab !== "ranking" && <td style={{ fontWeight: "700", color: activeTab === "ranking_aulas" ? "var(--accent)" : "#fff" }}>{profile.total_points}</td>}
              <td>
                <span style={{ background: "rgba(255,255,255,0.1)", padding: "2px 8px", borderRadius: "4px", fontSize: "0.8rem", display: "inline-flex", alignItems: "center" }}>
                  <RoleBadge role={profile.most_frequent_role || profile.role} />
                </span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

export default RankingTable;
