export type FilterOperator = '=' | '!=' | '<' | '>' | '<=' | '>=' | 'LIKE' | 'BETWEEN' | 'IN';
export type SortDirection = 'ASC' | 'DESC';

interface FilterCondition {
  field: string;
  operator: FilterOperator;
  value: any;
}

interface SortCondition {
  field: string;
  direction: SortDirection;
}

export interface QueryOptions {
  filters: FilterCondition[];
  sorts: SortCondition[];
  page?: number;
  limit?: number;
  offset?: number;
}

export class FilterBuilder {
  private filters: FilterCondition[] = [];
  private sorts: SortCondition[] = [];
  private page: number = 1;
  private limit: number = 10;

  addFilter(field: string, operator: FilterOperator, value: any): this {
    this.filters.push({ field, operator, value });
    return this;
  }

  removeFilter(field: string): this {
    this.filters = this.filters.filter(f => f.field !== field);
    return this;
  }

  clearFilters(): this {
    this.filters = [];
    return this;
  }

  addSort(field: string, direction: SortDirection = 'ASC'): this {
    this.sorts.push({ field, direction });
    return this;
  }

  clearSorts(): this {
    this.sorts = [];
    return this;
  }

  setPagination(page: number, limit: number): this {
    this.page = Math.max(1, page);
    this.limit = Math.max(1, limit);
    return this;
  }

  getPage(): number {
    return this.page;
  }

  getLimit(): number {
    return this.limit;
  }

  getOffset(): number {
    return (this.page - 1) * this.limit;
  }

  buildWhereClause(): string {
    if (this.filters.length === 0) return '';

    const conditions = this.filters.map(f => {
      switch (f.operator) {
        case '=':
          return `${f.field} = '${this.escapeValue(f.value)}'`;
        case '!=':
          return `${f.field} != '${this.escapeValue(f.value)}'`;
        case '<':
          return `${f.field} < ${f.value}`;
        case '>':
          return `${f.field} > ${f.value}`;
        case '<=':
          return `${f.field} <= ${f.value}`;
        case '>=':
          return `${f.field} >= ${f.value}`;
        case 'LIKE':
          return `${f.field} LIKE '%${this.escapeValue(f.value)}%'`;
        case 'BETWEEN':
          return `${f.field} BETWEEN ${f.value.min} AND ${f.value.max}`;
        case 'IN':
          const values = Array.isArray(f.value)
            ? f.value.map(v => `'${this.escapeValue(v)}'`).join(',')
            : `'${this.escapeValue(f.value)}'`;
          return `${f.field} IN (${values})`;
        default:
          return '';
      }
    });

    return conditions.filter(c => c).join(' AND ');
  }

  buildOrderByClause(): string {
    if (this.sorts.length === 0) return '';
    return this.sorts.map(s => `${s.field} ${s.direction}`).join(', ');
  }

  buildQuery(): { where: string; orderBy: string; limit: string } {
    const where = this.buildWhereClause();
    const orderBy = this.buildOrderByClause();
    const limit = `LIMIT ${this.limit} OFFSET ${this.getOffset()}`;

    return { where, orderBy, limit };
  }

  getFilters(): FilterCondition[] {
    return [...this.filters];
  }

  getSorts(): SortCondition[] {
    return [...this.sorts];
  }

  private escapeValue(value: any): string {
    if (value === null || value === undefined) return '';
    return String(value).replace(/'/g, "''");
  }

  clone(): FilterBuilder {
    const cloned = new FilterBuilder();
    cloned.filters = [...this.filters];
    cloned.sorts = [...this.sorts];
    cloned.page = this.page;
    cloned.limit = this.limit;
    return cloned;
  }

  reset(): this {
    this.filters = [];
    this.sorts = [];
    this.page = 1;
    this.limit = 10;
    return this;
  }
}
