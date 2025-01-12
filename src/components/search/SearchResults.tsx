import React from "react";
import { Highlight, Pagination, ResultItem } from "@/types";

interface SearchResultsProps {
  loading: boolean;
  error: string | null;
  results: ResultItem[];
  pagination: Pagination;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  loading,
  error,
  results,
  pagination,
}) => {
  const highlightText = (text: string, highlights: Highlight[]) => {
    let currentIndex = 0;
    const parts: React.ReactNode[] = [];
    highlights.forEach(({ BeginOffset, EndOffset }, index) => {
      if (currentIndex < BeginOffset) {
        parts.push(text.substring(currentIndex, BeginOffset));
      }
      parts.push(
        <mark key={`highlight-${index}`}>
          {text.substring(BeginOffset, EndOffset)}
        </mark>
      );
      currentIndex = EndOffset;
    });
    if (currentIndex < text.length) {
      parts.push(text.substring(currentIndex));
    }
    return parts;
  };

  const hasResults = results.length > 0;

  return (
    <div className="py-10 w-full flex justify-center">
      <div className="w-full px-4 sm:px-0 sm:w-4/6">
        {loading && <p className="text-center text-gray-500">Loading...</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}

        {hasResults ? (
          <div className="text-gray-800 font-semibold mb-8 text-lg">
            {`Showing ${hasResults ? "1-10" : "0"} of ${pagination.totalItems} results`}
          </div>
        ) : (
          <p className="text-center text-gray-600">No results found</p>
        )}

        {results.map((item) => (
          <div key={item.DocumentId} className="mb-6">
            <a
              href={item.DocumentURI}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary text-lg font-semibold hover:underline block"
            >
              {highlightText(
                item.DocumentTitle.Text,
                item.DocumentTitle.Highlights
              )}
            </a>
            <p
              className="text-gray-700 text-sm mt-1"
              data-testid={`excerpt-${item.DocumentId}`}
            >
              {highlightText(
                item.DocumentExcerpt.Text,
                item.DocumentExcerpt.Highlights
              )}
            </p>
            <a
              href={item.DocumentURI}
              className="text-gray-500 hover:text-gray-600 text-sm mt-1 block break-words"
            >
              {item.DocumentURI}
            </a>
          </div>
        ))}

        {hasResults && (
          <div className="mt-4 flex justify-center items-center gap-2">
            <button
              onClick={() => pagination.onChange(pagination.current - 1)}
              disabled={pagination.current === 1}
              className="px-4 py-2 bg-blue-500 text-white rounded-l disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Prev
            </button>
            <span className="px-4 py-2 text-gray-700 text-center">
              {pagination.current} / {pagination.totalPages}
            </span>
            <button
              onClick={() => pagination.onChange(pagination.current + 1)}
              disabled={pagination.current === pagination.totalPages}
              className="px-4 py-2 bg-blue-500 text-white rounded-r disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
