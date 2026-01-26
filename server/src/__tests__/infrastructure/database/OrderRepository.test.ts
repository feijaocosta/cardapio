import { Order, OrderItem } from '../../../domain/orders/Order';
import { ValidationError } from '../../../core/errors/AppError';
import { OrderRepository } from '../../../infrastructure/database/repositories/OrderRepository';

describe('OrderRepository - Resiliência com Dados Corrompidos', () => {
  let mockDb: any;
  let repository: OrderRepository;

  beforeEach(() => {
    // Mock do banco de dados
    mockDb = {
      all: jest.fn(),
      get: jest.fn(),
      run: jest.fn(),
    };

    repository = new OrderRepository(mockDb);
  });

  describe('🔴 Cenário: Pedido Corrompido (SEM items) no Banco', () => {
    test('deve ignorar e deletar pedido sem items ao fazer findAll()', async () => {
      // Simular pedido corrompido já no banco (sem items)
      const corruptedOrder = {
        id: 1,
        customer_name: 'Cliente Corrompido',
        status: 'Pendente',
        created_at: new Date(),
        updated_at: new Date(),
      };

      // Mock: retorna 1 pedido, mas sem items
      mockDb.all.mockResolvedValueOnce([corruptedOrder]); // Primeiro SELECT orders
      mockDb.all.mockResolvedValueOnce([]); // Segundo SELECT order_items (vazio!)
      mockDb.run.mockResolvedValue(undefined); // DELETE

      const orders = await repository.findAll();

      // Deve retornar array vazio (pedido corrompido foi deletado)
      expect(orders).toEqual([]);
      expect(orders.length).toBe(0);

      // Verificar se chamou DELETE
      expect(mockDb.run).toHaveBeenCalledWith(
        'DELETE FROM orders WHERE id = ?',
        1
      );
    });

    test('deve NOT falhar com ValidationError ao encontrar pedido sem items', async () => {
      const corruptedOrder = {
        id: 1,
        customer_name: 'Corrompido',
        status: 'Pendente',
      };

      mockDb.all.mockResolvedValueOnce([corruptedOrder]);
      mockDb.all.mockResolvedValueOnce([]); // Sem items
      mockDb.run.mockResolvedValue(undefined);

      let error: Error | null = null;
      try {
        await repository.findAll();
      } catch (e) {
        error = e as Error;
      }

      expect(error).toBeNull();
    });

    test('deve retornar array vazio em vez de erro 400', async () => {
      // Múltiplos pedidos corrompidos
      const orders1 = { id: 1, customer_name: 'Corr1', status: 'Pendente' };
      const orders2 = { id: 2, customer_name: 'Corr2', status: 'Pendente' };

      mockDb.all.mockResolvedValueOnce([orders1, orders2]);
      mockDb.all.mockResolvedValueOnce([]); // items para order 1
      mockDb.all.mockResolvedValueOnce([]); // items para order 2
      mockDb.run.mockResolvedValue(undefined);

      const result = await repository.findAll();

      expect(result).toEqual([]);
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('✅ Cenário: Mix de Pedidos Válidos e Corrompidos', () => {
    test('deve manter pedidos válidos e deletar apenas os corrompidos', async () => {
      const corruptedOrder = { id: 1, customer_name: 'Corrompido', status: 'Pendente' };
      const validOrder = { id: 2, customer_name: 'Válido', status: 'Pendente', created_at: new Date(), updated_at: new Date() };
      const validItem = { id: 1, order_id: 2, item_id: 1, quantity: 2, unit_price: 25.50 };

      mockDb.all.mockResolvedValueOnce([corruptedOrder, validOrder]); // SELECT orders
      mockDb.all.mockResolvedValueOnce([]); // items para order 1 (vazio - corrompido)
      mockDb.all.mockResolvedValueOnce([validItem]); // items para order 2 (válido)
      mockDb.run.mockResolvedValue(undefined); // DELETE

      const orders = await repository.findAll();

      expect(orders.length).toBe(1);
      expect(orders[0].customerName).toBe('Válido');
      expect(orders[0].items.length).toBe(1);

      // Verificar se deletou o corrompido
      expect(mockDb.run).toHaveBeenCalledWith('DELETE FROM orders WHERE id = ?', 1);
    });

    test('deve preservar pedidos válidos intactos', async () => {
      const validOrder = {
        id: 1,
        customer_name: 'João Silva',
        status: 'Pendente',
        created_at: new Date(),
        updated_at: new Date(),
      };
      const items = [
        { id: 1, order_id: 1, item_id: 1, quantity: 2, unit_price: 25.50 },
        { id: 2, order_id: 1, item_id: 2, quantity: 1, unit_price: 30.00 },
      ];

      mockDb.all.mockResolvedValueOnce([validOrder]); // SELECT orders
      mockDb.all.mockResolvedValueOnce(items); // SELECT order_items

      const orders = await repository.findAll();

      expect(orders.length).toBe(1);
      expect(orders[0].customerName).toBe('João Silva');
      expect(orders[0].items.length).toBe(2);
      expect(orders[0].getTotal()).toBe(81.00);
    });
  });

  describe('🛡️ Proteção: Endpoint GET /api/orders não falha', () => {
    test('GET /api/orders retorna 200 com array vazio mesmo com dados corrompidos', async () => {
      const corruptedOrder = { id: 1, customer_name: 'Corrompido', status: 'Pendente' };

      mockDb.all.mockResolvedValueOnce([corruptedOrder]);
      mockDb.all.mockResolvedValueOnce([]); // Sem items
      mockDb.run.mockResolvedValue(undefined);

      let statusCode = 500;
      let responseBody: any;

      try {
        const orders = await repository.findAll();
        statusCode = 200;
        responseBody = orders;
      } catch (error) {
        statusCode = 400;
        if (error instanceof ValidationError) {
          responseBody = { message: (error as ValidationError).message };
        }
      }

      expect(statusCode).toBe(200);
      expect(responseBody).toEqual([]);
    });
  });

  describe('🔍 Diagnostico: Identificar e Registrar Dados Corrompidos', () => {
    test('deve logar aviso quando encontra pedido sem items', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

      const corruptedOrder = { id: 5, customer_name: 'Corrompido', status: 'Pendente' };

      mockDb.all.mockResolvedValueOnce([corruptedOrder]);
      mockDb.all.mockResolvedValueOnce([]); // Sem items
      mockDb.run.mockResolvedValue(undefined);

      await repository.findAll();

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Pedido 5 sem items')
      );

      consoleSpy.mockRestore();
    });
  });

  describe('🚀 Regressão: Bug não volta a acontecer', () => {
    test('cenário original: GET /api/orders com pedido sem items não retorna 400', async () => {
      // Este é o bug original que tivemos
      // Pedido sem items no banco causava GET /api/orders retornar erro 400

      const corruptedOrder = { id: 1, customer_name: 'Cliente X', status: 'Pendente' };

      mockDb.all.mockResolvedValueOnce([corruptedOrder]);
      mockDb.all.mockResolvedValueOnce([]); // Sem items
      mockDb.run.mockResolvedValue(undefined);

      const result = await repository.findAll();

      expect(result).toEqual([]);
      expect(Array.isArray(result)).toBe(true);
    });

    test('mesmo com 10+ pedidos corrompidos, findAll retorna sucesso', async () => {
      const corruptedOrders = Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        customer_name: `Corrompido${i + 1}`,
        status: 'Pendente',
      }));

      mockDb.all.mockResolvedValueOnce(corruptedOrders);

      // Mock 10 chamadas de items (todas vazias)
      for (let i = 0; i < 10; i++) {
        mockDb.all.mockResolvedValueOnce([]);
      }

      mockDb.run.mockResolvedValue(undefined);

      const orders = await repository.findAll();

      expect(orders).toEqual([]);
      expect(orders.length).toBe(0);

      // Verificar se chamou DELETE 10 vezes
      expect(mockDb.run).toHaveBeenCalledTimes(10);
    });
  });
});
