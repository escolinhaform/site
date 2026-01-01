import { useState, useEffect } from 'react';

const PROFILES_API_URL = "https://kswvirdheurkykcqbokv.supabase.co/rest/v1/players_profiles";
const DGS_API_URL = "https://kswvirdheurkykcqbokv.supabase.co/rest/v1/dgs_realizadas";
const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtzd3ZpcmRoZXVya3lrY3Fib2t2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Njk0NTIwOCwiZXhwIjoyMDgyNTIxMjA4fQ.5CnziP68971KRQi7_j41oWAJ_asrSBncZiLLcIMxYfk";
const DGS_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtzd3ZpcmRoZXVya3lrY3Fib2t2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5NDUyMDgsImV4cCI6MjA4MjUyMTIwOH0.TaDw28xYzzIbkQQMVjyO_Rq8ljIS8S_rbQ3Y8fGvOoI";

export const usePlayerProfile = (nickname) => {
  const [profile, setProfile] = useState(null);
  const [allDgs, setAllDgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!nickname) return;

      setLoading(true);
      setError(null);

      try {
        // Buscar perfil do jogador
        const profileParams = new URLSearchParams({
          nickname: `eq.${nickname}`,
          select: "*",
          apikey: API_KEY,
        });

        const profileResponse = await fetch(`${PROFILES_API_URL}?${profileParams.toString()}`);
        if (!profileResponse.ok) throw new Error("Perfil não encontrado");
        
        const profileData = await profileResponse.json();
        if (profileData.length === 0) {
          setError("Jogador não encontrado");
          return;
        }

        const playerProfile = profileData[0];

        // Se o histórico de dungeons for uma lista de IDs, buscar os detalhes
        if (playerProfile.dungeon_history && Array.isArray(playerProfile.dungeon_history)) {
          const historyIds = playerProfile.dungeon_history;
          const historyPromises = historyIds.map(eventId => {
            const url = `${DGS_API_URL}?eventid=eq.${eventId}&select=*&apikey=${DGS_API_KEY}`;
            return fetch(url).then(res => res.json());
          });

          const results = await Promise.all(historyPromises);
          const rawHistory = results.flat();

          const processedHistory = rawHistory.map(dg => {
            const playerData = dg.players.find(p => p.nick.toLowerCase() === nickname.toLowerCase());
            if (playerData) {
              return { ...dg, ...playerData };
            }
            return dg; // Retorna a DG mesmo se o jogador não for encontrado, para manter o registro
          }).sort((a, b) => new Date(b.date) - new Date(a.date));

          playerProfile.dungeon_history = processedHistory;
        }

        setProfile(playerProfile);

        // A busca de todas as DGs pode ser removida se não for usada em outro lugar
        // Por enquanto, vou manter para não quebrar outras funcionalidades.
        const dgsParams = new URLSearchParams({
          select: "*",
          order: "date.desc",
          apikey: DGS_API_KEY,
        });

        const dgsResponse = await fetch(`${DGS_API_URL}?${dgsParams.toString()}`);
        if (dgsResponse.ok) {
          const dgsData = await dgsResponse.json();
          setAllDgs(dgsData);
        }

      } catch (err) {
        console.error("Erro ao buscar perfil:", err);
        setError(err.message || "Erro ao carregar perfil");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [nickname]);

  return {
    profile,
    allDgs,
    loading,
    error,
  };
};
