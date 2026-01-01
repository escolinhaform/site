import { useState, useEffect } from "react";
import { apiFetch, getApiUrl, getApiHeaders } from "../utils/api";

const DGS_API_URL = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/dgs_realizadas`;
const DGS_API_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

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
        const url = `${getApiUrl('dgs_realizadas')}?select=*&order=date.desc&limit=${PAGE_SIZE}&offset=${offset}`;
        const response = await apiFetch(url, {
          headers: getApiHeaders(false)
        });
        
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
