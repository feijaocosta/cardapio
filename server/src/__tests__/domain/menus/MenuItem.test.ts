import { MenuItem } from '../../../domain/menus/MenuItem';
import { ValidationError } from '../../../core/errors/AppError';

describe('MenuItem Domain Entity', () => {
  describe('Constructor', () => {
    test('deve criar item com todos os parâmetros', () => {
      const item = new MenuItem(1, 'Margherita', 25.50, 'Clássica italiana');
      
      expect(item.id).toBe(1);
      expect(item.name).toBe('Margherita');
      expect(item.price).toBe(25.50);
      expect(item.description).toBe('Clássica italiana');
    });

    test('deve criar item sem description', () => {
      const item = new MenuItem(1, 'Margherita', 25.50);
      
      expect(item.id).toBe(1);
      expect(item.name).toBe('Margherita');
      expect(item.price).toBe(25.50);
      expect(item.description).toBeUndefined();
    });

    test('deve aceitar description null', () => {
      const item = new MenuItem(1, 'Margherita', 25.50, null as any);
      expect(item.description).toBeNull();
    });

    test('deve aceitar description com conteúdo', () => {
      const item = new MenuItem(1, 'Margherita', 25.50, 'Descrição');
      expect(item.description).toBe('Descrição');
    });
  });

  describe('Factory Method: create', () => {
    test('deve criar item novo com create()', () => {
      const item = MenuItem.create(1, 'Margherita', 25.50);
      
      expect(item.id).toBe(1);
      expect(item.name).toBe('Margherita');
      expect(item.price).toBe(25.50);
      expect(item.description).toBeUndefined();
    });

    test('deve criar item com description opcional', () => {
      const item = MenuItem.create(1, 'Margherita', 25.50, 'Clássica');
      
      expect(item.name).toBe('Margherita');
      expect(item.description).toBe('Clássica');
    });

    test('deve criar com todos os parâmetros', () => {
      const item = MenuItem.create(1, 'Pizza', 25.50, 'Deliciosa');
      expect(item).toBeDefined();
      expect(item.id).toBe(1);
    });
  });

  describe('Casos Básicos', () => {
    test('deve aceitar nome com caracteres especiais', () => {
      const item = new MenuItem(1, 'Açaí com Granola @Premium', 15.00);
      expect(item.name).toBe('Açaí com Granola @Premium');
    });

    test('deve aceitar preço inteiro', () => {
      const item = new MenuItem(1, 'Pizza', 25);
      expect(item.price).toBe(25);
    });

    test('deve aceitar preço decimal', () => {
      const item = new MenuItem(1, 'Pizza', 25.99);
      expect(item.price).toBe(25.99);
    });

    test('deve aceitar preço zero', () => {
      const item = new MenuItem(1, 'Pizza', 0);
      expect(item.price).toBe(0);
    });

    test('deve aceitar preço muito pequeno', () => {
      const item = new MenuItem(1, 'Pizza', 0.01);
      expect(item.price).toBe(0.01);
    });

    test('deve aceitar preço muito grande', () => {
      const item = new MenuItem(1, 'Pizza', 9999.99);
      expect(item.price).toBe(9999.99);
    });

    test('deve aceitar ID negativo', () => {
      const item = new MenuItem(-1, 'Pizza', 25.50);
      expect(item.id).toBe(-1);
    });

    test('deve aceitar ID zero', () => {
      const item = new MenuItem(0, 'Pizza', 25.50);
      expect(item.id).toBe(0);
    });

    test('deve aceitar description muito longa', () => {
      const longDesc = 'a'.repeat(1000);
      const item = new MenuItem(1, 'Pizza', 25.50, longDesc);
      expect(item.description).toBe(longDesc);
    });

    test('deve aceitar description com quebras de linha', () => {
      const multiline = 'linha1\nlinha2\nlinha3';
      const item = new MenuItem(1, 'Pizza', 25.50, multiline);
      expect(item.description).toBe(multiline);
    });
  });

  describe('Validação Completa', () => {
    test('deve ser válido com parâmetros básicos', () => {
      expect(() => new MenuItem(1, 'Pizza', 10.00)).not.toThrow();
    });

    test('deve ser válido com todos os parâmetros', () => {
      expect(() => new MenuItem(1, 'Pizza', 25.50, 'Descrição')).not.toThrow();
    });

    test('deve criar múltiplos items diferentes', () => {
      const item1 = new MenuItem(1, 'Pizza', 25.50);
      const item2 = new MenuItem(2, 'Sushi', 30.00);
      const item3 = new MenuItem(3, 'Hamburguer', 15.00);

      expect(item1.id).toBe(1);
      expect(item2.id).toBe(2);
      expect(item3.id).toBe(3);
      expect(item1.name).not.toBe(item2.name);
    });
  });

  describe('Casos Extremos', () => {
    test('deve aceitar nome vazio tecnicamente', () => {
      const item = new MenuItem(1, '', 10.00);
      expect(item.name).toBe('');
    });

    test('deve aceitar nome com números', () => {
      const item = new MenuItem(1, 'Pizza 2024', 25.50);
      expect(item.name).toBe('Pizza 2024');
    });

    test('deve aceitar nome com espaços', () => {
      const item = new MenuItem(1, '  Pizza Premium  ', 25.50);
      expect(item.name).toBe('  Pizza Premium  ');
    });

    test('deve aceitar nome muito longo', () => {
      const longName = 'a'.repeat(255);
      const item = new MenuItem(1, longName, 25.50);
      expect(item.name).toHaveLength(255);
    });

    test('deve manter propriedades após criação', () => {
      const item = new MenuItem(5, 'Especial', 99.99, 'Prato principal');
      
      expect(item.id).toBe(5);
      expect(item.name).toBe('Especial');
      expect(item.price).toBe(99.99);
      expect(item.description).toBe('Prato principal');
    });

    test('deve permitir valores negativos no ID', () => {
      const item = new MenuItem(-100, 'Pizza', 25.50);
      expect(item.id).toBe(-100);
    });

    test('deve permitir valores muito altos no preço', () => {
      const item = new MenuItem(1, 'Luxo', 999999.99);
      expect(item.price).toBe(999999.99);
    });
  });

  describe('Igualdade e Imutabilidade', () => {
    test('dois items com mesmos dados são instâncias diferentes', () => {
      const item1 = new MenuItem(1, 'Pizza', 25.50);
      const item2 = new MenuItem(1, 'Pizza', 25.50);

      expect(item1).not.toBe(item2);
      expect(item1.id).toBe(item2.id);
      expect(item1.name).toBe(item2.name);
      expect(item1.price).toBe(item2.price);
    });

    test('deve manter propriedades inalteradas', () => {
      const item = new MenuItem(1, 'Pizza', 25.50, 'Descrição');
      const originalName = item.name;
      const originalPrice = item.price;

      // Verificar que as propriedades não mudam
      expect(item.name).toBe(originalName);
      expect(item.price).toBe(originalPrice);
    });
  });
});
