import { renderHook, act } from "@testing-library/react";
import { vi } from "vitest";
import { useSearch } from "./useSearch";

vi.mock("./useError", () => ({
  useError: vi.fn().mockReturnValue({
    error: "",
    setError: vi.fn(),
    clearError: vi.fn(),
  }),
}));

describe("useSearch", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("initial state is correct", () => {
    const { result } = renderHook(() => useSearch(10));

    expect(result.current.results).toEqual(null);
    expect(result.current.totalResults).toBe(0);
    expect(result.current.currentPage).toBe(1);
    expect(result.current.suggestions).toEqual([]);
    expect(result.current.showSuggestions).toBe(false);
    expect(result.current.loadingResults).toBe(false);
    expect(result.current.loadingSuggestions).toBe(false);
    expect(result.current.error).toBe("");
  });

  test("fetchSuggestions sets suggestions correctly", async () => {
    const mockResponse = {
      suggestions: ["suggestion 1", "suggestion 2", "suggestion 3"],
    };

    global.fetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue(mockResponse),
    });

    const { result } = renderHook(() => useSearch(10));

    await act(async () => {
      await result.current.fetchSuggestions("suggestion");
    });

    expect(result.current.suggestions).toEqual([
      "suggestion 1",
      "suggestion 2",
      "suggestion 3",
    ]);
    expect(global.fetch).toHaveBeenCalledWith(
      "https://gist.githubusercontent.com/yuhong90/b5544baebde4bfe9fe2d12e8e5502cbf/raw/e026dab444155edf2f52122aefbb80347c68de86/suggestion.json"
    );
    expect(result.current.loadingSuggestions).toBe(false);
  });

  test("fetchSuggestions handles errors", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("Fetch failed"));

    const { result } = renderHook(() => useSearch(10));

    await act(async () => {
      await result.current.fetchSuggestions("term");
    });

    expect(result.current.loadingSuggestions).toBe(false);
    expect(result.current.showSuggestions).toBe(false);
  });

  test("fetchResults sets results correctly", async () => {
    const mockResponse = {
      ResultItems: Array.from({ length: 30 }, (_, index) => ({
        id: index,
        name: `Item ${index}`,
      })),
      TotalNumberOfResults: 30,
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(mockResponse),
    });

    const { result } = renderHook(() => useSearch(10));

    await act(async () => {
      await result.current.fetchResults("item", 1);
    });

    expect(result.current.results).toHaveLength(10);
    expect(result.current.totalResults).toBe(0);
    expect(result.current.loadingResults).toBe(false);
  });

  test("fetchResults handles errors", async () => {
    global.fetch = vi
      .fn()
      .mockRejectedValue(new Error("Failed to fetch results"));

    const { result } = renderHook(() => useSearch(10));

    await act(async () => {
      await result.current.fetchResults("child");
    });

    expect(result.current.loadingResults).toBe(false);
  });

  test("loading state toggles during fetchResults and fetchSuggestions", async () => {
    const mockResponse = {
      suggestions: ["suggestion 1", "suggestion 2"],
    };
    global.fetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue(mockResponse),
    });

    const { result } = renderHook(() => useSearch(10));

    expect(result.current.loadingSuggestions).toBe(false);

    act(() => {
      result.current.fetchSuggestions("term");
    });

    expect(result.current.loadingSuggestions).toBe(true);
    await act(async () => {});
    expect(result.current.loadingSuggestions).toBe(false);
  });

  test("setCurrentPage updates the page correctly", async () => {
    const { result } = renderHook(() => useSearch(10));

    act(() => {
      result.current.setCurrentPage(2);
    });

    expect(result.current.currentPage).toBe(2);
  });
});
