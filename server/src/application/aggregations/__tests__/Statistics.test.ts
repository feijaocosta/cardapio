import { MenuStatistics, OrderStatistics, SystemStatistics } from '../index';

describe('MenuStatistics', () => {
  describe('Construtor', () => {
    test('deve criar estatísticas com valores padrão', () => {
      const stats = new MenuStatistics();

      expect(stats.totalItems).toBe(0);
      expect(stats.avgPrice).toBe(0);
      expect(stats.minPrice).toBe(0);
      expect(stats.maxPrice).toBe(0);
      expect(stats.activeItemsCount).toBe(0);
    });

    test('deve criar estatísticas com dados fornecidos', () => {
      const stats = new MenuStatistics({
        totalItems: 10,
        avgPrice: 25.50,
        minPrice: 10,
        maxPrice: 50,
        activeItemsCount: 9
      });

      expect(stats.totalItems).toBe(10);
      expect(stats.avgPrice).toBe(25.50);
    });
  });

  describe('from', () => {
    test('deve retornar estatísticas vazias para items vazio', () => {
      const stats = MenuStatistics.from([]);

      expect(stats.totalItems).toBe(0);
      expect(stats.avgPrice).toBe(0);
      expect(stats.minPrice).toBe(0);
      expect(stats.maxPrice).toBe(0);
      expect(stats.activeItemsCount).toBe(0);
    });

    test('deve calcular estatísticas corretas', () => {
      const items = [
        { price: 10, active: true },
        { price: 20, active: true },
        { price: 30, active: false },
      ];

      const stats = MenuStatistics.from(items);

      expect(stats.totalItems).toBe(3);
      expect(stats.activeItemsCount).toBe(2);
      expect(stats.minPrice).toBe(10);
      expect(stats.maxPrice).toBe(30);
      expect(stats.avgPrice).toBe(20); // (10 + 20 + 30) / 3
    });

    test('deve ignorar itens com preço zero', () => {
      const items = [
        { price: 0 },
        { price: 10 },
        { price: 20 },
      ];

      const stats = MenuStatistics.from(items);

      expect(stats.totalItems).toBe(3);
      expect(stats.minPrice).toBe(10);
      expect(stats.maxPrice).toBe(20);
      expect(stats.avgPrice).toBe(15); // (10 + 20) / 2
    });

    test('deve lidar com preços decimais corretamente', () => {
      const items = [
        { price: 9.99, active: true },
        { price: 15.50, active: true },
        { price: 20.01, active: true },
      ];

      const stats = MenuStatistics.from(items);

      expect(stats.minPrice).toBe(9.99);
      expect(stats.maxPrice).toBe(20.01);
      expect(stats.avgPrice).toBeCloseTo(15.17, 1);
    });
  });
});

describe('OrderStatistics', () => {
  describe('Construtor', () => {
    test('deve criar estatísticas com valores padrão', () => {
      const stats = new OrderStatistics();

      expect(stats.totalOrders).toBe(0);
      expect(stats.totalRevenue).toBe(0);
      expect(stats.avgOrderValue).toBe(0);
      expect(stats.ordersByStatus).toEqual({});
      expect(stats.topCustomers).toEqual([]);
    });
  });

  describe('from', () => {
    test('deve retornar estatísticas vazias para orders vazio', () => {
      const stats = OrderStatistics.from([]);

      expect(stats.totalOrders).toBe(0);
      expect(stats.totalRevenue).toBe(0);
    });

    test('deve calcular revenue correto', () => {
      const orders = [
        { items: [{ unitPrice: 10, quantity: 2 }], customerName: 'João' },
        { items: [{ unitPrice: 15, quantity: 1 }], customerName: 'Maria' },
      ];

      const stats = OrderStatistics.from(orders);

      expect(stats.totalOrders).toBe(2);
      expect(stats.totalRevenue).toBe(35); // (10*2) + (15*1)
      expect(stats.avgOrderValue).toBe(17.5); // 35/2
    });

    test('deve agrupar orders por status', () => {
      const orders = [
        { status: 'Pendente', items: [], customerName: 'João' },
        { status: 'Pronto', items: [], customerName: 'Maria' },
        { status: 'Pendente', items: [], customerName: 'Pedro' },
      ];

      const stats = OrderStatistics.from(orders);

      expect(stats.ordersByStatus['Pendente']).toBe(2);
      expect(stats.ordersByStatus['Pronto']).toBe(1);
    });

    test('deve identificar top customers', () => {
      const orders = [
        { items: [{ unitPrice: 100, quantity: 1 }], customerName: 'João', status: 'Entregue' },
        { items: [{ unitPrice: 50, quantity: 1 }], customerName: 'Maria', status: 'Entregue' },
        { items: [{ unitPrice: 200, quantity: 1 }], customerName: 'João', status: 'Entregue' },
      ];

      const stats = OrderStatistics.from(orders);

      expect(stats.topCustomers).toHaveLength(2);
      expect(stats.topCustomers[0].name).toBe('João'); // 300 total
      expect(stats.topCustomers[0].count).toBe(2);
      expect(stats.topCustomers[1].name).toBe('Maria'); // 50 total
    });

    test('deve limitar top customers a 10', () => {
      const orders = Array.from({ length: 15 }, (_, i) => ({
        items: [{ unitPrice: (i + 1) * 10, quantity: 1 }],
        customerName: `Cliente ${i + 1}`,
        status: 'Entregue'
      }));

      const stats = OrderStatistics.from(orders);

      expect(stats.topCustomers.length).toBeLessThanOrEqual(10);
    });
  });
});

describe('SystemStatistics', () => {
  describe('from', () => {
    test('deve calcular estatísticas do sistema', () => {
      const menus = [{ id: 1, name: 'Menu 1' }, { id: 2, name: 'Menu 2' }];
      const items = [
        { id: 1, menuId: 1, price: 10 },
        { id: 2, menuId: 1, price: 20 },
        { id: 3, menuId: 2, price: 15 },
      ];
      const orders = [
        { items: [{ unitPrice: 10, quantity: 2 }], customerName: 'João' },
        { items: [{ unitPrice: 15, quantity: 1 }], customerName: 'Maria' },
      ];

      const stats = SystemStatistics.from(menus, items, orders);

      expect(stats.totalMenus).toBe(2);
      expect(stats.totalItems).toBe(3);
      expect(stats.totalOrders).toBe(2);
      expect(stats.totalRevenue).toBe(35); // (10*2) + (15*1)
      expect(stats.avgOrderValue).toBe(17.5);
    });

    test('deve identificar top menu', () => {
      const menus = [
        { id: 1, name: 'Menu A' },
        { id: 2, name: 'Menu B' },
        { id: 3, name: 'Menu C' },
      ];
      const items = [
        { id: 1, menuId: 1 },
        { id: 2, menuId: 1 },
        { id: 3, menuId: 1 },
        { id: 4, menuId: 2 },
        { id: 5, menuId: 3 },
      ];
      const orders: any[] = [];

      const stats = SystemStatistics.from(menus, items, orders);

      expect(stats.topMenu).not.toBeNull();
      expect(stats.topMenu?.name).toBe('Menu A');
      expect(stats.topMenu?.itemCount).toBe(3);
    });

    test('deve lidar com sistema vazio', () => {
      const stats = SystemStatistics.from([], [], []);

      expect(stats.totalMenus).toBe(0);
      expect(stats.totalItems).toBe(0);
      expect(stats.totalOrders).toBe(0);
      expect(stats.totalRevenue).toBe(0);
      expect(stats.topMenu).toBeNull();
    });

    test('deve calcular avgOrderValue como 0 sem pedidos', () => {
      const menus: any[] = [];
      const items: any[] = [];
      const orders: any[] = [];

      const stats = SystemStatistics.from(menus, items, orders);

      expect(stats.avgOrderValue).toBe(0);
    });
  });
});
