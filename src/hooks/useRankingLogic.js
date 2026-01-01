import { useState, useEffect } from "react";

const PROFILES_API_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtzd3ZpcmRoZXVya3lrY3Fib2t2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Njk0NTIwOCwiZXhwIjoyMDgyNTIxMjA4fQ.5CnziP68971KRQi7_j41oWAJ_asrSBncZiLLcIMxYfk";

export const useRankingLogic = (activeTab, getSafeImage) => {
  const [loadingProfiles, setLoadingProfiles] = useState(false);
  const [rankingFilter, setRankingFilter] = useState("TOTAL");
  const [top3, setTop3] = useState([]);
  const [tableRanking, setTableRanking] = useState([]);
  const [rankingPage, setRankingPage] = useState(1);
  const [hasMoreProfiles, setHasMoreProfiles] = useState(true);

  // Determinar qual tabela usar baseado na aba ativa
  const getTableName = (filter) => {
    if (activeTab === "ranking_aulas") {
      // Usar tabelas de DGs para ranking de aulas
      if (filter === '30D') return 'player_rankingdgs_30d';
      if (filter === '7D') return 'player_rankingdgs_7d';
      return 'player_rankingdgs'; // Tabela base para ranking de DGs
    } else {
      // Usar tabelas de maestria para ranking normal
      if (filter === '30D') return 'player_ranking_30d';
      if (filter === '7D') return 'player_ranking_7d';
      return 'player_ranking';
    }
  };

  // --- CORREÇÃO 1: Mapeamento no Top 3 ---
  useEffect(() => {
    const fetchTop3 = async () => {
      const tableName = getTableName(rankingFilter);

      try {
        const params = new URLSearchParams({
          select: '*',
          order: 'position.asc',
          limit: 3,
          apikey: PROFILES_API_KEY,
        });
        const API_URL = `https://kswvirdheurkykcqbokv.supabase.co/rest/v1/${tableName}`;
        const response = await fetch(`${API_URL}?${params.toString()}`);
        if (!response.ok) throw new Error(`Erro ao buscar top 3 de ${tableName}`);
        const data = await response.json();
        
        // Mapear campos corretos baseado na tabela
        const mappedData = data.map(p => {
          if (activeTab === "ranking_aulas") {
            return { 
              ...p, 
              // AQUI ESTÁ A CORREÇÃO:
              // Verifica se existe total_dgs (comum em views de DG), senão tenta total_points
              total_points: Number(p.total_dgs || p.total_points) || 0,
              // Garante que o campo role exista para colorir o nickname
              role: p.role || p.most_frequent_role,
            };
          } else {
            return { 
              ...p, 
              total_points: Number(p.total_points) || 0,
            };
          }
        });
        
        setTop3(mappedData);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTop3();
  }, [rankingFilter, activeTab]);

  // --- CORREÇÃO 2: Mapeamento na Tabela de Ranking ---
  useEffect(() => {
    const fetchTableRanking = async () => {
      setLoadingProfiles(true);
      const tableName = getTableName(rankingFilter);

      try {
        const offset = (rankingPage - 1) * 20 + 3; // Adiciona 3 para pular o top 3 
        const params = new URLSearchParams({
          select: '*',
          order: 'position.asc',
          limit: 20,
          offset,
          apikey: PROFILES_API_KEY,
        });

        const API_URL = `https://kswvirdheurkykcqbokv.supabase.co/rest/v1/${tableName}`;
        const response = await fetch(`${API_URL}?${params.toString()}`);
        if (!response.ok) throw new Error(`Erro ao buscar ranking de ${tableName}`);
        
        const data = await response.json();
        
        // Mapear campos corretos baseado na tabela
        const finalData = data.map(p => {
          if (activeTab === "ranking_aulas") {
            return {
              ...p,
              // AQUI ESTÁ A CORREÇÃO:
              // Garante que a UI receba "total_points" mesmo que o banco mande "total_dgs"
              total_points: Number(p.total_dgs || p.total_points) || 0,
              // Garante que o campo role exista para colorir o nickname
              role: p.role || p.most_frequent_role,
            };
          } else {
            return {
              ...p,
              total_points: Number(p.total_points) || 0, // Pontos de maestria
            };
          }
        });

        setTableRanking(finalData);
        setHasMoreProfiles(data.length === 20);

      } catch (err) {
        console.error(err);
      } finally {
        setLoadingProfiles(false);
      }
    };

    fetchTableRanking();
  }, [rankingFilter, rankingPage, activeTab]);

  const handleRankingPageChange = (page) => {
    setRankingPage(page);
    document.getElementById("list-top")?.scrollIntoView({ behavior: "smooth" });
  };

  return {
    loadingProfiles,
    rankingFilter,
    setRankingFilter,
    rankingPage,
    setRankingPage,
    hasMoreProfiles,
    top3,
    tableRanking,
    handleRankingPageChange,
  };
};