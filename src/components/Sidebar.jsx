import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = ({ isCollapsed, setIsCollapsed, activeTab, setActiveTab, handleSidebarSelectPlayer, SidebarSearch: SearchComponent, Icons, mobileOpen, setMobileOpen }) => {
  const location = useLocation();
  
  const closeMobileSidebar = () => {
    if (window.innerWidth <= 900) {
      setMobileOpen(false);
      const sidebar = document.querySelector('.sidebar');
      if (sidebar) {
        sidebar.classList.remove('open');
      }
    }
  };

  const getActiveTabFromPath = () => {
    const path = location.pathname;
    if (path === '/ranking-maestria') return 'ranking';
    if (path === '/ranking-dgs') return 'ranking_aulas';
    if (path === '/historico') return 'history';
    if (path === '/promocao') return 'promotion';
    if (path === '/dashboard') return 'dashboard';
    return activeTab;
  };

  const currentActiveTab = getActiveTabFromPath();

  const NavIcon = ({ type }) => {
    switch (type) {
      case "ranking":
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
            <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
        );
      case "ranking_aulas":
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
        );
      case "history":
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
        );
      case "promotion":
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        );
      case "dashboard":
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7"/>
            <rect x="14" y="3" width="7" height="7"/>
            <rect x="14" y="14" width="7" height="7"/>
            <rect x="3" y="14" width="7" height="7"/>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <aside className={`sidebar${isCollapsed ? " collapsed" : ""}${mobileOpen ? " open" : ""}`}>
      <div className="sidebar-header">
        {!isCollapsed && (
          <>
            <img src="https://i.ibb.co/XZVfxWbx/main-Logo.webp" alt="Logo" style={{ width: "32px", height: "32px", objectFit: "contain" }} />
            <div>
              <div style={{ color: "#fff", fontWeight: "bold", lineHeight: "1", fontSize: "0.9rem" }}>ESCOLINHA</div>
              <div style={{ color: "var(--accent)", fontWeight: "bold", lineHeight: "1", fontSize: "1.1rem" }}>AVALON</div>
            </div>
            <button className="header-toggle-btn" onClick={() => {
              if (window.innerWidth <= 900) {
                // Mobile: close sidebar
                closeMobileSidebar();
              } else {
                // Desktop: collapse sidebar
                setIsCollapsed(true);
              }
            }}><Icons.ChevronLeft /></button>
          </>
        )}
        {isCollapsed && (
          <button onClick={() => setIsCollapsed(false)} style={{ width: "40px", height: "40px", background: "var(--accent)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: "#000", border: "none", cursor: "pointer", boxShadow: "0 0 10px var(--accent-glow)" }}><Icons.ChevronRight /></button>
        )}
      </div>
      {!isCollapsed && SearchComponent && <SearchComponent onSelect={handleSidebarSelectPlayer} closeMobileSidebar={closeMobileSidebar} />}
      <nav className="nav-items">
        <Link to="/ranking-maestria" className={`nav-btn${currentActiveTab === "ranking" ? " active" : ""}`} onClick={closeMobileSidebar}>
          <NavIcon type="ranking" />
          <span>Ranking Maestria</span>
        </Link>
        <Link to="/ranking-dgs" className={`nav-btn${currentActiveTab === "ranking_aulas" ? " active" : ""}`} onClick={closeMobileSidebar}>
          <NavIcon type="ranking_aulas" />
          <span>Ranking DGs</span>
        </Link>
        <Link to="/historico" className={`nav-btn${currentActiveTab === "history" ? " active" : ""}`} onClick={closeMobileSidebar}>
          <NavIcon type="history" />
          <span>Histórico de Aulas</span>
        </Link>
        <Link to="/promocao" className={`nav-btn${currentActiveTab === "promotion" ? " active" : ""}`} onClick={closeMobileSidebar}>
          <NavIcon type="promotion" />
          <span>Promoção Alunos</span>
        </Link>
        <Link to="/dashboard" className={`nav-btn${currentActiveTab === "dashboard" ? " active" : ""}`} onClick={closeMobileSidebar}>
          <NavIcon type="dashboard" />
          <span>Dashboard</span>
        </Link>
      </nav>
      <div className="footer-text" style={{ padding: "0 20px 20px" }}>&copy; 2025 Avalon</div>
    </aside>
  );
};

export default Sidebar;
