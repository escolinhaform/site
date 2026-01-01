import { useState, useEffect } from "react";

const PROFILES_API_URL =
  "https://kswvirdheurkykcqbokv.supabase.co/rest/v1/players_profiles";
const PROFILES_API_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtzd3ZpcmRoZXVya3lrY3Fib2t2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Njk0NTIwOCwiZXhwIjoyMDgyNTIxMjA4fQ.5CnziP68971KRQi7_j41oWAJ_asrSBncZiLLcIMxYfk";

export const usePromotionLogic = (dgs, activeTab, getSessionWeight) => {
  const [promotionList, setPromotionList] = useState([]);
  const [loadingPromotion, setLoadingPromotion] = useState(false);

  useEffect(() => {
    if (activeTab !== "promotion") {
      return;
    }

    const fetchPromotions = async () => {
      setLoadingPromotion(true);
      try {
        // 1. Calcular DGs nos últimos 15 dias por nickname
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - 15);

        const recentActivity = {};
        dgs.forEach((dg) => {
          if (new Date(dg.date) >= cutoff) {
            const w = getSessionWeight(dg.players);
            if (dg.players) {
              dg.players.forEach((p) => {
                if (p.nick) {
                  const lower = p.nick.trim().toLowerCase();
                  recentActivity[lower] = (recentActivity[lower] || 0) + w;
                }
              });
            }
          }
        });

        // 2. Buscar profiles com role 'calouro'
        const params = new URLSearchParams({
          select: "*",
          role: "ilike.%calouro%",
          apikey: PROFILES_API_KEY,
        });

        const res = await fetch(`${PROFILES_API_URL}?${params.toString()}`);
        if (res.ok) {
          const candidates = await res.json();

          // 3. Filtrar candidatos com > 30 DGs
          const qualified = candidates
            .map((p) => {
              const nick = p.nickname ? p.nickname.trim().toLowerCase() : "";
              const count = recentActivity[nick] || 0;
              return { ...p, recent_dgs: count };
            })
            .filter((p) => p.recent_dgs > 30);

          // Ordenar por maior número de DGs
          qualified.sort((a, b) => b.recent_dgs - a.recent_dgs);
          setPromotionList(qualified);
        }
      } catch (e) {
        console.error("Error fetching promotions", e);
      } finally {
        setLoadingPromotion(false);
      }
    };

    fetchPromotions();
  }, [activeTab]);

  return {
    promotionList,
    loadingPromotion,
  };
};
