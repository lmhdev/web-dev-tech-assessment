import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import SearchContainer from "./SearchContainer";
import { useSearch } from "@/utils/hooks/useSearch";

vi.mock("@/utils/hooks/useSearch", () => ({
  useSearch: vi.fn(),
}));

describe("SearchContainer Component", () => {
  const mockUseSearch = {
    results: [],
    totalResults: 50,
    fetchResults: vi.fn(),
    suggestions: ["suggestion1", "suggestion2"],
    showSuggestions: true,
    setShowSuggestions: vi.fn(),
    fetchSuggestions: vi.fn(),
    loadingResults: false,
    loadingSuggestions: false,
    error: null,
    currentPage: 1,
    setCurrentPage: vi.fn(),
  };

  beforeEach(() => {
    (useSearch as jest.Mock).mockReturnValue(mockUseSearch);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders SearchBar and SearchResults components", () => {
    render(<SearchContainer />);

    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(screen.getByText("No results found")).toBeInTheDocument();
  });

  it("passes correct props to SearchBar", async () => {
    render(<SearchContainer />);

    const input = screen.getByRole("textbox");
    userEvent.type(input, "test");

    await waitFor(() => {
      expect(mockUseSearch.fetchSuggestions).toHaveBeenCalled();
    });
  });

  it("displays error message when there is an error", () => {
    (useSearch as jest.Mock).mockReturnValueOnce({
      ...mockUseSearch,
      error: "Something went wrong!",
    });

    render(<SearchContainer />);

    expect(screen.getByText("Something went wrong!")).toBeInTheDocument();
  });
});
