export interface SearchOptions {
  term: string;
  fields: string[];
  page?: number;
  limit?: number;
}

export class SearchService {
  buildSearchFilter(term: string, fields: string[]): string {
    if (!term || fields.length === 0) return '';

    const conditions = fields.map(field => `${field} LIKE '%${this.escapeValue(term)}%'`);
    return conditions.join(' OR ');
  }

  buildSearchQuery(options: SearchOptions): { where: string; limit: string } {
    const where = this.buildSearchFilter(options.term, options.fields);
    const page = options.page || 1;
    const limit = options.limit || 10;
    const offset = (page - 1) * limit;

    return {
      where: where || '1=1',
      limit: `LIMIT ${limit} OFFSET ${offset}`
    };
  }

  private escapeValue(value: string): string {
    return value.replace(/'/g, "''").trim();
  }
}
