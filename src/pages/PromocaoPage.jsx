import React from "react";
import { usePromotionRankingLogic } from "../hooks/usePromotionRankingLogic";
import PromotionTable from "../components/PromotionTable";
import PageLayout from "../components/PageLayout";

const PromocaoPage = () => {
  const {
    promotionList,
    loadingPromotion,
  } = usePromotionRankingLogic("promotion");

  const handleOpenProfile = (player) => {
    window.location.href = `/${player.nickname}`;
  };

  return (
    <PageLayout title="Promoção de Alunos" activeTab="promotion">
      <div className="page-container">
        <div className="section-header">
          <div>
            <h1 className="title-large">
              Promoção <span className="title-accent">Alunos</span>
            </h1>
            <p
              style={{
                color: "#888",
                marginTop: "4px",
                marginBottom: "8px",
                fontSize: "0.9rem",
              }}
            >
              Calouros com &gt; 30 DGs nos últimos 15 dias
            </p>
          </div>
        </div>

        <div className="ranking-table-container">
          <PromotionTable
            promotionList={promotionList}
            loadingPromotion={loadingPromotion}
            onProfileClick={handleOpenProfile}
          />
        </div>
      </div>
    </PageLayout>
  );
};

export default PromocaoPage;
