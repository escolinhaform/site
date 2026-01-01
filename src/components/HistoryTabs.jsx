import React from "react";

const HistoryTabs = ({ historySort, setHistorySort }) => (
  <div className="filter-input-group" style={{ maxWidth: "180px" }}>
    <select
      className="filter-input"
      value={historySort}
      onChange={(e) => setHistorySort(e.target.value)}
    >
      <option value="date">📅 Mais Recentes</option>
      <option value="dgs">🏆 Maior Peso (DGs)</option>
    </select>
  </div>
);

export default HistoryTabs;
