import React from "react";
import { useRankingLogic } from "../hooks/useRankingLogic";
import { getSafeImage, getRoleGradient, formatPlayerName, DEFAULT_AVATAR } from "../utils/helpers";
import RankingSkeleton from "../components/RankingSkeleton";
import TopThree from "../components/TopThree";
import RankingTable from "../components/RankingTable";
import { Icons } from "../components/Icons.jsx";
import RoleBadge from "../components/RoleBadge";
import PageLayout from "../components/PageLayout";

const RankingDGsPage = () => {
  const {
    loadingProfiles,
    rankingFilter,
    setRankingFilter,
    rankingPage,
    setRankingPage,
    hasMoreProfiles,
    top3,
    tableRanking,
    handleRankingPageChange,
  } = useRankingLogic("ranking_aulas", getSafeImage);

  const handleOpenProfile = (profile) => {
    window.location.href = `/${profile.nickname}`;
  };

  const handleImageError = (e) => {
    e.target.src = DEFAULT_AVATAR;
  };

  return (
    <PageLayout title="Ranking DGs" activeTab="ranking_aulas">
      <div className="page-container">
      <div className="section-header">
        <div>
          <h1 className="title-large">
            Ranking <span className="title-accent">DGs</span>
          </h1>
          <p style={{ color: "#888", marginTop: "4px", fontSize: "0.9rem" }}>
            Ranking baseado no número total de DGs realizadas
          </p>
        </div>
        <div className="ranking-filters">
          <button
            className={`rank-filter-btn ${
              rankingFilter === "TOTAL" ? "active" : ""
            }`}
            onClick={() => {
              setRankingFilter("TOTAL");
              setRankingPage(1);
            }}
          >
            TOTAL
          </button>
          <button
            className={`rank-filter-btn ${
              rankingFilter === "30D" ? "active" : ""
            }`}
            onClick={() => {
              setRankingFilter("30D");
              setRankingPage(1);
            }}
          >
            30D
          </button>
          <button
            className={`rank-filter-btn ${
              rankingFilter === "7D" ? "active" : ""
            }`}
            onClick={() => {
              setRankingFilter("7D");
              setRankingPage(1);
            }}
          >
            7D
          </button>
        </div>
      </div>

      {loadingProfiles ? (
        <RankingSkeleton />
      ) : (
        <>
          {top3.length > 0 && (
            <TopThree
              top3={top3}
              handleOpenProfile={handleOpenProfile}
              getRoleGradient={getRoleGradient}
              formatPlayerName={formatPlayerName}
              RoleBadge={RoleBadge}
              activeTab="ranking_aulas"
              getSafeImage={getSafeImage}
              handleImageError={handleImageError}
            />
          )}
          <RankingTable
            currentRanking={tableRanking}
            handleOpenProfile={handleOpenProfile}
            activeTab="ranking_aulas"
            RoleBadge={RoleBadge}
            getRoleGradient={getRoleGradient}
            formatPlayerName={formatPlayerName}
            Icons={Icons}
            getSafeImage={getSafeImage}
            handleImageError={handleImageError}
            rankOffset={4 + (rankingPage - 1) * 20}
          />
          <div className="pagination" style={{ padding: "20px", justifyContent: "center" }}>
            <button
              className="page-btn"
              disabled={rankingPage === 1}
              onClick={() => handleRankingPageChange(rankingPage - 1)}
            >
              <Icons.ChevronLeft />
            </button>
            <span style={{ color: "#888" }}>
              Página <b style={{ color: "#fff" }}>{rankingPage}</b>
            </span>
            <button
              className="page-btn"
              disabled={!hasMoreProfiles}
              onClick={() => handleRankingPageChange(rankingPage + 1)}
            >
              <Icons.ChevronRight />
            </button>
          </div>
        </>
      )}
      </div>
    </PageLayout>
  );
};

export default RankingDGsPage;
