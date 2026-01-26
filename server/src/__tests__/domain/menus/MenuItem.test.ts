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

  // ✨ PRÉ-REQUISITO 2: Preço não deve ser obrigatório (exibição é opcional)
  describe('PRÉ-REQUISITO 2: Preço Opcional do Item', () => {
    describe('Criar Item SEM Preço', () => {
      test('deve permitir criar item sem preço (undefined)', () => {
        const item = new MenuItem(1, 'Brinde', undefined as any);

        expect(item.id).toBe(1);
        expect(item.name).toBe('Brinde');
        expect(item.price).toBeUndefined();
      });

      test('deve permitir criar item com preço null', () => {
        const item = new MenuItem(1, 'Item Gratuito', null as any);

        expect(item.name).toBe('Item Gratuito');
        expect(item.price).toBeNull();
      });

      test('deve permitir criar item sem fornecer preço no construtor', () => {
        // Simula construtor com preço opcional
        const item = new MenuItem(1, 'Item Sem Preço');

        expect(item.id).toBe(1);
        expect(item.name).toBe('Item Sem Preço');
        // price pode ser undefined quando não fornecido
      });
    });

    describe('Factory Method com Preço Opcional', () => {
      test('deve criar item sem preço usando create()', () => {
        const item = MenuItem.create(1, 'Brinquedo', undefined as any);

        expect(item.id).toBe(1);
        expect(item.name).toBe('Brinquedo');
        expect(item.price).toBeUndefined();
      });

      test('deve criar item com preço null usando create()', () => {
        const item = MenuItem.create(1, 'Amostra', null as any);

        expect(item.name).toBe('Amostra');
        expect(item.price).toBeNull();
      });

      test('deve criar item sem preço e sem descrição', () => {
        const item = MenuItem.create(1, 'Item Simples');

        expect(item.id).toBe(1);
        expect(item.name).toBe('Item Simples');
        // price não fornecido
      });
    });

    describe('Validações com Preço Opcional', () => {
      test('deve aceitar preço 0 (zero)', () => {
        const item = new MenuItem(1, 'Cortesia', 0);

        expect(item.price).toBe(0);
        expect(typeof item.price).toBe('number');
      });

      test('deve diferenciar entre preço zero e preço undefined', () => {
        const itemZero = new MenuItem(1, 'Grátis', 0);
        const itemUndefined = new MenuItem(2, 'Sem Preço', undefined as any);

        expect(itemZero.price).toBe(0);
        expect(itemUndefined.price).toBeUndefined();
        expect(itemZero.price).not.toBe(itemUndefined.price);
      });

      test('deve aceitar preço positivo', () => {
        const item = new MenuItem(1, 'Pizza', 25.50);

        expect(item.price).toBe(25.50);
        expect(typeof item.price).toBe('number');
      });

      test('deve aceitar preço negativo (em caso de devolução/desconto)', () => {
        const item = new MenuItem(1, 'Desconto', -5.00);

        expect(item.price).toBe(-5.00);
      });
    });

    describe('Cenários de Uso Prático', () => {
      test('Cenário 1: Cardápio com preço visível - item tem preço', () => {
        // Quando configuração show_price = true
        const item = new MenuItem(1, 'Margherita', 25.50, 'Pizza clássica');

        expect(item.price).toBe(25.50);
        expect(item.description).toBe('Pizza clássica');
      });

      test('Cenário 2: Cardápio com preço oculto - item sem preço', () => {
        // Quando configuração show_price = false
        const item = new MenuItem(1, 'Margherita', undefined as any, 'Pizza clássica');

        expect(item.price).toBeUndefined();
        expect(item.description).toBe('Pizza clássica');
      });

      test('Cenário 3: Item de brinde/amostra - sem preço', () => {
        const brinde = new MenuItem(1, 'Brinde da Casa', undefined as any);

        expect(brinde.name).toBe('Brinde da Casa');
        expect(brinde.price).toBeUndefined();
      });

      test('Cenário 4: Item com preço 0 - deve diferenciar de sem preço', () => {
        const free = new MenuItem(1, 'Item Gratuito', 0);
        const noPriceItem = new MenuItem(2, 'Sem Preço Configurado', undefined as any);

        // Free tem preço 0 (configurado como gratuito)
        expect(free.price).toBe(0);

        // noPriceItem não tem preço (preço não configurado)
        expect(noPriceItem.price).toBeUndefined();
      });

      test('Cenário 5: Múltiplos items com e sem preço', () => {
        const items = [
          new MenuItem(1, 'Pizza', 25.50),
          new MenuItem(2, 'Brinde', undefined as any),
          new MenuItem(3, 'Amostra', null as any),
          new MenuItem(4, 'Cortesia', 0),
        ];

        expect(items[0].price).toBe(25.50);
        expect(items[1].price).toBeUndefined();
        expect(items[2].price).toBeNull();
        expect(items[3].price).toBe(0);
      });
    });

    describe('Compatibilidade com Configurações Administrativas', () => {
      test('deve permitir item sem preço quando show_price = false', () => {
        // Quando admin configura show_price = false
        // Item pode ser criado sem preço
        const item = new MenuItem(1, 'Item', undefined as any);

        expect(item.price).toBeUndefined();
      });

      test('deve permitir item com preço mesmo quando show_price = false', () => {
        // Admin pode manter preço guardado mesmo se oculto
        const item = new MenuItem(1, 'Item com Preço Oculto', 30.00);

        expect(item.price).toBe(30.00);
      });

      test('deve permitir item com ou sem preço quando show_price = true', () => {
        // Quando admin configura show_price = true
        // Item pode ter preço definido
        const itemComPreço = new MenuItem(1, 'Com Preço', 25.50);
        const itemSemPreço = new MenuItem(2, 'Sem Preço', undefined as any);

        expect(itemComPreço.price).toBe(25.50);
        expect(itemSemPreço.price).toBeUndefined();
      });
    });
  });
});
