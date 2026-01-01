import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link, useSearchParams } from "react-router-dom";
import { getSafeImage, getRoleIcon, getRoleGradient, formatPlayerName, formatHistoryDate, formatDate, DEFAULT_AVATAR, parseDamage, getSessionWeight, formatDGTime } from "../utils/helpers";
import { useHistoryLogic } from "../hooks/useHistoryLogic";
import DungeonModal from "./DungeonModal";
import { usePlayerProfile } from "../hooks/usePlayerProfile";
import Sidebar from "./Sidebar";
import SidebarSearch from "./SidebarSearch";
import { Icons } from "./Icons.jsx";
import RoleBadge from "./RoleBadge";

const ProfilePage = () => {
  const { nickname } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedDg, setSelectedDg] = useState(null);
  const [activeTab, setActiveTab] = useState('classes');

  const { profile, allDgs, rankingDGs, loading, error } = usePlayerProfile(nickname);

  const handleSidebarSelectPlayer = (player) => {
    navigate(`/${player.nickname}`);
  };

  const sortedElos = [...(profile?.all_players_roles || [])].sort(
    (a, b) => (Number(b.points) || 0) - (Number(a.points) || 0)
  );
  
  // Determinar role favorita (com mais pontos)
  const favoriteRole = sortedElos.length > 0 ? sortedElos[0] : null;
  const roleGradient = getRoleGradient(profile?.role);
  const roleName = profile?.role ? profile.role.toUpperCase() : null;
  const totalPointsCalc = profile?.total_points || 0;
  const totalClassesCalc = profile?.total_participations || 0;

  const {
    currentDgs: currentHistory,
    dgsTotalPages: historyTotalPages,
    currentPage: historyPage,
    handlePageChange: handleHistoryPageChange,
    loading: historyLoading,
  } = useHistoryLogic(profile?.dungeon_history, getSessionWeight);

  const handleImageError = (e) => {
    e.target.src = DEFAULT_AVATAR;
  };

  if (loading) {
    return (
      <div className="app-container">
        <div className="ambient-light">
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
        </div>
        <Sidebar
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          activeTab="profile"
          setActiveTab={() => { }}
          handleSidebarSelectPlayer={handleSidebarSelectPlayer}
          SidebarSearch={SidebarSearch}
          Icons={Icons}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />
        <main className="main-content profile-page">
          <div className="loading-container">
            <div className="loading-spinner-fancy"></div>
            <p style={{ marginTop: '20px', fontSize: '18px', color: '#fff' }}>Carregando perfil...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-container">
        <div className="ambient-light">
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
        </div>
        <main className="main-content">
          <div className="error-container">
            <h2>Erro</h2>
            <p>{error}</p>
            <Link to="/" className="back-btn">
              <Icons.ChevronLeft /> Voltar para o Ranking
            </Link>
          </div>
        </main>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

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

      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        activeTab="profile"
        setActiveTab={() => { }}
        handleSidebarSelectPlayer={handleSidebarSelectPlayer}
        SidebarSearch={SidebarSearch}
        Icons={Icons}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <main className="main-content profile-page">
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

        <div className="content-scroll">
          <div className="profile-view">
          <div className="profile-header-card">
            <div className="profile-banner"></div>
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
                      color: "#000",
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
              <h4>Role Favorita</h4>
              <div className="val" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                {favoriteRole ? (
                  <>
                    <RoleBadge role={favoriteRole.role} />
                  </>
                ) : (
                  <span style={{ fontSize: '0.9rem', color: '#666' }}>N/A</span>
                )}
              </div>
            </div>
            <div className="p-stat-card">
              <h4>Pontos de Cantina</h4>
              <div className="val" style={{ color: "#f472b6" }}>
                {profile.oinc_points || 0}
              </div>
            </div>
          </div>

          {/* Abas de Navegação - Mobile */}
          <div className="profile-tabs-container">
            <button
              className={`profile-tab-btn ${activeTab === 'classes' ? 'active' : ''}`}
              onClick={() => setActiveTab('classes')}
            >
              <Icons.Shield style={{ width: 16 }} />
              <span>Classes</span>
            </button>
            <button
              className={`profile-tab-btn ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveTab('history')}
            >
              <Icons.History style={{ width: 16 }} />
              <span>Histórico</span>
            </button>
          </div>

          <div className="profile-content-split">
            {/* Coluna Classes - Desktop e Mobile quando aba ativa */}
            <div className={`profile-left-col ${activeTab === 'classes' ? 'mobile-active' : ''}`}>
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
                    else if (rankName.includes("bacharel")) rankClass = "rank-bacharel";
                    else if (rankName.includes("aprendiz")) rankClass = "rank-aprendiz";
                    else if (rankName.includes("estudante")) rankClass = "rank-estudante";

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
                              className={`elo-progress-fill ${item.elo?.current?.color || "bg-blue-500"
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

            {/* Coluna Histórico - Desktop e Mobile quando aba ativa */}
            <div className={`profile-right-col ${activeTab === 'history' ? 'mobile-active' : ''}`} id="profile-history-top">
              <div className="profile-section-title" style={{ marginBottom: 10 }}>
                <span>Histórico de Aulas</span>
              </div>
              <div className="players-table-container">
                {/* Versão Desktop - Tabela Completa */}
                <div className="desktop-history-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Nome da Aula</th>
                        <th>Role</th>
                        <th style={{ textAlign: "right" }}>Dano</th>
                        <th style={{ textAlign: "right" }}>DPS</th>
                        <th style={{ textAlign: "right" }}>Pontos</th>
                        <th style={{ width: 50 }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {historyLoading ? (
                        <tr>
                          <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                            <div className="loading-spinner-fancy"></div>
                          </td>
                        </tr>
                      ) : currentHistory.length > 0 ? (
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
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px'
                                }}
                              >
                                <Icons.Calendar style={{ width: 14 }} />
                                {formatHistoryDate(dg.date)}
                              </div>
                              <div
                                style={{
                                  color: "#aaa",
                                  fontSize: "0.8rem",
                                  marginTop: 8,
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '4px'
                                }}
                              >
                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <Icons.Trophy style={{ width: 14, color: 'var(--accent)' }} />
                                  DGs Realizadas:{" "}
                                  <b style={{ color: "#fff", fontWeight: "600" }}>
                                    {dg.dg_count ?? 'N/A'}
                                  </b>
                                </span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <Icons.History style={{ width: 14 }} />
                                  Tempo Total:{" "}
                                  <b style={{ color: "#fff", fontWeight: "600" }}>
                                    {formatDGTime(dg.dg_time || 0)}
                                  </b>
                                </span>
                              </div>
                            </td>
                            <td>
                              <RoleBadge role={dg.role} />
                            </td>
                            <td style={{ textAlign: 'right', color: '#ffffffff', fontWeight: 'bold' }}>
                              {dg.damage ? parseInt(dg.damage).toLocaleString() : 'N/A'}
                            </td>
                            <td style={{ textAlign: 'right', color: '#ffffffff', fontWeight: 'bold' }}>
                              {dg.maxDps || 'N/A'}
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
                                onClick={() => setSelectedDg(dg)}
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
                            colSpan="6"
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
                </div>

                {/* Versão Mobile - Cards Simplificados */}
                <div className="mobile-history-cards">
                  {historyLoading ? (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                      <div className="loading-spinner-fancy"></div>
                    </div>
                  ) : currentHistory.length > 0 ? (
                    currentHistory.map((dg, idx) => (
                      <div key={dg.id || idx} className="mobile-history-card">
                        <div className="mobile-card-header">
                          <div className="mobile-class-info">
                            <h4 className="mobile-class-name">{dg.name}</h4>
                            <div className="mobile-class-datetime">
                              <Icons.Calendar style={{ width: 14 }} />
                              {formatHistoryDate(dg.date)}
                            </div>
                          </div>
                          <button
                            className="view-details-btn"
                            onClick={() => setSelectedDg(dg)}
                            title="Ver Detalhes da Aula"
                          >
                            <Icons.Search style={{ width: 16 }} />
                          </button>
                        </div>
                        <div className="mobile-card-content">
                          <div className="mobile-stats">
                            <div className="mobile-stat-item">
                              <Icons.Trophy style={{ width: 14, color: 'var(--accent)' }} />
                              <span>DGs: <b>{dg.dg_count ?? 'N/A'}</b></span>
                            </div>
                            <div className="mobile-stat-item">
                              <Icons.History style={{ width: 14 }} />
                              <span>Tempo: <b>{formatDGTime(dg.dg_time || 0)}</b></span>
                            </div>
                          </div>
                          <div className="mobile-role-badge">
                            <RoleBadge role={dg.role} />
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div
                      style={{
                        textAlign: "center",
                        padding: 20,
                        color: "#666",
                        border: "1px dashed #333",
                        borderRadius: 10,
                      }}
                    >
                      Sem histórico encontrado.
                    </div>
                  )}
                </div>
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
                      <Icons.ChevronLeft style={{ transform: "rotate(180deg)" }} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        </div>
      </main>

      {selectedDg && (
        <DungeonModal
          data={selectedDg}
          onClose={() => setSelectedDg(null)}
          highlightNick={profile?.nickname}
          parseDamage={parseDamage} // Supondo que parseDamage está disponível no escopo ou importado
          formatPlayerName={formatPlayerName}
          DEFAULT_AVATAR={DEFAULT_AVATAR}
          Icons={Icons}
          getSessionWeight={getSessionWeight}
        />
      )}
    </div>
  );
};

export default ProfilePage;
