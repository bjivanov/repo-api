export interface Filter {
  [property: string]: any[]
}

export interface ResponseQuery {
  orderBy?: string;
  sortOrder?: SortOrder;
  filter?: Filter;
  skip?: number;
  take?: number;
}

export type SortOrder = 'asc' | 'desc';