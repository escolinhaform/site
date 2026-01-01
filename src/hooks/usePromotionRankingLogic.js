import { useState, useEffect } from "react";

const RANKING_DGS_API_URL = "https://kswvirdheurkykcqbokv.supabase.co/rest/v1/player_rankingdgs_30d";
const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtzd3ZpcmRoZXVya3lrY3Fib2t2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Njk0NTIwOCwiZXhwIjoyMDgyNTIxMjA4fQ.5CnziP68971KRQi7_j41oWAJ_asrSBncZiLLcIMxYfk";

export const usePromotionRankingLogic = (activeTab) => {
  const [promotionList, setPromotionList] = useState([]);
  const [loadingPromotion, setLoadingPromotion] = useState(false);

  useEffect(() => {
    if (activeTab !== "promotion") {
      return;
    }

    const fetchPromotionRanking = async () => {
      setLoadingPromotion(true);
      try {
        // Buscar dados da tabela player_rankingdgs_30d
        const params = new URLSearchParams({
          select: "*",
          order: "position.asc",
          limit: "1000",
          apikey: API_KEY,
        });

        const response = await fetch(`${RANKING_DGS_API_URL}?${params.toString()}`);
        
        if (response.ok) {
          const allPlayers = await response.json();
          
          // Filtrar apenas calouros com pelo menos 100 pontos
          const qualifiedFreshmen = allPlayers.filter(player => {
            const role = player.role?.toLowerCase() || "";
            const hasRoleCalouro = role.includes("calouro");
            const hasMinPoints = player.total_points >= 30;
            
            return hasRoleCalouro && hasMinPoints;
          });

          // Ordenar por total de pontos (decrescente)
          qualifiedFreshmen.sort((a, b) => b.total_points - a.total_points);
          
          setPromotionList(qualifiedFreshmen);
        } else {
          console.error("Error fetching promotion ranking:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching promotion ranking:", error);
      } finally {
        setLoadingPromotion(false);
      }
    };

    fetchPromotionRanking();
  }, [activeTab]);

  return {
    promotionList,
    loadingPromotion,
  };
};
