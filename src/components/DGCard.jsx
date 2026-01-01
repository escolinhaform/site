import React from "react";
import { formatDGDateTime, formatDGTime } from "../utils/helpers";

const DGCard = ({ data, onClick, Icons }) => (
  <div className="card" onClick={() => onClick(data)}>
    <div className="card-header-row">
      <div className="icon-circle">
        <Icons.Swords />
      </div>
      <span className="card-id">ID: {data.id}</span>
    </div>
    <h3>{data.name}</h3>
    <div className="card-meta">
      <div className="meta-item">
        <Icons.Calendar style={{ width: 16 }} /> {formatDGDateTime(data.date)}
      </div>
      <div className="meta-item">
        <Icons.Users style={{ width: 16 }} /> {data.players ? data.players.length : 0} Alunos
      </div>
      <div className="meta-item">
        <Icons.Trophy style={{ width: 16, color: "var(--accent)" }} /> DGs Realizadas: <span style={{ color: "#fff", fontWeight: "bold", marginLeft: "4px" }}>{data.dg_count || 0}</span>
      </div>
      <div className="meta-item">
        <Icons.Clock style={{ width: 16 }} /> Tempo Total: <span style={{ color: "#fff", fontWeight: "bold", marginLeft: "4px" }}>{formatDGTime(data.dg_time || 0)}</span>
      </div>
    </div>
    <div className="view-more">
      Ver Detalhes <Icons.ChevronRight style={{ width: 16 }} />
    </div>
  </div>
);

export default DGCard;
