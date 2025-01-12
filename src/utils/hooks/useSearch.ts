import { useState, useCallback } from "react";
import { ResultItem, Suggestion } from "@/types";
import { useError } from "./useError";

export const useSearch = (pageSize: number = 10) => {
  const [results, setResults] = useState<ResultItem[]>([]);
  const [totalResults, setTotalResults] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  const [loadingResults, setLoadingResults] = useState<boolean>(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState<boolean>(false);

  const { error, setError, clearError } = useError();

  const fetchSuggestions = useCallback(async (term: string) => {
    setLoadingSuggestions(true);
    clearError();
    try {
      const response = await fetch(
        `https://gist.githubusercontent.com/yuhong90/b5544baebde4bfe9fe2d12e8e5502cbf/raw/e026dab444155edf2f52122aefbb80347c68de86/suggestion.json`
      );
      const data: Suggestion = await response.json();
      setSuggestions(data.suggestions.slice(0, 6));
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
    async (page: number = 1) => {
      setLoadingResults(true);
      clearError();
      try {
        const response = await fetch(
          `https://gist.githubusercontent.com/yuhong90/b5544baebde4bfe9fe2d12e8e5502cbf/raw/44deafab00fc808ed7fa0e59a8bc959d255b9785/queryResult.json`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch results");
        }
        const data = await response.json();

        const startIdx = (page - 1) * pageSize;
        const endIdx = startIdx + pageSize;

        setResults(data.ResultItems.slice(startIdx, endIdx));
        setTotalResults(data.TotalNumberOfResults);
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
