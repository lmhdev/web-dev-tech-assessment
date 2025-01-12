import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import SearchResults from "@/components/search/SearchResults";
import { ResultItem } from "@/types";

describe("SearchResults Component", () => {
  const mockPagination = {
    current: 1,
    totalPages: 2,
    totalItems: 20,
    onChange: vi.fn(),
  };

  const mockResults: ResultItem[] = [
    {
      DocumentId: "1",
      DocumentURI: "https://example.com/doc1",
      DocumentTitle: {
        Text: "Sample Title 1",
        Highlights: [{ BeginOffset: 7, EndOffset: 12 }], // Highlight "Title"
      },
      DocumentExcerpt: {
        Text: "This is a sample excerpt highlighting terms.",
        Highlights: [{ BeginOffset: 10, EndOffset: 16 }], // Highlight "sample"
      },
    },
    {
      DocumentId: "2",
      DocumentURI: "https://example.com/doc2",
      DocumentTitle: {
        Text: "Another Title Example",
        Highlights: [{ BeginOffset: 8, EndOffset: 13 }], // Highlight "Title"
      },
      DocumentExcerpt: {
        Text: "This excerpt does not contain highlights.",
        Highlights: [],
      },
    },
  ];

  test("displays loading message when loading is true", () => {
    render(
      <SearchResults
        loading={true}
        error={null}
        results={[]}
        pagination={mockPagination}
      />
    );
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("displays error message when error is provided", () => {
    const errorMessage = "Something went wrong.";
    render(
      <SearchResults
        loading={false}
        error={errorMessage}
        results={[]}
        pagination={mockPagination}
      />
    );
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  test("displays results with highlights", () => {
    const { container } = render(
      <SearchResults
        loading={false}
        error={null}
        results={mockResults}
        pagination={mockPagination}
      />
    );

    const marks = container.querySelectorAll("mark");
    expect(marks).toHaveLength(3);
    expect(marks[0]).toHaveTextContent("Title");
    expect(marks[1]).toHaveTextContent("sample");
  });

  test("displays 'No results found' when results are empty", () => {
    render(
      <SearchResults
        loading={false}
        error={null}
        results={[]}
        pagination={mockPagination}
      />
    );
    expect(screen.getByText("No results found")).toBeInTheDocument();
  });

  test("paginates correctly", () => {
    render(
      <SearchResults
        loading={false}
        error={null}
        results={mockResults}
        pagination={mockPagination}
      />
    );

    expect(screen.getByText("Prev")).toBeDisabled();
    expect(screen.getByText("Next")).not.toBeDisabled();
    expect(screen.getByText("1 / 2")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Next"));
    expect(mockPagination.onChange).toHaveBeenCalledWith(2);
  });

  test("does not display highlights when there are no highlights", () => {
    render(
      <SearchResults
        loading={false}
        error={null}
        results={[mockResults[1]]} // Second result has no excerpt highlights
        pagination={mockPagination}
      />
    );
    const excerpt = screen.getByTestId(`excerpt-${mockResults[1].DocumentId}`);
    const marksInExcerpt = excerpt.querySelectorAll("mark");
    expect(marksInExcerpt.length).toBe(0);
  });
});
