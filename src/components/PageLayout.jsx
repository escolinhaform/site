import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import SidebarSearch from "./SidebarSearch";
import { Icons } from "./Icons.jsx";
import "../styles/styles.css";

const PageLayout = ({ children, title, activeTab = "" }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleSidebarSelectPlayer = (player) => {
    navigate(`/${player.nickname}`);
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

      {/* Sidebar */}
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        activeTab={activeTab}
        setActiveTab={() => {}}
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
        <div className="content-scroll">
          {children}
        </div>
      </main>
    </div>
  );
};

export default PageLayout;
