import React from "react";
import { Pagination, ResultItem } from "@/types";

interface SearchResultsProps {
  searchTerm: string;
  loading: boolean;
  error: string | null;
  results: ResultItem[] | null;
  pagination: Pagination;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  searchTerm,
  loading,
  error,
  results,
  pagination,
}) => {
  const highlightTextInParagraph = (
    text: string,
    searchTerm: string
  ): React.ReactNode[] => {
    if (!searchTerm) return [text];

    const parts: React.ReactNode[] = [];
    let currentIndex = 0;

    const lowerCaseText = text.toLowerCase();
    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    let startIndex = lowerCaseText.indexOf(lowerCaseSearchTerm);

    while (startIndex !== -1) {
      if (currentIndex < startIndex) {
        parts.push(text.substring(currentIndex, startIndex));
      }

      const endIndex = startIndex + searchTerm.length;
      parts.push(
        <mark key={`highlight-${currentIndex}`}>
          {text.substring(startIndex, endIndex)}
        </mark>
      );

      currentIndex = endIndex;

      startIndex = lowerCaseText.indexOf(lowerCaseSearchTerm, startIndex + 1);
    }

    if (currentIndex < text.length) {
      parts.push(text.substring(currentIndex));
    }
    return parts;
  };

  const hasResults = results && results.length > 0;

  return (
    <div className="py-10 w-full flex justify-center">
      <div className="w-full px-4 sm:px-0 sm:w-4/6">
        {loading && <p className="text-center text-gray-500">Loading...</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}

        {hasResults ? (
          <div className="text-gray-800 font-semibold mb-8 text-lg">
            {`Showing ${hasResults ? `1-${Math.min(pagination.totalItems, 10)}` : "0"} of ${pagination.totalItems} results`}
          </div>
        ) : (
          !loading &&
          results && (
            <p className="text-center text-gray-600">No results found</p>
          )
        )}

        {hasResults
          ? results.map((item) => (
              <div key={item.DocumentId} className="mb-6">
                <a
                  href={item.DocumentURI}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary text-lg font-semibold hover:underline block"
                >
                  {highlightTextInParagraph(
                    item.DocumentTitle.Text,
                    searchTerm
                  )}
                </a>
                <p
                  className="text-gray-700 text-sm mt-1"
                  data-testid={`excerpt-${item.DocumentId}`}
                >
                  {highlightTextInParagraph(
                    item.DocumentExcerpt.Text,
                    searchTerm
                  )}
                </p>
                <a
                  href={item.DocumentURI}
                  className="text-gray-500 hover:text-gray-600 text-sm mt-1 block break-words"
                >
                  {item.DocumentURI}
                </a>
              </div>
            ))
          : null}

        {hasResults && (
          <div className="mt-4 flex justify-center items-center gap-2">
            <button
              onClick={() => pagination.onChange(pagination.current - 1)}
              disabled={pagination.current === 1}
              className="px-4 py-2 bg-blue-500 text-white rounded-l disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Prev
            </button>
            <span
              className="px-4 py-2 text-gray-700 text-center"
              role="presentation"
            >
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
