import { Order, OrderItem, OrderStatus } from '../../../domain/orders/Order';
import { ValidationError } from '../../../core/errors/AppError';
import { CreateOrderDTO, UpdateOrderDTO } from '../../../application/dtos/order';

describe('Order Validation Tests - Regras de Negócio Críticas', () => {
  const mockItem = new OrderItem(1, null, 1, 2, 25.50);

  describe('✅ REGRA 1: Pedido NÃO pode ser criado SEM ITEMS', () => {
    test('deve lançar erro ao tentar criar Order com items vazio', () => {
      expect(() => {
        new Order(1, 'João Silva', 'Pendente', []);
      }).toThrow(ValidationError);
      expect(() => {
        new Order(1, 'João Silva', 'Pendente', []);
      }).toThrow('Pedido deve conter pelo menos um item');
    });

    test('deve lançar erro em Order.create() com items vazio', () => {
      expect(() => {
        Order.create('João Silva', []);
      }).toThrow(ValidationError);
      expect(() => {
        Order.create('João Silva', []);
      }).toThrow('Pedido deve conter pelo menos um item');
    });

    test('deve lançar erro ao tentar criar Order com null items', () => {
      expect(() => {
        new Order(1, 'João Silva', 'Pendente', null as any);
      }).toThrow(ValidationError);
      expect(() => {
        new Order(1, 'João Silva', 'Pendente', null as any);
      }).toThrow('Pedido deve conter pelo menos um item');
    });

    test('deve lançar erro ao tentar criar Order com undefined items', () => {
      expect(() => {
        new Order(1, 'João Silva', 'Pendente', undefined as any);
      }).toThrow(ValidationError);
    });

    test('deve lançar erro ao tentar criar Order com items não-array', () => {
      expect(() => {
        new Order(1, 'João Silva', 'Pendente', 'items' as any);
      }).toThrow(ValidationError);
      expect(() => {
        new Order(1, 'João Silva', 'Pendente', { items: [] } as any);
      }).toThrow(ValidationError);
    });

    test('deve lançar erro no DTO CreateOrderDTO com items vazio', () => {
      expect(() => {
        new CreateOrderDTO({
          customerName: 'João Silva',
          items: [],
        });
      }).toThrow(ValidationError);
      expect(() => {
        new CreateOrderDTO({
          customerName: 'João Silva',
          items: [],
        });
      }).toThrow('Pedido deve conter pelo menos um item');
    });

    test('deve lançar erro no DTO CreateOrderDTO com items null', () => {
      expect(() => {
        new CreateOrderDTO({
          customerName: 'João Silva',
          items: null,
        });
      }).toThrow(ValidationError);
    });

    test('deve lançar erro no DTO CreateOrderDTO com items undefined', () => {
      expect(() => {
        new CreateOrderDTO({
          customerName: 'João Silva',
          items: undefined,
        });
      }).toThrow(ValidationError);
    });

    test('deve bloquear pedido com payload JSON vazio', () => {
      expect(() => {
        new CreateOrderDTO({});
      }).toThrow(ValidationError);
    });

    test('deve bloquear pedido com payload apenas customerName', () => {
      expect(() => {
        new CreateOrderDTO({
          customerName: 'João Silva',
        });
      }).toThrow(ValidationError);
    });
  });

  describe('✅ REGRA 2: Pedido NÃO pode ser criado SEM NOME DO CLIENTE', () => {
    test('deve lançar erro ao tentar criar Order com customerName vazio', () => {
      const items = [mockItem];
      expect(() => {
        new Order(1, '', 'Pendente', items);
      }).toThrow(ValidationError);
      expect(() => {
        new Order(1, '', 'Pendente', items);
      }).toThrow('Nome do cliente é obrigatório');
    });

    test('deve lançar erro ao tentar criar Order com customerName whitespace', () => {
      const items = [mockItem];
      expect(() => {
        new Order(1, '   ', 'Pendente', items);
      }).toThrow(ValidationError);
      expect(() => {
        new Order(1, '   ', 'Pendente', items);
      }).toThrow('Nome do cliente é obrigatório');
    });

    test('deve lançar erro ao tentar criar Order com customerName null', () => {
      const items = [mockItem];
      expect(() => {
        new Order(1, null as any, 'Pendente', items);
      }).toThrow(ValidationError);
    });

    test('deve lançar erro ao tentar criar Order com customerName undefined', () => {
      const items = [mockItem];
      expect(() => {
        new Order(1, undefined as any, 'Pendente', items);
      }).toThrow(ValidationError);
    });

    test('deve lançar erro em Order.create() com customerName vazio', () => {
      const items = [mockItem];
      expect(() => {
        Order.create('', items);
      }).toThrow(ValidationError);
    });

    test('deve lançar erro em Order.create() com customerName whitespace', () => {
      const items = [mockItem];
      expect(() => {
        Order.create('   ', items);
      }).toThrow(ValidationError);
    });

    test('deve lançar erro no DTO CreateOrderDTO com customerName vazio', () => {
      expect(() => {
        new CreateOrderDTO({
          customerName: '',
          items: [{ itemId: 1, quantity: 1, unitPrice: 25.50 }],
        });
      }).toThrow(ValidationError);
      expect(() => {
        new CreateOrderDTO({
          customerName: '',
          items: [{ itemId: 1, quantity: 1, unitPrice: 25.50 }],
        });
      }).toThrow('Nome do cliente é obrigatório');
    });

    test('deve lançar erro no DTO CreateOrderDTO com customerName whitespace', () => {
      expect(() => {
        new CreateOrderDTO({
          customerName: '   ',
          items: [{ itemId: 1, quantity: 1, unitPrice: 25.50 }],
        });
      }).toThrow(ValidationError);
    });

    test('deve lançar erro no DTO CreateOrderDTO com customerName null', () => {
      expect(() => {
        new CreateOrderDTO({
          customerName: null,
          items: [{ itemId: 1, quantity: 1, unitPrice: 25.50 }],
        });
      }).toThrow(ValidationError);
    });

    test('deve lançar erro no DTO CreateOrderDTO com customerName undefined', () => {
      expect(() => {
        new CreateOrderDTO({
          customerName: undefined,
          items: [{ itemId: 1, quantity: 1, unitPrice: 25.50 }],
        });
      }).toThrow(ValidationError);
    });

    test('deve bloquear pedido com customerName não-string', () => {
      expect(() => {
        new CreateOrderDTO({
          customerName: 123,
          items: [{ itemId: 1, quantity: 1, unitPrice: 25.50 }],
        });
      }).toThrow(ValidationError);
    });
  });

  describe('✅ REGRA 3: Combinações de validações críticas', () => {
    test('deve lançar erro com AMBOS customerName E items vazios', () => {
      expect(() => {
        new Order(1, '', 'Pendente', []);
      }).toThrow(ValidationError);
    });

    test('deve bloquear no DTO AMBOS customerName E items vazios', () => {
      expect(() => {
        new CreateOrderDTO({
          customerName: '',
          items: [],
        });
      }).toThrow(ValidationError);
    });

    test('deve lançar erro com customerName vazio mas items válido', () => {
      const items = [mockItem];
      expect(() => {
        new Order(1, '', 'Pendente', items);
      }).toThrow(ValidationError);
    });

    test('deve lançar erro com customerName válido mas items vazio', () => {
      expect(() => {
        new Order(1, 'João', 'Pendente', []);
      }).toThrow(ValidationError);
    });

    test('deve aceitar APENAS quando AMBOS são válidos', () => {
      const items = [mockItem];
      expect(() => {
        new Order(1, 'João Silva', 'Pendente', items);
      }).not.toThrow();

      const order = new Order(1, 'João Silva', 'Pendente', items);
      expect(order.customerName).toBe('João Silva');
      expect(order.items).toEqual(items);
    });
  });

  describe('✅ REGRA 4: Validações de items individuais', () => {
    test('deve validar quantity ser inteiro positivo', () => {
      expect(() => {
        new OrderItem(1, null, 1, 0, 25.50);
      }).toThrow(ValidationError);
      expect(() => {
        new OrderItem(1, null, 1, -1, 25.50);
      }).toThrow(ValidationError);
      expect(() => {
        new OrderItem(1, null, 1, 1.5, 25.50);
      }).toThrow(ValidationError);
    });

    test('deve validar unitPrice não negativo', () => {
      expect(() => {
        new OrderItem(1, null, 1, 1, -10.00);
      }).toThrow(ValidationError);
    });

    test('deve aceitar item com quantity 1 e unitPrice 0', () => {
      expect(() => {
        new OrderItem(1, null, 1, 1, 0);
      }).not.toThrow();
    });

    test('deve aceitar item com quantidade alta', () => {
      expect(() => {
        new OrderItem(1, null, 1, 1000, 25.50);
      }).not.toThrow();
    });
  });

  describe('✅ REGRA 5: Pedidos com múltiplos items - todos devem ser válidos', () => {
    test('deve aceitar múltiplos items válidos', () => {
      const items = [
        new OrderItem(1, null, 1, 2, 25.50),
        new OrderItem(2, null, 2, 1, 30.00),
        new OrderItem(3, null, 3, 3, 10.00),
      ];
      expect(() => {
        new Order(1, 'João', 'Pendente', items);
      }).not.toThrow();
    });

    test('deve aceitar muitos items (10+)', () => {
      const items = Array.from({ length: 10 }, (_, i) =>
        new OrderItem(i + 1, null, i + 1, 1, 10.00)
      );
      expect(() => {
        new Order(1, 'João', 'Pendente', items);
      }).not.toThrow();
    });

    test('deve rejeitar se algum item é inválido na lista', () => {
      // Criar items válidos primeiro
      const items = [
        new OrderItem(1, null, 1, 2, 25.50),
        // O próximo item seria inválido com quantity 0
      ];

      // Tentar adicionar item inválido deve falhar no constructor do OrderItem
      expect(() => {
        new OrderItem(2, null, 2, 0, 30.00);
      }).toThrow(ValidationError);
    });
  });

  describe('✅ TESTE FINAL: Simulação de casos do mundo real', () => {
    test('Cliente tenta fazer pedido SEM especificar items', () => {
      const payload = {
        customerName: 'João Silva',
        // items esquecido propositalmente
      };

      expect(() => {
        new CreateOrderDTO(payload);
      }).toThrow(ValidationError);
    });

    test('Cliente tenta fazer pedido com nome vazio', () => {
      const payload = {
        customerName: '',
        items: [{ itemId: 1, quantity: 1, unitPrice: 25.50 }],
      };

      expect(() => {
        new CreateOrderDTO(payload);
      }).toThrow(ValidationError);
    });

    test('Frontend envia payload malformado com items vazio', () => {
      const payload = {
        customerName: 'Maria',
        items: [],
      };

      expect(() => {
        new CreateOrderDTO(payload);
      }).toThrow(ValidationError);
    });

    test('Frontend envia JSON vazio por acidente', () => {
      const payload = {};

      expect(() => {
        new CreateOrderDTO(payload);
      }).toThrow(ValidationError);
    });

    test('Pedido completo e válido deve passar por TODAS validações', () => {
      const validPayload = {
        customerName: 'João Silva',
        items: [
          { itemId: 1, quantity: 2, unitPrice: 25.50 },
          { itemId: 2, quantity: 1, unitPrice: 30.00 },
        ],
      };

      expect(() => {
        const dto = new CreateOrderDTO(validPayload);
        expect(dto.customerName).toBe('João Silva');
        expect(dto.items).toHaveLength(2);
      }).not.toThrow();
    });
  });
});
