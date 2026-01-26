import { Order, OrderItem, OrderStatus } from '../../../domain/orders/Order';
import { ValidationError } from '../../../core/errors/AppError';

describe('Order Domain Entity', () => {
  const mockItem = new OrderItem(1, null, 1, 2, 25.50);

  describe('Constructor', () => {
    test('deve criar order com todos os parâmetros', () => {
      const now = new Date();
      const items = [mockItem];
      const order = new Order(1, 'João Silva', 'Pendente', items, now, now);

      expect(order.id).toBe(1);
      expect(order.customerName).toBe('João Silva');
      expect(order.status).toBe('Pendente');
      expect(order.items).toEqual(items);
      expect(order.createdAt).toBe(now);
      expect(order.updatedAt).toBe(now);
    });

    test('deve criar order sem ID (null)', () => {
      const items = [mockItem];
      const order = new Order(null, 'João Silva', 'Pendente', items);

      expect(order.id).toBeNull();
      expect(order.customerName).toBe('João Silva');
    });

    test('deve lançar erro se customerName está vazio', () => {
      const items = [mockItem];
      expect(() => new Order(1, '', 'Pendente', items)).toThrow(ValidationError);
      expect(() => new Order(1, '   ', 'Pendente', items)).toThrow(ValidationError);
    });

    test('deve lançar erro se status inválido', () => {
      const items = [mockItem];
      expect(() => new Order(1, 'João', 'Inválido' as any, items)).toThrow(ValidationError);
    });

    test('deve lançar erro se items está vazio', () => {
      expect(() => new Order(1, 'João', 'Pendente', [])).toThrow(ValidationError);
    });

    test('deve lançar erro se items não é array', () => {
      expect(() => new Order(1, 'João', 'Pendente', null as any)).toThrow(ValidationError);
    });

    test('deve aceitar todos os status válidos', () => {
      const validStatuses: OrderStatus[] = ['Pendente', 'Em preparação', 'Pronto', 'Entregue', 'Cancelado'];
      const items = [mockItem];

      validStatuses.forEach(status => {
        expect(() => new Order(1, 'João', status, items)).not.toThrow();
      });
    });

    test('deve aceitar customerName com caracteres especiais', () => {
      const items = [mockItem];
      const order = new Order(1, 'João da Silva Oliveira', 'Pendente', items);
      expect(order.customerName).toBe('João da Silva Oliveira');
    });
  });

  describe('Factory Method: create', () => {
    test('deve criar order novo com create()', () => {
      const items = [mockItem];
      const order = Order.create('João Silva', items);

      expect(order.id).toBeNull();
      expect(order.customerName).toBe('João Silva');
      expect(order.status).toBe('Pendente');
      expect(order.items).toEqual(items);
      expect(order.createdAt).toBeDefined();
      expect(order.updatedAt).toBeDefined();
    });

    test('deve lançar erro se customerName vazio em create', () => {
      const items = [mockItem];
      expect(() => Order.create('', items)).toThrow(ValidationError);
    });

    test('deve lançar erro se items vazio em create', () => {
      expect(() => Order.create('João', [])).toThrow(ValidationError);
    });

    test('deve definir status como Pendente em create', () => {
      const items = [mockItem];
      const order = Order.create('João', items);
      expect(order.status).toBe('Pendente');
    });

    test('deve definir datas automaticamente em create', () => {
      const before = new Date();
      const items = [mockItem];
      const order = Order.create('João', items);
      const after = new Date();

      expect(order.createdAt!.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(order.createdAt!.getTime()).toBeLessThanOrEqual(after.getTime());
    });
  });

  describe('changeStatus()', () => {
    test('deve mudar status do pedido', () => {
      const items = [mockItem];
      const order = new Order(1, 'João', 'Pendente', items);
      const orderPreparando = order.changeStatus('Em preparação');

      expect(orderPreparando.status).toBe('Em preparação');
    });

    test('deve atualizar updatedAt ao mudar status', () => {
      const now = new Date();
      const items = [mockItem];
      const order = new Order(1, 'João', 'Pendente', items, now, now);
      const orderPronto = order.changeStatus('Pronto');

      expect(orderPronto.updatedAt!.getTime()).toBeGreaterThanOrEqual(now.getTime());
    });

    test('deve manter createdAt ao mudar status', () => {
      const now = new Date();
      const items = [mockItem];
      const order = new Order(1, 'João', 'Pendente', items, now, now);
      const orderPronto = order.changeStatus('Pronto');

      expect(orderPronto.createdAt).toBe(order.createdAt);
    });

    test('deve manter dados do order ao mudar status', () => {
      const items = [mockItem];
      const order = new Order(1, 'João', 'Pendente', items);
      const orderEntregue = order.changeStatus('Entregue');

      expect(orderEntregue.id).toBe(1);
      expect(orderEntregue.customerName).toBe('João');
      expect(orderEntregue.items).toEqual(items);
    });

    test('deve ser imutável - original não muda', () => {
      const items = [mockItem];
      const order = new Order(1, 'João', 'Pendente', items);
      const orderPronto = order.changeStatus('Pronto');

      expect(order.status).toBe('Pendente');
      expect(orderPronto.status).toBe('Pronto');
    });

    test('deve permitir todas as transições de status', () => {
      const items = [mockItem];
      const statuses: OrderStatus[] = ['Pendente', 'Em preparação', 'Pronto', 'Entregue', 'Cancelado'];

      let order = new Order(1, 'João', 'Pendente', items);
      statuses.slice(1).forEach(status => {
        order = order.changeStatus(status);
        expect(order.status).toBe(status);
      });
    });
  });

  describe('getTotal()', () => {
    test('deve calcular total com um item', () => {
      const item = new OrderItem(1, null, 1, 2, 25.50);
      const order = new Order(1, 'João', 'Pendente', [item]);

      expect(order.getTotal()).toBe(51.00);
    });

    test('deve calcular total com múltiplos items', () => {
      const item1 = new OrderItem(1, null, 1, 2, 25.50);
      const item2 = new OrderItem(2, null, 2, 1, 30.00);
      const item3 = new OrderItem(3, null, 3, 3, 10.00);
      const order = new Order(1, 'João', 'Pendente', [item1, item2, item3]);

      expect(order.getTotal()).toBe(51.00 + 30.00 + 30.00);
    });

    test('deve retornar 0 para item com preço 0', () => {
      const item = new OrderItem(1, null, 1, 5, 0);
      const order = new Order(1, 'João', 'Pendente', [item]);

      expect(order.getTotal()).toBe(0);
    });

    test('deve calcular corretamente com decimais', () => {
      const item1 = new OrderItem(1, null, 1, 2, 9.99);
      const item2 = new OrderItem(2, null, 2, 1, 15.50);
      const order = new Order(1, 'João', 'Pendente', [item1, item2]);

      expect(order.getTotal()).toBeCloseTo(35.48, 2);
    });

    test('deve ser imutável - não afetar order ao calcular', () => {
      const item = new OrderItem(1, null, 1, 2, 25.50);
      const order = new Order(1, 'João', 'Pendente', [item]);

      const total1 = order.getTotal();
      const total2 = order.getTotal();

      expect(total1).toBe(total2);
      expect(order.getTotal()).toBe(51.00);
    });
  });

  describe('Casos Extremos', () => {
    test('deve aceitar customerName muito longo', () => {
      const longName = 'a'.repeat(255);
      const items = [mockItem];
      const order = new Order(1, longName, 'Pendente', items);

      expect(order.customerName).toBe(longName);
    });

    test('deve aceitar múltiplos items (10+)', () => {
      const items = Array.from({ length: 10 }, (_, i) =>
        new OrderItem(i + 1, null, i + 1, 1, 10.00)
      );
      const order = new Order(1, 'João', 'Pendente', items);

      expect(order.items.length).toBe(10);
    });

    test('deve calcular total corretamente com muitos items', () => {
      const items = Array.from({ length: 5 }, (_, i) =>
        new OrderItem(i + 1, null, i + 1, 2, 10.00)
      );
      const order = new Order(1, 'João', 'Pendente', items);

      expect(order.getTotal()).toBe(100);
    });

    test('deve aceitar ID negativo', () => {
      const order = new Order(-1, 'João', 'Pendente', [mockItem]);
      expect(order.id).toBe(-1);
    });

    test('deve aceitar ID zero', () => {
      const order = new Order(0, 'João', 'Pendente', [mockItem]);
      expect(order.id).toBe(0);
    });
  });

  // ✨ PRÉ-REQUISITO 3: Todo pedido precisa ter status obrigatório
  describe('PRÉ-REQUISITO 3: Status Obrigatório do Pedido', () => {
    describe('Status Obrigatório na Criação', () => {
      test('deve lançar erro se status é inválido no construtor', () => {
        const items = [mockItem];
        expect(() => new Order(1, 'João', 'Inválido' as any, items)).toThrow(
          ValidationError
        );
      });

      test('deve lançar erro se status é null', () => {
        const items = [mockItem];
        expect(() => new Order(1, 'João', null as any, items)).toThrow(
          ValidationError
        );
      });

      test('deve lançar erro se status é undefined', () => {
        const items = [mockItem];
        expect(() => new Order(1, 'João', undefined as any, items)).toThrow(
          ValidationError
        );
      });

      test('deve lançar erro se status é vazio', () => {
        const items = [mockItem];
        expect(() => new Order(1, 'João', '' as any, items)).toThrow(
          ValidationError
        );
      });

      test('deve aceitar status Pendente', () => {
        const items = [mockItem];
        expect(() => new Order(1, 'João', 'Pendente', items)).not.toThrow();
      });

      test('deve aceitar status Em preparação', () => {
        const items = [mockItem];
        expect(() => new Order(1, 'João', 'Em preparação', items)).not.toThrow();
      });

      test('deve aceitar status Pronto', () => {
        const items = [mockItem];
        expect(() => new Order(1, 'João', 'Pronto', items)).not.toThrow();
      });

      test('deve aceitar status Entregue', () => {
        const items = [mockItem];
        expect(() => new Order(1, 'João', 'Entregue', items)).not.toThrow();
      });

      test('deve aceitar status Cancelado', () => {
        const items = [mockItem];
        expect(() => new Order(1, 'João', 'Cancelado', items)).not.toThrow();
      });
    });

    describe('Todos os Status Válidos', () => {
      test('deve aceitar EXATAMENTE 5 status válidos', () => {
        const validStatuses: OrderStatus[] = [
          'Pendente',
          'Em preparação',
          'Pronto',
          'Entregue',
          'Cancelado',
        ];
        const items = [mockItem];

        validStatuses.forEach((status) => {
          expect(() => new Order(1, 'João', status, items)).not.toThrow();
        });

        expect(validStatuses).toHaveLength(5);
      });

      test('deve rejeitar status inválidos', () => {
        const invalidStatuses = [
          'Processando',
          'Enviado',
          'Recebido',
          'Finalizado',
          'Cancelar',
          'PENDENTE',
          'pendente',
          '',
        ];
        const items = [mockItem];

        invalidStatuses.forEach((status) => {
          expect(() => new Order(1, 'João', status as any, items)).toThrow();
        });
      });
    });

    describe('Factory Method com Status Padrão', () => {
      test('deve definir status como Pendente por padrão em create()', () => {
        const items = [mockItem];
        const order = Order.create('João', items);

        expect(order.status).toBe('Pendente');
      });

      test('deve criar order com status Pendente automaticamente', () => {
        const items = [mockItem];
        const order = Order.create('Clientes', items);

        expect(order.status).toBe('Pendente');
        expect(typeof order.status).toBe('string');
      });

      test('deve manter status Pendente mesmo com múltiplos items', () => {
        const items = Array.from({ length: 5 }, (_, i) =>
          new OrderItem(i + 1, null, i + 1, 1, 10.00)
        );
        const order = Order.create('João', items);

        expect(order.status).toBe('Pendente');
      });
    });

    describe('Mudança de Status (Painel Administrativo)', () => {
      test('deve mudar de Pendente para Em preparação', () => {
        const items = [mockItem];
        let order = new Order(1, 'João', 'Pendente', items);

        order = order.changeStatus('Em preparação');

        expect(order.status).toBe('Em preparação');
      });

      test('deve mudar de Em preparação para Pronto', () => {
        const items = [mockItem];
        let order = new Order(1, 'João', 'Em preparação', items);

        order = order.changeStatus('Pronto');

        expect(order.status).toBe('Pronto');
      });

      test('deve mudar de Pronto para Entregue', () => {
        const items = [mockItem];
        let order = new Order(1, 'João', 'Pronto', items);

        order = order.changeStatus('Entregue');

        expect(order.status).toBe('Entregue');
      });

      test('deve permitir cancelar de Pendente', () => {
        const items = [mockItem];
        let order = new Order(1, 'João', 'Pendente', items);

        order = order.changeStatus('Cancelado');

        expect(order.status).toBe('Cancelado');
      });

      test('deve permitir cancelar de Em preparação', () => {
        const items = [mockItem];
        let order = new Order(1, 'João', 'Em preparação', items);

        order = order.changeStatus('Cancelado');

        expect(order.status).toBe('Cancelado');
      });

      test('deve permitir cancelar de Pronto', () => {
        const items = [mockItem];
        let order = new Order(1, 'João', 'Pronto', items);

        order = order.changeStatus('Cancelado');

        expect(order.status).toBe('Cancelado');
      });

      test('deve permitir todas as transições de status', () => {
        const items = [mockItem];
        const statuses: OrderStatus[] = [
          'Pendente',
          'Em preparação',
          'Pronto',
          'Entregue',
        ];

        let order = new Order(1, 'João', 'Pendente', items);

        statuses.slice(1).forEach((status) => {
          order = order.changeStatus(status);
          expect(order.status).toBe(status);
        });

        expect(order.status).toBe('Entregue');
      });

      test('deve fazer ciclo completo: Pendente → Em preparação → Pronto → Entregue', () => {
        const items = [mockItem];
        let order = new Order(1, 'João', 'Pendente', items);

        expect(order.status).toBe('Pendente');

        order = order.changeStatus('Em preparação');
        expect(order.status).toBe('Em preparação');

        order = order.changeStatus('Pronto');
        expect(order.status).toBe('Pronto');

        order = order.changeStatus('Entregue');
        expect(order.status).toBe('Entregue');
      });
    });

    describe('Imutabilidade do Status', () => {
      test('deve ser imutável - original não muda ao alterar status', () => {
        const items = [mockItem];
        const order1 = new Order(1, 'João', 'Pendente', items);
        const order2 = order1.changeStatus('Pronto');

        expect(order1.status).toBe('Pendente');
        expect(order2.status).toBe('Pronto');
        expect(order1).not.toBe(order2);
      });

      test('deve manter outros dados ao mudar status', () => {
        const items = [mockItem];
        const order1 = new Order(1, 'João', 'Pendente', items);
        const order2 = order1.changeStatus('Pronto');

        expect(order2.id).toBe(order1.id);
        expect(order2.customerName).toBe(order1.customerName);
        expect(order2.items).toEqual(order1.items);
      });

      test('deve atualizar updatedAt ao mudar status', () => {
        const now = new Date();
        const items = [mockItem];
        const order1 = new Order(1, 'João', 'Pendente', items, now, now);
        const order2 = order1.changeStatus('Pronto');

        expect(order2.updatedAt!.getTime()).toBeGreaterThanOrEqual(now.getTime());
      });

      test('deve manter createdAt ao mudar status', () => {
        const now = new Date();
        const items = [mockItem];
        const order1 = new Order(1, 'João', 'Pendente', items, now, now);
        const order2 = order1.changeStatus('Pronto');

        expect(order2.createdAt).toBe(order1.createdAt);
      });
    });

    describe('Cenários de Uso do Painel Administrativo', () => {
      test('Cenário 1: Admin vê pedido Pendente e marca como Em preparação', () => {
        const items = [mockItem];
        let order = new Order(1, 'Cliente João', 'Pendente', items);

        // Admin clica em "Iniciar Preparação"
        order = order.changeStatus('Em preparação');

        expect(order.status).toBe('Em preparação');
        expect(order.customerName).toBe('Cliente João');
      });

      test('Cenário 2: Admin move pedido através do fluxo completo', () => {
        const items = [mockItem];
        let order = new Order(1, 'Cliente Maria', 'Pendente', items);

        // Admin marca como em preparação
        order = order.changeStatus('Em preparação');
        expect(order.status).toBe('Em preparação');

        // Admin marca como pronto
        order = order.changeStatus('Pronto');
        expect(order.status).toBe('Pronto');

        // Admin marca como entregue
        order = order.changeStatus('Entregue');
        expect(order.status).toBe('Entregue');
      });

      test('Cenário 3: Admin cancela pedido em qualquer etapa', () => {
        const statuses: OrderStatus[] = [
          'Pendente',
          'Em preparação',
          'Pronto',
        ];
        const items = [mockItem];

        statuses.forEach((status) => {
          let order = new Order(1, 'Cliente', status, items);
          order = order.changeStatus('Cancelado');
          expect(order.status).toBe('Cancelado');
        });
      });

      test('Cenário 4: Múltiplos pedidos com status diferentes', () => {
        const items = [mockItem];
        const orders = [
          new Order(1, 'João', 'Pendente', items),
          new Order(2, 'Maria', 'Em preparação', items),
          new Order(3, 'Pedro', 'Pronto', items),
          new Order(4, 'Ana', 'Entregue', items),
        ];

        expect(orders[0].status).toBe('Pendente');
        expect(orders[1].status).toBe('Em preparação');
        expect(orders[2].status).toBe('Pronto');
        expect(orders[3].status).toBe('Entregue');
      });

      test('Cenário 5: Admin muda apenas o status via API', () => {
        const items = [mockItem];
        let order = new Order(1, 'João Silva', 'Pendente', items);

        const originalCustomer = order.customerName;
        const originalItems = order.items;

        // Admin muda status
        order = order.changeStatus('Pronto');

        // Dados do cliente e items não devem mudar
        expect(order.customerName).toBe(originalCustomer);
        expect(order.items).toBe(originalItems);
        expect(order.status).toBe('Pronto');
      });
    });

    describe('Rejeição de Status Inválidos Após Criação', () => {
      test('deve rejeitar mudança para status inválido', () => {
        const items = [mockItem];
        const order = new Order(1, 'João', 'Pendente', items);

        expect(() => order.changeStatus('Inválido' as any)).toThrow();
      });

      test('deve rejeitar mudança para null', () => {
        const items = [mockItem];
        const order = new Order(1, 'João', 'Pendente', items);

        expect(() => order.changeStatus(null as any)).toThrow();
      });

      test('deve rejeitar mudança para undefined', () => {
        const items = [mockItem];
        const order = new Order(1, 'João', 'Pendente', items);

        expect(() => order.changeStatus(undefined as any)).toThrow();
      });

      test('deve rejeitar mudança para string vazia', () => {
        const items = [mockItem];
        const order = new Order(1, 'João', 'Pendente', items);

        expect(() => order.changeStatus('' as any)).toThrow();
      });
    });
  });
});
