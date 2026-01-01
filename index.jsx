
import React, { useState, useEffect, useMemo, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAppLogic } from "./src/hooks/useAppLogic";
import ProfilePage from "./src/components/ProfilePage";
import { useRankingLogic } from "./src/hooks/useRankingLogic";
import { useProfileLogic } from "./src/hooks/useProfileLogic";
import { usePromotionLogic } from "./src/hooks/usePromotionLogic";
import { getSafeImage, getSessionWeight, getRoleIcon, getRoleGradient, formatPlayerName, formatDate, formatHistoryDate, DEFAULT_AVATAR } from "./src/utils/helpers";
import DungeonModal from "./src/components/DungeonModal";
import HistorySection from "./src/components/HistorySection";
import RankingTable from "./src/components/RankingTable";
import RankingSkeleton from "./src/components/RankingSkeleton";
import { Icons } from "./src/components/Icons.jsx";
import Sidebar from "./src/components/Sidebar";
import TopThree from "./src/components/TopThree";
import SidebarSearch from "./src/components/SidebarSearch";
import "./src/styles/styles.css";

// Import pages
import RankingMaestriaPage from "./src/pages/RankingMaestriaPage";
import RankingDGsPage from "./src/pages/RankingDGsPage";
import HistoricoPage from "./src/pages/HistoricoPage";
import PromocaoPage from "./src/pages/PromocaoPage";




const RoleBadge = ({ role }) => {
  const roleName =
    typeof role === "string" ? role : role ? String(role) : "N/A";
  const iconUrl = getRoleIcon(roleName);
  return (
    <span
      style={{
        background: "rgba(255,255,255,0.1)",
        padding: "4px 8px",
        borderRadius: "4px",
        fontSize: "0.8rem",
        whiteSpace: "nowrap",
        display: "inline-flex",
        alignItems: "center",
        width: "fit-content",
        maxWidth: "100%",
      }}
    >
      {iconUrl && <img src={iconUrl} className="role-icon-img" alt="" />}
      {roleName}
    </span>
  );
};





// --- Components ---

const Card = ({ data, onClick }) => {
  const sessionWeight = getSessionWeight(data.players);
  return (
    <div className="card" onClick={() => onClick(data)}>
      <div className="card-header-row">
        <div className="icon-circle">
          <Icons.Swords />
        </div>
        <span className="card-id">ID: {data.id}</span>
      </div>
      <h3>{data.name}</h3>
      <div className="card-meta">
        <div className="meta-item">
          <Icons.Calendar style={{ width: 16 }} /> {formatDate(data.date)}
        </div>
        <div className="meta-item">
          <Icons.Users style={{ width: 16 }} />{" "}
          {data.players ? data.players.length : 0} Alunos
        </div>
        <div className="meta-item">
          <Icons.Trophy style={{ width: 16, color: "var(--accent)" }} />
          DGs Realizadas:{" "}
          <span
            style={{ color: "#fff", fontWeight: "bold", marginLeft: "4px" }}
          >
            {sessionWeight}
          </span>
        </div>
      </div>
      <div className="view-more">
        Ver Detalhes <Icons.ChevronRight style={{ width: 16 }} />
      </div>
    </div>
  );
};

const SkeletonCard = () => (
  <div className="card" style={{ opacity: 0.8, pointerEvents: "none" }}>
    <div className="card-header-row">
      <div
        className="icon-circle shimmer-block"
        style={{ border: "none" }}
      ></div>
    </div>
    <div
      className="shimmer-block"
      style={{
        height: "24px",
        borderRadius: "4px",
        marginBottom: "10px",
        width: "80%",
      }}
    ></div>
    <div
      className="shimmer-block"
      style={{
        height: "16px",
        borderRadius: "4px",
        width: "60%",
        marginBottom: "8px",
      }}
    ></div>
    <div
      className="shimmer-block"
      style={{ height: "16px", borderRadius: "4px", width: "50%" }}
    ></div>
  </div>
);


const UserProfileView = ({ profile, allDgs, onBack, onSelectDg }) => {
  if (!profile) return null;

  const {
    elos,
    sortedElos,
    roleGradient,
    roleName,
    playerHistory,
    totalDgsCalc,
    totalPointsCalc,
    totalClassesCalc,
    historyPage,
    setHistoryPage,
    historyItemsPerPage,
    sortMode,
    setSortMode,
    historyTotalPages,
    currentHistory,
    handleHistoryPageChange,
  } = useProfileLogic(profile, allDgs, getSessionWeight);
  const handleImageError = (e) => {
    e.target.src = DEFAULT_AVATAR;
  };

  return (
    <div className="profile-view">
      <div className="profile-header-card">
        <div className="profile-banner"></div>
        <button className="back-btn" onClick={onBack}>
          <Icons.ChevronLeft /> Voltar
        </button>
        <div className="profile-header-content">
          <div className="profile-avatar-wrapper">
            <img
              src={getSafeImage(profile.image)}
              className="profile-avatar-large"
              alt={profile.nickname}
              onError={handleImageError}
            />
          </div>
          <div className="profile-texts">
            <h2
              className={roleGradient ? "holo-text" : ""}
              style={roleGradient ? { backgroundImage: roleGradient } : {}}
            >
              {formatPlayerName(profile.nickname)}
            </h2>
            {roleGradient && roleName && (
              <div
                className="role-seal"
                style={{
                  backgroundImage: roleGradient,
                  color: "#000", // Text color black for contrast on bright gradients
                  border: "none",
                }}
              >
                {roleName}
              </div>
            )}
            <p style={{ marginTop: 5 }}>@{profile.username}</p>
          </div>
        </div>
      </div>
      <div className="profile-stats-grid">
        <div className="p-stat-card">
          <h4>Pontos Maestria</h4>
          <div className="val text-yellow-400">{totalPointsCalc}</div>
        </div>
        <div className="p-stat-card">
          <h4>Aulas Totais</h4>
          <div className="val">{totalClassesCalc}</div>
        </div>
        <div className="p-stat-card">
          <h4>DGs Totais</h4>
          <div className="val text-blue-500">{totalDgsCalc}</div>
        </div>
        <div className="p-stat-card">
          <h4>Pontos de Cantina</h4>
          <div className="val" style={{ color: "#f472b6" }}>
            {profile.oinc_points || 0}
          </div>
        </div>
      </div>
      <div className="profile-content-split">
        <div className="profile-left-col">
          <div className="profile-section-title" style={{ marginBottom: 10 }}>
            <span>Classes</span>
          </div>
          {sortedElos.length > 0 ? (
            <div className="classes-list">
              {sortedElos.map((item, idx) => {
                const rankName = item.elo?.current?.name?.toLowerCase() || "";
                let rankClass = "";
                if (rankName.includes("doutor")) rankClass = "rank-doutor";
                else if (rankName.includes("mestre")) rankClass = "rank-mestre";
                else if (rankName.includes("bacharel"))
                  rankClass = "rank-bacharel";
                else if (rankName.includes("aprendiz"))
                  rankClass = "rank-aprendiz";
                else if (rankName.includes("estudante"))
                  rankClass = "rank-estudante";

                return (
                  <div key={idx} className={`elo-card-small ${rankClass}`}>
                    <div className="elo-icon-small">
                      {item.elo?.current?.icon || "🛡️"}
                    </div>
                    <div className="elo-info-small">
                      <div className="elo-role-name-small">
                        <RoleBadge role={item.role} />
                      </div>
                      <div className="elo-rank-small">
                        <span>{item.elo?.current?.name}</span>
                        <span style={{ fontWeight: "bold" }}>
                          {item.points} pts
                        </span>
                      </div>
                      <div
                        className="elo-progress-bg"
                        style={{ marginTop: 6, height: 3 }}
                      >
                        <div
                          className={`elo-progress-fill ${
                            item.elo?.current?.color || "bg-blue-500"
                          }`}
                          style={{ width: `${item.elo?.progress || 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div
              style={{
                color: "#666",
                fontStyle: "italic",
                padding: 20,
                textAlign: "center",
                border: "1px dashed #333",
                borderRadius: 10,
              }}
            >
              Nenhuma classe registrada.
            </div>
          )}
        </div>
        <div className="profile-right-col" id="profile-history-top">
          <div className="profile-section-title" style={{ marginBottom: 10 }}>
            <span>Histórico de Aulas</span>
          </div>
          <div className="players-table-container">
            <table>
              <thead>
                <tr>
                  <th>Nome da Aula</th>
                  <th>Role</th>
                  <th style={{ textAlign: "right" }}>Pontos</th>
                  <th style={{ width: 50 }}></th>
                </tr>
              </thead>
              <tbody>
                {currentHistory.length > 0 ? (
                  currentHistory.map((dg, idx) => (
                    <tr key={dg.id || idx}>
                      <td>
                        <div style={{ fontWeight: "500", color: "#fff" }}>
                          {dg.name}
                        </div>
                        <div
                          style={{
                            color: "#888",
                            fontSize: "0.8rem",
                            marginTop: 4,
                          }}
                        >
                          {formatHistoryDate(dg.date)}
                        </div>
                        <div
                          style={{
                            color: "#aaa",
                            fontSize: "0.75rem",
                            marginTop: 2,
                          }}
                        >
                          DGs Realizadas:{" "}
                          <span style={{ color: "#fff" }}>
                            {dg.sessionWeight}
                          </span>
                        </div>
                      </td>
                      <td>
                        <RoleBadge role={dg.role} />
                      </td>
                      <td
                        style={{
                          textAlign: "right",
                          fontWeight: "bold",
                          color: "var(--accent)",
                        }}
                      >
                        +{dg.points}
                      </td>
                      <td>
                        <button
                          className="view-details-btn"
                          onClick={() => onSelectDg(dg)}
                          title="Ver Detalhes da Aula"
                        >
                          <Icons.Search style={{ width: 16 }} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      style={{
                        textAlign: "center",
                        padding: 20,
                        color: "#666",
                      }}
                    >
                      Sem histórico encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {historyTotalPages > 1 && (
              <div
                className="pagination"
                style={{ padding: "20px", justifyContent: "center" }}
              >
                <button
                  className="page-btn"
                  disabled={historyPage === 1}
                  onClick={() => handleHistoryPageChange(historyPage - 1)}
                >
                  <Icons.ChevronLeft />
                </button>
                <span style={{ color: "#888" }}>
                  Página <b style={{ color: "#fff" }}>{historyPage}</b> de{" "}
                  {historyTotalPages}
                </span>
                <button
                  className="page-btn"
                  disabled={historyPage === historyTotalPages}
                  onClick={() => handleHistoryPageChange(historyPage + 1)}
                >
                  <Icons.ChevronRight />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


const MainContent = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const {
    activeTab,
    setActiveTab,
    dgs,
    totalDgsCount,
    loadingDgs,
    selectedDg,
    setSelectedDg,
    error,
    mobileOpen,
    setMobileOpen,
    isCollapsed,
    setIsCollapsed,
  } = useAppLogic();

  // Sincronizar aba com parâmetro da URL
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && tabParam !== activeTab) {
      setActiveTab(tabParam);
    }
  }, [searchParams]); // Removido activeTab e setActiveTab para evitar loop

  // Atualizar URL quando aba mudar internamente
  useEffect(() => {
    const currentTab = searchParams.get('tab');
    if (activeTab !== currentTab) {
      const newParams = new URLSearchParams(searchParams);
      if (activeTab) {
        newParams.set('tab', activeTab);
      } else {
        newParams.delete('tab');
      }
      navigate(`/?${newParams.toString()}`, { replace: true });
    }
  }, [activeTab, navigate]);

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
  } = useRankingLogic(activeTab, getSafeImage);

  const {
    promotionList,
    loadingPromotion,
  } = usePromotionLogic(dgs, activeTab, getSessionWeight);

  // Sidebar search handler
  const handleSidebarSelectPlayer = (profile) => {
    navigate(`/${profile.nickname}`);
  };

  const handleOpenProfile = (profile) => {
    navigate(`/${profile.nickname}`);
  };



  const handleImageError = (e) => {
    e.target.src = DEFAULT_AVATAR;
  };

  return (
    <div className="app-container">
      <div className="ambient-light">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
      </div>
      {mobileOpen && (
        <div
          className="modal-overlay"
          style={{ zIndex: 998 }}
          onClick={() => {
            setMobileOpen(false);
            const sidebar = document.querySelector('.sidebar');
            if (sidebar) {
              sidebar.classList.remove('open');
            }
          }}
        ></div>
      )}

      {/* Sidebar refatorado */}
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        handleSidebarSelectPlayer={handleSidebarSelectPlayer}
        SidebarSearch={SidebarSearch}
        Icons={Icons}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <main className="main-content">
        <div className="top-bar-mobile">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <img
              src="https://i.ibb.co/XZVfxWbx/main-Logo.webp"
              alt="Logo"
              style={{ width: "28px", height: "28px" }}
            />
            <span style={{ fontWeight: "bold", color: "#fff" }}>AVALON</span>
          </div>
          <button
            onClick={() => {
              setMobileOpen(true);
              const sidebar = document.querySelector('.sidebar');
              if (sidebar) {
                sidebar.classList.add('open');
              }
            }}
            style={{ background: "none", border: "none", color: "#fff" }}
          >
            <Icons.Menu />
          </button>
        </div>
        <div className="content-scroll" id="list-top">
          {activeTab !== "profile" && (
            <div className="section-header">
              <div>
                <h1 className="title-large">
                  {activeTab === "history"
                    ? "Histórico de "
                    : activeTab === "promotion"
                    ? "Promoção "
                    : "Ranking "}
                  <span className="title-accent">
                    {activeTab === "history"
                      ? "Aulas"
                      : activeTab === "promotion"
                      ? "Alunos"
                      : activeTab === "ranking"
                      ? "Maestria"
                      : "DGs"}
                  </span>
                </h1>
                {activeTab === "promotion" && (
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
                )}
                {activeTab === "ranking_aulas" && (
                  <p
                    style={{
                      color: "#888",
                      marginTop: "4px",
                      fontSize: "0.9rem",
                    }}
                  >
                    Ranking baseado no número total de DGs realizadas
                  </p>
                )}
              </div>
              {(activeTab === "ranking" || activeTab === "ranking_aulas") && (
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
              )}
            </div>
          )}

          {activeTab === "history" && (
            <HistorySection 
              dgs={dgs} 
              totalDgsCount={totalDgsCount}
              loadingDgs={loadingDgs} 
              setSelectedDg={setSelectedDg} 
            />
          )}

          {activeTab === "promotion" && (
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
          )}

          {(activeTab === "ranking" || activeTab === "ranking_aulas") && (
            <>
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
                      activeTab={activeTab}
                      getSafeImage={getSafeImage}
                      handleImageError={handleImageError}
                    />
                  )}
                  <RankingTable
                    currentRanking={tableRanking}
                    handleOpenProfile={handleOpenProfile}
                    activeTab={activeTab}
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
            </>
          )}
        </div>
      </main>

      <DungeonModal
        data={selectedDg}
        onClose={() => setSelectedDg(null)}
        formatPlayerName={formatPlayerName}
        RoleBadge={RoleBadge}
        DEFAULT_AVATAR={DEFAULT_AVATAR}
        Icons={Icons}
        getSessionWeight={getSessionWeight}
      />
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainContent />} />
        <Route path="/ranking-maestria" element={<RankingMaestriaPage />} />
        <Route path="/ranking-dgs" element={<RankingDGsPage />} />
        <Route path="/historico" element={<HistoricoPage />} />
        <Route path="/promocao" element={<PromocaoPage />} />
        <Route path="/:nickname" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
};

import ReactDOM from 'react-dom/client';

const rootElement = document.getElementById('root');
if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(<App />);
}

export default App;
