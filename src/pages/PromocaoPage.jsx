import React from "react";
import { useAppLogic } from "../hooks/useAppLogic";
import { usePromotionLogic } from "../hooks/usePromotionLogic";
import { getSafeImage, getRoleGradient, formatPlayerName, DEFAULT_AVATAR } from "../utils/helpers";
import { Icons } from "../components/Icons.jsx";
import PageLayout from "../components/PageLayout";

const PromocaoPage = () => {
  const { dgs } = useAppLogic();
  
  const {
    promotionList,
    loadingPromotion,
  } = usePromotionLogic(dgs, "promotion", (players) => players ? players.length : 0);

  const handleOpenProfile = (profile) => {
    window.location.href = `/${profile.nickname}`;
  };

  const handleImageError = (e) => {
    e.target.src = DEFAULT_AVATAR;
  };

  return (
    <PageLayout title="Promoção de Alunos" activeTab="promotion">
      <div className="page-container">
      <div className="section-header">
        <div>
          <h1 className="title-large">
            Promoção <span className="title-accent">Alunos</span>
          </h1>
          <p
            style={{
              color: "#888",
              marginTop: "4px",
              marginBottom: "8px",
              fontSize: "0.9rem",
            }}
          >
            Calouros com &gt; 30 DGs nos últimos 15 dias
          </p>
        </div>
      </div>

      <div className="ranking-table-container">
        {loadingPromotion ? (
          <div
            style={{
              padding: "40px",
              textAlign: "center",
              color: "#888",
            }}
          >
            Calculando elegibilidade...
          </div>
        ) : (
          <table className="ranking-table">
            <thead>
              <tr>
                <th style={{ width: 60, textAlign: "center" }}>#</th>
                <th>Aluno</th>
                <th style={{ color: "var(--accent)" }}>DGs (15 dias)</th>
                <th>Pontos Totais</th>
                <th>Role Atual</th>
              </tr>
            </thead>
            <tbody>
              {promotionList.length > 0 ? (
                promotionList.map((profile, idx) => (
                  <tr
                    key={profile.id}
                    onClick={() => handleOpenProfile(profile)}
                  >
                    <td className="rank-number" style={{ color: "#666" }}>
                      {idx + 1}
                    </td>
                    <td>
                      <div className="player-cell">
                        <img
                          src={getSafeImage(profile.image)}
                          className="player-avatar-small"
                          onError={handleImageError}
                        />
                        <div>
                          <div
                            className={
                              getRoleGradient(profile.role)
                                ? "holo-text"
                                : ""
                            }
                            style={{
                              fontWeight: "600",
                              color: "#fff",
                              backgroundImage: getRoleGradient(
                                profile.role
                              ),
                            }}
                          >
                            {formatPlayerName(profile.nickname)}
                          </div>
                          <div
                            style={{ fontSize: "0.75rem", color: "#666" }}
                          >
                            @{profile.username}
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
                      {profile.recent_dgs}
                    </td>
                    <td style={{ fontWeight: "700", color: "#fff" }}>
                      {profile.total_points}
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
                        {profile.role || "Calouro"}
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
        )}
      </div>
      </div>
    </PageLayout>
  );
};

export default PromocaoPage;
