export interface Highlight {
  BeginOffset: number;
  EndOffset: number;
}

export interface ResultItem {
  DocumentId: string;
  DocumentTitle: { Text: string; Highlights: Highlight[] };
  DocumentExcerpt: { Text: string; Highlights: Highlight[] };
  DocumentURI: string;
}

export interface Suggestion {
  suggestions: string[];
}

export interface Pagination {
  current: number;
  totalItems: number;
  totalPages: number;
  onChange: (page: number) => void;
}
