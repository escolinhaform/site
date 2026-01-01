import React, { useState, useEffect, useRef } from 'react';
import { getSafeImage, formatPlayerName, DEFAULT_AVATAR } from '../utils/helpers';

const SidebarSearch = ({ onSelect, closeMobileSidebar }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setResults([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
          select: "id,nickname,image",
          nickname: `ilike.%${query}%`,
          limit: 5,
          apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtzd3ZpcmRoZXVya3lrY3Fib2t2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Njk0NTIwOCwiZXhwIjoyMDgyNTIxMjA4fQ.5CnziP68971KRQi7_j41oWAJ_asrSBncZiLLcIMxYfk",
        });
        const response = await fetch(
          `https://kswvirdheurkykcqbokv.supabase.co/rest/v1/players_profiles?${params.toString()}`
        );
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
    setQuery("");
    setResults([]);
    // Close mobile sidebar after selecting a player
    if (closeMobileSidebar) {
      closeMobileSidebar();
    }
    try {
      const params = new URLSearchParams({
        id: `eq.${playerBasic.id}`,
        select: "*",
        apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtzd3ZpcmRoZXVya3lrY3Fib2t2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Njk0NTIwOCwiZXhwIjoyMDgyNTIxMjA4fQ.5CnziP68971KRQi7_j41oWAJ_asrSBncZiLLcIMxYfk",
      });
      const url = `https://kswvirdheurkykcqbokv.supabase.co/rest/v1/players_profiles?${params.toString()}`;
      const response = await fetch(url);
      const data = await response.json();
      if (data && data.length > 0) {
        onSelect(data[0]);
      }
    } catch (err) {
      if (err.name === 'AbortError') return;
      console.error("Error fetching full profile", err);
    }
  };

  return (
    <div className="sidebar-search-container" ref={searchRef}>
      <div className="sidebar-search-input-wrapper">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="sidebar-search-icon"
          style={{ width: 16 }}
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
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
          {results.map((player) => (
            <div
              key={player.id}
              className="search-result-item"
              onClick={() => handleSelect(player)}
            >
              <img
                src={getSafeImage(player.image)}
                alt={player.nickname}
                className="search-avatar"
                onError={(e) => (e.target.src = DEFAULT_AVATAR)}
              />
              <span className="search-name">
                {formatPlayerName(player.nickname)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SidebarSearch;
