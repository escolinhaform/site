import React from "react";
import { parseDamage, formatDGTime, formatDGDateTime } from "../utils/helpers";
import RoleBadge from "./RoleBadge";

const DungeonModal = ({ data, onClose, highlightNick, formatPlayerName, DEFAULT_AVATAR, Icons, getSessionWeight }) => {
  if (!data) return null;
  const sortedPlayers = React.useMemo(() => {
    if (!data.players) return [];
    return [...data.players].sort(
      (a, b) => parseDamage(b.damage) - parseDamage(a.damage)
    );
  }, [data.players]);

  const sessionDgs = data.dg_count || 0;
  const maxDgs = sortedPlayers.length > 0 ? sessionDgs : 0;
  const topDPSPlayer = sortedPlayers.length > 0 ? sortedPlayers[0] : null;
  const sessionMaxDamage = topDPSPlayer ? parseDamage(topDPSPlayer.damage) : 1;

  // Detectar se é mobile
  const [isMobile, setIsMobile] = React.useState(false);
  
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 style={{ color: "var(--accent)", fontSize: "1.5rem", display: "flex", alignItems: "center", gap: "10px" }}>
              <Icons.GraduationCap /> {data.name}
            </h2>
            <p style={{ color: "var(--text-secondary)", marginTop: "5px", fontSize: "0.9rem" }}>{formatDGDateTime(data.date)}</p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", flexShrink: 0 }}>
            <Icons.X />
          </button>
        </div>
        <div className="modal-body custom-scrollbar">
          {/* Stats Grid - Responsivo */}
          <div className={`stats-grid ${isMobile ? 'mobile-stats-grid' : ''}`}>
            <div className="stat-box">
              <div className="stat-label">Tempo Total</div>
              <div className="stat-val">{formatDGTime(data.dg_time || 0)}</div>
            </div>
            <div className="stat-box">
              <div className="stat-label">Total Alunos</div>
              <div className="stat-val">{data.players?.length || 0}</div>
            </div>
            <div className="stat-box">
              <div className="stat-label">DGs Realizadas</div>
              <div className="stat-val" style={{ color: "var(--accent)" }}>{data.dg_count || 0}</div>
            </div>
            <div className="stat-box">
              <div className="stat-label">Pontos de maestria distribuidos</div>
              <div className="stat-val" style={{ color: "#FFD700" }}>
                {sortedPlayers.reduce((acc, p) => acc + (Number(p.points) || 0), 0)}
              </div>
            </div>
            <div className="stat-box">
              <div className="stat-label">Pontos de cantina distribuidos</div>
              <div className="stat-val" style={{ color: "rgb(244, 114, 182)" }}>
                {sortedPlayers.reduce((acc, p) => acc + (Number(p.storePoints) || 0), 0)}
              </div>
            </div>
          </div>

          {/* Seção Dados */}
          <div style={{ marginTop: "12px" }}>
            <h3 style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "#fff",
              marginBottom: "16px",
              fontSize: "1rem",
              fontWeight: "600"
            }}>
              <Icons.Trophy style={{ width: 18 }} /> Dados
            </h3>

            {/* Players Table - Desktop vs Mobile Cards */}
            {isMobile ? (
              <div className="mobile-players-cards">
                {sortedPlayers.length > 0 ? (
                  sortedPlayers.map((player, idx) => {
                    const playerDamage = parseDamage(player.damage);
                    const damagePercent = sessionMaxDamage > 0 ? (playerDamage / sessionMaxDamage) * 100 : 0;
                    const isHighlighted = player.nick && player.nick.toLowerCase() === (highlightNick || "").toLowerCase();
                    const storePoints = Number(player.storePoints) || 0;
                    const maestriaPoints = Number(player.points) || 0;
                    const maxDps = player.maxDps || "0";
                    const maxPercentage = player.maxPercentage || "0%";
                    
                    return (
                      <div
                        key={idx}
                        className={`mobile-player-card ${isHighlighted ? 'highlighted' : ''}`}
                      >
                        <div className="mobile-card-header">
                          <div className="mobile-player-info">
                            <div className="mobile-rank">#{idx + 1}</div>
                            <img
                              src={player.image || DEFAULT_AVATAR}
                              alt={player.nick}
                              className="mobile-avatar"
                              onError={(e) => e.target.src = DEFAULT_AVATAR}
                            />
                            <div className="mobile-name-section">
                              <div className="mobile-player-name">{formatPlayerName(player.nick)}</div>
                              <div className="mobile-role-badge">
                                <RoleBadge role={player.role} />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="mobile-stats-grid">
                          <div className="mobile-stat">
                            <span className="mobile-stat-label">DANO</span>
                            <span className="mobile-stat-value damage">{playerDamage.toLocaleString()}</span>
                          </div>
                          <div className="mobile-stat">
                            <span className="mobile-stat-label">DPS</span>
                            <span className="mobile-stat-value dps">{maxDps}</span>
                          </div>
                          <div className="mobile-stat">
                            <span className="mobile-stat-label">MAESTRIA</span>
                            <span className="mobile-stat-value maestria">{maestriaPoints}</span>
                          </div>
                          <div className="mobile-stat">
                            <span className="mobile-stat-label">CANTINA</span>
                            <span className="mobile-stat-value cantina">{storePoints}</span>
                          </div>
                        </div>
                        <div className="mobile-damage-bar">
                          <div className="damage-bar-container">
                            <div 
                              className="damage-bar-fill" 
                              style={{ width: `${damagePercent}%` }}
                            >
                              <div className="damage-bar-shimmer" />
                            </div>
                          </div>
                          <span className="damage-percentage">{maxPercentage}</span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="no-players">
                    Nenhum jogador encontrado
                  </div>
                )}
              </div>
            ) : (
              <div className="players-table-container">
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>ALUNO</th>
                      <th>ROLE</th>
                      <th>DANO</th>
                      <th>DPS</th>
                      <th>MAESTRIA</th>
                      <th>CANTINA</th>
                      <th>DANO %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedPlayers.length > 0 ? (
                      sortedPlayers.map((player, idx) => {
                        const playerDamage = parseDamage(player.damage);
                        const damagePercent = sessionMaxDamage > 0 ? (playerDamage / sessionMaxDamage) * 100 : 0;
                        const isHighlighted = player.nick && player.nick.toLowerCase() === (highlightNick || "").toLowerCase();
                        const storePoints = Number(player.storePoints) || 0;
                        const maestriaPoints = Number(player.points) || 0;
                        const maxDps = player.maxDps || "0";
                        const maxPercentage = player.maxPercentage || "0%";
                        
                        return (
                          <tr
                            key={idx}
                            className={isHighlighted ? 'highlight-row' : ''}
                          >
                            <td>{idx + 1}</td>
                            <td>
                              <div className="player-cell">
                                <img
                                  src={player.image || DEFAULT_AVATAR}
                                  alt={player.nick}
                                  className="player-avatar-small"
                                  onError={(e) => e.target.src = DEFAULT_AVATAR}
                                />
                                <span>{formatPlayerName(player.nick)}</span>
                              </div>
                            </td>
                            <td><RoleBadge role={player.role} /></td>
                            <td className="damage-value">{playerDamage.toLocaleString()}</td>
                            <td className="dps-value">{maxDps}</td>
                            <td className="maestria-value">{maestriaPoints}</td>
                            <td className="cantina-value">{storePoints}</td>
                            <td>
                              <div className="progress-bar-container">
                                <div 
                                  className="progress-bar-fill" 
                                  style={{ width: `${damagePercent}%` }}
                                />
                              </div>
                              <div className="damage-percentage-text">{maxPercentage}</div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="8" className="no-data">
                          Nenhum jogador encontrado
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DungeonModal;
