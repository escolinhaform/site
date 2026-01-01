import { useState, useEffect } from "react";

const DGS_API_URL =
  "https://kswvirdheurkykcqbokv.supabase.co/rest/v1/dgs_realizadas";
const DGS_API_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtzd3ZpcmRoZXVya3lrY3Fib2t2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5NDUyMDgsImV4cCI6MjA4MjUyMTIwOH0.TaDw28xYzzIbkQQMVjyO_Rq8ljIS8S_rbQ3Y8fGvOoI";

export const useAppLogic = () => {
  const [activeTab, setActiveTab] = useState("ranking");
  const [dgs, setDgs] = useState([]);
  const [totalDgsCount, setTotalDgsCount] = useState(0);
  const [loadingDgs, setLoadingDgs] = useState(true);
  const [selectedDg, setSelectedDg] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [error, setError] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const fetchAllDgs = async () => {
    setLoadingDgs(true);
    try {
      const PAGE_SIZE = 1000;
      let allDgs = [];
      let offset = 0;
      let hasMore = true;

      while (hasMore) {
        const response = await fetch(
          `${DGS_API_URL}?select=*&order=date.desc&limit=${PAGE_SIZE}&offset=${offset}`,
          {
            headers: { apikey: DGS_API_KEY },
          }
        );
        
        if (!response.ok) throw new Error("Falha ao buscar DGs");
        
        const data = await response.json();
        
        if (data.length === 0) {
          hasMore = false;
        } else {
          allDgs = [...allDgs, ...data];
          offset += PAGE_SIZE;
          
          // Se retornou menos que o PAGE_SIZE, chegamos ao fim
          if (data.length < PAGE_SIZE) {
            hasMore = false;
          }
        }
      }

      setDgs(allDgs);
      setTotalDgsCount(allDgs.length);
    } catch (err) {
      console.error(err);
      setError("Erro ao carregar aulas.");
    } finally {
      setLoadingDgs(false);
    }
  };

  useEffect(() => {
    fetchAllDgs();
  }, []);

  const handleOpenProfile = (profile) => {
    setSelectedProfile(profile);
    setActiveTab("profile");
    if (mobileOpen) setMobileOpen(false);
  };

  const handleBackToRanking = () => {
    setSelectedProfile(null);
    setActiveTab("ranking");
  };

  return {
    activeTab,
    setActiveTab,
    dgs,
    totalDgsCount,
    loadingDgs,
    selectedDg,
    setSelectedDg,
    selectedProfile,
    handleOpenProfile,
    handleBackToRanking,
    error,
    mobileOpen,
    setMobileOpen,
    isCollapsed,
    setIsCollapsed,
  };
};
