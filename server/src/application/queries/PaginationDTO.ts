export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export class PaginationDTO<T> {
  data: T[];
  meta: PaginationMeta;

  constructor(
    data: T[],
    page: number,
    limit: number,
    total: number
  ) {
    this.data = data;
    this.meta = {
      page: Math.max(1, page),
      limit: Math.max(1, limit),
      total: Math.max(0, total),
      pages: Math.max(1, Math.ceil(Math.max(0, total) / Math.max(1, limit))),
      hasNextPage: page < Math.ceil(Math.max(0, total) / Math.max(1, limit)),
      hasPreviousPage: page > 1
    };
  }

  static fromData<T>(data: T[], page: number, limit: number, total: number): PaginationDTO<T> {
    return new PaginationDTO(data, page, limit, total);
  }

  static empty<T>(page: number = 1, limit: number = 10): PaginationDTO<T> {
    return new PaginationDTO([], page, limit, 0);
  }

  toJSON() {
    return {
      data: this.data,
      pagination: this.meta
    };
  }
}
