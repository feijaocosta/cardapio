import { MenuItem } from '../../../domain/menus/MenuItem';
import { ValidationError } from '../../../core/errors/AppError';

describe('MenuItem Domain Entity', () => {
  describe('Constructor', () => {
    test('deve criar item com todos os parâmetros', () => {
      const now = new Date();
      const item = new MenuItem(1, 1, 'Margherita', 25.50, 'Clássica italiana', now, now);
      
      expect(item.id).toBe(1);
      expect(item.menuId).toBe(1);
      expect(item.name).toBe('Margherita');
      expect(item.price).toBe(25.50);
      expect(item.description).toBe('Clássica italiana');
      expect(item.createdAt).toBe(now);
      expect(item.updatedAt).toBe(now);
    });

    test('deve criar item sem ID (null)', () => {
      const item = new MenuItem(null, 1, 'Margherita', 25.50, null);
      
      expect(item.id).toBeNull();
      expect(item.menuId).toBe(1);
      expect(item.name).toBe('Margherita');
    });

    test('deve lançar erro se nome está vazio', () => {
      expect(() => new MenuItem(1, 1, '', 10.00, null)).toThrow(ValidationError);
      expect(() => new MenuItem(1, 1, '   ', 10.00, null)).toThrow(ValidationError);
    });

    test('deve lançar erro se nome é muito longo', () => {
      const longName = 'a'.repeat(256);
      expect(() => new MenuItem(1, 1, longName, 10.00, null)).toThrow(ValidationError);
    });

    test('deve permitir nome com até 255 caracteres', () => {
      const maxName = 'a'.repeat(255);
      expect(() => new MenuItem(1, 1, maxName, 10.00, null)).not.toThrow();
    });

    test('deve lançar erro se preço é negativo', () => {
      expect(() => new MenuItem(1, 1, 'Pizza', -10, null)).toThrow(ValidationError);
    });

    test('deve permitir preço zero', () => {
      const item = new MenuItem(1, 1, 'Pizza', 0, null);
      expect(item.price).toBe(0);
    });

    test('deve permitir preço decimal', () => {
      const item = new MenuItem(1, 1, 'Pizza', 25.99, null);
      expect(item.price).toBe(25.99);
    });

    test('deve lançar erro se preço não é número', () => {
      expect(() => new MenuItem(1, 1, 'Pizza', 'vinte' as any, null)).toThrow(ValidationError);
    });

    test('deve permitir description null', () => {
      const item = new MenuItem(1, 1, 'Pizza', 25.50, null);
      expect(item.description).toBeNull();
    });

    test('deve permitir description com conteúdo', () => {
      const item = new MenuItem(1, 1, 'Pizza', 25.50, 'Pizza deliciosa');
      expect(item.description).toBe('Pizza deliciosa');
    });
  });

  describe('Factory Method: create', () => {
    test('deve criar item novo com create()', () => {
      const item = MenuItem.create(1, 'Margherita', 25.50);
      
      expect(item.id).toBeNull();
      expect(item.menuId).toBe(1);
      expect(item.name).toBe('Margherita');
      expect(item.price).toBe(25.50);
      expect(item.description).toBeNull();
      expect(item.createdAt).toBeDefined();
      expect(item.updatedAt).toBeDefined();
    });

    test('deve criar item com description opcional', () => {
      const item = MenuItem.create(1, 'Margherita', 25.50, 'Clássica');
      
      expect(item.name).toBe('Margherita');
      expect(item.description).toBe('Clássica');
    });

    test('deve lançar erro se nome vazio em create', () => {
      expect(() => MenuItem.create(1, '', 10.00)).toThrow(ValidationError);
    });

    test('deve lançar erro se preço negativo em create', () => {
      expect(() => MenuItem.create(1, 'Pizza', -5)).toThrow(ValidationError);
    });

    test('deve definir datas automaticamente em create', () => {
      const before = new Date();
      const item = MenuItem.create(1, 'Pizza', 25.50);
      const after = new Date();
      
      expect(item.createdAt!.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(item.createdAt!.getTime()).toBeLessThanOrEqual(after.getTime());
    });
  });

  describe('getPriceFormatted()', () => {
    test('deve formatar preço com 2 casas decimais', () => {
      const item = new MenuItem(1, 1, 'Pizza', 25.5, null);
      expect(item.getPriceFormatted()).toBe('25.50');
    });

    test('deve formatar preço inteiro com .00', () => {
      const item = new MenuItem(1, 1, 'Pizza', 25, null);
      expect(item.getPriceFormatted()).toBe('25.00');
    });

    test('deve formatar preço zero', () => {
      const item = new MenuItem(1, 1, 'Pizza', 0, null);
      expect(item.getPriceFormatted()).toBe('0.00');
    });

    test('deve manter precisão decimal', () => {
      const item = new MenuItem(1, 1, 'Pizza', 25.999, null);
      expect(item.getPriceFormatted()).toBe('26.00');
    });

    test('deve formatar preço muito grande', () => {
      const item = new MenuItem(1, 1, 'Pizza', 9999.99, null);
      expect(item.getPriceFormatted()).toBe('9999.99');
    });
  });

  describe('Imutabilidade', () => {
    test('deve manter referência original de datas', () => {
      const now = new Date();
      const item = new MenuItem(1, 1, 'Pizza', 25.50, null, now, now);
      
      expect(item.createdAt === now).toBe(true);
      expect(item.updatedAt === now).toBe(true);
    });
  });

  describe('Casos Extremos', () => {
    test('deve aceitar nome com caracteres especiais', () => {
      const item = new MenuItem(1, 1, 'Açaí com Granola @Premium', 15.00, null);
      expect(item.name).toBe('Açaí com Granola @Premium');
    });

    test('deve aceitar menuId negativo', () => {
      const item = new MenuItem(1, -1, 'Pizza', 25.50, null);
      expect(item.menuId).toBe(-1);
    });

    test('deve aceitar menuId zero', () => {
      const item = new MenuItem(1, 0, 'Pizza', 25.50, null);
      expect(item.menuId).toBe(0);
    });

    test('deve aceitar preço muito pequeno', () => {
      const item = new MenuItem(1, 1, 'Pizza', 0.01, null);
      expect(item.price).toBe(0.01);
      expect(item.getPriceFormatted()).toBe('0.01');
    });

    test('deve aceitar description muito longa', () => {
      const longDesc = 'a'.repeat(1000);
      const item = new MenuItem(1, 1, 'Pizza', 25.50, longDesc);
      expect(item.description).toBe(longDesc);
    });
  });

  describe('Validação Completa', () => {
    test('deve ser válido com parâmetros mínimos', () => {
      expect(() => new MenuItem(null, 1, 'Pizza', 10.00, null)).not.toThrow();
    });

    test('deve ser válido com todos os parâmetros', () => {
      const now = new Date();
      expect(() => new MenuItem(1, 1, 'Pizza', 25.50, 'Descrição', now, now)).not.toThrow();
    });
  });
});
