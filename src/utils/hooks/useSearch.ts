import { useState, useCallback } from "react";
import { ResultItem, Suggestion } from "@/types";
import { useError } from "./useError";

export const useSearch = (pageSize: number = 10) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [results, setResults] = useState<ResultItem[] | null>(null);
  const [totalResults, setTotalResults] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  const [loadingResults, setLoadingResults] = useState<boolean>(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState<boolean>(false);

  const { error, setError, clearError } = useError();

  const resultsURL = import.meta.env.VITE_API_ENDPOINT_RESULT;
  const suggestionsURL = import.meta.env.VITE_API_ENDPOINT_SUGGESTION;

  const fetchSuggestions = useCallback(async (term: string) => {
    setLoadingSuggestions(true);
    clearError();
    try {
      const response = await fetch(suggestionsURL);
      const data: Suggestion = await response.json();
      const filteredSuggestion = data.suggestions.filter((item: string) =>
        item.includes(term)
      );
      setSuggestions(filteredSuggestion.slice(0, 6));
      if (filteredSuggestion.length === 0) {
        setShowSuggestions(false);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(`Failed to fetch suggestions for ${term}`);
      }
    } finally {
      setLoadingSuggestions(false);
    }
  }, []);

  const fetchResults = useCallback(
    async (term: string, page: number = 1) => {
      setSearchTerm(term);
      setLoadingResults(true);
      clearError();
      try {
        const response = await fetch(resultsURL);
        if (!response.ok) {
          throw new Error("Failed to fetch results");
        }
        const data = await response.json();

        const startIdx = (page - 1) * pageSize;
        const endIdx = startIdx + pageSize;
        setResults(data.ResultItems.slice(startIdx, endIdx));

        const filteredResults = data.ResultItems.filter(
          (item: ResultItem) =>
            item.DocumentTitle.Text.toLowerCase().includes(
              term.toLowerCase()
            ) ||
            item.DocumentExcerpt.Text.toLowerCase().includes(term.toLowerCase())
        );

        setResults(filteredResults.slice(startIdx, endIdx));
        setTotalResults(filteredResults.length);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoadingResults(false);
      }
    },
    [pageSize]
  );

  return {
    searchTerm,
    results,
    totalResults,
    suggestions,
    showSuggestions,
    setShowSuggestions,
    loadingResults,
    loadingSuggestions,
    error,
    fetchSuggestions,
    fetchResults,
    currentPage,
    setCurrentPage,
  };
};
