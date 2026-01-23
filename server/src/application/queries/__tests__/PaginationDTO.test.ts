import { PaginationDTO } from '../PaginationDTO';

describe('PaginationDTO', () => {
  describe('Construtor', () => {
    test('deve criar pagination com dados corretos', () => {
      const data = [{ id: 1, name: 'Item 1' }, { id: 2, name: 'Item 2' }];
      const pagination = new PaginationDTO(data, 1, 10, 25);

      expect(pagination.data).toEqual(data);
      expect(pagination.meta.page).toBe(1);
      expect(pagination.meta.limit).toBe(10);
      expect(pagination.meta.total).toBe(25);
    });

    test('deve calcular número de páginas corretamente', () => {
      const data: any[] = [];
      const pagination = new PaginationDTO(data, 1, 10, 25);

      expect(pagination.meta.pages).toBe(3);
    });

    test('deve calcular hasNextPage corretamente', () => {
      const data: any[] = [];
      const pagination1 = new PaginationDTO(data, 1, 10, 25);
      const pagination2 = new PaginationDTO(data, 3, 10, 25);

      expect(pagination1.meta.hasNextPage).toBe(true);
      expect(pagination2.meta.hasNextPage).toBe(false);
    });

    test('deve calcular hasPreviousPage corretamente', () => {
      const data: any[] = [];
      const pagination1 = new PaginationDTO(data, 1, 10, 25);
      const pagination2 = new PaginationDTO(data, 2, 10, 25);

      expect(pagination1.meta.hasPreviousPage).toBe(false);
      expect(pagination2.meta.hasPreviousPage).toBe(true);
    });

    test('deve garantir página mínima de 1', () => {
      const data: any[] = [];
      const pagination = new PaginationDTO(data, 0, 10, 25);

      expect(pagination.meta.page).toBe(1);
    });

    test('deve garantir limite mínimo de 1', () => {
      const data: any[] = [];
      const pagination = new PaginationDTO(data, 1, 0, 25);

      expect(pagination.meta.limit).toBe(1);
      expect(pagination.meta.pages).toBe(25);
    });

    test('deve garantir total mínimo de 0', () => {
      const data: any[] = [];
      const pagination = new PaginationDTO(data, 1, 10, -5);

      expect(pagination.meta.total).toBe(0);
      expect(pagination.meta.pages).toBe(1);
    });
  });

  describe('Métodos estáticos', () => {
    test('deve criar pagination com fromData', () => {
      const data = [{ id: 1 }, { id: 2 }];
      const pagination = PaginationDTO.fromData(data, 1, 10, 20);

      expect(pagination.data).toEqual(data);
      expect(pagination.meta.page).toBe(1);
      expect(pagination.meta.total).toBe(20);
    });

    test('deve criar pagination vazia com empty', () => {
      const pagination = PaginationDTO.empty<{ id: number }>(1, 10);

      expect(pagination.data).toEqual([]);
      expect(pagination.meta.page).toBe(1);
      expect(pagination.meta.limit).toBe(10);
      expect(pagination.meta.total).toBe(0);
      expect(pagination.meta.pages).toBe(1);
    });

    test('deve usar defaults em empty', () => {
      const pagination = PaginationDTO.empty<{ id: number }>();

      expect(pagination.meta.page).toBe(1);
      expect(pagination.meta.limit).toBe(10);
    });
  });

  describe('Serialização', () => {
    test('deve serializar para JSON com estrutura correta', () => {
      const data = [{ id: 1, name: 'Item 1' }];
      const pagination = new PaginationDTO(data, 1, 10, 25);
      const json = pagination.toJSON();

      expect(json).toHaveProperty('data');
      expect(json).toHaveProperty('pagination');
      expect(json.data).toEqual(data);
      expect(json.pagination.page).toBe(1);
      expect(json.pagination.total).toBe(25);
    });
  });

  describe('Edge Cases', () => {
    test('deve lidar com 1 item na página 1', () => {
      const data = [{ id: 1 }];
      const pagination = new PaginationDTO(data, 1, 10, 1);

      expect(pagination.meta.pages).toBe(1);
      expect(pagination.meta.hasNextPage).toBe(false);
      expect(pagination.meta.hasPreviousPage).toBe(false);
    });

    test('deve lidar com muitas páginas', () => {
      const data: any[] = [];
      const pagination = new PaginationDTO(data, 100, 10, 1000);

      expect(pagination.meta.pages).toBe(100);
      expect(pagination.meta.hasNextPage).toBe(false);
      expect(pagination.meta.hasPreviousPage).toBe(true);
    });
  });
});
