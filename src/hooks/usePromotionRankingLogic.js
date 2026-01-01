import { useState, useEffect } from "react";

const RANKING_DGS_API_URL = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/player_rankingdgs_15d`;
const API_KEY = import.meta.env.VITE_SUPABASE_SERVICE_KEY;

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
        // Buscar dados da tabela player_rankingdgs_15d
        const params = new URLSearchParams({
          select: "*",
          order: "position.asc",
          limit: "1000"
        });

        const response = await fetch(`${RANKING_DGS_API_URL}?${params.toString()}`, {
          headers: {
            'apikey': API_KEY,
            'Authorization': `Bearer ${API_KEY}`
          }
        });
        
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
