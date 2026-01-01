import React from "react";
import { getSafeImage, getRoleGradient, formatPlayerName, DEFAULT_AVATAR } from "../utils/helpers";

const PromotionTable = ({ 
  promotionList, 
  loadingPromotion, 
  onProfileClick 
}) => {
  const handleImageError = (e) => {
    e.target.src = DEFAULT_AVATAR;
  };

  if (loadingPromotion) {
    return (
      <div
        style={{
          padding: "40px",
          textAlign: "center",
          color: "#888",
        }}
      >
        Calculando elegibilidade...
      </div>
    );
  }

  return (
    <table className="ranking-table">
      <thead>
        <tr>
          <th style={{ width: 60, textAlign: "center" }}>#</th>
          <th>Aluno</th>
          <th style={{ color: "var(--accent)" }}>DGs (15 dias)</th>
          <th>Role Atual</th>
        </tr>
      </thead>
      <tbody>
        {promotionList.length > 0 ? (
          promotionList.map((player, idx) => (
            <tr
              key={player.id || player.nickname}
              onClick={() => onProfileClick(player)}
              style={{ cursor: "pointer" }}
            >
              <td className="rank-number" style={{ color: "#666" }}>
                {idx + 1}
              </td>
              <td>
                <div className="player-cell">
                  <img
                    src={getSafeImage(player.image)}
                    className="player-avatar-small"
                    onError={handleImageError}
                  />
                  <div>
                    <div
                      className={
                        getRoleGradient(player.role)
                          ? "holo-text"
                          : ""
                      }
                      style={{
                        fontWeight: "600",
                        color: "#fff",
                        backgroundImage: getRoleGradient(
                          player.role
                        ),
                      }}
                    >
                      {formatPlayerName(player.nickname)}
                    </div>
                    <div
                      style={{ fontSize: "0.75rem", color: "#666" }}
                    >
                      @{player.username}
                    </div>
                  </div>
                </div>
              </td>
              <td
                style={{
                  fontWeight: "700",
                  color: "var(--accent)",
                  fontSize: "1.1rem",
                }}
              >
                {player.total_points}
              </td>
              <td>
                <span
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    padding: "2px 8px",
                    borderRadius: "4px",
                    fontSize: "0.8rem",
                    display: "inline-flex",
                    alignItems: "center",
                  }}
                >
                  {player.role || "calouro"}
                </span>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td
              colSpan="5"
              style={{
                textAlign: "center",
                padding: "40px",
                color: "#666",
              }}
            >
              Nenhum calouro atingiu a meta de 30 DGs nos últimos 15
              dias.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default PromotionTable;
