import {
  act,
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import SearchBar from "./SearchBar";

describe("SearchBar Component", () => {
  const mockFetchResults = vi.fn();
  const mockFetchSuggestions = vi.fn();
  const mockSetShowSuggestions = vi.fn();

  const props = {
    fetchResults: mockFetchResults,
    loadingSuggestions: false,
    suggestions: [
      "suggestion1",
      "suggestion2",
      "suggestion3",
      "suggestion4",
      "suggestion5",
      "suggestion6",
    ],
    showSuggestions: true,
    setShowSuggestions: mockSetShowSuggestions,
    fetchSuggestions: mockFetchSuggestions,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls fetchSuggestions when typing in the input", async () => {
    render(<SearchBar {...props} />);

    const input = screen.getByRole("textbox");

    userEvent.type(input, "test");

    await waitFor(() => {
      expect(mockFetchSuggestions).toHaveBeenCalledWith("test");
    });
  });

  it("calls fetchResults when search button is clicked", async () => {
    render(<SearchBar {...props} />);

    const input = screen.getByRole("textbox");
    await act(async () => {
      await userEvent.type(input, "test");
    });

    const searchButton = screen.getByRole("button", { name: /search/i });

    await act(async () => {
      await userEvent.click(searchButton);
    });

    expect(mockFetchResults).toHaveBeenCalled();
  });

  it("displays suggestion dropdown when user types more than 2 characters", async () => {
    render(<SearchBar {...props} />);

    const input = screen.getByRole("textbox");
    await act(async () => {
      await userEvent.type(input, "test");
    });

    const suggestionDropdown = await screen.findByRole("list");
    expect(suggestionDropdown).toBeInTheDocument();
  });

  it("clears input and suggestions when clear button is clicked", async () => {
    render(<SearchBar {...props} />);
    const searchInput: HTMLInputElement = screen.getByRole("textbox");
    await userEvent.type(searchInput, "test");
    const clearButton = screen.getByLabelText("clear-button");
    await userEvent.click(clearButton);

    expect(searchInput).toHaveValue("");
    expect(mockSetShowSuggestions).toHaveBeenCalledWith(false);
    expect(clearButton).not.toBeInTheDocument();
    expect(searchInput).toHaveFocus();
  });

  it("navigates suggestions with arrow keys and selects with Enter key", async () => {
    render(<SearchBar {...props} />);

    const input = screen.getByRole("textbox");
    await act(async () => {
      await userEvent.type(input, "test");
    });

    await waitFor(() => {
      expect(screen.getByText("suggestion1")).toBeInTheDocument();
    });

    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.keyDown(input, { key: "ArrowUp" });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(mockSetShowSuggestions).toHaveBeenCalledWith(false);
    expect(mockFetchResults).toHaveBeenCalled();
  });

  it("closes suggestions when input is cleared", async () => {
    render(<SearchBar {...props} />);
    const input = screen.getByRole("textbox");

    await userEvent.type(input, "test");

    await userEvent.clear(input);

    await waitFor(() => {
      expect(mockSetShowSuggestions).toHaveBeenCalledWith(false);
    });
  });
});
