import { useState, useEffect, useMemo } from "react";

export const useHistoryLogic = (dgs, getSessionWeight) => {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [historySort, setHistorySort] = useState("date");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(getDynamicItemsPerPage());

  function getDynamicItemsPerPage() {
    const width = window.innerWidth;
    if (width < 640) return 6;
    if (width < 1024) return 9;
    return 16;
  }

  useEffect(() => {
    const handleResize = () => setItemsPerPage(getDynamicItemsPerPage());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const filteredDgs = useMemo(() => {
    let result = (dgs || []).filter((dg) => {
      const matchesName = dg.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesDate = dateFilter ? dg.date.startsWith(dateFilter) : true;
      return matchesName && matchesDate;
    });

    if (historySort === "dgs") {
      result.sort((a, b) => (b.dg_count || 0) - (a.dg_count || 0));
    } else {
      result.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    return result;
  }, [dgs, searchTerm, dateFilter, historySort]);

  useEffect(() => {
    if (dgs) {
      setLoading(false);
    }
  }, [dgs]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, dateFilter, historySort]);

  const dgsTotalPages = Math.ceil(filteredDgs.length / itemsPerPage);
  const currentDgs = useMemo(
    () =>
      filteredDgs.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      ),
    [filteredDgs, currentPage, itemsPerPage]
  );

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    document.getElementById("list-top")?.scrollIntoView({ behavior: "smooth" });
  };

  return {
    searchTerm,
    setSearchTerm,
    dateFilter,
    setDateFilter,
    historySort,
    setHistorySort,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    filteredDgs,
    currentDgs,
    dgsTotalPages,
    handlePageChange,
    loading,
  };
};
