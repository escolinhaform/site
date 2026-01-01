import React from "react";
import { useAppLogic } from "../hooks/useAppLogic";
import HistorySection from "../components/HistorySection";
import PageLayout from "../components/PageLayout";
import DungeonModal from "../components/DungeonModal";
import { formatPlayerName } from "../utils/helpers";
import { Icons } from "../components/Icons.jsx";
import { DEFAULT_AVATAR } from "../utils/helpers";
import { getSessionWeight } from "../utils/helpers";

const HistoricoPage = () => {
  const {
    dgs,
    totalDgsCount,
    loadingDgs,
    selectedDg,
    setSelectedDg,
  } = useAppLogic();

  return (
    <PageLayout title="Histórico de Aulas" activeTab="history">
      <div className="page-container">
      <div className="section-header">
        <div>
          <h1 className="title-large">
            Histórico de <span className="title-accent">Aulas</span>
          </h1>
        </div>
      </div>

      <HistorySection 
        dgs={dgs} 
        totalDgsCount={totalDgsCount}
        loadingDgs={loadingDgs} 
        setSelectedDg={setSelectedDg} 
      />
      </div>

      <DungeonModal
        data={selectedDg}
        onClose={() => setSelectedDg(null)}
        formatPlayerName={formatPlayerName}
        DEFAULT_AVATAR={DEFAULT_AVATAR}
        Icons={Icons}
        getSessionWeight={getSessionWeight}
      />
    </PageLayout>
  );
};

export default HistoricoPage;
