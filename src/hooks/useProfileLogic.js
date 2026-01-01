import { useState, useMemo } from "react";
import { getRoleGradient } from "../utils/helpers";

export const useProfileLogic = (profile, allDgs, rankingDGs, getSessionWeight) => {
  const [historyPage, setHistoryPage] = useState(1);
  const historyItemsPerPage = 10;
  const [sortMode, setSortMode] = useState("date");

  const elos = profile?.all_players_roles || [];
  const sortedElos = [...elos].sort(
    (a, b) => (Number(b.points) || 0) - (Number(a.points) || 0)
  );

  const roleGradient = getRoleGradient(profile?.role);
  const roleName = profile?.role ? profile.role.toUpperCase() : null;

  const playerHistory = useMemo(() => {
    if (!profile) return [];
    
    // Se o perfil tiver dungeon_history, usa todos os registros do histórico
    if (profile.dungeon_history && profile.dungeon_history.length > 0) {
      const history = profile.dungeon_history.map(record => ({
        ...record,
        // Adicionar campos para compatibilidade com a UI existente
        role: record.role || "Desconhecido",
        points: record.points || 0,
        sessionWeight: 1, // Cada entrada no dungeon_history = 1 participação
        name: record.name || "DG sem nome",
        date: record.date,
      }));
      
      if (sortMode === "dgs") {
        return history.sort((a, b) => new Date(b.date) - new Date(a.date));
      } else {
        return history.sort((a, b) => new Date(b.date) - new Date(a.date));
      }
    }
    
    // Fallback: método antigo usando allDgs
    if (!allDgs || allDgs.length === 0) return [];
    const history = [];
    const targetNick = (profile.nickname || "").trim().toLowerCase();

    allDgs.forEach((dg) => {
      if (dg.players) {
        const playerData = dg.players.find(
          (p) => p.nick && p.nick.trim().toLowerCase() === targetNick
        );
        if (playerData) {
          const thisSessionWeight = getSessionWeight(dg.players);
          history.push({
            ...dg,
            role: playerData.role,
            points: playerData.points,
            sessionWeight: thisSessionWeight,
          });
        }
      }
    });

    if (sortMode === "dgs") {
      return history.sort((a, b) => b.sessionWeight - a.sessionWeight);
    } else {
      return history.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
  }, [profile, allDgs, sortMode]);

  // Usar dados diretos do perfil em vez de calcular
  // Se tiver dados do ranking DGs, usa total_dgs, senão usa total_participations
  // Se tiver dungeon_history, usa o tamanho do histórico
  const totalDgsCalc = rankingDGs?.total_dgs || 
                         profile?.dungeon_history?.length || 
                         profile?.total_participations || 0;
  const totalPointsCalc = profile?.total_points || 0;
  const totalClassesCalc = rankingDGs?.total_dgs || 
                        profile?.dungeon_history?.length || 
                        profile?.total_participations || 0;

  const historyTotalPages = Math.ceil(
    playerHistory.length / historyItemsPerPage
  );
  const currentHistory = playerHistory.slice(
    (historyPage - 1) * historyItemsPerPage,
    historyPage * historyItemsPerPage
  );

  const handleHistoryPageChange = (val) => {
    if (val >= 1 && val <= historyTotalPages) setHistoryPage(val);
  };

  return {
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
  };
};
