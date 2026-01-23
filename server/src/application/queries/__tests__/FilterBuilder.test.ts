import { FilterBuilder } from '../FilterBuilder';

describe('FilterBuilder', () => {
  let builder: FilterBuilder;

  beforeEach(() => {
    builder = new FilterBuilder();
  });

  describe('Filtros', () => {
    test('deve criar filtro com operador =', () => {
      builder.addFilter('status', '=', 'ativo');
      const filters = builder.getFilters();
      
      expect(filters).toHaveLength(1);
      expect(filters[0].field).toBe('status');
      expect(filters[0].operator).toBe('=');
      expect(filters[0].value).toBe('ativo');
    });

    test('deve criar múltiplos filtros', () => {
      builder.addFilter('status', '=', 'ativo').addFilter('price', '>', 10);
      const filters = builder.getFilters();
      
      expect(filters).toHaveLength(2);
    });

    test('deve remover filtro por field', () => {
      builder.addFilter('status', '=', 'ativo').addFilter('price', '>', 10);
      builder.removeFilter('status');
      const filters = builder.getFilters();
      
      expect(filters).toHaveLength(1);
      expect(filters[0].field).toBe('price');
    });

    test('deve limpar todos os filtros', () => {
      builder.addFilter('status', '=', 'ativo').addFilter('price', '>', 10);
      builder.clearFilters();
      const filters = builder.getFilters();
      
      expect(filters).toHaveLength(0);
    });
  });

  describe('Ordenação', () => {
    test('deve criar ordenação ASC', () => {
      builder.addSort('name', 'ASC');
      const sorts = builder.getSorts();
      
      expect(sorts).toHaveLength(1);
      expect(sorts[0].field).toBe('name');
      expect(sorts[0].direction).toBe('ASC');
    });

    test('deve criar múltiplas ordenações', () => {
      builder.addSort('name', 'ASC').addSort('price', 'DESC');
      const sorts = builder.getSorts();
      
      expect(sorts).toHaveLength(2);
    });

    test('deve limpar todas as ordenações', () => {
      builder.addSort('name', 'ASC').addSort('price', 'DESC');
      builder.clearSorts();
      const sorts = builder.getSorts();
      
      expect(sorts).toHaveLength(0);
    });
  });

  describe('Paginação', () => {
    test('deve definir página e limite', () => {
      builder.setPagination(2, 20);
      
      expect(builder.getPage()).toBe(2);
      expect(builder.getLimit()).toBe(20);
    });

    test('deve calcular offset corretamente', () => {
      builder.setPagination(3, 10);
      
      expect(builder.getOffset()).toBe(20);
    });

    test('deve garantir página mínima de 1', () => {
      builder.setPagination(0, 10);
      
      expect(builder.getPage()).toBe(1);
    });

    test('deve garantir limite mínimo de 1', () => {
      builder.setPagination(1, 0);
      
      expect(builder.getLimit()).toBe(1);
    });
  });

  describe('Query Building', () => {
    test('deve construir WHERE com operador =', () => {
      builder.addFilter('status', '=', 'ativo');
      const query = builder.buildQuery();
      
      expect(query.where).toContain("status = 'ativo'");
    });

    test('deve construir WHERE com operador LIKE', () => {
      builder.addFilter('name', 'LIKE', 'pizza');
      const query = builder.buildQuery();
      
      expect(query.where).toContain("name LIKE '%pizza%'");
    });

    test('deve construir WHERE com múltiplos filtros', () => {
      builder.addFilter('status', '=', 'ativo').addFilter('price', '>', 10);
      const query = builder.buildQuery();
      
      expect(query.where).toContain('AND');
    });

    test('deve construir ORDER BY', () => {
      builder.addSort('name', 'ASC');
      const query = builder.buildQuery();
      
      expect(query.orderBy).toBe('name ASC');
    });

    test('deve construir LIMIT com paginação', () => {
      builder.setPagination(2, 10);
      const query = builder.buildQuery();
      
      expect(query.limit).toBe('LIMIT 10 OFFSET 10');
    });

    test('deve escapar valores com aspas', () => {
      builder.addFilter('name', '=', "O'Reilly");
      const query = builder.buildQuery();
      
      expect(query.where).toContain("O''Reilly");
    });
  });

  describe('Clone e Reset', () => {
    test('deve clonar builder com todos os parâmetros', () => {
      builder.addFilter('status', '=', 'ativo').addSort('name', 'ASC').setPagination(2, 20);
      const cloned = builder.clone();

      expect(cloned.getFilters()).toEqual(builder.getFilters());
      expect(cloned.getSorts()).toEqual(builder.getSorts());
      expect(cloned.getPage()).toBe(builder.getPage());
      expect(cloned.getLimit()).toBe(builder.getLimit());
    });

    test('deve resetar builder', () => {
      builder.addFilter('status', '=', 'ativo').addSort('name', 'ASC').setPagination(2, 20);
      builder.reset();

      expect(builder.getFilters()).toHaveLength(0);
      expect(builder.getSorts()).toHaveLength(0);
      expect(builder.getPage()).toBe(1);
      expect(builder.getLimit()).toBe(10);
    });
  });
});
