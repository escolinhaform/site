import { useState, useEffect } from "react";

export const useDashboardLogic = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Por enquanto, apenas um hook básico sem lógica complexa
  useEffect(() => {
    // Futura lógica do dashboard pode ser adicionada aqui
  }, []);

  return {
    loading,
    error,
  };
};
