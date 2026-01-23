import { OrderItem } from '../../../domain/orders/Order';
import { ValidationError } from '../../../core/errors/AppError';

describe('OrderItem Domain Entity', () => {
  describe('Constructor', () => {
    test('deve criar order item com todos os parâmetros', () => {
      const item = new OrderItem(1, 1, 5, 2, 25.50);

      expect(item.id).toBe(1);
      expect(item.orderId).toBe(1);
      expect(item.itemId).toBe(5);
      expect(item.quantity).toBe(2);
      expect(item.unitPrice).toBe(25.50);
    });

    test('deve criar item sem ID (null)', () => {
      const item = new OrderItem(null, null, 5, 2, 25.50);

      expect(item.id).toBeNull();
      expect(item.orderId).toBeNull();
      expect(item.itemId).toBe(5);
    });

    test('deve lançar erro se quantity não é inteiro', () => {
      expect(() => new OrderItem(1, 1, 5, 2.5, 25.50)).toThrow(ValidationError);
      expect(() => new OrderItem(1, 1, 5, 1.1, 25.50)).toThrow(ValidationError);
    });

    test('deve lançar erro se quantity é zero', () => {
      expect(() => new OrderItem(1, 1, 5, 0, 25.50)).toThrow(ValidationError);
    });

    test('deve lançar erro se quantity é negativo', () => {
      expect(() => new OrderItem(1, 1, 5, -1, 25.50)).toThrow(ValidationError);
    });

    test('deve permitir quantity positivo', () => {
      const item = new OrderItem(1, 1, 5, 1, 25.50);
      expect(item.quantity).toBe(1);
    });

    test('deve lançar erro se unitPrice é negativo', () => {
      expect(() => new OrderItem(1, 1, 5, 2, -10)).toThrow(ValidationError);
    });

    test('deve permitir unitPrice zero', () => {
      const item = new OrderItem(1, 1, 5, 2, 0);
      expect(item.unitPrice).toBe(0);
    });

    test('deve permitir unitPrice decimal', () => {
      const item = new OrderItem(1, 1, 5, 2, 25.99);
      expect(item.unitPrice).toBe(25.99);
    });
  });

  describe('Factory Method: create', () => {
    test('deve criar order item novo com create()', () => {
      const item = OrderItem.create(5, 2, 25.50);

      expect(item.id).toBeNull();
      expect(item.orderId).toBeNull();
      expect(item.itemId).toBe(5);
      expect(item.quantity).toBe(2);
      expect(item.unitPrice).toBe(25.50);
    });

    test('deve lançar erro se quantity inválido em create', () => {
      expect(() => OrderItem.create(5, 0, 25.50)).toThrow(ValidationError);
      expect(() => OrderItem.create(5, -1, 25.50)).toThrow(ValidationError);
    });

    test('deve lançar erro se unitPrice negativo em create', () => {
      expect(() => OrderItem.create(5, 2, -10)).toThrow(ValidationError);
    });

    test('deve permitir unitPrice zero em create', () => {
      expect(() => OrderItem.create(5, 2, 0)).not.toThrow();
    });
  });

  describe('getSubtotal()', () => {
    test('deve calcular subtotal corretamente', () => {
      const item = new OrderItem(1, 1, 5, 2, 25.50);
      expect(item.getSubtotal()).toBe(51.00);
    });

    test('deve calcular subtotal com quantity 1', () => {
      const item = new OrderItem(1, 1, 5, 1, 25.50);
      expect(item.getSubtotal()).toBe(25.50);
    });

    test('deve calcular subtotal com preço zero', () => {
      const item = new OrderItem(1, 1, 5, 5, 0);
      expect(item.getSubtotal()).toBe(0);
    });

    test('deve calcular subtotal com decimais', () => {
      const item = new OrderItem(1, 1, 5, 3, 9.99);
      expect(item.getSubtotal()).toBeCloseTo(29.97, 2);
    });

    test('deve calcular subtotal corretamente múltiplas vezes', () => {
      const item = new OrderItem(1, 1, 5, 2, 25.50);
      const subtotal1 = item.getSubtotal();
      const subtotal2 = item.getSubtotal();

      expect(subtotal1).toBe(51.00);
      expect(subtotal2).toBe(51.00);
      expect(subtotal1).toBe(subtotal2);
    });

    test('deve calcular subtotal com quantity muito grande', () => {
      const item = new OrderItem(1, 1, 5, 1000, 10.00);
      expect(item.getSubtotal()).toBe(10000);
    });

    test('deve calcular subtotal com preço muito grande', () => {
      const item = new OrderItem(1, 1, 5, 2, 9999.99);
      expect(item.getSubtotal()).toBeCloseTo(19999.98, 2);
    });
  });

  describe('Casos Extremos', () => {
    test('deve aceitar quantity muito grande', () => {
      const item = new OrderItem(1, 1, 5, 1000000, 1.00);
      expect(item.quantity).toBe(1000000);
    });

    test('deve aceitar itemId negativo', () => {
      const item = new OrderItem(1, 1, -1, 2, 25.50);
      expect(item.itemId).toBe(-1);
    });

    test('deve aceitar itemId zero', () => {
      const item = new OrderItem(1, 1, 0, 2, 25.50);
      expect(item.itemId).toBe(0);
    });

    test('deve aceitar orderId negativo', () => {
      const item = new OrderItem(1, -1, 5, 2, 25.50);
      expect(item.orderId).toBe(-1);
    });

    test('deve aceitar ID negativo', () => {
      const item = new OrderItem(-1, 1, 5, 2, 25.50);
      expect(item.id).toBe(-1);
    });
  });

  describe('Validação Completa', () => {
    test('deve ser válido com parâmetros mínimos', () => {
      expect(() => new OrderItem(null, null, 1, 1, 0)).not.toThrow();
    });

    test('deve ser válido com todos os parâmetros', () => {
      expect(() => new OrderItem(1, 1, 5, 2, 25.50)).not.toThrow();
    });
  });
});
