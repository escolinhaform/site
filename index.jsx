import React, { useState, useEffect, useMemo, useRef } from 'react';

// --- CSS Styles ---
const styles = `
    /* --- Variáveis e Reset --- */
    :root {
        --bg-color: #050505;
        --text-primary: #e5e5e5;
        --text-secondary: #a3a3a3;
        --accent: #facc15; /* Amarelo */
        --accent-glow: rgba(250, 204, 21, 0.5);
        --glass-bg: rgba(20, 20, 20, 0.6);
        --glass-border: rgba(255, 255, 255, 0.1);
        --glass-blur: 16px;
        --card-hover: rgba(255, 255, 255, 0.03);
        --font-family: 'Segoe UI', system-ui, sans-serif;
        --sidebar-width: 280px;
        --sidebar-width-collapsed: 80px;
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }

    @keyframes bgPulse {
        0% { background-color: #050505; }
        50% { background-color: #0a0a05; }
        100% { background-color: #050505; }
    }
    
    @keyframes gradientBG {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }

    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }

    /* Animação de fundo gradiente */
    @keyframes gradientAnimation {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }

    /* Animação de brilho passando (Sweep) - Melhorada para Mestre */
    @keyframes goldSweep {
        0% { left: -100%; opacity: 0; }
        50% { opacity: 1; }
        100% { left: 200%; opacity: 0; }
    }

    @keyframes silverSheen {
        0% { background-position: 200% center; }
        100% { background-position: -200% center; }
    }

    @keyframes textGlowPurple {
        0% { text-shadow: 0 0 5px rgba(168, 85, 247, 0.6); color: #e9d5ff; }
        50% { text-shadow: 0 0 20px rgba(168, 85, 247, 1), 0 0 5px #fff; color: #fff; }
        100% { text-shadow: 0 0 5px rgba(168, 85, 247, 0.6); color: #e9d5ff; }
    }

    @keyframes pulseGold {
        0% { box-shadow: 0 0 0 rgba(250, 204, 21, 0.4); }
        70% { box-shadow: 0 0 20px rgba(250, 204, 21, 0); }
        100% { box-shadow: 0 0 0 rgba(250, 204, 21, 0); }
    }

    /* Animação Deep Dark para Doutor */
    @keyframes deepDarkPulse {
        0% { box-shadow: 0 0 20px rgba(88, 28, 135, 0.4); background-color: #0a0a0a; }
        50% { box-shadow: 0 0 40px rgba(126, 34, 206, 0.7); background-color: #1a0524; }
        100% { box-shadow: 0 0 20px rgba(88, 28, 135, 0.4); background-color: #0a0a0a; }
    }

    body {
        background-color: var(--bg-color);
        color: var(--text-primary);
        font-family: 'Segoe UI', system-ui, sans-serif;
        overflow: hidden; height: 100vh; width: 100%; margin: 0;
        animation: bgPulse 10s infinite ease-in-out;
    }

    /* --- Ambient Light --- */
    .ambient-light { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -1; pointer-events: none; overflow: hidden; }
    .orb { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.4; animation: float 20s infinite ease-in-out; }
    .orb-1 { top: -10%; left: -10%; width: 50vw; height: 50vw; background: radial-gradient(circle, rgba(250,204,21,0.15) 0%, transparent 70%); }
    .orb-2 { bottom: -10%; right: -10%; width: 40vw; height: 40vw; background: radial-gradient(circle, rgba(100,100,100,0.2) 0%, transparent 70%); animation-delay: -5s; }

    /* --- Layout --- */
    .app-container { display: flex; width: 100%; height: 100vh; position: relative; overflow: hidden; }

    /* --- Sidebar --- */
    .sidebar {
        width: var(--sidebar-width); background: rgba(0,0,0,0.85); backdrop-filter: blur(20px);
        border-right: 1px solid var(--glass-border); display: flex; flex-direction: column; z-index: 100;
        transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1); white-space: nowrap; height: 100%; position: relative;
    }
    .sidebar.collapsed { width: var(--sidebar-width-collapsed); }
    .sidebar-header { height: 80px; display: flex; align-items: center; padding: 0 20px; border-bottom: 1px solid var(--glass-border); background: rgba(255,255,255,0.02); overflow: hidden; }
    .sidebar.collapsed .sidebar-header { justify-content: center; padding: 0; }
    .nav-items { flex: 1; padding: 10px 10px; display: flex; flex-direction: column; gap: 5px; }
    .nav-btn {
        width: 100%; display: flex; align-items: center; padding: 12px 16px; background: transparent;
        border: 1px solid transparent; color: var(--text-secondary); border-radius: 10px; cursor: pointer;
        font-size: 0.95rem; transition: all 0.2s; overflow: hidden;
    }
    .sidebar.collapsed .nav-btn { justify-content: center; padding: 12px; }
    .nav-btn.active { background: rgba(250, 204, 21, 0.1); color: var(--accent); border-color: rgba(250, 204, 21, 0.2); }
    .nav-btn:hover:not(.active) { background: rgba(255,255,255,0.05); color: #fff; }
    .nav-btn svg { margin-right: 12px; flex-shrink: 0; }
    .sidebar.collapsed .nav-btn svg { margin-right: 0; }
    .nav-text { opacity: 1; transition: opacity 0.2s; }
    .sidebar.collapsed .nav-text { opacity: 0; display: none; }
    .header-toggle-btn { background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border); color: var(--text-secondary); width: 32px; height: 32px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.2s; }
    .header-toggle-btn:hover { color: #fff; border-color: rgba(255,255,255,0.2); }
    .footer-text { font-size: 0.8rem; color: #666; text-align: center; margin-top: 10px; padding: 0 20px 20px; transition: opacity 0.2s; }
    .sidebar.collapsed .footer-text { display: none; }

    /* Sidebar Search */
    .sidebar-search-container { padding: 20px; position: relative; }
    .sidebar.collapsed .sidebar-search-container { padding: 20px 10px; display: flex; justify-content: center; }
    .sidebar-search-input-wrapper { position: relative; width: 100%; }
    .sidebar-search-input { width: 100%; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 12px 12px 12px 40px; color: #fff; font-family: inherit; font-size: 0.9rem; outline: none; transition: 0.3s; }
    .sidebar-search-input:focus { border-color: var(--accent); background: rgba(255,255,255,0.12); box-shadow: 0 0 10px rgba(250, 204, 21, 0.2); }
    .sidebar-search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--text-secondary); pointer-events: none; }
    .sidebar-search-results { position: absolute; top: 100%; left: 20px; right: 20px; background: #151515; border: 1px solid var(--glass-border); border-radius: 12px; z-index: 200; max-height: 300px; overflow-y: auto; box-shadow: 0 10px 40px rgba(0,0,0,0.8); margin-top: 8px; animation: fadeIn 0.2s; }
    .search-result-item { display: flex; align-items: center; gap: 12px; padding: 12px; cursor: pointer; transition: 0.2s; border-bottom: 1px solid rgba(255,255,255,0.05); }
    .search-result-item:last-child { border-bottom: none; }
    .search-result-item:hover { background: rgba(250, 204, 21, 0.1); }
    .search-avatar { width: 32px; height: 32px; border-radius: 50%; object-fit: cover; background: #333; }
    .search-name { font-size: 0.9rem; font-weight: 600; color: #fff; }

    /* Content */
    .main-content { flex: 1; display: flex; flex-direction: column; position: relative; background: transparent; width: 100%; overflow: hidden; height: 100%; }
    .top-bar-mobile { display: none; height: 60px; align-items: center; justify-content: space-between; padding: 0 20px; background: rgba(0,0,0,0.8); backdrop-filter: blur(10px); border-bottom: 1px solid var(--glass-border); }
    .content-scroll { flex: 1; overflow-y: auto; padding: 40px; }
    .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; flex-wrap: wrap; gap: 15px; max-width: 1400px; margin: 0 auto; width: 100%; }
    
    @keyframes shine { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
    .title-large {
        font-size: 2rem; font-weight: 700; color: #fff; line-height: 1.2; position: relative; display: inline-block;
        background: linear-gradient(90deg, #fff 0%, var(--accent) 50%, #fff 100%); background-size: 200% auto;
        background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: shine 5s linear infinite;
    }

    /* Filters */
    .filters-bar { display: flex; gap: 15px; margin-bottom: 30px; flex-wrap: wrap; align-items: center; max-width: 1400px; margin: 0 auto; }
    .filter-input-group { position: relative; flex: 1; min-width: 200px; }
    .filter-input { width: 100%; background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border); border-radius: 12px; padding: 12px 16px 12px 42px; color: #fff; font-family: inherit; font-size: 0.95rem; outline: none; transition: all 0.3s; }
    .filter-input:focus { border-color: var(--accent); background: rgba(255,255,255,0.1); }
    .filter-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--text-secondary); pointer-events: none; }
    .date-input-group .filter-input { padding-left: 16px; color-scheme: dark; }
    
    /* Select styling */
    select.filter-input {
        appearance: none; -webkit-appearance: none; -moz-appearance: none;
        background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23a3a3a3' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
        background-repeat: no-repeat; background-position: right 15px center; background-size: 16px;
        padding-right: 40px; cursor: pointer; padding-left: 16px;
    }
    select.filter-input option { background-color: #1a1a1a; color: #fff; }

    .clear-btn { height: 44px; padding: 0 20px; background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border); border-radius: 12px; color: var(--text-secondary); cursor: pointer; transition: 0.2s; display: flex; align-items: center; justify-content: center; }
    .clear-btn:hover { background: rgba(239, 68, 68, 0.15); color: #fca5a5; border-color: rgba(239, 68, 68, 0.3); }

    .ranking-filters { display: flex; gap: 8px; background: rgba(0,0,0,0.4); padding: 6px; border-radius: 16px; border: 1px solid var(--glass-border); }
    .rank-filter-btn { padding: 8px 20px; border-radius: 10px; font-weight: 700; font-size: 0.9rem; cursor: pointer; transition: all 0.3s; border: 1px solid transparent; color: var(--text-secondary); background: transparent; }
    .rank-filter-btn.active { background: rgba(250, 204, 21, 0.15); color: var(--accent); border-color: rgba(250, 204, 21, 0.3); box-shadow: 0 0 20px rgba(250, 204, 21, 0.1); }
    .rank-filter-btn:hover:not(.active) { color: #fff; background: rgba(255,255,255,0.05); }

    /* --- SKELETONS (OPACITY PULSE - SEM MOVIMENTO) --- */
    @keyframes skeletonPulse {
        0% { opacity: 0.3; }
        50% { opacity: 0.7; }
        100% { opacity: 0.3; }
    }
    
    .shimmer-block {
        background: rgba(255, 255, 255, 0.1);
        background-repeat: no-repeat;
        animation: skeletonPulse 1.5s infinite ease-in-out;
    }

    /* Skeleton Specifics */
    .top-three-skeleton { display: flex; justify-content: center; align-items: flex-end; gap: 24px; margin-bottom: 60px; max-width: 1000px; margin: 0 auto; width: 100%; }
    .top-card-skeleton { border-radius: 24px; border: 1px solid var(--glass-border); position: relative; overflow: hidden; background: rgba(255,255,255,0.02); display: flex; flex-direction: column; align-items: center; justify-content: flex-end; padding: 20px; }
    
    .top-card-skeleton.rank-1 { width: 300px; height: 420px; order: 2; }
    .top-card-skeleton.rank-2 { width: 260px; height: 360px; order: 1; }
    .top-card-skeleton.rank-3 { width: 260px; height: 360px; order: 3; }

    .sk-avatar { width: 100px; height: 100px; border-radius: 50%; margin-bottom: 15px; }
    .rank-1 .sk-avatar { width: 130px; height: 130px; }
    .sk-name { width: 70%; height: 20px; border-radius: 4px; margin-bottom: 10px; }
    .sk-badge { width: 40px; height: 20px; border-radius: 4px; margin-bottom: 10px; }
    .sk-score { width: 50%; height: 24px; border-radius: 12px; }

    .table-skeleton-row { height: 72px; width: 100%; display: flex; align-items: center; border-bottom: 1px solid var(--glass-border); padding: 0 24px; gap: 20px; }
    .sk-row-avatar { width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0; }
    .sk-row-text { width: 150px; height: 14px; border-radius: 4px; }
    .sk-row-score { width: 40px; height: 14px; border-radius: 4px; margin-left: auto; }

    /* --- Top 3 Cards Animados e Responsivos --- */
    .top-three-container { 
        display: flex; 
        justify-content: center; 
        align-items: flex-end; 
        gap: 20px; 
        margin-bottom: 60px; 
        width: 100%; 
        max-width: 1400px; 
        margin-left: auto; 
        margin-right: auto; 
        flex-wrap: wrap; 
        perspective: 1000px; 
        animation: fadeIn 0.5s ease-out; 
    }
    
    .top-card {
        position: relative; 
        border-radius: 24px; 
        overflow: hidden; 
        border: 1px solid rgba(255,255,255,0.1);
        display: flex; 
        flex-direction: column; 
        align-items: center; 
        transition: 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94); 
        cursor: pointer;
        box-shadow: 0 10px 30px rgba(0,0,0,0.5); 
        flex: 1; /* Permite que cresçam para ocupar a largura */
        min-width: 250px; /* Largura mínima para não quebrar em telas médias */
        max-width: 380px; /* Largura máxima para não ficar excessivo */
    }
    .top-card:hover { transform: translateY(-10px) scale(1.02); z-index: 20; box-shadow: 0 20px 50px rgba(0,0,0,0.7); }
    
    /* Fundos Animados (Sem Imagens) */
    .animated-bg-gold {
        position: absolute; top: 0; left: 0; width: 100%; height: 100%;
        background: linear-gradient(-45deg, #FFD700, #FDB931, #B8860B, #FFD700);
        background-size: 400% 400%;
        animation: gradientAnimation 8s ease infinite;
        opacity: 0.15;
        z-index: 0;
    }
    .animated-bg-silver {
        position: absolute; top: 0; left: 0; width: 100%; height: 100%;
        background: linear-gradient(-45deg, #C0C0C0, #E0E0E0, #708090, #C0C0C0);
        background-size: 400% 400%;
        animation: gradientAnimation 10s ease infinite;
        opacity: 0.15;
        z-index: 0;
    }
    .animated-bg-bronze {
        position: absolute; top: 0; left: 0; width: 100%; height: 100%;
        background: linear-gradient(-45deg, #CD7F32, #A0522D, #8B4513, #CD7F32);
        background-size: 400% 400%;
        animation: gradientAnimation 12s ease infinite;
        opacity: 0.15;
        z-index: 0;
    }

    .top-card-content { position: relative; z-index: 2; width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; padding: 24px; justify-content: flex-end; }

    /* Rank 1 Specifics */
    .top-card.rank-1 { 
        height: 440px; 
        order: 2; 
        border: 1px solid rgba(255, 215, 0, 0.3);
        box-shadow: 0 0 40px rgba(255, 215, 0, 0.1); 
    }
    .top-card.rank-1:hover { border-color: rgba(255, 215, 0, 0.8); box-shadow: 0 0 60px rgba(255, 215, 0, 0.3); }
    
    /* Rank 2 Specifics */
    .top-card.rank-2 { 
        height: 380px; 
        order: 1; 
        border: 1px solid rgba(192, 192, 192, 0.3);
    }
    
    /* Rank 3 Specifics */
    .top-card.rank-3 { 
        height: 380px; 
        order: 3; 
        border: 1px solid rgba(205, 127, 50, 0.3);
    }
    
    .top-avatar {
        width: 110px; height: 110px; border-radius: 50%; object-fit: cover; 
        border: 4px solid rgba(20,20,20,1);
        box-shadow: 0 10px 30px rgba(0,0,0,0.5); margin-bottom: 20px; background: #111;
        transition: transform 0.3s;
    }
    .top-card:hover .top-avatar { transform: scale(1.05); }

    .rank-1 .top-avatar { width: 140px; height: 140px; border-color: #FFD700; box-shadow: 0 0 25px rgba(255, 215, 0, 0.4); }
    .rank-2 .top-avatar { border-color: #C0C0C0; box-shadow: 0 0 20px rgba(192, 192, 192, 0.3); }
    .rank-3 .top-avatar { border-color: #CD7F32; box-shadow: 0 0 20px rgba(205, 127, 50, 0.3); }

    .rank-badge { 
        width: 40px; height: 40px; border-radius: 50%; 
        display: flex; align-items: center; justify-content: center; 
        font-weight: 900; font-size: 1.2rem; color: #000; 
        position: absolute; top: 20px; z-index: 10; 
        box-shadow: 0 4px 15px rgba(0,0,0,0.6); 
    }
    .rank-1 .rank-badge { background: linear-gradient(135deg, #FFD700, #FDB931); width: 50px; height: 50px; font-size: 1.5rem; top: 20px; box-shadow: 0 0 20px rgba(255, 215, 0, 0.6); }
    .rank-2 .rank-badge { background: linear-gradient(135deg, #E0E0E0, #C0C0C0); left: 20px; }
    .rank-3 .rank-badge { background: linear-gradient(135deg, #CD7F32, #A0522D); color: #fff; right: 20px; }
    
    .top-info { text-align: center; width: 100%; display: flex; flex-direction: column; align-items: center; gap: 8px; }
    .top-name { font-weight: 800; color: #fff; text-shadow: 0 2px 10px rgba(0,0,0,0.8); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 100%; font-size: 1.4rem; letter-spacing: 0.5px; }
    .rank-1 .top-name { font-size: 1.8rem; color: #FFD700; text-shadow: 0 0 20px rgba(255, 215, 0, 0.4); }
    .rank-2 .top-name { color: #E0E0E0; }
    .rank-3 .top-name { color: #CD7F32; }

    .top-stats { display: flex; flex-direction: column; align-items: center; gap: 4px; }
    .top-points { 
        font-family: monospace; font-weight: 800; color: #fff; font-size: 1.2rem; 
        background: rgba(0,0,0,0.6); padding: 6px 20px; border-radius: 20px; 
        border: 1px solid rgba(255,255,255,0.1); backdrop-filter: blur(5px);
        display: flex; align-items: center; gap: 8px;
    }
    .rank-1 .top-points { border-color: rgba(255, 215, 0, 0.5); color: #FFD700; background: rgba(255, 215, 0, 0.1); }

    /* --- Ranking Table --- */
    .ranking-table-container {
        border: 1px solid var(--glass-border); border-radius: 16px; overflow: hidden; background: transparent;
        max-width: 1400px; margin: 0 auto; animation: fadeIn 0.5s ease-out;
    }
    .ranking-table { width: 100%; border-collapse: collapse; }
    .ranking-table th { text-align: left; padding: 18px 24px; color: var(--text-secondary); font-size: 0.85rem; text-transform: uppercase; background: rgba(255,255,255,0.03); border-bottom: 1px solid var(--glass-border); }
    .ranking-table td { padding: 16px 24px; border-bottom: 1px solid rgba(255,255,255,0.03); color: #e5e5e5; vertical-align: middle; }
    .ranking-table tr { transition: background 0.2s; cursor: pointer; }
    .ranking-table tr:hover { background: rgba(255,255,255,0.05); }
    .rank-number { font-weight: 800; font-size: 1.1rem; color: #666; width: 40px; text-align: center; }
    .player-cell { display: flex; align-items: center; gap: 12px; }
    .player-avatar-small { width: 32px; height: 32px; border-radius: 50%; object-fit: cover; border: 1px solid var(--glass-border); }
    
    /* --- Cards Grid --- */
    .cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px; margin-bottom: 40px; max-width: 1400px; margin-left: auto; margin-right: auto; }
    .card { background: linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(20,20,20,0.4) 50%, rgba(255,255,255,0.03) 100%); backdrop-filter: blur(10px); border: 1px solid var(--glass-border); border-radius: 16px; padding: 24px; cursor: pointer; position: relative; overflow: hidden; transition: transform 0.3s, box-shadow 0.3s, border-color 0.3s; display: flex; flex-direction: column; min-height: 240px; }
    .card:hover { transform: translateY(-5px); border-color: rgba(250, 204, 21, 0.4); box-shadow: 0 15px 40px rgba(0,0,0,0.6); z-index: 2; }
    .card-header-row { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; }
    .icon-circle { width: 44px; height: 44px; border-radius: 50%; background: rgba(0,0,0,0.4); border: 1px solid var(--glass-border); display: flex; align-items: center; justify-content: center; color: var(--text-secondary); }
    .card:hover .icon-circle { color: var(--accent); border-color: rgba(250,204,21,0.3); background: rgba(250, 204, 21, 0.05); }
    .card-id { font-size: 0.75rem; font-weight: bold; padding: 4px 8px; background: rgba(0,0,0,0.6); border-radius: 6px; color: var(--text-secondary); border: 1px solid var(--glass-border); }
    .card h3 { font-size: 1.25rem; font-weight: 700; margin-bottom: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: #fff; }
    .card:hover h3 { color: var(--accent); }
    .card-meta { font-size: 0.9rem; color: var(--text-secondary); display: flex; flex-direction: column; gap: 8px; flex-grow: 1; }
    .meta-item { display: flex; align-items: center; gap: 8px; }
    .view-more { margin-top: 16px; font-size: 0.9rem; font-weight: 600; color: var(--accent); display: flex; align-items: center; gap: 5px; opacity: 0; transform: translateX(-10px); transition: all 0.3s; }
    .card:hover .view-more { opacity: 1; transform: translateX(0); }

    /* --- Profile View --- */
    .profile-view { animation: fadeIn 0.3s ease-out; width: 100%; max-width: 1400px; margin: 0 auto; padding-bottom: 40px; }
    .profile-header-card { position: relative; border-radius: 20px; overflow: hidden; background: rgba(20,20,20,0.6); backdrop-filter: blur(20px); border: 1px solid var(--glass-border); margin-bottom: 30px; display: flex; flex-direction: column; }
    
    /* ANIMATED BANNER */
    .profile-banner { 
        height: 200px; 
        width: 100%; 
        background: linear-gradient(-45deg, #0f0f0f, #2a1b05, #4d3300, #1a1a1a);
        background-size: 400% 400%;
        animation: gradientBG 15s ease infinite;
        mask-image: linear-gradient(to bottom, black 50%, transparent 100%);
    }
    
    .profile-header-content { padding: 0 40px 30px; margin-top: -60px; display: flex; align-items: flex-end; gap: 25px; position: relative; z-index: 2; }
    .profile-avatar-large { width: 130px; height: 130px; border-radius: 50%; border: 5px solid #0a0a0a; box-shadow: 0 5px 20px rgba(0,0,0,0.5); background: #222; object-fit: cover; flex-shrink: 0; }
    .profile-texts { margin-bottom: 10px; }
    .profile-texts h2 { font-size: 2.2rem; color: #fff; font-weight: 800; margin: 0; line-height: 1.1; text-shadow: 0 2px 10px rgba(0,0,0,0.8); }
    .profile-texts p { color: var(--accent); font-size: 1rem; margin: 4px 0 0; font-weight: 600; opacity: 0.9; }
    .back-btn { position: absolute; top: 20px; right: 20px; background: rgba(0,0,0,0.6); border: 1px solid var(--glass-border); color: #fff; padding: 10px 20px; border-radius: 30px; cursor: pointer; backdrop-filter: blur(10px); display: flex; align-items: center; gap: 8px; font-weight: 600; font-size: 0.9rem; z-index: 10; }
    .back-btn:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.3); }
    
    .profile-stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin-bottom: 40px; }
    .p-stat-card { background: rgba(255,255,255,0.03); border: 1px solid var(--glass-border); border-radius: 16px; padding: 20px; text-align: center; }
    .p-stat-card h4 { color: var(--text-secondary); font-size: 0.8rem; text-transform: uppercase; margin-bottom: 8px; }
    .p-stat-card .val { font-size: 1.8rem; font-weight: 700; color: #fff; }
    
    .profile-content-split { display: grid; grid-template-columns: 280px 1fr; gap: 30px; margin-top: 30px; }
    .profile-left-col, .profile-right-col { display: flex; flex-direction: column; gap: 20px; }
    .classes-list { display: flex; flex-direction: column; gap: 12px; }
    .profile-section-title { font-size: 1.4rem; color: #fff; margin-bottom: 10px; display: flex; align-items: center; justify-content: space-between; }
    
    .elo-card-small { background: rgba(255,255,255,0.03); border: 1px solid var(--glass-border); border-radius: 12px; padding: 12px; display: flex; align-items: center; gap: 12px; transition: 0.2s; position: relative; overflow: hidden; z-index: 0; }
    .elo-card-small:hover { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.2); }
    
    /* === RANKING STYLES === */

    /* DOUTOR (Seamless Dark Purple/Crimson Rotating Light) */
    .elo-card-small.rank-doutor {
        border: none;
        background: #0d0d0d;
        animation: deepDarkPulse 4s infinite ease-in-out;
    }
    /* Seamless looping border */
    .elo-card-small.rank-doutor::before {
        content: '';
        position: absolute;
        top: -150%; left: -150%;
        width: 400%; height: 400%;
        background: conic-gradient(
            transparent 0deg, 
            transparent 80deg,
            #d8b4fe 100deg,
            #7c3aed 140deg,
            transparent 180deg,
            transparent 260deg,
            #d8b4fe 280deg,
            #7c3aed 320deg,
            transparent 360deg
        );
        animation: spin 6s linear infinite;
        z-index: -2;
    }
    .elo-card-small.rank-doutor::after {
        content: '';
        position: absolute;
        inset: 2px;
        background: #0f0f0f;
        border-radius: 10px;
        z-index: -1;
    }
    .elo-card-small.rank-doutor .elo-role-name-small { 
        color: #d8b4fe;
        animation: textGlowPurple 3s ease-in-out infinite;
        font-size: 1.1rem;
    }
    .elo-card-small.rank-doutor .elo-icon-small { 
        filter: drop-shadow(0 0 12px rgba(168, 85, 247, 0.9)); 
        transform: scale(1.15); 
    }
    .elo-card-small.rank-doutor .elo-progress-fill {
        background: linear-gradient(90deg, #581c87, #a855f7, #e9d5ff);
        box-shadow: 0 0 10px rgba(168, 85, 247, 0.7);
    }

    /* MESTRE (Gold & Shine - Muito Chamativo) */
    .elo-card-small.rank-mestre {
        border: 1px solid rgba(250, 204, 21, 0.8);
        background: linear-gradient(135deg, rgba(161, 98, 7, 0.3), rgba(0,0,0,0.8));
        box-shadow: 0 0 20px rgba(234, 179, 8, 0.3);
        animation: pulseGold 3s infinite;
    }
    /* Gold sweep shine animation */
    .elo-card-small.rank-mestre::before {
        content: '';
        position: absolute;
        top: 0; left: -100%;
        width: 100%; height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.4), transparent);
        transform: skewX(-25deg);
        animation: goldSweep 2.5s infinite ease-in-out;
        pointer-events: none;
    }
    .elo-card-small.rank-mestre .elo-role-name-small { 
        color: #fef08a; 
        text-shadow: 0 0 12px rgba(250, 204, 21, 0.8);
        font-size: 1.05rem;
    }
    .elo-card-small.rank-mestre .elo-icon-small { filter: drop-shadow(0 0 8px #facc15); transform: scale(1.05); }
    .elo-card-small.rank-mestre .elo-progress-fill {
        background: linear-gradient(90deg, #b45309, #facc15, #fef08a);
        box-shadow: 0 0 10px #facc15;
    }

    /* BACHAREL (Prata/Metálico - Sheen) */
    .elo-card-small.rank-bacharel {
        border: 1px solid rgba(148, 163, 184, 0.4);
        background: linear-gradient(120deg, rgba(255,255,255,0.03) 30%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.03) 70%);
        background-size: 200% 100%;
        animation: silverSheen 3s infinite linear;
        box-shadow: 0 0 10px rgba(255, 255, 255, 0.05);
    }
    .elo-card-small.rank-bacharel .elo-role-name-small { color: #e2e8f0; text-shadow: 0 0 3px rgba(255, 255, 255, 0.3); }
    .elo-card-small.rank-bacharel .elo-progress-fill {
        background: linear-gradient(90deg, #475569, #94a3b8, #cbd5e1);
        box-shadow: 0 0 5px #94a3b8;
    }
    
    /* APRENDIZ (Bronze - Sutil) */
    .elo-card-small.rank-aprendiz {
        border: 1px solid rgba(180, 83, 9, 0.3);
        background: rgba(67, 20, 7, 0.1);
    }
    .elo-card-small.rank-aprendiz .elo-role-name-small { color: #d97706; }
    .elo-card-small.rank-aprendiz .elo-progress-fill { background: #b45309; }

    /* ESTUDANTE (Azul - Fraco) */
    .elo-card-small.rank-estudante {
        border: 1px solid rgba(30, 58, 138, 0.3);
        background: rgba(30, 58, 138, 0.05);
    }
    .elo-card-small.rank-estudante .elo-role-name-small { color: #60a5fa; opacity: 0.8; }
    .elo-card-small.rank-estudante .elo-progress-fill { background: #1e40af; opacity: 0.6; }
    
    
    .elo-icon-small { font-size: 1.5rem; width: 30px; text-align: center; position: relative; z-index: 2; }
    .elo-info-small { flex: 1; position: relative; z-index: 2; }
    .elo-role-name-small { font-weight: 700; color: #fff; font-size: 0.9rem; margin-bottom: 2px; }
    .elo-rank-small { font-size: 0.75rem; color: var(--text-secondary); display: flex; justify-content: space-between; }
    .elo-progress-bg { height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; overflow: hidden; }
    .elo-progress-fill { height: 100%; border-radius: 2px; }
    
    /* View Details Button in Profile */
    .view-details-btn {
        background: rgba(255,255,255,0.05);
        border: 1px solid var(--glass-border);
        color: var(--text-secondary);
        width: 32px; height: 32px;
        border-radius: 8px;
        display: flex; align-items: center; justify-content: center;
        cursor: pointer; transition: 0.2s;
    }
    .view-details-btn:hover {
        background: var(--accent);
        color: #000;
        box-shadow: 0 0 10px var(--accent-glow);
    }

    .bg-blue-500 { background-color: #3b82f6; }
    .bg-yellow-400 { background-color: #facc15; }
    .bg-gray-400 { background-color: #9ca3af; }
    .bg-orange-500 { background-color: #f97316; }
    .bg-green-500 { background-color: #22c55e; }
    .bg-amber-500 { background-color: #f59e0b; }
    .text-blue-500 { color: #3b82f6; }
    .text-yellow-400 { color: #facc15; }

    /* --- Pagination --- */
    .pagination { display: flex; justify-content: center; align-items: center; gap: 15px; margin-top: 20px; }
    .page-btn { background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border); color: var(--text-secondary); padding: 10px; border-radius: 8px; cursor: pointer; }
    .page-btn:hover:not(:disabled) { border-color: var(--accent); color: var(--accent); }
    .page-btn:disabled { opacity: 0.3; cursor: not-allowed; }
    
    /* --- Modal --- */
    .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(5px); z-index: 100; display: flex; justify-content: center; align-items: center; padding: 20px; animation: fadeIn 0.2s ease-out; }
    .modal-content { background: #0a0a0a; width: 100%; max-width: 900px; max-height: 90vh; border: 1px solid rgba(250,204,21,0.3); border-radius: 20px; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.9); animation: zoomIn 0.2s ease-out; }
    .modal-header { padding: 24px; border-bottom: 1px solid var(--glass-border); background: rgba(255,255,255,0.03); display: flex; justify-content: space-between; align-items: flex-start; flex-shrink: 0; }
    .modal-body { padding: 24px; overflow-y: auto; }
    
    /* Stats in Modal */
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 30px; }
    .stat-box { background: rgba(255,255,255,0.05); padding: 16px; border-radius: 12px; border: 1px solid var(--glass-border); }
    .stat-val { font-size: 1.5rem; font-weight: 700; color: #fff; margin-top: 4px; }
    
    .players-table-container { border: 1px solid var(--glass-border); border-radius: 12px; overflow: hidden; background: rgba(0,0,0,0.3); }
    .players-table-container table { width: 100%; border-collapse: collapse; text-align: left; }
    .players-table-container th { background: rgba(255,255,255,0.08); padding: 16px; color: var(--text-secondary); font-size: 0.8rem; text-transform: uppercase; font-weight: 700; border-bottom: 1px solid var(--glass-border); }
    .players-table-container td { padding: 14px 16px; border-bottom: 1px solid rgba(255,255,255,0.05); color: #ddd; font-size: 0.9rem; }
    .players-table-container tr:hover td { background: rgba(255,255,255,0.03); }
    
    /* Highlight Row in Modal */
    .highlight-row td { background: rgba(250, 204, 21, 0.08) !important; }
    
    .progress-bar-container { width: 100%; height: 8px; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden; position: relative; box-shadow: inset 0 1px 3px rgba(0,0,0,0.5); }
    .progress-bar-fill { height: 100%; border-radius: 4px; background: linear-gradient(90deg, #b45309 0%, #f59e0b 50%, #facc15 100%); box-shadow: 0 0 12px rgba(250, 204, 21, 0.6); position: relative; overflow: hidden; }
    .progress-bar-fill::after { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent); transform: translateX(-100%); animation: shimmer 2s infinite; }
    @keyframes shimmer { 100% { transform: translateX(100%); } }
    
    .role-icon-img { width: 24px; height: 24px; object-fit: contain; vertical-align: middle; margin-right: 8px; filter: drop-shadow(0 0 2px rgba(0,0,0,0.8)); }
    .role-badge { display: inline-flex; align-items: center; }

    /* Media Queries */
    @media (max-width: 900px) {
        .sidebar { position: fixed; top: 0; bottom: 0; left: 0; transform: translateX(-100%); width: 260px; }
        .sidebar.open { transform: translateX(0); }
        .top-bar-mobile { display: flex; }
        .content-scroll { padding: 20px; }
        .title-large { font-size: 1.5rem; }
        .filters-bar { flex-direction: column; align-items: stretch; }
        .profile-header-content { flex-direction: column; align-items: center; text-align: center; margin-top: -60px; }
        .profile-avatar-large { margin-bottom: 15px; border-width: 4px; width: 110px; height: 110px; }
        .profile-stats-grid { grid-template-columns: 1fr 1fr; }
        .profile-content-split { grid-template-columns: 1fr; gap: 40px; }
        .profile-left-col { order: 2; }
        .top-three-container { flex-direction: column; align-items: center; width: 100%; gap: 15px; }
        .top-card { width: 100%; max-width: 100%; min-width: 0; }
        .top-card.rank-1 { order: 1; height: auto; padding-bottom: 20px; }
        .top-card.rank-2 { order: 2; height: auto; padding-bottom: 20px; }
        .top-card.rank-3 { order: 3; height: auto; padding-bottom: 20px; }
    }
    @media (min-width: 901px) { .modal-body { padding-right: 12px; } }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes zoomIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
`;

// --- Mapeamento de Ícones de Roles ---
const ROLE_ICONS = {
    'golem': 'https://render.albiononline.com/v1/item/T8_2H_SHAPESHIFTER_KEEPER@4',
    'elevado': 'https://render.albiononline.com/v1/item/T8_2H_ARCANESTAFF@4',
    'arcano elevado': 'https://render.albiononline.com/v1/item/T8_2H_ARCANESTAFF@4',
    'silence': 'https://render.albiononline.com/v1/item/T8_MAIN_ARCANESTAFF@4',
    'arcano silence': 'https://render.albiononline.com/v1/item/T8_MAIN_ARCANESTAFF@4',
    'main healer': 'https://render.albiononline.com/v1/item/T8_MAIN_HOLYSTAFF_AVALON@4',
    'raiz ferrea': 'https://render.albiononline.com/v1/item/T8_MAIN_NATURESTAFF_AVALON@4',
    'raiz férrea': 'https://render.albiononline.com/v1/item/T8_MAIN_NATURESTAFF_AVALON@4',
    'bruxo': 'https://render.albiononline.com/v1/item/T8_2H_CURSEDSTAFF_MORGANA@4',
    'incubus': 'https://render.albiononline.com/v1/item/T8_MAIN_MACE_HELL@4',
    'quebra reino': 'https://render.albiononline.com/v1/item/T8_2H_AXE_AVALON@4',
    'quebra-reino': 'https://render.albiononline.com/v1/item/T8_2H_AXE_AVALON@4',
    'oculto': 'https://render.albiononline.com/v1/item/T8_2H_ARCANESTAFF_HELL@4',
    'foice de cristal': 'https://render.albiononline.com/v1/item/T8_2H_SCYTHE_CRYSTAL@4', 
    'raiz dps': 'https://render.albiononline.com/v1/item/T8_ARMOR_LEATHER_UNDEAD@4',
    'xbow': 'https://render.albiononline.com/v1/item/T8_2H_REPEATINGCROSSBOW_UNDEAD@4',
    'aguia': 'https://render.albiononline.com/v1/item/T8_2H_SHAPESHIFTER_AVALON@4',
    'águia': 'https://render.albiononline.com/v1/item/T8_2H_SHAPESHIFTER_AVALON@4',
    'fire': 'https://render.albiononline.com/v1/item/T8_2H_INFERNOSTAFF_MORGANA@4',
    'bruxo dps': 'https://render.albiononline.com/v1/item/T8_MAIN_CURSEDSTAFF_AVALON@4',
    'frost': 'https://render.albiononline.com/v1/item/T8_MAIN_FROSTSTAFF_AVALON@4',
    'main tank': 'https://render.albiononline.com/v1/item/T8_MAIN_HAMMER@4',
    'maintank': 'https://render.albiononline.com/v1/item/T8_MAIN_HAMMER@4',
    'zelador': 'https://i.ibb.co/kgYdV1zS/Zelador.webp'
};

const getRoleIcon = (roleName) => {
    if (!roleName) return null;
    const normalized = String(roleName).toLowerCase().trim();
    if (ROLE_ICONS[normalized]) return ROLE_ICONS[normalized];
    return null; 
};

const RoleBadge = ({ role }) => {
    const roleName = typeof role === 'string' ? role : (role ? String(role) : 'N/A');
    const iconUrl = getRoleIcon(roleName);
    return (
        <span style={{background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center'}}>
            {iconUrl && <img src={iconUrl} className="role-icon-img" alt="" />}
            {roleName}
        </span>
    );
};

const Icons = {
    Swords: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 17.5L3 6V3h3l11.5 11.5"/><path d="m13 19 6-6"/><path d="M16 16 4 4"/><path d="M19 21 7 9"/></svg>,
    History: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 12"/><path d="M3 3v9h9"/><path d="M12 7v5l4 2"/></svg>,
    Users: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    Calendar: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>,
    X: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>,
    ChevronRight: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>,
    ChevronLeft: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>,
    Menu: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>,
    GraduationCap: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>,
    Trophy: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>,
    Search: (props) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
    Ranking: (props) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></svg>,
    Target: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
};

const DGS_API_URL = "https://kswvirdheurkykcqbokv.supabase.co/rest/v1/dgs_realizadas";
const DGS_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtzd3ZpcmRoZXVya3lrY3Fib2t2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5NDUyMDgsImV4cCI6MjA4MjUyMTIwOH0.TaDw28xYzzIbkQQMVjyO_Rq8ljIS8S_rbQ3Y8fGvOoI";
const PROFILES_API_URL = "https://kswvirdheurkykcqbokv.supabase.co/rest/v1/players_profiles";
const PROFILES_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtzd3ZpcmRoZXVya3lrY3Fib2t2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Njk0NTIwOCwiZXhwIjoyMDgyNTIxMjA4fQ.5CnziP68971KRQi7_j41oWAJ_asrSBncZiLLcIMxYfk";
const DEFAULT_AVATAR = "https://i.ibb.co/XZVfxWbx/main-Logo.webp";

const getDynamicItemsPerPage = () => {
    const width = window.innerWidth;
    if (width < 640) return 6;
    if (width < 1024) return 9;
    return 16;
};

const formatDate = (dateString) => {
    if (!dateString) return 'Data desconhecida';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-PT', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(date);
};

const formatHistoryDate = (dateString) => {
    if (!dateString) return 'Data desconhecida';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
};

const parseDamage = (val) => {
    if (typeof val === 'number') return val;
    if (!val) return 0;
    return parseInt(val.toString().replace(/\./g, '')) || 0;
};

const isValidImage = (url) => {
    // Verificação menos rigorosa: se for uma string não vazia com http/https e um tamanho mínimo, aceita.
    // O evento onError da tag img lidará com links quebrados reais (404).
    if (!url || typeof url !== 'string') return false;
    return url.length > 10 && (url.startsWith('http') || url.startsWith('https'));
};

const getSafeImage = (url) => {
    return isValidImage(url) ? url : DEFAULT_AVATAR;
};

const getSessionWeight = (players) => {
    if (!players || players.length === 0) return 1;
    const tanks = players.filter(p => {
        const r = (p.role || '').toLowerCase().replace(/\s/g, '');
        return r === 'maintank';
    });
    if (tanks.length > 0) {
        const totalPoints = tanks.reduce((sum, tank) => sum + (Number(tank.points) || 0), 0);
        return totalPoints > 0 ? totalPoints : 1;
    }
    return 1; 
};

// --- Sidebar Search ---
const SidebarSearch = ({ onSelect }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const searchRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setResults([]);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchResults = async () => {
            if (!query.trim()) {
                setResults([]);
                return;
            }
            setLoading(true);
            try {
                const params = new URLSearchParams({
                    select: 'id,nickname,image',
                    nickname: `ilike.%${query}%`,
                    limit: 5,
                    apikey: PROFILES_API_KEY
                });
                const response = await fetch(`${PROFILES_API_URL}?${params.toString()}`);
                if (response.ok) {
                    const data = await response.json();
                    setResults(data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(fetchResults, 400);
        return () => clearTimeout(timeoutId);
    }, [query]);

    const handleSelect = async (playerBasic) => {
        setQuery('');
        setResults([]);
        try {
            const params = new URLSearchParams({
                id: `eq.${playerBasic.id}`,
                select: '*',
                apikey: PROFILES_API_KEY
            });
            const response = await fetch(`${PROFILES_API_URL}?${params.toString()}`);
            if (response.ok) {
                const data = await response.json();
                if (data && data.length > 0) {
                    onSelect(data[0]);
                }
            }
        } catch (err) {
            console.error("Error fetching full profile", err);
        }
    };

    return (
        <div className="sidebar-search-container" ref={searchRef}>
            <div className="sidebar-search-input-wrapper">
                <Icons.Search className="sidebar-search-icon" style={{width: 16}} />
                <input 
                    type="text" 
                    className="sidebar-search-input" 
                    placeholder="Buscar jogador..." 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>
            {results.length > 0 && (
                <div className="sidebar-search-results custom-scrollbar">
                    {results.map(player => (
                        <div key={player.id} className="search-result-item" onClick={() => handleSelect(player)}>
                            <img src={getSafeImage(player.image)} alt={player.nickname} className="search-avatar" onError={(e) => e.target.src = DEFAULT_AVATAR} />
                            <span className="search-name">{player.nickname}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// --- Components ---

const Card = ({ data, onClick }) => {
    const sessionWeight = getSessionWeight(data.players);
    return (
        <div className="card" onClick={() => onClick(data)}>
            <div className="card-header-row"><div className="icon-circle"><Icons.Swords /></div><span className="card-id">ID: {data.id}</span></div>
            <h3>{data.name}</h3>
            <div className="card-meta">
                <div className="meta-item"><Icons.Calendar style={{width: 16}} /> {formatDate(data.date)}</div>
                <div className="meta-item"><Icons.Users style={{width: 16}} /> {data.players ? data.players.length : 0} Alunos</div>
                <div className="meta-item">
                    <Icons.Trophy style={{width: 16, color: 'var(--accent)'}} /> 
                    DGs Realizadas: <span style={{color: '#fff', fontWeight: 'bold', marginLeft: '4px'}}>{sessionWeight}</span>
                </div>
            </div>
            <div className="view-more">Ver Detalhes <Icons.ChevronRight style={{width: 16}} /></div>
        </div>
    );
};

const SkeletonCard = () => (
    <div className="card" style={{ opacity: 0.8, pointerEvents: 'none' }}>
        <div className="card-header-row"><div className="icon-circle shimmer-block" style={{border: 'none'}}></div></div>
        <div className="shimmer-block" style={{height: '24px', borderRadius: '4px', marginBottom: '10px', width: '80%'}}></div>
        <div className="shimmer-block" style={{height: '16px', borderRadius: '4px', width: '60%', marginBottom: '8px'}}></div>
        <div className="shimmer-block" style={{height: '16px', borderRadius: '4px', width: '50%'}}></div>
    </div>
);

const RankingSkeleton = () => (
    <div style={{width: '100%', maxWidth: '1400px', margin: '0 auto'}}>
        <div className="top-three-skeleton">
             <div className="top-card-skeleton rank-2">
                 <div className="sk-avatar shimmer-block"></div>
                 <div className="sk-name shimmer-block"></div>
                 <div className="sk-badge shimmer-block"></div>
                 <div className="sk-score shimmer-block"></div>
             </div>
             <div className="top-card-skeleton rank-1">
                 <div className="sk-avatar shimmer-block"></div>
                 <div className="sk-name shimmer-block"></div>
                 <div className="sk-badge shimmer-block"></div>
                 <div className="sk-score shimmer-block"></div>
             </div>
             <div className="top-card-skeleton rank-3">
                 <div className="sk-avatar shimmer-block"></div>
                 <div className="sk-name shimmer-block"></div>
                 <div className="sk-badge shimmer-block"></div>
                 <div className="sk-score shimmer-block"></div>
             </div>
        </div>
        <div className="ranking-table-container">
            <div style={{display: 'flex', flexDirection: 'column'}}>
                 {[...Array(15)].map((_, i) => (
                    <div key={i} className="table-skeleton-row">
                        <div className="shimmer-block" style={{width: 30, height: 20, borderRadius: 4}}></div>
                        <div className="sk-row-avatar shimmer-block"></div>
                        <div className="sk-row-text shimmer-block"></div>
                        <div className="sk-row-score shimmer-block"></div>
                        <div className="sk-row-score shimmer-block" style={{width: 30}}></div>
                    </div>
                 ))}
            </div>
        </div>
    </div>
);

const UserProfileView = ({ profile, allDgs, onBack, onSelectDg }) => {
    if (!profile) return null;
    const [historyPage, setHistoryPage] = useState(1);
    const historyItemsPerPage = 10;
    // Alterado para 'date' para ordenar por data mais recente por padrão
    const [sortMode, setSortMode] = useState('date');

    const elos = profile.all_players_roles || [];
    const sortedElos = [...elos].sort((a, b) => (Number(b.points) || 0) - (Number(a.points) || 0));
    
    const playerHistory = useMemo(() => {
        if (!allDgs || allDgs.length === 0) return [];
        const history = [];
        const targetNick = (profile.nickname || '').trim().toLowerCase();
        
        allDgs.forEach(dg => {
            if (dg.players) {
                const playerData = dg.players.find(p => p.nick && p.nick.trim().toLowerCase() === targetNick);
                if (playerData) {
                    const thisSessionWeight = getSessionWeight(dg.players);
                    history.push({ 
                        ...dg, 
                        role: playerData.role, 
                        points: playerData.points,
                        sessionWeight: thisSessionWeight 
                    });
                }
            }
        });
        
        if (sortMode === 'dgs') {
            return history.sort((a, b) => b.sessionWeight - a.sessionWeight);
        } else {
             return history.sort((a, b) => new Date(b.date) - new Date(a.date));
        }

    }, [allDgs, profile, sortMode]);

    const totalDgsCalc = playerHistory.reduce((acc, curr) => acc + curr.sessionWeight, 0);
    const totalPointsCalc = playerHistory.reduce((acc, curr) => acc + (Number(curr.points) || 0), 0);
    const totalClassesCalc = playerHistory.length; 

    const historyTotalPages = Math.ceil(playerHistory.length / historyItemsPerPage);
    const currentHistory = playerHistory.slice((historyPage - 1) * historyItemsPerPage, historyPage * historyItemsPerPage);

    const handleHistoryPageChange = (val) => { if (val >= 1 && val <= historyTotalPages) setHistoryPage(val); };
    const handleImageError = (e) => { e.target.src = DEFAULT_AVATAR; };

    return (
        <div className="profile-view">
            <div className="profile-header-card">
                <div className="profile-banner"></div>
                <button className="back-btn" onClick={onBack}><Icons.ChevronLeft /> Voltar</button>
                <div className="profile-header-content">
                    <div className="profile-avatar-wrapper">
                        <img src={getSafeImage(profile.image)} className="profile-avatar-large" alt={profile.nickname} onError={handleImageError} />
                    </div>
                    <div className="profile-texts">
                        <h2>{profile.nickname}</h2>
                        <p>@{profile.username}</p>
                    </div>
                </div>
            </div>
            <div className="profile-stats-grid">
                <div className="p-stat-card"><h4>Pontos Maestria</h4><div className="val text-yellow-400">{totalPointsCalc}</div></div>
                <div className="p-stat-card"><h4>Aulas Totais</h4><div className="val">{totalClassesCalc}</div></div>
                <div className="p-stat-card"><h4>DGs Totais</h4><div className="val text-blue-500">{totalDgsCalc}</div></div>
                <div className="p-stat-card"><h4>Pontos de Cantina</h4><div className="val" style={{color: '#f472b6'}}>{profile.oinc_points || 0}</div></div>
            </div>
            <div className="profile-content-split">
                <div className="profile-left-col">
                    <div className="profile-section-title" style={{marginBottom: 10}}><span>Classes</span></div>
                    {sortedElos.length > 0 ? (
                        <div className="classes-list">
                            {sortedElos.map((item, idx) => {
                                const rankName = item.elo?.current?.name?.toLowerCase() || '';
                                let rankClass = '';
                                if (rankName.includes('doutor')) rankClass = 'rank-doutor';
                                else if (rankName.includes('mestre')) rankClass = 'rank-mestre';
                                else if (rankName.includes('bacharel')) rankClass = 'rank-bacharel';
                                else if (rankName.includes('aprendiz')) rankClass = 'rank-aprendiz';
                                else if (rankName.includes('estudante')) rankClass = 'rank-estudante';

                                return (
                                    <div key={idx} className={`elo-card-small ${rankClass}`}>
                                        <div className="elo-icon-small">{item.elo?.current?.icon || '🛡️'}</div>
                                        <div className="elo-info-small">
                                            <div className="elo-role-name-small"><RoleBadge role={item.role} /></div>
                                            <div className="elo-rank-small"><span>{item.elo?.current?.name}</span><span style={{fontWeight: 'bold'}}>{item.points} pts</span></div>
                                            <div className="elo-progress-bg" style={{marginTop: 6, height: 3}}><div className={`elo-progress-fill ${item.elo?.current?.color || 'bg-blue-500'}`} style={{width: `${item.elo?.progress || 0}%`}}></div></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : <div style={{color: '#666', fontStyle: 'italic', padding: 20, textAlign: 'center', border: '1px dashed #333', borderRadius: 10}}>Nenhuma classe registrada.</div>}
                </div>
                <div className="profile-right-col" id="profile-history-top">
                    <div className="profile-section-title" style={{marginBottom: 10}}><span>Histórico de Aulas</span></div>
                    <div className="players-table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Nome da Aula</th>
                                    <th>Role</th>
                                    <th style={{textAlign: 'right'}}>Pontos</th>
                                    <th style={{width: 50}}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentHistory.length > 0 ? (
                                    currentHistory.map((dg, idx) => (
                                        <tr key={idx}>
                                            <td>
                                                <div style={{fontWeight: '500', color: '#fff'}}>{dg.name}</div>
                                                <div style={{color: '#888', fontSize: '0.8rem', marginTop: 4}}>{formatHistoryDate(dg.date)}</div>
                                                <div style={{color: '#aaa', fontSize: '0.75rem', marginTop: 2}}>DGs Realizadas: <span style={{color: '#fff'}}>{dg.sessionWeight}</span></div>
                                            </td>
                                            <td><RoleBadge role={dg.role} /></td>
                                            <td style={{textAlign: 'right', fontWeight: 'bold', color: 'var(--accent)'}}>+{dg.points}</td>
                                            <td>
                                                <button className="view-details-btn" onClick={() => onSelectDg(dg)} title="Ver Detalhes da Aula">
                                                    <Icons.Search style={{width: 16}}/>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : <tr><td colSpan="4" style={{textAlign: 'center', padding: 20, color: '#666'}}>Sem histórico encontrado.</td></tr>}
                            </tbody>
                        </table>
                        {historyTotalPages > 1 && (
                            <div className="pagination" style={{padding: '20px', justifyContent: 'center'}}>
                                <button className="page-btn" disabled={historyPage === 1} onClick={() => handleHistoryPageChange(historyPage - 1)}><Icons.ChevronLeft /></button>
                                <span style={{color: '#888'}}>Página <b style={{color: '#fff'}}>{historyPage}</b> de {historyTotalPages}</span>
                                <button className="page-btn" disabled={historyPage === historyTotalPages} onClick={() => handleHistoryPageChange(historyPage + 1)}><Icons.ChevronRight /></button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const DungeonModal = ({ data, onClose, highlightNick }) => {
    if (!data) return null;
    const sortedPlayers = useMemo(() => {
        if (!data.players) return [];
        return [...data.players].sort((a, b) => parseDamage(b.damage) - parseDamage(a.damage));
    }, [data.players]);

    const sessionDgs = getSessionWeight(data.players);
    const maxDgs = sortedPlayers.length > 0 ? sessionDgs : 0; 
    const topDPSPlayer = sortedPlayers.length > 0 ? sortedPlayers[0] : null;
    const sessionMaxDamage = topDPSPlayer ? parseDamage(topDPSPlayer.damage) : 1;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <div><h2 style={{color: 'var(--accent)', fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px'}}><Icons.GraduationCap /> {data.name}</h2><p style={{color: 'var(--text-secondary)', marginTop: '5px', fontSize: '0.9rem'}}>{formatDate(data.date)}</p></div>
                    <button onClick={onClose} style={{background: 'none', border: 'none', color: '#fff', cursor: 'pointer', flexShrink: 0}}><Icons.X /></button>
                </div>
                <div className="modal-body custom-scrollbar">
                    <div className="stats-grid">
                        <div className="stat-box"><div style={{color: 'var(--text-secondary)', fontSize: '0.85rem'}}>Total Alunos</div><div className="stat-val">{sortedPlayers.length}</div></div>
                        <div className="stat-box"><div style={{color: 'var(--text-secondary)', fontSize: '0.85rem'}}>DGs Realizadas</div><div className="stat-val" style={{color: '#3b82f6'}}>{sessionDgs}</div></div>
                        <div className="stat-box"><div style={{color: 'var(--text-secondary)', fontSize: '0.85rem'}}>Pontos Distribuídos</div><div className="stat-val" style={{color: 'var(--accent)'}}>{sortedPlayers.reduce((acc, p) => acc + (Number(p.points) || 0), 0)}</div></div>
                    </div>
                    <h3 style={{color: '#fff', marginBottom: '15px', display: 'flex', gap: '10px'}}><Icons.History /> Dados</h3>
                    <div className="players-table-container">
                        <table>
                            <thead><tr><th style={{width: '50px', textAlign: 'center'}}>#</th><th>Aluno</th><th>Role</th><th style={{textAlign: 'right'}}>Dano</th><th style={{textAlign: 'center'}}>Pts</th><th style={{textAlign: 'center'}}>Part.</th><th style={{width: '35%'}}>DANO %</th></tr></thead>
                            <tbody>
                                {sortedPlayers.map((player, idx) => {
                                    const currentDamage = parseDamage(player.damage);
                                    const barWidth = sessionMaxDamage > 0 ? (currentDamage / sessionMaxDamage) * 100 : 0;
                                    const isTopDPS = idx === 0;
                                    const isHighlighted = highlightNick && player.nick && player.nick.trim().toLowerCase() === highlightNick.trim().toLowerCase();
                                    return (
                                        <tr key={idx} className={isHighlighted ? 'highlight-row' : ''}>
                                            <td style={{textAlign: 'center', color: '#666', fontWeight: 'bold'}}>{idx + 1}</td>
                                            <td style={{fontWeight: '500', color: isTopDPS ? 'var(--accent)' : '#fff'}}>{isTopDPS && '👑 '} {player.nick}</td>
                                            <td><RoleBadge role={player.role} /></td>
                                            <td style={{textAlign: 'right', fontFamily: 'monospace', color: isTopDPS ? '#fff' : '#ccc', fontWeight: isTopDPS ? 'bold' : 'normal'}}>{parseInt(player.damage).toLocaleString('pt-PT')}</td>
                                            <td style={{textAlign: 'center', color: 'var(--accent)', fontWeight: 'bold', fontSize: '1.1rem'}}>{player.points}</td>
                                            <td style={{textAlign: 'center', color: '#3b82f6', fontWeight: 'bold', fontSize: '1.1rem'}}>{sessionDgs}</td>
                                            <td><div style={{display: 'flex', alignItems: 'center', gap: '12px'}}><div className="progress-bar-container"><div className="progress-bar-fill" style={{width: `${barWidth}%`}}></div></div><span style={{fontSize: '0.85rem', color: '#fff', fontWeight: 'bold', minWidth: '40px', textAlign: 'right'}}>{player.maxPercentage}</span></div></td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

const App = () => {
    const [activeTab, setActiveTab] = useState('ranking'); 
    const [dgs, setDgs] = useState([]);
    const [loadingDgs, setLoadingDgs] = useState(true);
    const [selectedDg, setSelectedDg] = useState(null);
    const [profiles, setProfiles] = useState([]);
    const [loadingProfiles, setLoadingProfiles] = useState(false);
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [rankingFilter, setRankingFilter] = useState('TOTAL');
    const [calculatedRanking, setCalculatedRanking] = useState([]);
    const [error, setError] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(getDynamicItemsPerPage());
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [historySort, setHistorySort] = useState('date');
    const [hasMoreProfiles, setHasMoreProfiles] = useState(true);
    
    // Pagination for Ranking
    const [rankingPage, setRankingPage] = useState(1);
    const rankingItemsPerPage = 23;

    // Sidebar search handler
    const handleSidebarSelectPlayer = (profile) => {
        setSelectedProfile(profile);
        setActiveTab('profile');
        if (mobileOpen) setMobileOpen(false);
    };

    useEffect(() => {
        const handleResize = () => setItemsPerPage(getDynamicItemsPerPage());
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Fetch DGs (Always needed for history and calculations)
    useEffect(() => {
        const fetchDgs = async () => {
            let allData = [];
            let page = 0;
            const pageSize = 1000;
            let hasMore = true;
            try {
                while (hasMore) {
                    const offset = page * pageSize;
                    const params = new URLSearchParams({ select: '*', order: 'date.desc', limit: pageSize, offset: offset, apikey: DGS_API_KEY });
                    const response = await fetch(`${DGS_API_URL}?${params.toString()}`);
                    if (!response.ok) throw new Error('Falha API DGs');
                    const data = await response.json();
                    if (data.length > 0) { allData = [...allData, ...data]; if (data.length < pageSize) hasMore = false; else page++; } else hasMore = false;
                }
                setDgs(allData);
            } catch (err) { console.error(err); setError('Erro ao carregar aulas.'); } finally { setLoadingDgs(false); }
        };
        fetchDgs();
    }, []);

    // Main Ranking Data Fetching Strategy
    useEffect(() => {
        if (activeTab !== 'ranking' && activeTab !== 'ranking_aulas') return;

        const fetchRankingData = async () => {
            setLoadingProfiles(true);
            
            try {
                // If filter is TOTAL, fetch from API with pagination
                if (rankingFilter === 'TOTAL') {
                    const orderBy = activeTab === 'ranking_aulas' ? 'total_participations.desc' : 'total_points.desc';
                    const offset = (rankingPage - 1) * rankingItemsPerPage;
                    
                    const params = new URLSearchParams({ 
                        select: '*', 
                        limit: rankingItemsPerPage, 
                        offset: offset,
                        order: orderBy,
                        apikey: PROFILES_API_KEY 
                    });
                    
                    const response = await fetch(`${PROFILES_API_URL}?${params.toString()}`);
                    if (!response.ok) throw new Error('Falha API Perfis');
                    
                    const data = await response.json();
                    setProfiles(prev => {
                        // Merge new profiles ensuring uniqueness
                        const newProfiles = [...prev];
                        data.forEach(p => {
                            if (!newProfiles.find(existing => existing.id === p.id)) {
                                newProfiles.push(p);
                            }
                        });
                        return newProfiles;
                    });
                    
                    if (data.length < rankingItemsPerPage) setHasMoreProfiles(false);
                    else setHasMoreProfiles(true);

                } else {
                    // If filter is 30D/7D, we must calculate first from DGs to know WHO to fetch
                    if (dgs.length === 0) return; // Wait for DGs

                    const now = new Date();
                    const cutoffDate = new Date();
                    if (rankingFilter === '30D') cutoffDate.setDate(now.getDate() - 30);
                    if (rankingFilter === '7D') cutoffDate.setDate(now.getDate() - 7);

                    const scores = {}; 
                    
                    // 1. Calculate scores
                    dgs.forEach(dg => {
                        const dgDate = new Date(dg.date);
                        if (dgDate < cutoffDate) return;
                        const sessionWeight = getSessionWeight(dg.players);
                        if (dg.players) {
                            dg.players.forEach(p => {
                                if (!p.nick) return;
                                const nick = p.nick.trim().toLowerCase(); 
                                if (!scores[nick]) scores[nick] = { points: 0, participations: 0, realNick: p.nick };
                                scores[nick].points += Number(p.points) || 0;
                                scores[nick].participations += sessionWeight;
                            });
                        }
                    });

                    // 2. Sort to find top players
                    const sortedNicks = Object.values(scores).sort((a, b) => {
                        if (activeTab === 'ranking_aulas') return b.participations - a.participations;
                        return b.points - a.points;
                    });

                    // 3. Get slice for current page
                    const startIdx = (rankingPage - 1) * rankingItemsPerPage;
                    const endIdx = startIdx + rankingItemsPerPage;
                    const pageItems = sortedNicks.slice(startIdx, endIdx);

                    // 4. Find which profiles we are missing
                    const nicksToFetch = pageItems
                        .filter(item => !profiles.find(p => p.nickname && p.nickname.toLowerCase() === item.realNick.toLowerCase()))
                        .map(item => item.realNick);

                    if (nicksToFetch.length > 0) {
                        // 5. Fetch only missing profiles
                        // Changed from 'in' to 'or' with 'ilike' to handle case insensitivity
                        // This fixes the issue where players showed up with empty profiles/classes
                        const orConditions = nicksToFetch.map(n => `nickname.ilike."${n}"`).join(',');
                        const params = new URLSearchParams({
                            or: `(${orConditions})`,
                            apikey: PROFILES_API_KEY
                        });
                        
                        const response = await fetch(`${PROFILES_API_URL}?${params.toString()}`);
                        if (response.ok) {
                            const newProfiles = await response.json();
                            setProfiles(prev => [...prev, ...newProfiles]);
                        }
                    }
                    
                    if (pageItems.length < rankingItemsPerPage) setHasMoreProfiles(false);
                    else setHasMoreProfiles(true);
                }
            } catch (err) { 
                console.error(err); 
                setError('Erro ao carregar ranking.'); 
            } finally { 
                setLoadingProfiles(false); 
            }
        };
        
        fetchRankingData();
    }, [activeTab, rankingFilter, rankingPage, dgs]); // Re-run when page changes

    // Calculate Rendering List based on `profiles` and `dgs`
    // CORREÇÃO AQUI: Calculamos o total de DGs (peso) para TODOS, inclusive no filtro 'TOTAL'
    useEffect(() => {
        if (dgs.length === 0 && rankingFilter !== 'TOTAL') return;

        // Passo 1: Calcular os stats baseados no histórico de DGs (para garantir contagem correta de Peso e não Aulas)
        const statsMap = {}; // nick -> { points, dgs_weight }
        
        const now = new Date();
        const cutoffDate = new Date();
        if (rankingFilter === '30D') cutoffDate.setDate(now.getDate() - 30);
        if (rankingFilter === '7D') cutoffDate.setDate(now.getDate() - 7);

        dgs.forEach(dg => {
            const dgDate = new Date(dg.date);
            // Se for TOTAL, aceita tudo. Se for filtro de data, verifica.
            if (rankingFilter !== 'TOTAL' && dgDate < cutoffDate) return;
            
            const sessionWeight = getSessionWeight(dg.players);

            if (dg.players) {
                dg.players.forEach(p => {
                    if (!p.nick) return;
                    const nick = p.nick.trim().toLowerCase();
                    if (!statsMap[nick]) statsMap[nick] = { points: 0, dgs_weight: 0, realNick: p.nick };
                    
                    statsMap[nick].points += Number(p.points) || 0;
                    statsMap[nick].dgs_weight += sessionWeight; // SOMA DO PESO
                });
            }
        });

        let finalRanking = [];

        if (rankingFilter === 'TOTAL') {
             // Para TOTAL, usamos os perfis carregados da API, mas substituímos os valores 
             // de pontos/participação pelo cálculo real feito acima para garantir precisão
             finalRanking = profiles.map(p => {
                const nick = p.nickname ? p.nickname.trim().toLowerCase() : '';
                const calculated = statsMap[nick] || { points: 0, dgs_weight: 0 };
                
                // Se o calculado for 0 (ex: jogador antigo que não está no range de DGs carregadas ou nome diferente),
                // usamos o da API como fallback, mas preferencialmente usamos o calculado.
                // Como carregamos TODAS as DGs no inicio, o calculado deve ser o correto.
                
                return {
                    ...p,
                    image: getSafeImage(p.image),
                    most_frequent_role: p.most_frequent_role || 'Desconhecido',
                    all_players_roles: p.all_players_roles || [],
                    dungeon_history: p.dungeon_history || [],
                    // Sobrescreve com o cálculo real do frontend
                    total_points: calculated.points > 0 ? calculated.points : p.total_points,
                    total_participations: calculated.dgs_weight > 0 ? calculated.dgs_weight : p.total_participations
                };
             });
        } else {
            // Para Timeframes (30D/7D), construímos a lista baseada no mapa de stats
            finalRanking = Object.keys(statsMap).map(nick => {
                const stats = statsMap[nick];
                const profile = profiles.find(p => p.nickname && p.nickname.trim().toLowerCase() === nick) || {};
                
                return {
                    ...profile, 
                    id: profile.id || `temp-${nick}`,
                    nickname: profile.nickname || stats.realNick,
                    username: profile.username || '',
                    image: getSafeImage(profile.image),
                    most_frequent_role: profile.most_frequent_role || 'Desconhecido',
                    all_players_roles: profile.all_players_roles || [],
                    dungeon_history: profile.dungeon_history || [],
                    oinc_points: profile.oinc_points || 0,
                    total_points: stats.points, 
                    total_participations: stats.dgs_weight, // USANDO O PESO CALCULADO
                };
            });
        }

        const sortKey = activeTab === 'ranking_aulas' ? 'total_participations' : 'total_points';
        finalRanking.sort((a, b) => (b[sortKey] || 0) - (a[sortKey] || 0));
        setCalculatedRanking(finalRanking);
    }, [dgs, profiles, rankingFilter, activeTab]);

    const filteredDgs = useMemo(() => {
        let result = dgs.filter(dg => {
            const matchesName = dg.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesDate = dateFilter ? dg.date.startsWith(dateFilter) : true;
            return matchesName && matchesDate;
        });

        if (historySort === 'dgs') {
            result.sort((a, b) => getSessionWeight(b.players) - getSessionWeight(a.players));
        } else {
            result.sort((a, b) => new Date(b.date) - new Date(a.date));
        }
        return result;
    }, [dgs, searchTerm, dateFilter, historySort]);

    useEffect(() => { setCurrentPage(1); }, [searchTerm, dateFilter, historySort]);
    const dgsTotalPages = Math.ceil(filteredDgs.length / itemsPerPage);
    const currentDgs = filteredDgs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const top3 = calculatedRanking.slice(0, 3);
    
    // Correct slicing logic for table view
    const currentRanking = useMemo(() => {
        if (rankingPage === 1) {
            return calculatedRanking.slice(3, 23); // First 20 after top 3
        } else {
            const start = (rankingPage - 1) * 23;
            const end = start + 23;
            return calculatedRanking.slice(start, end);
        }
    }, [calculatedRanking, rankingPage]);

    const handleRankingPageChange = (newPage) => {
        setRankingPage(newPage);
        document.getElementById('list-top')?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleOpenProfile = (profile) => { setSelectedProfile(profile); setActiveTab('profile'); };
    const handleBackToRanking = () => { setSelectedProfile(null); setActiveTab(activeTab === 'profile' ? 'ranking' : activeTab); };
    const handleImageError = (e) => { e.target.src = DEFAULT_AVATAR; };

    return (
        <div className="app-container">
            <style>{styles}</style>
            <div className="ambient-light"><div className="orb orb-1"></div><div className="orb orb-2"></div></div>
            {mobileOpen && <div className="modal-overlay" style={{zIndex: 40}} onClick={() => setMobileOpen(false)}></div>}

            <aside className={`sidebar ${mobileOpen ? 'open' : ''} ${isCollapsed ? 'collapsed' : ''}`}>
                <div className="sidebar-header" style={{ justifyContent: isCollapsed ? 'center' : 'space-between', padding: isCollapsed ? '0' : '0 20px' }}>
                    {!isCollapsed && ( <> <div style={{animation: 'fadeIn 0.3s', display: 'flex', alignItems: 'center', gap: '10px'}}> <img src="https://i.ibb.co/XZVfxWbx/main-Logo.webp" alt="Logo" style={{width: '32px', height: '32px', objectFit: 'contain'}} /> <div> <div style={{color: '#fff', fontWeight: 'bold', lineHeight: '1', fontSize: '0.9rem'}}>ESCOLINHA</div> <div style={{color: 'var(--accent)', fontWeight: 'bold', lineHeight: '1', fontSize: '1.1rem'}}>AVALON</div> </div> </div> <button className="header-toggle-btn" onClick={() => setIsCollapsed(true)}><Icons.ChevronLeft /></button> </> )}
                    {isCollapsed && <button onClick={() => setIsCollapsed(false)} style={{width: '40px', height: '40px', background: 'var(--accent)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', border: 'none', cursor: 'pointer', boxShadow: '0 0 10px var(--accent-glow)'}}><Icons.ChevronRight /></button>}
                </div>
                
                {/* SEARCH BAR */}
                {!isCollapsed && <SidebarSearch onSelect={handleSidebarSelectPlayer} />}
                {isCollapsed && (
                    <div style={{padding: '20px 0', display: 'flex', justifyContent: 'center'}}>
                         <button className="header-toggle-btn" onClick={() => setIsCollapsed(false)} title="Buscar">
                             <Icons.Search />
                         </button>
                    </div>
                )}

                <nav className="nav-items">
                    <button className={`nav-btn ${activeTab === 'ranking' ? 'active' : ''}`} onClick={() => {setActiveTab('ranking'); setRankingPage(1); setMobileOpen(false);}}><Icons.Ranking width={20} /> <span className="nav-text">Ranking Maestria</span></button>
                    <button className={`nav-btn ${activeTab === 'ranking_aulas' ? 'active' : ''}`} onClick={() => {setActiveTab('ranking_aulas'); setRankingPage(1); setMobileOpen(false);}}><Icons.Users width={20} /> <span className="nav-text">Ranking DGs</span></button>
                    <button className={`nav-btn ${activeTab === 'history' ? 'active' : ''}`} onClick={() => {setActiveTab('history'); setMobileOpen(false);}}><Icons.History width={20} /> <span className="nav-text">Histórico de Aulas</span></button>
                </nav>
                <div className="footer-text" style={{padding: '0 20px 20px'}}>&copy; 2025 Avalon</div>
            </aside>

            <main className="main-content">
                <div className="top-bar-mobile">
                    <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                        <img src="https://i.ibb.co/XZVfxWbx/main-Logo.webp" alt="Logo" style={{width: '28px', height: '28px'}} />
                        <span style={{fontWeight: 'bold', color: '#fff'}}>AVALON</span>
                    </div>
                    <button onClick={() => setMobileOpen(true)} style={{background: 'none', border: 'none', color: '#fff'}}><Icons.Menu /></button>
                </div>
                <div className="content-scroll" id="list-top">
                    {activeTab !== 'profile' && (
                        <div className="section-header">
                            <div>
                                <h1 className="title-large">{activeTab === 'history' ? 'Histórico de ' : 'Ranking '} <span className="title-accent">{activeTab === 'history' ? 'Aulas' : (activeTab === 'ranking' ? 'Maestria' : 'DGs')}</span></h1>
                                {activeTab === 'history' && <p style={{color: '#888', marginTop: '4px', fontSize: '0.9rem'}}>Total de aulas: <span style={{color: '#fff', fontWeight: 'bold'}}>{filteredDgs.length}</span></p>}
                            </div>
                            {(activeTab === 'ranking' || activeTab === 'ranking_aulas') && (
                                <div className="ranking-filters">
                                    <button className={`rank-filter-btn ${rankingFilter === 'TOTAL' ? 'active' : ''}`} onClick={() => {setRankingFilter('TOTAL'); setRankingPage(1);}}>TOTAL</button>
                                    <button className={`rank-filter-btn ${rankingFilter === '30D' ? 'active' : ''}`} onClick={() => {setRankingFilter('30D'); setRankingPage(1);}}>30D</button>
                                    <button className={`rank-filter-btn ${rankingFilter === '7D' ? 'active' : ''}`} onClick={() => {setRankingFilter('7D'); setRankingPage(1);}}>7D</button>
                                </div>
                            )}
                        </div>
                    )}
                    
                    {activeTab === 'history' && (
                        <>
                            {!loadingDgs && (
                                <div className="filters-bar">
                                    <div className="filter-input-group"><div className="filter-icon"><Icons.Search style={{width: 18}}/></div><input type="text" className="filter-input" placeholder="Pesquisar por nome..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
                                    <div className="filter-input-group date-input-group" style={{maxWidth: '220px'}}><input type="date" className="filter-input" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} /></div>
                                    <div className="filter-input-group" style={{maxWidth: '180px'}}>
                                        <select className="filter-input" value={historySort} onChange={(e) => setHistorySort(e.target.value)}>
                                            <option value="date">📅 Mais Recentes</option>
                                            <option value="dgs">🏆 Maior Peso (DGs)</option>
                                        </select>
                                    </div>
                                    {(searchTerm || dateFilter) && <button className="clear-btn" onClick={() => {setSearchTerm(''); setDateFilter('');}}><Icons.X style={{width: 16, marginRight: 6}} /> Limpar</button>}
                                </div>
                            )}
                            <div className="cards-grid">
                                {loadingDgs ? Array(8).fill(0).map((_, i) => <SkeletonCard key={i} />) : currentDgs.length > 0 ? currentDgs.map(dg => <Card key={dg.id} data={dg} onClick={setSelectedDg} />) : <div style={{gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: '#666'}}>Nenhuma aula encontrada.</div>}
                            </div>
                            {!loadingDgs && currentDgs.length > 0 && (
                                <div className="pagination">
                                    <button className="page-btn" disabled={currentPage === 1} onClick={() => {setCurrentPage(p => p - 1); document.getElementById('list-top').scrollIntoView({ behavior: 'smooth' });}}><Icons.ChevronLeft /></button>
                                    <span style={{color: '#888'}}>Página <b style={{color: '#fff'}}>{currentPage}</b> de {dgsTotalPages}</span>
                                    <button className="page-btn" disabled={currentPage === dgsTotalPages} onClick={() => {setCurrentPage(p => p + 1); document.getElementById('list-top').scrollIntoView({ behavior: 'smooth' });}}><Icons.ChevronRight /></button>
                                </div>
                            )}
                        </>
                    )}

                    {(activeTab === 'ranking' || activeTab === 'ranking_aulas') && (
                        <>
                            {(loadingProfiles || profiles.length === 0) ? (
                                <RankingSkeleton />
                            ) : (
                                <>
                                    {rankingPage === 1 && (
                                        <div className="top-three-container">
                                            {top3[1] && (
                                                <div className="top-card rank-2" onClick={() => handleOpenProfile(top3[1])}>
                                                    <div className="animated-bg-silver"></div>
                                                    <div className="top-card-content">
                                                        <div className="rank-badge">2</div>
                                                        <img src={getSafeImage(top3[1].image)} className="top-avatar" onError={handleImageError} />
                                                        <div className="top-info">
                                                            <div className="top-name">{top3[1].nickname}</div>
                                                            <div style={{marginBottom: 4}}><RoleBadge role={top3[1].most_frequent_role} /></div>
                                                            <div className="top-stats"><div className="top-points">{activeTab === 'ranking' ? top3[1].total_points : top3[1].total_participations} {activeTab === 'ranking' ? 'PTS' : 'DGs'}</div></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            {top3[0] && (
                                                <div className="top-card rank-1" onClick={() => handleOpenProfile(top3[0])}>
                                                    <div className="animated-bg-gold"></div>
                                                    <div className="top-card-content">
                                                        <div className="rank-badge">1</div>
                                                        <img src={getSafeImage(top3[0].image)} className="top-avatar" onError={handleImageError} />
                                                        <div className="top-info">
                                                            <div className="top-name">{top3[0].nickname}</div>
                                                            <div style={{marginBottom: 4}}><RoleBadge role={top3[0].most_frequent_role} /></div>
                                                            <div className="top-stats"><div className="top-points">{activeTab === 'ranking' ? top3[0].total_points : top3[0].total_participations} {activeTab === 'ranking' ? 'PTS' : 'DGs'}</div></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            {top3[2] && (
                                                <div className="top-card rank-3" onClick={() => handleOpenProfile(top3[2])}>
                                                    <div className="animated-bg-bronze"></div>
                                                    <div className="top-card-content">
                                                        <div className="rank-badge">3</div>
                                                        <img src={getSafeImage(top3[2].image)} className="top-avatar" onError={handleImageError} />
                                                        <div className="top-info">
                                                            <div className="top-name">{top3[2].nickname}</div>
                                                            <div style={{marginBottom: 4}}><RoleBadge role={top3[2].most_frequent_role} /></div>
                                                            <div className="top-stats"><div className="top-points">{activeTab === 'ranking' ? top3[2].total_points : top3[2].total_participations} {activeTab === 'ranking' ? 'PTS' : 'DGs'}</div></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    <div className="ranking-table-container">
                                        <table className="ranking-table">
                                            <thead>
                                                <tr>
                                                    <th style={{width: 60, textAlign: 'center'}}>#</th>
                                                    <th>Aluno</th>
                                                    <th style={{color: activeTab === 'ranking' ? 'var(--accent)' : 'inherit'}}>Pontos Maestria</th>
                                                    <th style={{color: activeTab === 'ranking_aulas' ? 'var(--accent)' : 'inherit'}}>DGs Totais</th>
                                                    <th>Main Role</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {currentRanking.map((profile, idx) => {
                                                    let absoluteRank;
                                                    if (rankingPage === 1) {
                                                        absoluteRank = idx + 4;
                                                    } else {
                                                        absoluteRank = (rankingPage - 1) * 23 + idx + 1;
                                                    }

                                                    return (
                                                        <tr key={profile.id} onClick={() => handleOpenProfile(profile)}>
                                                            <td className="rank-number" style={{color: '#666'}}>{absoluteRank}</td>
                                                            <td>
                                                                <div className="player-cell">
                                                                    <img src={getSafeImage(profile.image)} className="player-avatar-small" onError={handleImageError} />
                                                                    <div><div style={{fontWeight: '600', color: '#fff'}}>{profile.nickname}</div><div style={{fontSize: '0.75rem', color: '#666'}}>@{profile.username}</div></div>
                                                                </div>
                                                            </td>
                                                            <td style={{fontWeight: '700', color: activeTab === 'ranking' ? 'var(--accent)' : '#fff'}}>{profile.total_points}</td>
                                                            <td style={{fontWeight: '700', color: activeTab === 'ranking_aulas' ? 'var(--accent)' : '#fff'}}>{profile.total_participations}</td>
                                                            <td><span style={{background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center'}}><RoleBadge role={profile.most_frequent_role} /></span></td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                        <div className="pagination" style={{padding: '20px', justifyContent: 'center'}}>
                                            <button className="page-btn" disabled={rankingPage === 1} onClick={() => handleRankingPageChange(rankingPage - 1)}><Icons.ChevronLeft /></button>
                                            <span style={{color: '#888'}}>Página <b style={{color: '#fff'}}>{rankingPage}</b></span>
                                            <button className="page-btn" disabled={!hasMoreProfiles} onClick={() => handleRankingPageChange(rankingPage + 1)}><Icons.ChevronRight /></button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </>
                    )}

                    {activeTab === 'profile' && selectedProfile && <UserProfileView profile={selectedProfile} allDgs={dgs} onBack={handleBackToRanking} onSelectDg={setSelectedDg} />}
                </div>
            </main>

            <DungeonModal data={selectedDg} onClose={() => setSelectedDg(null)} highlightNick={selectedProfile?.nickname} />
        </div>
    );
};

import ReactDOM from 'react-dom/client';

const rootElement = document.getElementById('root');
if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(<App />);
}

export default App;