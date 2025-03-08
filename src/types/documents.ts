interface Company {
    name: string;
}

interface InnerDocument {
    text: string;
    company?: Company;
}

interface Highlight {
    text: string[];
}

interface Relation {
    value: number;
    relation: string;
}

export interface Hits<T> {
    hits: Array<T>,
    total: Relation,
}

export interface SearchResult<T> {
    hits?: Hits<T>,
    _scroll_id?: string,
}

export interface Document {
    _id: string;
    _source: InnerDocument;
    highlight?: Highlight;
}
