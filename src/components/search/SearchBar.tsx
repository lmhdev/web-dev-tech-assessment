import React, { useState, useRef, useEffect } from "react";
import { MdClear } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import { AiOutlineLoading } from "react-icons/ai";

interface SearchBarProps {
  fetchResults: () => void;
  loadingSuggestions: boolean;
  suggestions: string[];
  showSuggestions: boolean;
  setShowSuggestions: React.Dispatch<React.SetStateAction<boolean>>;
  fetchSuggestions: (term: string) => Promise<void>;
}

const SearchBar: React.FC<SearchBarProps> = ({
  fetchResults,
  loadingSuggestions,
  suggestions,
  showSuggestions,
  setShowSuggestions,
  fetchSuggestions,
}) => {
  const [query, setQuery] = useState<string>("");
  const [activeSuggestionIndex, setActiveSuggestionIndex] =
    useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!showSuggestions) {
      setActiveSuggestionIndex(-1);
    }
  }, [showSuggestions]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      if (value.length > 2) {
        fetchSuggestions(value);
        setShowSuggestions(true);
      } else {
        setShowSuggestions(false);
      }
    }, 300);
  };

  const handleSearch = () => {
    if (query.trim()) {
      fetchResults();
    }
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      setActiveSuggestionIndex((prevIndex) =>
        prevIndex < suggestions.length - 1 ? prevIndex + 1 : prevIndex
      );
    } else if (e.key === "ArrowUp") {
      setActiveSuggestionIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : prevIndex
      );
    } else if (e.key === "Enter" && activeSuggestionIndex >= 0) {
      handleSuggestionClick(suggestions[activeSuggestionIndex]);
    } else if (e.key === "Enter") {
      handleSearch();
      setShowSuggestions(false);
    }
  };

  const handleClear = () => {
    setQuery("");
    setShowSuggestions(false);
    setActiveSuggestionIndex(-1);
    inputRef.current?.focus();
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    handleSearch();
  };

  return (
    <div className="flex justify-center items-center w-full py-10 shadow-lg">
      <div className="flex flex-col sm:flex-row items-center border border-gray-400 rounded-lg w-full sm:w-4/6 relative mx-2 sm:mx-0 sm:pl-4 sm:pr-0">
        <div className="flex items-center w-full rounded-lg">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder="Search..."
            className="flex-grow px-3 py-2 focus:outline-none text-sm sm:text-base rounded-lg"
            onKeyDown={handleKeyDown}
          />
          {query && (
            <button
              onClick={handleClear}
              className="text-gray-600 hover:text-gray-700 focus:outline-none mr-2"
              aria-label="clear-button"
            >
              <MdClear size={20} />
            </button>
          )}
        </div>
        <button
          className="flex items-center w-full sm:w-auto px-5 py-2 sm:ml-2 bg-primary text-white rounded-md hover:bg-blue-600 focus:outline-none justify-center"
          onClick={handleSearch}
        >
          <FaSearch />
          <span className="ml-1">Search</span>
        </button>
        {showSuggestions && (
          <ul className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-2 z-10">
            {loadingSuggestions ? (
              <div className="flex justify-center items-center py-4">
                <AiOutlineLoading className="animate-spin text-gray-500 text-xl" />
              </div>
            ) : null}
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className={`px-4 py-2 cursor-pointer hover:bg-gray-200 ${
                  index === activeSuggestionIndex ? "bg-gray-300" : ""
                }`}
                onClick={() => handleSuggestionClick(suggestion)}
                onMouseEnter={() => setActiveSuggestionIndex(index)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
