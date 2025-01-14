import React, { useState } from "react";
import { useSearch } from "@/utils/hooks/useSearch";
import SearchBar from "./SearchBar";
import SearchResults from "./SearchResults";

const SearchContainer: React.FC = () => {
  const [pageSize] = useState<number>(10);

  const {
    searchTerm,
    results,
    totalResults,
    fetchResults,
    suggestions,
    showSuggestions,
    setShowSuggestions,
    fetchSuggestions,
    loadingResults,
    loadingSuggestions,
    error,
    currentPage,
    setCurrentPage,
  } = useSearch();

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(totalResults / pageSize);

  return (
    <div className="flex flex-col items-center w-full">
      <SearchBar
        fetchResults={fetchResults}
        suggestions={suggestions}
        showSuggestions={showSuggestions}
        setShowSuggestions={setShowSuggestions}
        fetchSuggestions={fetchSuggestions}
        loadingSuggestions={loadingSuggestions}
      />
      <SearchResults
        searchTerm={searchTerm}
        loading={loadingResults}
        error={error}
        results={results}
        pagination={{
          current: currentPage,
          totalItems: totalResults,
          totalPages: totalPages,
          onChange: handlePageChange,
        }}
      />
    </div>
  );
};

export default SearchContainer;
