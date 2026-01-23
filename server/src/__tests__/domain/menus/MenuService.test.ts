import { MenuService } from '../../../domain/menus/MenuService';
import { Menu } from '../../../domain/menus/Menu';
import { IMenuRepository } from '../../../domain/menus/MenuRepository';
import { NotFoundError } from '../../../core/errors/AppError';
import { CreateMenuDTO, UpdateMenuDTO } from '../../../application/dtos/menu';

describe('MenuService', () => {
  let menuService: MenuService;
  let mockRepository: jest.Mocked<IMenuRepository>;

  beforeEach(() => {
    mockRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as any;

    menuService = new MenuService(mockRepository);
  });

  describe('getAllMenus()', () => {
    test('deve retornar todos os menus', async () => {
      const mockMenus = [
        new Menu(1, 'Pizza', 'Pizzas italianas', null, true),
        new Menu(2, 'Sushi', 'Culinária oriental', null, true),
      ];
      mockRepository.findAll.mockResolvedValue(mockMenus);

      const result = await menuService.getAllMenus();

      expect(result).toHaveLength(2);
      expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
    });

    test('deve retornar array vazio quando não há menus', async () => {
      mockRepository.findAll.mockResolvedValue([]);

      const result = await menuService.getAllMenus();

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    test('deve chamar findAll do repositório', async () => {
      mockRepository.findAll.mockResolvedValue([]);

      await menuService.getAllMenus();

      expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
      expect(mockRepository.findAll).toHaveBeenCalledWith();
    });

    test('deve mapear menus para DTO', async () => {
      const menu = new Menu(1, 'Pizza', 'Pizzas italianas', null, true);
      mockRepository.findAll.mockResolvedValue([menu]);

      const result = await menuService.getAllMenus();

      expect(result[0]).toBeDefined();
      expect(result[0].name).toBe('Pizza');
    });

    test('deve lançar erro se repositório falhar', async () => {
      mockRepository.findAll.mockRejectedValue(new Error('Database error'));

      await expect(menuService.getAllMenus()).rejects.toThrow('Database error');
    });
  });

  describe('getMenuById()', () => {
    test('deve retornar menu pelo ID', async () => {
      const menu = new Menu(1, 'Pizza', 'Pizzas italianas', null, true);
      mockRepository.findById.mockResolvedValue(menu);

      const result = await menuService.getMenuById(1);

      expect(result).toBeDefined();
      expect(result.name).toBe('Pizza');
    });

    test('deve chamar findById com ID correto', async () => {
      const menu = new Menu(1, 'Pizza', null, null, true);
      mockRepository.findById.mockResolvedValue(menu);

      await menuService.getMenuById(1);

      expect(mockRepository.findById).toHaveBeenCalledWith(1);
    });

    test('deve lançar erro NotFoundError quando menu não existe', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(menuService.getMenuById(999)).rejects.toThrow(NotFoundError);
    });

    test('deve lançar erro com ID correto quando não encontrado', async () => {
      mockRepository.findById.mockResolvedValue(null);

      try {
        await menuService.getMenuById(5);
      } catch (error: any) {
        expect(error.message).toContain('5');
      }
    });

    test('deve lançar erro se repositório falhar', async () => {
      mockRepository.findById.mockRejectedValue(new Error('Database error'));

      await expect(menuService.getMenuById(1)).rejects.toThrow('Database error');
    });
  });

  describe('createMenu()', () => {
    test('deve criar novo menu', async () => {
      const dto = new CreateMenuDTO({ name: 'Pizza', description: 'Pizzas italianas' });
      const savedMenu = new Menu(1, 'Pizza', 'Pizzas italianas', null, true);
      mockRepository.save.mockResolvedValue(savedMenu);

      const result = await menuService.createMenu(dto);

      expect(result).toBeDefined();
      expect(result.name).toBe('Pizza');
    });

    test('deve chamar save do repositório', async () => {
      const dto = new CreateMenuDTO({ name: 'Pizza', description: 'Pizzas' });
      const savedMenu = new Menu(1, 'Pizza', 'Pizzas', null, true);
      mockRepository.save.mockResolvedValue(savedMenu);

      await menuService.createMenu(dto);

      expect(mockRepository.save).toHaveBeenCalledTimes(1);
      expect(mockRepository.save).toHaveBeenCalledWith(expect.any(Menu));
    });

    test('deve criar menu com nome apenas', async () => {
      const dto = new CreateMenuDTO({ name: 'Pizza' });
      const savedMenu = new Menu(1, 'Pizza', '', null, true);
      mockRepository.save.mockResolvedValue(savedMenu);

      const result = await menuService.createMenu(dto);

      expect(result.name).toBe('Pizza');
    });

    test('deve criar menu como ativo por padrão', async () => {
      const dto = new CreateMenuDTO({ name: 'Pizza' });
      const savedMenu = new Menu(1, 'Pizza', '', null, true);
      mockRepository.save.mockResolvedValue(savedMenu);

      const result = await menuService.createMenu(dto);

      expect(result.active).toBe(true);
    });

    test('deve lançar erro se repositório falhar', async () => {
      const dto = new CreateMenuDTO({ name: 'Pizza' });
      mockRepository.save.mockRejectedValue(new Error('Save failed'));

      await expect(menuService.createMenu(dto)).rejects.toThrow('Save failed');
    });
  });

  describe('updateMenu()', () => {
    test('deve atualizar menu existente', async () => {
      const existingMenu = new Menu(1, 'Pizza', 'Pizzas', null, true);
      const dto = new UpdateMenuDTO({ name: 'Pizza Premium' });
      const updatedMenu = new Menu(1, 'Pizza Premium', 'Pizzas', null, true);
      
      mockRepository.findById.mockResolvedValue(existingMenu);
      mockRepository.save.mockResolvedValue(updatedMenu);

      const result = await menuService.updateMenu(1, dto);

      expect(result.name).toBe('Pizza Premium');
    });

    test('deve manter descrição quando não é atualizada', async () => {
      const existingMenu = new Menu(1, 'Pizza', 'Descrição original', null, true);
      const dto = new UpdateMenuDTO({ name: 'Pizza New' });
      const updatedMenu = new Menu(1, 'Pizza New', 'Descrição original', null, true);
      
      mockRepository.findById.mockResolvedValue(existingMenu);
      mockRepository.save.mockResolvedValue(updatedMenu);

      const result = await menuService.updateMenu(1, dto);

      expect(result.description).toBe('Descrição original');
    });

    test('deve atualizar status ativo/inativo', async () => {
      const existingMenu = new Menu(1, 'Pizza', null, null, true);
      const dto = new UpdateMenuDTO({ active: false });
      const updatedMenu = new Menu(1, 'Pizza', null, null, false);
      
      mockRepository.findById.mockResolvedValue(existingMenu);
      mockRepository.save.mockResolvedValue(updatedMenu);

      const result = await menuService.updateMenu(1, dto);

      expect(result.active).toBe(false);
    });

    test('deve lançar erro quando menu não existe', async () => {
      mockRepository.findById.mockResolvedValue(null);
      const dto = new UpdateMenuDTO({ name: 'Pizza' });

      await expect(menuService.updateMenu(999, dto)).rejects.toThrow(NotFoundError);
    });

    test('deve chamar save após update', async () => {
      const existingMenu = new Menu(1, 'Pizza', null, null, true);
      const dto = new UpdateMenuDTO({ name: 'Pizza Premium' });
      const updatedMenu = new Menu(1, 'Pizza Premium', null, null, true);
      
      mockRepository.findById.mockResolvedValue(existingMenu);
      mockRepository.save.mockResolvedValue(updatedMenu);

      await menuService.updateMenu(1, dto);

      expect(mockRepository.save).toHaveBeenCalledTimes(1);
    });

    test('deve lançar erro se save falhar', async () => {
      const existingMenu = new Menu(1, 'Pizza', null, null, true);
      const dto = new UpdateMenuDTO({ name: 'Pizza Premium' });
      
      mockRepository.findById.mockResolvedValue(existingMenu);
      mockRepository.save.mockRejectedValue(new Error('Save failed'));

      await expect(menuService.updateMenu(1, dto)).rejects.toThrow('Save failed');
    });
  });

  describe('deleteMenu()', () => {
    test('deve deletar menu pelo ID', async () => {
      mockRepository.delete.mockResolvedValue(undefined);

      await menuService.deleteMenu(1);

      expect(mockRepository.delete).toHaveBeenCalledWith(1);
    });

    test('deve chamar delete com ID correto', async () => {
      mockRepository.delete.mockResolvedValue(undefined);

      await menuService.deleteMenu(5);

      expect(mockRepository.delete).toHaveBeenCalledWith(5);
    });

    test('deve lançar erro se repositório falhar', async () => {
      mockRepository.delete.mockRejectedValue(new Error('Delete failed'));

      await expect(menuService.deleteMenu(1)).rejects.toThrow('Delete failed');
    });
  });

  describe('updateMenuLogo()', () => {
    test('deve atualizar logo do menu', async () => {
      const existingMenu = new Menu(1, 'Pizza', null, null, true);
      const updatedMenu = new Menu(1, 'Pizza', null, 'pizza.png', true);
      
      mockRepository.findById.mockResolvedValue(existingMenu);
      mockRepository.save.mockResolvedValue(updatedMenu);

      const result = await menuService.updateMenuLogo(1, 'pizza.png');

      expect(result.logoFilename).toBe('pizza.png');
    });

    test('deve chamar save após atualizar logo', async () => {
      const existingMenu = new Menu(1, 'Pizza', null, null, true);
      const updatedMenu = new Menu(1, 'Pizza', null, 'pizza.png', true);
      
      mockRepository.findById.mockResolvedValue(existingMenu);
      mockRepository.save.mockResolvedValue(updatedMenu);

      await menuService.updateMenuLogo(1, 'pizza.png');

      expect(mockRepository.save).toHaveBeenCalledTimes(1);
    });

    test('deve lançar erro quando menu não existe', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(menuService.updateMenuLogo(999, 'pizza.png')).rejects.toThrow(NotFoundError);
    });

    test('deve substituir logo anterior', async () => {
      const existingMenu = new Menu(1, 'Pizza', null, 'old.png', true);
      const updatedMenu = new Menu(1, 'Pizza', null, 'new.png', true);
      
      mockRepository.findById.mockResolvedValue(existingMenu);
      mockRepository.save.mockResolvedValue(updatedMenu);

      const result = await menuService.updateMenuLogo(1, 'new.png');

      expect(result.logoFilename).toBe('new.png');
    });

    test('deve lançar erro se save falhar', async () => {
      const existingMenu = new Menu(1, 'Pizza', null, null, true);
      
      mockRepository.findById.mockResolvedValue(existingMenu);
      mockRepository.save.mockRejectedValue(new Error('Save failed'));

      await expect(menuService.updateMenuLogo(1, 'pizza.png')).rejects.toThrow('Save failed');
    });

    test('deve lançar erro se repositório falhar ao buscar', async () => {
      mockRepository.findById.mockRejectedValue(new Error('Database error'));

      await expect(menuService.updateMenuLogo(1, 'pizza.png')).rejects.toThrow('Database error');
    });
  });

  describe('Casos Extremos', () => {
    test('deve lidar com múltiplas operações em sequência', async () => {
      const menu = new Menu(1, 'Pizza', null, null, true);
      mockRepository.findById.mockResolvedValue(menu);
      mockRepository.save.mockResolvedValue(menu);

      await menuService.getMenuById(1);
      await menuService.updateMenuLogo(1, 'logo.png');
      await menuService.deleteMenu(1);

      expect(mockRepository.findById).toHaveBeenCalledTimes(2);
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
      expect(mockRepository.delete).toHaveBeenCalledTimes(1);
    });

    test('deve lidar com update parcial', async () => {
      const menu = new Menu(1, 'Pizza', 'Descrição', null, true);
      const dto: UpdateMenuDTO = {}; // sem atualizações
      mockRepository.findById.mockResolvedValue(menu);
      mockRepository.save.mockResolvedValue(menu);

      const result = await menuService.updateMenu(1, dto);

      expect(result.name).toBe('Pizza');
      expect(result.description).toBe('Descrição');
    });

    test('deve processar array vazio de menus', async () => {
      mockRepository.findAll.mockResolvedValue([]);

      const result = await menuService.getAllMenus();

      expect(result).toHaveLength(0);
      expect(Array.isArray(result)).toBe(true);
    });
  });
});
