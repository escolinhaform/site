import React from "react";
import { useHistoryLogic } from "../hooks/useHistoryLogic";
import HistoryTabs from "./HistoryTabs";
import DGCardSkeleton from "./DGCardSkeleton";
import DGCard from "./DGCard";
import { Icons } from "./Icons.jsx";

const HistorySection = ({ dgs, totalDgsCount, loadingDgs, setSelectedDg }) => {
  const {
    searchTerm,
    setSearchTerm,
    dateFilter,
    setDateFilter,
    historySort,
    setHistorySort,
    currentPage,
    setCurrentPage,
    filteredDgs,
    currentDgs,
    dgsTotalPages,
    handlePageChange,
  } = useHistoryLogic(dgs, (players) => {
    // Função para calcular peso da sessão (DGs)
    if (!players || !Array.isArray(players)) return 0;
    return players.reduce((total, player) => {
      const dgs = player.dgs || 0;
      const assists = player.assists || 0;
      return total + dgs + assists;
    }, 0);
  });

  return (
    <>
      <div className="section-header">
        {/* Header com total de aulas */}
        <div style={{ marginBottom: "20px" }}>
          <p
            style={{
              color: "#888",
              marginTop: "4px",
              fontSize: "0.9rem",
            }}
          >
            Total de aulas:{" "}
            <span style={{ color: "#fff", fontWeight: "bold" }}>
              {totalDgsCount || 0}
            </span>
          </p>
        </div>
      </div>

      {/* Filtros e abas de histórico */}
      {!loadingDgs && (
        <div className="filters-bar">
          <div className="filter-input-group">
            <div className="filter-icon">
              <Icons.Search style={{ width: 18 }} />
            </div>
            <input
              type="text"
              className="filter-input"
              placeholder="Pesquisar por nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-input-group date-input-group" style={{ maxWidth: "220px" }}>
            <input
              type="date"
              className="filter-input"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>
          <HistoryTabs historySort={historySort} setHistorySort={setHistorySort} />
          {(searchTerm || dateFilter) && (
            <button
              className="clear-btn"
              onClick={() => {
                setSearchTerm("");
                setDateFilter("");
              }}
            >
              <Icons.X style={{ width: 16, marginRight: 6 }} /> Limpar
            </button>
          )}
        </div>
      )}
      <div className="cards-grid">
        {loadingDgs ? (
          Array(16)
            .fill(0)
            .map((_, i) => <DGCardSkeleton key={i} />)
        ) : currentDgs.length > 0 ? (
          currentDgs.map((dg) => (
            <DGCard key={dg.id} data={dg} onClick={setSelectedDg} Icons={Icons} />
          ))
        ) : (
          <div
            style={{
              gridColumn: "1/-1",
              textAlign: "center",
              padding: "40px",
              color: "#666",
            }}
          >
            Nenhuma aula encontrada.
          </div>
        )}
      </div>
      {/* Paginação */}
      {!loadingDgs && currentDgs.length > 0 && (
        <div className="pagination">
          <button
            className="page-btn"
            disabled={currentPage === 1}
            onClick={() => {
              setCurrentPage((p) => p - 1);
              document.getElementById("list-top")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <Icons.ChevronLeft />
          </button>
          <span style={{ color: "#888" }}>
            Página <b style={{ color: "#fff" }}>{currentPage}</b> de {dgsTotalPages}
          </span>
          <button
            className="page-btn"
            disabled={currentPage === dgsTotalPages}
            onClick={() => {
              setCurrentPage((p) => p + 1);
              document.getElementById("list-top")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <Icons.ChevronRight />
          </button>
        </div>
      )}
    </>
  );
};

export default HistorySection;
