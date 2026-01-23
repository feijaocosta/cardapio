import { Menu } from '../../../domain/menus/Menu';
import { ValidationError } from '../../../core/errors/AppError';

describe('Menu Domain Entity', () => {
  describe('Constructor', () => {
    test('deve criar menu com todos os parâmetros', () => {
      const now = new Date();
      const menu = new Menu(1, 'Pizza', 'Menu de pizzas', 'pizza.png', true, now, now);
      
      expect(menu.id).toBe(1);
      expect(menu.name).toBe('Pizza');
      expect(menu.description).toBe('Menu de pizzas');
      expect(menu.logoFilename).toBe('pizza.png');
      expect(menu.active).toBe(true);
      expect(menu.createdAt).toBe(now);
      expect(menu.updatedAt).toBe(now);
    });

    test('deve criar menu sem ID (null)', () => {
      const menu = new Menu(null, 'Hamburguer', null, null, true);
      
      expect(menu.id).toBeNull();
      expect(menu.name).toBe('Hamburguer');
      expect(menu.active).toBe(true);
    });

    test('deve lançar erro se nome está vazio', () => {
      expect(() => new Menu(1, '', null, null, true)).toThrow(ValidationError);
      expect(() => new Menu(1, '   ', null, null, true)).toThrow(ValidationError);
    });

    test('deve lançar erro se nome é muito longo', () => {
      const longName = 'a'.repeat(256);
      expect(() => new Menu(1, longName, null, null, true)).toThrow(ValidationError);
    });

    test('deve permitir nome com até 255 caracteres', () => {
      const maxName = 'a'.repeat(255);
      expect(() => new Menu(1, maxName, null, null, true)).not.toThrow();
    });

    test('deve aceitar nome com espaços em branco', () => {
      const menu = new Menu(1, '  Pizza Premium  ', null, null, true);
      expect(menu.name).toBe('  Pizza Premium  ');
    });

    test('deve permitir description null', () => {
      const menu = new Menu(1, 'Pizza', null, null, true);
      expect(menu.description).toBeNull();
    });

    test('deve permitir description com conteúdo', () => {
      const menu = new Menu(1, 'Pizza', 'Pizzas variadas', null, true);
      expect(menu.description).toBe('Pizzas variadas');
    });

    test('deve permitir logoFilename null', () => {
      const menu = new Menu(1, 'Pizza', null, null, true);
      expect(menu.logoFilename).toBeNull();
    });

    test('deve permitir active false', () => {
      const menu = new Menu(1, 'Pizza', null, null, false);
      expect(menu.active).toBe(false);
    });
  });

  describe('Factory Method: create', () => {
    test('deve criar menu novo com create()', () => {
      const menu = Menu.create('Sushi');
      
      expect(menu.id).toBeNull();
      expect(menu.name).toBe('Sushi');
      expect(menu.description).toBeNull();
      expect(menu.logoFilename).toBeNull();
      expect(menu.active).toBe(true);
      expect(menu.createdAt).toBeDefined();
      expect(menu.updatedAt).toBeDefined();
    });

    test('deve criar menu com description opcional', () => {
      const menu = Menu.create('Sushi', 'Culinária oriental');
      
      expect(menu.name).toBe('Sushi');
      expect(menu.description).toBe('Culinária oriental');
    });

    test('deve lançar erro se nome vazio em create', () => {
      expect(() => Menu.create('')).toThrow(ValidationError);
      expect(() => Menu.create('   ')).toThrow(ValidationError);
    });

    test('deve definir datas automaticamente em create', () => {
      const before = new Date();
      const menu = Menu.create('Pizza');
      const after = new Date();
      
      expect(menu.createdAt!.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(menu.createdAt!.getTime()).toBeLessThanOrEqual(after.getTime());
      expect(menu.updatedAt!.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(menu.updatedAt!.getTime()).toBeLessThanOrEqual(after.getTime());
    });
  });

  describe('isActive()', () => {
    test('deve retornar true para menu ativo', () => {
      const menu = new Menu(1, 'Pizza', null, null, true);
      expect(menu.isActive()).toBe(true);
    });

    test('deve retornar false para menu inativo', () => {
      const menu = new Menu(1, 'Pizza', null, null, false);
      expect(menu.isActive()).toBe(false);
    });
  });

  describe('deactivate()', () => {
    test('deve criar novo menu desativado', () => {
      const now = new Date();
      const menuAtivo = new Menu(1, 'Pizza', null, null, true, now, now);
      const menuInativo = menuAtivo.deactivate();
      
      expect(menuInativo.active).toBe(false);
      expect(menuInativo.id).toBe(1);
      expect(menuInativo.name).toBe('Pizza');
    });

    test('deve atualizar updatedAt ao desativar', () => {
      const now = new Date();
      const menu = new Menu(1, 'Pizza', null, null, true, now, now);
      const menuInativo = menu.deactivate();
      
      expect(menuInativo.updatedAt!.getTime()).toBeGreaterThanOrEqual(now.getTime());
    });

    test('deve manter createdAt ao desativar', () => {
      const now = new Date();
      const menu = new Menu(1, 'Pizza', null, null, true, now, now);
      const menuInativo = menu.deactivate();
      
      expect(menuInativo.createdAt).toBe(menu.createdAt);
    });

    test('deve ser imutável - original não muda', () => {
      const menu = new Menu(1, 'Pizza', null, null, true);
      const menuInativo = menu.deactivate();
      
      expect(menu.active).toBe(true);
      expect(menuInativo.active).toBe(false);
    });
  });

  describe('activate()', () => {
    test('deve criar novo menu ativado', () => {
      const now = new Date();
      const menuInativo = new Menu(1, 'Pizza', null, null, false, now, now);
      const menuAtivo = menuInativo.activate();
      
      expect(menuAtivo.active).toBe(true);
      expect(menuAtivo.id).toBe(1);
      expect(menuAtivo.name).toBe('Pizza');
    });

    test('deve atualizar updatedAt ao ativar', () => {
      const now = new Date();
      const menu = new Menu(1, 'Pizza', null, null, false, now, now);
      const menuAtivo = menu.activate();
      
      expect(menuAtivo.updatedAt!.getTime()).toBeGreaterThanOrEqual(now.getTime());
    });

    test('deve manter createdAt ao ativar', () => {
      const now = new Date();
      const menu = new Menu(1, 'Pizza', null, null, false, now, now);
      const menuAtivo = menu.activate();
      
      expect(menuAtivo.createdAt).toBe(menu.createdAt);
    });

    test('deve ser idempotente - ativar já ativo', () => {
      const now = new Date();
      const menuAtivo = new Menu(1, 'Pizza', null, null, true, now, now);
      const menuAtivo2 = menuAtivo.activate();
      
      expect(menuAtivo2.active).toBe(true);
    });
  });

  describe('updateLogo()', () => {
    test('deve atualizar logo filename', () => {
      const now = new Date();
      const menu = new Menu(1, 'Pizza', null, null, true, now, now);
      const menuComLogo = menu.updateLogo('pizza-nova.png');
      
      expect(menuComLogo.logoFilename).toBe('pizza-nova.png');
    });

    test('deve manter outros campos ao atualizar logo', () => {
      const now = new Date();
      const menu = new Menu(1, 'Pizza', 'Pizzas italianas', null, true, now, now);
      const menuComLogo = menu.updateLogo('pizza.png');
      
      expect(menuComLogo.id).toBe(1);
      expect(menuComLogo.name).toBe('Pizza');
      expect(menuComLogo.description).toBe('Pizzas italianas');
      expect(menuComLogo.active).toBe(true);
    });

    test('deve atualizar updatedAt ao mudar logo', () => {
      const now = new Date();
      const menu = new Menu(1, 'Pizza', null, null, true, now, now);
      const menuComLogo = menu.updateLogo('pizza.png');
      
      expect(menuComLogo.updatedAt!.getTime()).toBeGreaterThanOrEqual(now.getTime());
    });

    test('deve substituir logo anterior', () => {
      const now = new Date();
      const menu = new Menu(1, 'Pizza', null, 'old.png', true, now, now);
      const menuComNovaLogo = menu.updateLogo('new.png');
      
      expect(menuComNovaLogo.logoFilename).toBe('new.png');
    });

    test('deve aceitar string vazia como logo', () => {
      const now = new Date();
      const menu = new Menu(1, 'Pizza', null, 'old.png', true, now, now);
      const menuSemLogo = menu.updateLogo('');
      
      expect(menuSemLogo.logoFilename).toBe('');
    });

    test('deve ser imutável', () => {
      const now = new Date();
      const menu = new Menu(1, 'Pizza', null, null, true, now, now);
      const menuComLogo = menu.updateLogo('pizza.png');
      
      expect(menu.logoFilename).toBeNull();
      expect(menuComLogo.logoFilename).toBe('pizza.png');
    });
  });

  describe('Imutabilidade', () => {
    test('deve manter referência de createdAt e updatedAt', () => {
      const now = new Date();
      const menu = new Menu(1, 'Pizza', null, null, true, now, now);
      
      expect(menu.createdAt === now).toBe(true);
      expect(menu.updatedAt === now).toBe(true);
    });
  });

  describe('Casos Extremos', () => {
    test('deve aceitar nome com caracteres especiais', () => {
      const menu = new Menu(1, 'Açaí @Home!', null, null, true);
      expect(menu.name).toBe('Açaí @Home!');
    });

    test('deve aceitar nome com números', () => {
      const menu = new Menu(1, 'Pizza 2024', null, null, true);
      expect(menu.name).toBe('Pizza 2024');
    });

    test('deve aceitar description muito longa', () => {
      const longDesc = 'a'.repeat(1000);
      const menu = new Menu(1, 'Pizza', longDesc, null, true);
      expect(menu.description).toBe(longDesc);
    });

    test('deve aceitar ID negativo', () => {
      const menu = new Menu(-1, 'Pizza', null, null, true);
      expect(menu.id).toBe(-1);
    });

    test('deve aceitar ID zero', () => {
      const menu = new Menu(0, 'Pizza', null, null, true);
      expect(menu.id).toBe(0);
    });
  });
});
