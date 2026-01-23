import { OrderService } from '../../../domain/orders/OrderService';
import { Order, OrderItem } from '../../../domain/orders/Order';
import { IOrderRepository } from '../../../domain/orders/OrderRepository';
import { NotFoundError } from '../../../core/errors/AppError';
import { CreateOrderDTO, UpdateOrderDTO } from '../../../application/dtos/order';

describe('OrderService', () => {
  let orderService: OrderService;
  let mockRepository: jest.Mocked<IOrderRepository>;

  beforeEach(() => {
    mockRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as any;

    orderService = new OrderService(mockRepository);
  });

  describe('getAllOrders()', () => {
    test('deve retornar todos os pedidos', async () => {
      const item = new OrderItem(1, null, 1, 2, 25.50);
      const mockOrders = [
        new Order(1, 'João Silva', 'Pendente', [item]),
        new Order(2, 'Maria Santos', 'Pronto', [item]),
      ];
      mockRepository.findAll.mockResolvedValue(mockOrders);

      const result = await orderService.getAllOrders();

      expect(result).toHaveLength(2);
      expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
    });

    test('deve retornar array vazio quando não há pedidos', async () => {
      mockRepository.findAll.mockResolvedValue([]);

      const result = await orderService.getAllOrders();

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    test('deve lançar erro se repositório falhar', async () => {
      mockRepository.findAll.mockRejectedValue(new Error('Database error'));

      await expect(orderService.getAllOrders()).rejects.toThrow('Database error');
    });
  });

  describe('getOrderById()', () => {
    test('deve retornar pedido pelo ID', async () => {
      const item = new OrderItem(1, null, 1, 2, 25.50);
      const order = new Order(1, 'João Silva', 'Pendente', [item]);
      mockRepository.findById.mockResolvedValue(order);

      const result = await orderService.getOrderById(1);

      expect(result).toBeDefined();
      expect(result.customerName).toBe('João Silva');
    });

    test('deve chamar findById com ID correto', async () => {
      const item = new OrderItem(1, null, 1, 2, 25.50);
      const order = new Order(1, 'João', 'Pendente', [item]);
      mockRepository.findById.mockResolvedValue(order);

      await orderService.getOrderById(1);

      expect(mockRepository.findById).toHaveBeenCalledWith(1);
    });

    test('deve lançar erro NotFoundError quando pedido não existe', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(orderService.getOrderById(999)).rejects.toThrow(NotFoundError);
    });

    test('deve lançar erro se repositório falhar', async () => {
      mockRepository.findById.mockRejectedValue(new Error('Database error'));

      await expect(orderService.getOrderById(1)).rejects.toThrow('Database error');
    });
  });

  describe('createOrder()', () => {
    test('deve criar novo pedido', async () => {
      const dto = new CreateOrderDTO({
        customerName: 'João Silva',
        items: [{ itemId: 1, quantity: 2, unitPrice: 25.50 }]
      });
      const item = new OrderItem(1, null, 1, 2, 25.50);
      const savedOrder = new Order(1, 'João Silva', 'Pendente', [item]);
      mockRepository.save.mockResolvedValue(savedOrder);

      const result = await orderService.createOrder(dto);

      expect(result).toBeDefined();
      expect(result.customerName).toBe('João Silva');
    });

    test('deve criar pedido com múltiplos items', async () => {
      const dto = new CreateOrderDTO({
        customerName: 'João',
        items: [
          { itemId: 1, quantity: 2, unitPrice: 25.50 },
          { itemId: 2, quantity: 1, unitPrice: 30.00 }
        ]
      });
      const items = [
        new OrderItem(1, null, 1, 2, 25.50),
        new OrderItem(2, null, 2, 1, 30.00)
      ];
      const savedOrder = new Order(1, 'João', 'Pendente', items);
      mockRepository.save.mockResolvedValue(savedOrder);

      const result = await orderService.createOrder(dto);

      expect(result).toBeDefined();
    });

    test('deve definir status como Pendente ao criar', async () => {
      const dto = new CreateOrderDTO({
        customerName: 'João',
        items: [{ itemId: 1, quantity: 2, unitPrice: 25.50 }]
      });
      const item = new OrderItem(1, null, 1, 2, 25.50);
      const savedOrder = new Order(1, 'João', 'Pendente', [item]);
      mockRepository.save.mockResolvedValue(savedOrder);

      const result = await orderService.createOrder(dto);

      expect(result.status).toBe('Pendente');
    });

    test('deve chamar save do repositório', async () => {
      const dto = new CreateOrderDTO({
        customerName: 'João',
        items: [{ itemId: 1, quantity: 2, unitPrice: 25.50 }]
      });
      const item = new OrderItem(1, null, 1, 2, 25.50);
      const savedOrder = new Order(1, 'João', 'Pendente', [item]);
      mockRepository.save.mockResolvedValue(savedOrder);

      await orderService.createOrder(dto);

      expect(mockRepository.save).toHaveBeenCalledTimes(1);
      expect(mockRepository.save).toHaveBeenCalledWith(expect.any(Order));
    });

    test('deve lançar erro se save falhar', async () => {
      const dto = new CreateOrderDTO({
        customerName: 'João',
        items: [{ itemId: 1, quantity: 2, unitPrice: 25.50 }]
      });
      mockRepository.save.mockRejectedValue(new Error('Save failed'));

      await expect(orderService.createOrder(dto)).rejects.toThrow('Save failed');
    });
  });

  describe('updateOrder()', () => {
    test('deve atualizar status do pedido', async () => {
      const item = new OrderItem(1, null, 1, 2, 25.50);
      const existingOrder = new Order(1, 'João', 'Pendente', [item]);
      const dto = new UpdateOrderDTO({ status: 'Pronto' });
      const updatedOrder = new Order(1, 'João', 'Pronto', [item]);

      mockRepository.findById.mockResolvedValue(existingOrder);
      mockRepository.save.mockResolvedValue(updatedOrder);

      const result = await orderService.updateOrder(1, dto);

      expect(result.status).toBe('Pronto');
    });

    test('deve atualizar nome do cliente', async () => {
      const item = new OrderItem(1, null, 1, 2, 25.50);
      const existingOrder = new Order(1, 'João', 'Pendente', [item]);
      const dto = new UpdateOrderDTO({ customerName: 'Maria' });
      const updatedOrder = new Order(1, 'Maria', 'Pendente', [item]);

      mockRepository.findById.mockResolvedValue(existingOrder);
      mockRepository.save.mockResolvedValue(updatedOrder);

      const result = await orderService.updateOrder(1, dto);

      expect(result.customerName).toBe('Maria');
    });

    test('deve atualizar ambos status e nome', async () => {
      const item = new OrderItem(1, null, 1, 2, 25.50);
      const existingOrder = new Order(1, 'João', 'Pendente', [item]);
      const dto = new UpdateOrderDTO({ customerName: 'Maria', status: 'Pronto' });
      const updatedOrder = new Order(1, 'Maria', 'Pronto', [item]);

      mockRepository.findById.mockResolvedValue(existingOrder);
      mockRepository.save.mockResolvedValue(updatedOrder);

      const result = await orderService.updateOrder(1, dto);

      expect(result.customerName).toBe('Maria');
      expect(result.status).toBe('Pronto');
    });

    test('deve lançar erro quando pedido não existe', async () => {
      mockRepository.findById.mockResolvedValue(null);
      const dto = new UpdateOrderDTO({ status: 'Pronto' });

      await expect(orderService.updateOrder(999, dto)).rejects.toThrow(NotFoundError);
    });

    test('deve chamar save após update', async () => {
      const item = new OrderItem(1, null, 1, 2, 25.50);
      const existingOrder = new Order(1, 'João', 'Pendente', [item]);
      const dto = new UpdateOrderDTO({ status: 'Pronto' });
      const updatedOrder = new Order(1, 'João', 'Pronto', [item]);

      mockRepository.findById.mockResolvedValue(existingOrder);
      mockRepository.save.mockResolvedValue(updatedOrder);

      await orderService.updateOrder(1, dto);

      expect(mockRepository.save).toHaveBeenCalledTimes(1);
    });

    test('deve lançar erro se save falhar', async () => {
      const item = new OrderItem(1, null, 1, 2, 25.50);
      const existingOrder = new Order(1, 'João', 'Pendente', [item]);
      const dto = new UpdateOrderDTO({ status: 'Pronto' });

      mockRepository.findById.mockResolvedValue(existingOrder);
      mockRepository.save.mockRejectedValue(new Error('Save failed'));

      await expect(orderService.updateOrder(1, dto)).rejects.toThrow('Save failed');
    });
  });

  describe('deleteOrder()', () => {
    test('deve deletar pedido pelo ID', async () => {
      mockRepository.delete.mockResolvedValue(undefined);

      await orderService.deleteOrder(1);

      expect(mockRepository.delete).toHaveBeenCalledWith(1);
    });

    test('deve chamar delete com ID correto', async () => {
      mockRepository.delete.mockResolvedValue(undefined);

      await orderService.deleteOrder(5);

      expect(mockRepository.delete).toHaveBeenCalledWith(5);
    });

    test('deve lançar erro se repositório falhar', async () => {
      mockRepository.delete.mockRejectedValue(new Error('Delete failed'));

      await expect(orderService.deleteOrder(1)).rejects.toThrow('Delete failed');
    });
  });

  describe('changeOrderStatus()', () => {
    test('deve mudar status do pedido', async () => {
      const item = new OrderItem(1, null, 1, 2, 25.50);
      const existingOrder = new Order(1, 'João', 'Pendente', [item]);
      const updatedOrder = new Order(1, 'João', 'Pronto', [item]);

      mockRepository.findById.mockResolvedValue(existingOrder);
      mockRepository.save.mockResolvedValue(updatedOrder);

      const result = await orderService.changeOrderStatus(1, 'Pronto');

      expect(result.status).toBe('Pronto');
    });

    test('deve permitir transição Pendente -> Em preparação', async () => {
      const item = new OrderItem(1, null, 1, 2, 25.50);
      const existingOrder = new Order(1, 'João', 'Pendente', [item]);
      const updatedOrder = new Order(1, 'João', 'Em preparação', [item]);

      mockRepository.findById.mockResolvedValue(existingOrder);
      mockRepository.save.mockResolvedValue(updatedOrder);

      const result = await orderService.changeOrderStatus(1, 'Em preparação');

      expect(result.status).toBe('Em preparação');
    });

    test('deve permitir cancelamento de qualquer status', async () => {
      const item = new OrderItem(1, null, 1, 2, 25.50);
      const existingOrder = new Order(1, 'João', 'Pronto', [item]);
      const updatedOrder = new Order(1, 'João', 'Cancelado', [item]);

      mockRepository.findById.mockResolvedValue(existingOrder);
      mockRepository.save.mockResolvedValue(updatedOrder);

      const result = await orderService.changeOrderStatus(1, 'Cancelado');

      expect(result.status).toBe('Cancelado');
    });

    test('deve lançar erro quando pedido não existe', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(orderService.changeOrderStatus(999, 'Pronto')).rejects.toThrow(NotFoundError);
    });

    test('deve chamar save após mudar status', async () => {
      const item = new OrderItem(1, null, 1, 2, 25.50);
      const existingOrder = new Order(1, 'João', 'Pendente', [item]);
      const updatedOrder = new Order(1, 'João', 'Pronto', [item]);

      mockRepository.findById.mockResolvedValue(existingOrder);
      mockRepository.save.mockResolvedValue(updatedOrder);

      await orderService.changeOrderStatus(1, 'Pronto');

      expect(mockRepository.save).toHaveBeenCalledTimes(1);
    });

    test('deve lançar erro se save falhar', async () => {
      const item = new OrderItem(1, null, 1, 2, 25.50);
      const existingOrder = new Order(1, 'João', 'Pendente', [item]);

      mockRepository.findById.mockResolvedValue(existingOrder);
      mockRepository.save.mockRejectedValue(new Error('Save failed'));

      await expect(orderService.changeOrderStatus(1, 'Pronto')).rejects.toThrow('Save failed');
    });

    test('deve lançar erro se repositório falhar ao buscar', async () => {
      mockRepository.findById.mockRejectedValue(new Error('Database error'));

      await expect(orderService.changeOrderStatus(1, 'Pronto')).rejects.toThrow('Database error');
    });
  });

  describe('Casos Extremos', () => {
    test('deve lidar com múltiplas operações em sequência', async () => {
      const item = new OrderItem(1, null, 1, 2, 25.50);
      const order = new Order(1, 'João', 'Pendente', [item]);
      mockRepository.findById.mockResolvedValue(order);
      mockRepository.save.mockResolvedValue(order);

      await orderService.getOrderById(1);
      await orderService.changeOrderStatus(1, 'Pronto');
      await orderService.deleteOrder(1);

      expect(mockRepository.findById).toHaveBeenCalledTimes(2);
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
      expect(mockRepository.delete).toHaveBeenCalledTimes(1);
    });

    test('deve processar array vazio de pedidos', async () => {
      mockRepository.findAll.mockResolvedValue([]);

      const result = await orderService.getAllOrders();

      expect(result).toHaveLength(0);
      expect(Array.isArray(result)).toBe(true);
    });

    test('deve lidar com update vazio', async () => {
      const item = new OrderItem(1, null, 1, 2, 25.50);
      const order = new Order(1, 'João', 'Pendente', [item]);
      const dto = new UpdateOrderDTO({});

      mockRepository.findById.mockResolvedValue(order);
      mockRepository.save.mockResolvedValue(order);

      const result = await orderService.updateOrder(1, dto);

      expect(result.customerName).toBe('João');
      expect(result.status).toBe('Pendente');
    });
  });
});
