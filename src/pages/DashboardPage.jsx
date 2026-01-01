import React from "react";
import { useDashboardLogic } from "../hooks/useDashboardLogic";
import PageLayout from "../components/PageLayout";

const DashboardPage = () => {
  const {
    loading,
    error,
  } = useDashboardLogic();

  return (
    <PageLayout title="Dashboard" activeTab="dashboard">
      <div className="page-container">
        <div className="section-header">
          <div>
            <h1 className="title-large">
              <span className="title-accent">Dashboard</span>
            </h1>
            <p
              style={{
                color: "#888",
                marginTop: "4px",
                marginBottom: "8px",
                fontSize: "0.9rem",
              }}
            >
              /
            </p>
          </div>
        </div>

        <div style={{ padding: "20px", textAlign: "center" }}>
          {loading && <p>Carregando dashboard...</p>}
          {error && <p style={{ color: "red" }}>Erro: {error}</p>}
          {!loading && !error && (
            <div>

            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default DashboardPage;
